# Prompt de datos y scraping — Fut Starzz

**Cómo usarlo:** pegale a Claude el enlace de este archivo (o su contenido) cuando vayas a pedirle
trabajo de datos. Está escrito para que no se repitan errores que ya costaron sesiones enteras.

---

## 0. Las cinco reglas que no se negocian

1. **Solo datos reales y actualizados a hoy.** Nada inventado, nada "aproximado", nada de memoria.
   Si un dato no se consigue, se dice — no se rellena con algo plausible.
2. **Los homónimos se resuelven por ID, jamás por nombre.** Ver §3. Esto ya rompió el juego dos
   veces.
3. **ESPN primero para calendarios; Transfermarkt para planteles** y para lo que ESPN no tenga o
   tenga desactualizado. Ver §2.
4. **Cada competencia tiene su reglamento y no se mezclan.** Colombia ≠ Argentina ≠ el resto.
   Ver §4.
5. **Verificar antes de cantar victoria.** `tsc` no alcanza: hay que renderizar. Ver §6.

---

## 1. Cómo se scrapea (recetas que YA funcionan)

### ESPN — calendarios con fecha exacta

```
https://www.espn.com.co/futbol/equipo/calendario/_/id/<ID>   → próximos
https://www.espn.com.co/futbol/equipo/resultados/_/id/<ID>   → jugados
https://www.espn.com.co/futbol/equipo/plantel/_/id/<ID>      → plantel
https://www.espn.com.co/futbol/equipos/_/liga/<LIGA>         → IDs de la liga (col.1, arg.1, esp.1…)
```

Script listo: `scripts/scrape_espn_calendario.mjs`

**Trampas ya resueltas — no volver a tropezar:**

| Síntoma | Causa | Solución |
|---|---|---|
| 202 con cuerpo vacío | El `fetch` de Node lo toma por bot | Usar `curl` vía `execFile` |
| 202 con cuerpo vacío | UA que menciona Chrome | UA exactamente `Mozilla/5.0`, nada más |
| 0 bytes | `--compressed` sin soporte gzip | Sacar `--compressed` |
| Página sin datos | Slug derivado del nombre de data.ts | URL **sin slug**: solo `/_/id/<ID>` |
| "No hay `__espnfitt__`" | Regex hasta `</script>` | Recortar **contando llaves** (el JSON trae `</script>` escapado) |
| `undefined` en el torneo | `ev.league` es string, no objeto | Leerlo como string |
| Faltan partidos jugados | Solo se leyó una rama | Leer `content.fixtures.events` **y** `content.results.events` |

Rutas del payload: `page.content.fixtures.events`, `page.content.results.events`,
`page.content.squad.groups[].athletes[]`.

### Transfermarkt — planteles

```
https://www.transfermarkt.co/<slug>/startseite/verein/<ID>/saison_id/<AÑO>
```

**Mejor que ESPN para planteles** porque da la posición detallada (lateral izquierdo, pivote,
extremo derecho) en vez de las cuatro genéricas de ESPN.

Script listo y genérico: `scripts/actualizar_plantel_tm.mjs data/planteles_tm/<club>.json [--dry]`
→ Para un club nuevo alcanza con crear el JSON. **Correr siempre `--dry` primero.**

### Fichajes — el comando único (esto es lo que se usa cada vez)

```bash
npm run fichajes                     # baja lo nuevo, lo aplica, lo anota
npm run fichajes -- --dry            # igual pero sin escribir
npm run fichajes -- --ligas GB1,ES1  # sólo esas ligas
npm run fichajes -- --pendientes     # los que no se pudieron aplicar y por qué
npm run fichaje -- "Bruno Guimarães" "Arsenal"   # uno suelto, sin esperar a Transfermarkt
```

**Es incremental y se puede repetir.** `data/fichajes_aplicados.json` guarda la clave de cada
movimiento ya aplicado (por ID de Transfermarkt del jugador y del club, nunca por nombre), así que
una corrida sin novedades tarda medio segundo y una con tres fichajes muestra tres renglones. La
bitácora legible queda en `data/fichajes_bitacora.md`.

