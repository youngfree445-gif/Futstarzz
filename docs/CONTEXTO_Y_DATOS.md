# Fut Starzz — Estado del proyecto y cómo pasar datos nuevos

**Última actualización:** 31 de julio de 2026

Este documento sirve para dos cosas: retomar el proyecto sin releer toda la
conversación, y **pasar datos de clubes nuevos en el formato exacto** que encaja
con la base sin trabajo manual de por medio.

---

# PARTE 1 — Cómo buscamos y cargamos datos (el flujo que funciona)

## La regla principal

**Claude busca primero en el buscador de Transfermarkt. Si no encuentra algo o el
resultado es ambiguo, lo dice y el usuario pasa el link correcto.**

Esto no es una preferencia: es lo que la experiencia demostró que funciona.
Cuando Claude intentó resolver todo solo, produjo IDs de club inventados
(Millonarios, Once Caldas y Deportivo Cali, los tres equivocados), páginas de
Estonia y Australia al adivinar IDs de país, y un código de competición que
resultó ser el Clausura en vez de la segunda división. Cuando el usuario pasó los
nombres exactos o los links, todo salió a la primera.

## Qué necesita Claude exactamente

### Opción A — La tabla de clubes de la competición (lo ideal)

Copiar y pegar **la tabla de clubes** de la página de la competición en
Transfermarkt. Se ve así:

```
Clubes de Torneo Clausura 2026
Club	Equipo	Edad	Extranjeros	Valor de mercado medio	Valor de mercado total
CA River Plate	CA River Plate	35	26,2	7	3,78 mill. €	132,18 mill. €
CA Boca Juniors	CA Boca Juniors	36	27,6	9	3,08 mill. €	110,75 mill. €
...
```

**Lo único imprescindible es la columna con el nombre del club tal como lo escribe
Transfermarkt.** El resto (edad, extranjeros, valores) no molesta pero no se usa.

Por qué sirve tanto: los nombres exactos de Transfermarkt son distintos de los del
juego, y ahí está el 90% del problema. Ejemplos reales que solo se resolvieron con
la tabla:

| Nombre en el juego | Nombre en Transfermarkt |
|---|---|
| Patriotas Boyacá | **Boyacá Patriotas FC** |
| Atlético Cali | **Atlético FC** |
| Internacional de Bogotá | (es **La Equidad** renombrada, id 17425) |
| Estudiantes de Río Cuarto | **AA Estudiantes (Río Cuarto)** |

### Opción B — Links directos (para los que Claude no encuentra)

Cuando Claude avisa que no pudo resolver ciertos clubes, la forma más rápida es
pasar **la URL de la página del club**. Basta con el link crudo:

```
https://www.transfermarkt.co/club-atletico-colon/startseite/verein/1070/saison_id/2025
https://www.transfermarkt.co/ca-san-martin-tucuman-/startseite/verein/12709/saison_id/2025
```

**Lo único que Claude necesita de ahí es el número después de `/verein/`** (1070,
12709). El resto de la URL puede tener cualquier cosa y funciona igual — varios
clubes conservan el slug de su nombre viejo (`cortulua`, `fcr-valledupar`,
`real-san-andres`, `cd-atletico-huila`) y aun así el ID es correcto.

No hace falta abrir el plantel, ni copiar jugadores, ni nada más: **con el ID,
Claude baja el plantel completo con edades solo.**

### Por qué el buscador de Transfermarkt falla tan seguido

Vale conocer los límites para saber cuándo Claude va a pedir ayuda:

- **No tolera queries largas.** "Club Atlético Unión Santa Fe" devuelve **cero
  resultados**; "Union Santa Fe" devuelve el club.
- **Los nombres cortos caen en el club más famoso.** Buscar "Estudiantes" da el de
  La Plata, "Almagro" da San Lorenzo de Almagro, "Racing" da el de Avellaneda.
- **Hay homónimos en otros países.** Existen un Leones FC y un Tigres FC no
  colombianos, y buscar "Racing Club" devuelve Estrasburgo, Lens y Genk antes que
  el argentino.