**Por qué hizo falta.** Las dos piezas de abajo ya existían, pero correrlas seguido era caro y
peligroso:

| | Antes | Ahora |
|---|---|---|
| Informe de un día tranquilo | 6.401 altas, casi todas ya aplicadas | `0 altas y 0 bajas` |
| Correrlo dos veces seguidas | 625 jugadores **duplicados** y 1.800 movimientos de más | no cambia nada |
| Decidir si aplicar | leer 100 líneas de verificaciones | tres banderas rojas que frenan solas la escritura |

**El bug de los clones, para que no vuelva.** `aplicar_fichajes.mjs` trataba a "Agentes libres" como
si fuera una selección, así que el índice de búsqueda por nombre no veía a los 4.859 jugadores sin
club: cuando alguno era fichado, la base "no lo tenía" y se creaba una fila nueva. La base arrastraba
604 filas clonadas. Ahora son dos preguntas separadas — "¿es un club?" (para el tope de plantel y las
cuentas) y "¿puedo buscar un jugador acá?" (que sí mira a los libres) — y los clones viejos se barren
solos.

**Cómo se sabe qué fila es un clon, sin adivinar:** los ids de la base original llegan hasta 279.948
y después hay un hueco de veinte mil hasta 300.000, donde empiezan los ids inventados por los
scripts. Un id >= 300.000 dentro de agentes libres, con otra fila del mismo nombre, es el clon. Si
las dos filas son originales **no se tocan**: son dos personas distintas que se llaman igual.

**Los jugadores creados guardan su `tm_id`**, así que la próxima ventana los encuentra por ID y no
por nombre. Ese mapa Transfermarkt ↔ base se llena solo, unos cientos por ventana.

**Las tres banderas rojas** que impiden guardar (se saltan con `--igual` si ya se sabe por qué):
dos clubes de Transfermarkt cayendo en el mismo club del juego, los clubes de más de 40 jugadores
creciendo, y los de menos de 14 creciendo de a más de cinco.

Las piezas sueltas siguen ahí y sirven para depurar: `scripts/scrape_fichajes_tm.mjs` (baja) y
`scripts/aplicar_fichajes.mjs --desde <archivo>` (cruza, con el informe largo).

### X / Twitter — para tono de ChutSocial

La API pide pago (402), pero **`https://r.jina.ai/https://x.com/<cuenta>` sí devuelve los tuits**
con emoji y mayúsculas. Los tuits salen como líneas que empiezan con `*   [![`.
No todas las cuentas responden siempre: **reintentar**, en el segundo intento suelen salir.

### Si nada funciona

Decirlo derecho y pedir **capturas de pantalla** — se leen sin problema. Nunca inventar el dato.

---

## 2. Qué fuente usar para qué

| Dato | Fuente | Por qué |
|---|---|---|
| Calendario con fechas | **ESPN** | Trae fecha exacta, torneo, local/visitante, IDs |
| Plantel | **Transfermarkt** | Posiciones detalladas; ESPN solo da 4 genéricas |
| Club que ESPN tiene mal | **Transfermarkt** | Ej: recién ascendidos que ESPN sigue listando en Segunda |
| Reglamentos | **Sitio oficial** (Dimayor, AFA/LPF) + prensa para confirmar el año en curso | Los formatos cambian entre temporadas |

**ESPN falla con los recién ascendidos**: los deja en Segunda con el plantel vacío. Pasó con Cúcuta
y Jaguares. Ante un club sin datos en ESPN → Transfermarkt.

---

## 3. Homónimos — la regla que ya se rompió dos veces

**Nunca emparejar clubes ni jugadores por nombre. Siempre por ID.**

Casos reales que costaron caro:

- **Clubes**: hay 10 pares con el mismo nombre (Everton chileno/inglés, Liverpool uruguayo/inglés,
  Nacional uruguayo/paraguayo, Athletic brasileño/español, Leones FC colombiano/ecuatoriano,
  Universidad Católica chilena/ecuatoriana, Comunicaciones argentino/guatemalteco, Racing Club
  argentino/uruguayo, San Antonio ecuatoriano/boliviano, Alianza Universidad).
  El Everton de Chile llegó a alinear a los jugadores del inglés, el Racing de Montevideo a los 31
  de Avellaneda y el San Antonio de Ecuador a los 32 bolivianos de Bulo Bulo.