- **Los clubes renombrados conservan el slug viejo**, así que el nombre de la URL
  no dice cuál club es realmente.

Por eso Claude **siempre verifica** cada ID contra el nombre que declara la propia
página del club antes de usarlo, incluso los que pasa el usuario.

## El pipeline técnico (lo que hace Claude con los datos)

1. **Resolver IDs** → buscador de Transfermarkt + verificación contra la página.
2. **`scripts/scrape_kader_tm.mjs`** → baja `/kader/verein/<id>` de cada club.
   Pausa de 1,2 s entre pedidos, sin dependencias externas.
3. **Cruce por nombre** contra los `starPlayers` de `src/data.ts` → genera
   `src/tmSquadEnrichment.ts`.
4. Los planteles crudos quedan en **`data/planteles_tm.json`**.

**Cuánto tarda:** ~20 clubes son 25 segundos de scraping. El cuello de botella no
es la red, es resolver los IDs.

## Reglas del cruce que NO hay que aflojar

El cruce por nombre exige que coincidan **nombre de pila Y apellido**. Aflojarlo
produjo cruces entre personas distintas, todos casos reales detectados:

| Nombre del juego | Cruzaba erróneamente con |
|---|---|
| Pedro Franco | Franco **Armani** |
| Luis Díaz | **Yesid** Díaz |
| Adrián Parra | **Néider** Parra |
| Dylan Lozano y Frank Lozano | ambos al **mismo** jugador |

Además un mismo `tmId` no puede quedar asignado a dos jugadores. Estas reglas
bajaron la cobertura de 72% a 44% en su momento, **y es lo correcto**: una edad
falsa rompe retiros y mentoría de forma difícil de rastrear.

## Reglas permanentes del proyecto

1. **Nunca tocar los escudos** (`badgeImageUrl`, `badgeLogoUrl`). Son trabajo
   manual acumulado. Antes de cada commit se verifica con `git diff` que no
   aparezcan.
2. **El enriquecimiento es aditivo**: `data.ts` no se reescribe salvo pedido
   explícito. Los datos nuevos viven en archivos aparte indexados por
   `"clubId|nombre"`.
3. **Deploy siempre a los tres targets**: Netlify (vía `main`) + GitHub Pages
   (`npm run deploy`) + mobile (`npm run cap:sync`). Nunca uno solo.
4. **Typecheck antes de commitear** (`npm run lint`).

---

# PARTE 2 — Estado actual del proyecto

## Números

| Métrica | Valor |
|---|---|
| Clubes en la base | **706** |
| Clubes con plantel real scrapeado | **99** |
| Jugadores scrapeados | **2.877** |
| `starPlayers` con edad real | **604** |

## Cobertura de planteles por liga

Las 7 ligas marcadas con ⭐ son las que dominan ChutSocial (85% de los posts).

| Liga | Clubes | Con plantel | Faltan |
|---|---|---|---|
| Colombiana ⭐ | 36 | **36** | **0** ✅ |
| Argentina ⭐ | 86 | 63 | 23 |
| Española ⭐ | 42 | 0 | **42** |
| Brasileña ⭐ | 40 | 0 | **40** |
| Italiana ⭐ | 40 | 0 | **40** |
| Alemana ⭐ | 36 | 0 | **36** |
| Inglesa ⭐ | 20 | 0 | **20** |
| Mexicana | 33 | 0 | 33 |
| Chilena | 32 | 0 | 32 |
| Estadounidense | 30 | 0 | 30 |
| Ecuatoriana | 28 | 1 | 27 |
| Peruana | 19 | 0 | 19 |
| Francesa | 18 | 0 | 18 |
| Portuguesa | 18 | 0 | 18 |
| Holandesa | 17 | 0 | 17 |
| Uruguaya | 16 | 0 | 16 |
| Boliviana | 16 | 0 | 16 |
| Venezolana | 14 | 0 | 14 |
| Paraguaya | 12 | 0 | 12 |