- **Jugadores**: emparejar por apellido unió a "Edwin Martínez" (lateral) con "Diego Martínez"
  (arquero) y le cambió la posición al arquero. Jaguares tiene **tres** Mosquera.

**Dónde viven los nombres:** en `src/clubAliases.ts`, **una sola tabla** (`NOMBRES_DE_CLUB`)
indexada por id de club, con un campo por fuente: `nombre` (el visible, el único que se muestra),
`calendario`, `plantel` y `otros`. Hubo cuatro tablas separadas contestando lo mismo y cada arreglo
entraba en una sola: el Bayern, el PSV, el Inter y el Lyon se quedaron sin la ventana de pases entera
porque su nombre de Transfermarkt estaba cargado nada más en la del calendario. **Un nombre nuevo se
agrega ahí y en ningún otro lado.** `plantel: null` significa que la base no tiene a ese club, y es
lo que evita que se lleve el plantel de su homónimo.

**Reglas:**
- Clubes → por `club.id`, y para desambiguar usar `resolverClubDeCalendario` con el torneo.
- Un nombre nuevo de un club → a `NOMBRES_DE_CLUB`, y `npm run validar:alias` después.
- Jugadores → nombre completo exacto, o apellido **+ algún nombre de pila coincidente**.
  Apellido solo, jamás.
- Al scrapear rivales → resolver por el **ID numérico de la fuente**, no por el texto.
- Después de importar, **verificar siempre**: 0 planteles compartidos, y la distribución de
  posiciones (ver §5).

---

## 4. Reglamentos — cada país el suyo