**Prioridad sugerida:** España, Brasil, Italia, Alemania e Inglaterra. Son ligas
prioritarias de ChutSocial con **cero** cobertura, así que sus posts y su
narración usan datos sin edad real (los retiros ahí caen al hash de respaldo).

## Lo que ya funciona

- **Motor de ligas paralelo**: todas las ligas y divisiones corren su calendario y
  tabla en simultáneo, con copas continentales y Mundial.
- **Fase 2.5**: 11 mecánicas de realismo (zona de confort, mentoría, bono por
  presencia, síndrome del segundo año, etc.).
- **Narración con rivales** (Paso 1): la crónica nombra a las figuras del equipo
  contrario, excluyendo arqueros de los goles. *"¡GOL de Once Caldas! Dayro Moreno
  aparece solo en el área"*.
- **Retiros** (Paso 3): decisión propia del jugador entre los 43 y 45 años; los
  jugadores del mundo se retiran según curva de edad y los reemplaza un canterano
  generado con nombre acorde al país del club. Sale en ChutSocial.
- **ChutSocial priorizado**: 89% de los posts son de las 7 ligas grandes (antes
  43%).
- **Estadísticas de liga por temporada**: se reinician cada año y el palmarés
  queda congelado en el historial de carrera.
- **Aviso legal** (`docs/LEGAL.md`) con enlace en la pantalla principal.

## Lo que falta

### Paso 2 — Ascenso y descenso (el más grande)

Los reglamentos reales ya están documentados:
- `docs/REGLAMENTO_COLOMBIA_2026.md` — descienden 2 por **promedio plurianual**;
  ascienden 2 vía campeones de los dos torneos semestrales + Repechaje.
- `docs/REGLAMENTO_ARGENTINA_2026.md` — Tabla General anual; en Primera Nacional
  ascienden 2 (Final + Torneo Reducido) y descienden 4.

**Bloqueo técnico conocido:** Argentina juega en **dos zonas dentro de la misma
división**, y hoy `LeagueSeasonState` asume una sola tabla por liga. Es el cambio
estructural más grande pendiente.

### Paso 4 — Mercado de fichajes lógico

Que los clubes se compren y vendan jugadores entre temporadas según
`reputation`/`marketValue`/división. Decidido: **sin datos reales de
Transfermarkt** — son una foto de 2026 que deja de tener sentido en la temporada 3.

### Otros pendientes

- **Bundle de 9,5 MB** en un solo chunk (1,2 MB gzip). Funciona, pero la primera
  carga en móvil con red lenta duele. Falta code-splitting.
- **569 escudos hotlinkeados** desde Wikimedia y footylogos. Riesgo técnico (los
  pueden bloquear) más que legal.
- **Fase 5 "vida fuera del campo"** (propuesta, no priorizada): apuestas y ruina,
  sobornos/amaño, gastos fijos de mantenimiento. Ver la conversación sobre New
  Star Soccer.

---

# PARTE 3 — Plantilla para pasar datos

Copiar esto y completarlo hace el trabajo directo:

```
LIGA: [nombre exacto como aparece en data.ts, ej. "Española"]
DIVISIÓN: [1, 2 o 3]

[pegar acá la tabla de clubes de Transfermarkt, o los links de cada club]
```

**Lo mínimo que sirve:** una lista de nombres de clubes tal como los escribe
Transfermarkt. Con eso Claude resuelve los IDs, verifica cada uno y scrapea.

**Lo que hace el trabajo instantáneo:** los links directos con el `/verein/<id>`.

**Lo que NO hace falta pasar:** planteles, edades, jugadores, valores de mercado
ni escudos. Todo eso lo baja Claude a partir del ID.

## Un dato útil sobre las webs oficiales de clubes

Se probó la web oficial de Barranquilla FC: **publica el plantel** (nombres y
posiciones, embebidos en base64 dentro de su API de WordPress) pero **no trae edad
ni fecha de nacimiento**, que es justo el dato que hace falta. Por eso la edad
sigue saliendo de Transfermarkt. Las webs de club sirven para *verificar* nombres,
no para reemplazar el scraping.