Documentados en `docs/`:
- `REGLAMENTO_COLOMBIA_2026.md` — Dimayor
- `REGLAMENTO_ARGENTINA_2026.md` — AFA / LPF
- Holanda — KNVB, vía [Dutch football league system](https://en.wikipedia.org/wiki/Dutch_football_league_system)

**Implementado** (`src/promocionDescenso.ts`):

| País | Descienden | Ascienden | Criterio |
|---|---|---|---|
| Colombia | 2 | 2 (campeón doble / líder anual / Gran Final / Repechaje) | **Promedio** (pts ÷ partidos), ventana 3 años |
| Argentina | 4 | 2 (Final a partido único + Reducido) | Tabla del año |
| Brasil | 4 (puestos 17-20) | 4 (los 4 primeros de la Serie B) | Tabla del año |
| Holanda | 2 + el 16° si pierde el play-off | 2 + el ganador del play-off | Tabla del año |
| Alemania | 2 + el 16° si pierde la Relegation | 2 + el ganador de la Relegation | Tabla del año |
| Francia | 2 + el 16° si pierde el barrage | 2 + el ganador del barrage | Tabla del año |
| España | 3 | 2 + el ganador del play-off 3°-6° | Tabla del año |
| Inglaterra | 3 | 2 + el ganador del play-off 3°-6° | Tabla del año |

**Los formatos de play-off, y no hay que confundirlos:**

| | Quién lo juega | Modelado en |
|---|---|---|
| Holanda | el 16° de Primera contra **seis** de Segunda; él juega 2 llaves, ellos 3 | `playoffPermanencia` |
| Alemania | el 16° de Primera contra **uno solo**, el 3° de la 2. Bundesliga | `playoffPermanencia` (`rivalesPlayoff: 1`) |
| Francia | el 16° de Ligue 1, pero recién después de que el 3°/4°/5° se crucen entre sí | `playoffPermanencia` (`rivalesPlayoff: 3`) |
| España | **solo clubes de Segunda** (3° al 6°); Primera no pone a nadie en juego | `playoffAscensoEspana` |
| Inglaterra | ídem España: 3° al 6° del Championship | `playoffAscensoEspana` |

**Ojo con las fuentes de Francia:** se contradicen entre sí sobre cuántos bajan de Ligue 1 (dos
dicen 2, una dice 3) y sobre quién juega el barrage. Lo resolvió mirar la **temporada real**
(`2025-26 Ligue 1`), que da nombres concretos: bajaron Nantes (17°) y Metz (18°), y el Niza (16°)
retuvo la categoría ganándole 4-1 al Saint-Étienne. Ante fuentes que no coinciden, la temporada
jugada manda.

**Brasil es el más simple:** intercambio directo y simétrico, 38 fechas de todos contra todos, sin
play-off ni liguilla. Al no declarar `puestoPlayoff`, `resolverMovimientos` ni se asoma al cruce.
Su desempate — **victorias → diferencia de gol → goles a favor** — obligó a guardar `victorias`,
`golesFavor` y `golesContra` en `RegistroAnual`: antes solo se persistían puntos y partidos, así que
al cerrar el año los desempates se perdían. Son opcionales, y si faltan (partidas viejas) el orden
lo decide el puntaje, como venía funcionando.

**El detalle del play-off neerlandés:** no es un cruce parejo. El 16° de la Eredivisie entra recién
en la 2ª ronda y le alcanza con **ganar 2 llaves**; los seis de la Eerste Divisie tienen que ganar
**3**. Modelarlo simétrico le sacaría la ventaja que el reglamento le da. Está en `playoffHolanda()`.

**Holanda ya funciona**: 17 clubes de Eredivisie + 16 de Eerste Divisie
([fuente](https://en.wikipedia.org/wiki/Eerste_Divisie), 2024/25). De los 20 de la categoría se
excluyeron a propósito los **cuatro filiales** — Jong Ajax, Jong PSV, Jong AZ y Jong FC Utrecht —:
por reglamento de la KNVB **no pueden ascender**, y cargarlos dejaría al motor subiendo a "Jong Ajax"
a la Eredivisie.

> **Trampa del `puestoPlayoff`:** el reglamento dice "16° de 18", pero la Eredivisie del juego tiene
> **17** clubes. Tomar el índice 16 fijo caía sobre el penúltimo — que ya bajaba directo — y el
> play-off no corría nunca: los dos escenarios daban el mismo resultado. Se cuenta **desde el fondo**
> (el que queda justo encima de los que descienden), no por posición absoluta.

**No mezclar nunca.** La puerta de entrada es `reglasDeLiga(league)`, que devuelve `null` para
cualquier liga sin reglamento cargado: así ninguna otra hereda reglas ajenas por accidente.

**Antes de implementar otra liga: buscar su reglamento vigente del año en curso.** Los formatos
cambian — en 2026 Argentina sumó cruces interzonales (36 fechas, no 18+18) y el Torneo BetPlay pasó
de 14 a 16 clubes. Documentarlo en `docs/` con las fuentes enlazadas.

---

## 5. Verificaciones obligatorias después de tocar datos

```
npm run validar:alias      <- 0 planteles compartidos, y una sola tabla de nombres
0 días con más partidos de los reales
distribución de posiciones sana (¿hay laterales izquierdos? ¿2+ arqueros por club?)
medias dentro del rango de la liga (Colombia: 55-78, mediana 68)
los clubes sin plantel siguen siendo los mismos de antes (sin regresiones)
```

Lo de "0 planteles compartidos" ya no se cuenta a mano: `npm run validar:alias` lo mide y falla si
dos clubes buscan su plantilla con el mismo nombre. Es lo que encontró al Racing de Montevideo con
el plantel de Avellaneda y al San Antonio de Ecuador con el de Bulo Bulo — dos clubes que se veían
perfectos en pantalla, con once jugadores cada uno.

**Trampa de ESPN**: solo publica 4 posiciones (Goalkeeper/Defender/Midfielder/Forward). Mapearlas
directo dejó a **toda la liga con 5 laterales y ningún lateral izquierdo** — equipos imposibles de
parar en cancha. Hay que repartir posiciones concretas dentro de cada línea.

---

## 6. Cómo verificar la UI (tsc NO alcanza)

`tsc` y `vite build` **no atrapan** los `ReferenceError` por TDZ que dejan la pantalla en blanco.
Lo que sí funciona:

```bash
npx vite build --ssr <entry>.jsx --outDir <dir> --logLevel error
node <dir>/<entry>.js
```

Entry y outDir **dentro del repo** (fuera no resuelve `node_modules`).

Callejones ya recorridos, no repetir:
- `ssrLoadModule('react')` → `ERR_AMBIGUOUS_MODULE_SYNTAX`
- Importar React con el `import` de Node → dos copias, "Invalid hook call"

Datos para el mock: items de tienda = `INITIAL_LIFESTYLE_ITEMS`; selección Colombia = `wc_colombia`.

**Regla de oro:** calcular cualquier variable que use el JSX **arriba del componente**, nunca cerca
del JSX que la consume — el archivo tiene ~3700 líneas y el TDZ ya dejó la pantalla en blanco una vez.

---

## 7. LO QUE FALTA (estado real, medido el 2-ago-2026)

### 7.1 Calendario real — 151 de 643 clubes

Colombia y las cinco grandes de Europa ya tienen fechas reales (importadas de `ALLgames.json`,
ver §7.4). **El resto del mundo sigue con calendario generado.**

Ya con fechas: Colombiana 30, Inglesa 20, Italiana 20, Española 20, Alemana 18, Francesa 16.

| Liga | Clubes | Con plantel | Con fechas |
|---|---|---|---|
| Colombiana | 36 | 35 | **30** |
| Brasileña | 40 | 37 | 5 |
| Uruguaya | 16 | 10 | 4 |
| Ecuatoriana | 28 | 20 | 3 |
| Peruana | 19 | 16 | 3 |
| Mexicana | 33 | 32 | **0** |
| Holandesa | 17 | 13 | **0** |
| Portuguesa | 18 | 12 | **0** |

**Siguiente paso sugerido:** Argentina (ya tiene reglamento cargado). Ojo: Holanda, Portugal,
Brasil, MLS y Turquía **están en `ALLgames.json`** pero se descartaron porque menos del 70% de sus
clubes existen en el juego — primero hay que crear esos clubes, después el calendario entra solo.

### 7.2 Planteles genéricos — 82 clubes sin jugadores reales

Lazio, Atalanta, Ludogorets, Maccabi, Pafos, Kairat y varios sudamericanos. No están en
`playersDatabase.json` y **no aparecen en ninguna fuente ya cargada** → hay que scrapearlos de
Transfermarkt uno por uno.

Ligas con más agujeros: Resto del Mundo (18/30), Portuguesa (12/18), Chilena (24/32),
Ecuatoriana (20/28), Italiana (33/40).

### 7.3 Reglamentos sin implementar

- **Argentina**: falta modelar las **zonas** (dos grupos de 18) — hoy `LeagueSeasonState` asume una
  sola tabla por liga. También la Tabla General anual y el Reducido completo.
- **Los 5 grandes ya están los cinco.** Lo que queda sin reglamento:

  | Liga | D1 | D2 | Reglamento |
  |---|---|---|---|
  | Italiana | 20 | 27 | **falta** |
  | Portuguesa | 16 | 15 | **falta** |
  | Inglesa | 20 | 24 | ✅ implementado |
  | Española | 20 | 22 | ✅ implementado |
  | Alemana | 18 | 18 | ✅ implementado |
  | Francesa | 18 | 19 | ✅ implementado |
  | Holandesa | 17 | 16 | ✅ implementado |
  | Brasileña | 20 | 20 | ✅ implementado |

  (Contar SIEMPRE con el módulo compilado, no con regex sobre `data.ts` — ver §5.)
- **Resto de ligas**: sin ascenso/descenso. Buscar el reglamento vigente antes de tocar código.

### 7.4 JSON sin importar — OJO, no todo es basura

**Lección aprendida: "nadie lo importa" NO significa "no sirve".** Al revisarlos uno por uno
aparecieron datos valiosos que casi se borran.

**Tienen datos que SÍ sirven — no borrar:**

| Archivo | Contenido |
|---|---|
| `ALLgames.json` (70M) | **88.958 partidos con FECHA EXACTA** de Transfermarkt, hasta la temporada 2025/26. Incluye Premier, LaLiga, Serie A, Bundesliga y Ligue 1 completas — justo las ligas que no tenían fechas |
| `schedule_2026.json` (20K) | Calendario real del **Mundial 2026**, 72 partidos con fecha |
| `clubs.json` (488K) | 796 clubes con market value, squad size, edad promedio |
| `national_teams.json` (76K) | 124 selecciones con escudo y datos |

**Duplicado exacto — borrar sin riesgo:**
- `games.json` (70M) — mismo contenido que `ALLgames.json`, verificado registro a registro

**Descartables:**
- `world_cup.json` (8K) — historial de Mundiales viejos
- `fifa_ranking_2026-06-08.json` (44K) — ranking de un día puntual
- `competitions.json` (28K), `most_valuable_teams (1).json` (28K)

*(Verificar de nuevo antes de borrar: `grep -rl "<archivo>" src/` **y abrir el archivo**.)*

Además: `src/realCalendar.ts` (1.1 MB, el calendario **viejo por semanas**) y `src/realSchedule.ts`
siguen vivos porque los clubes sin fechas reales todavía los usan. **Se podrán borrar recién cuando
todas las ligas tengan fechas reales** — no antes.

### 7.5 Bugs conocidos

- El **cruce Libertadores/Superliga** se arregló varias veces; si reaparece, buscar **todos** los
  sitios que escriben `nextMatchOpponent` (hay 3) antes de tocar uno.
- **"La tarjeta dice un equipo y el partido es otro" en una copa continental** (reportado con el
  Junior, sep-2026): la causa NO estaba en `nextMatchOpponent` sino un paso antes — en **quién
  manda en la copa**. App decidía con la regla completa (en la temporada 1 los partidos los pone el
  CALENDARIO, porque ésos sí son los que el club jugó de verdad) y el Dashboard se conformaba con
  que el club estuviera clasificado, así que la tarjeta leía el cuadro del motor y el partido salía
  del calendario. De los seis partidos del grupo del Junior, **cuatro** se anunciaban contra un
  rival y se jugaban contra otro. La respuesta vive ahora una sola vez, en
  `laCopaContinentalLaLlevaElCuadro` (`src/decisionDelDia.ts`).

  **Cómo se encontró, que es lo reutilizable:** `npm run jugar:ui` ya trae el chequeo —
  compara el rival que anunció la tarjeta contra el que nombra el resumen del partido y escribe
  `!! el partido NO fue contra X` en el log. Marcaba las cuatro fechas exactas y se habían
  descartado como ruido (el resumen a veces queda tapado por un cartel de logro). **Ante un reporte
  de este tipo: correr el banco con ese club y contar los `!!` antes y después.**
- Cinco cuentas de X no siempre devuelven tuits; reintentar.

---

### 7.6 Planteles al día

La ventana de pases se sincroniza con `npm run fichajes` (§1). Lo que ese comando **no** puede
resolver solo, y queda esperando en `npm run fichajes -- --pendientes`:

- **~950 movimientos hacia clubes que el juego no tiene** (turcos, griegos, saudíes de segunda
  línea). El jugador se va a agentes libres, que es lo correcto: dejó su club de verdad.
- **~440 jugadores con nombre repetido en la base** que no se pueden identificar sin adivinar
  ("Thiago Fernández" está en tres clubes). Se destraban de a uno con
  `npm run fichaje -- "Nombre" "Club" --de "Club actual"`.

## 8. Checklist antes de decir "listo"

- [ ] Los datos salen de una fuente real y verificable, y quedó anotada
- [ ] Homónimos resueltos por ID, no por nombre
- [ ] `tsc --noEmit` limpio
- [ ] Render SSR OK (§6)
- [ ] Sin regresiones: mismos clubes sin plantel que antes, 0 planteles compartidos
- [ ] Scratch files borrados del repo
- [ ] Desplegado a **los tres destinos**: `main` (Netlify) + `npm run deploy` (GitHub Pages) +
      `npm run cap:sync` (móvil)
- [ ] Verificado que el sitio en vivo sirve el build nuevo (comparar hash de `dist-ghpages/`)
