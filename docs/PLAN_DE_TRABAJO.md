# Plan de trabajo

Lo que falta y lo que viene. Se arma el 13 de agosto de 2026, después de una sesión larga de
arreglos y features.

**Regla de esta lista:** cada punto dice *por qué* vale la pena y *qué toca*, no sólo qué es. Una
lista de ideas sin eso se vuelve un depósito y nadie la usa. Y lo que está medido va con el número
al lado — los que dicen "verificado" se comprobaron contra el código, no de memoria.

---

## Pendiente concreto

### Datos que faltan

- **Copa de Perú y Copa de Paraguay.** Son los únicos **2 de 19** países con liga cargada y sin copa
  nacional (verificado). Cierran el mapa de Sudamérica. Es scraping, y la red funciona desde los
  scripts — ver `scripts/bajar_fotos_tienda.mjs` como referencia de cómo se hizo con las fotos.
- **El arquero de la liga colombiana.** La tarjeta de "portería menos vencida" quedó vacía a
  propósito al sacar a Santiago Mele, que pasó a Independiente de Argentina. Hace falta el dato real;
  va en `REAL_LEAGUE_LEADERS` (`src/data.ts`).

### Deuda técnica que ya costó bugs

- **Terminar `scripts/validar_pantallas.jsx`.** Dibuja el Dashboard con un perfil a mitad de
  temporada. Está escrito pero NO conectado: su perfil sintético está incompleto y falla por el
  andamio, no por el juego.

  **Por qué importa:** dos bugs le llegaron al jugador porque nada dibuja el Dashboard en el build.
  `tsc` no ve el orden de ejecución (por eso pasó la pantalla negra por zona muerta temporal) y el
  chequeo de SSR entra por la pantalla de bienvenida, no por el Dashboard.

  **Cómo terminarlo:** extraer la construcción del perfil de `SetupScreen.tsx` (~línea 189) a una
  función exportada y usarla desde el validador. Copiar los campos a mano se desincroniza al primer
  campo nuevo.

### Interfaz

- **Campo 2D con micro-animaciones** durante el partido, en vez de círculos estáticos. La más
  vistosa y la más larga.
- El resto está en [PENDIENTES_UI_UX.md](PENDIENTES_UI_UX.md).

---

## Features acordadas, en orden sugerido

El orden no es por tamaño: es por **cuánto aprovechan lo que ya está construido**. Las primeras
reutilizan sistemas existentes y no tocan el motor ni el calendario, que es donde vivieron casi
todos los bugs.

### 1. El clásico

Marcar ciertos partidos como derbi: más presión en las decisiones, el feed lo anticipa toda la
semana, ganarlo da fans desproporcionados y perderlo duele el doble.

**Por qué primero:** ya existen las rivalidades y el feed. Es casi todo reutilización, y se siente
enseguida — un partido que pesa distinto cambia cómo lo encarás.

### 2. Lesión con rehabilitación jugable ✅ HECHA

Hoy la lesión es un número que baja. Podría ser un tramo con decisiones: sesiones de recuperación,
la tentación de volver antes con riesgo de recaída, el DT presionando.

**Por qué:** convierte un castigo pasivo en algo que jugás.

**Lo que se encontró al abrirla, y que cambió la tarea.** `ActiveInjury` ya llevaba
`treatmentChoice: 'fast' | 'natural'` y `handleTreatInjury` ya funcionaba, así que no había que
construir un sistema sino extender uno. Pero además apareció algo que no se veía desde afuera:

> **El roll de recaída ya existía y era CÓDIGO MUERTO.** Las dos puertas al partido
> (`handleAdvanceWeek` y `startMatchflow`) cortaban con `weeksRemaining > 0`, así que era imposible
> llegar a jugar con lesión activa — y por lo tanto imposible recaer. El aviso del tratamiento
> rápido, *"hay riesgo de recaída si volvés a jugar"*, era literalmente un farol: ese riesgo no se
> ejecutaba nunca.

Osea que **volver antes de tiempo** no agregó un sistema: abrió la puerta que dejaba muerto al que ya
estaba escrito.

**Cómo quedó** (`src/lesion.ts`, con la regla en un solo lugar):

- Tercera opción **"Volver antes de tiempo"**, ofrecida durante TODA la lesión y no sólo al
  principio — la decisión interesante no aparece el día que te lesionás, aparece a mitad de camino
  cuando ves la final en el calendario.
- **El riesgo escala con lo que te salteás**, no es plano: 23% con una semana pendiente, 45% con
  tres, 72% de tope. Un porcentaje fijo volvería la decisión trivial (forzás siempre o nunca); así
  la pregunta pasa a ser *"¿fuerzo ahora o espero dos fechas más?"*.
- **Cuesta en la cancha**, no sólo en el aviso: −9 a todos los atributos mientras jugás roto,
  encadenado donde ya vivía el descuento por fatiga. Es más alto que el de fatiga (6) a propósito —
  jugar roto tiene que pesar más que jugar cansado.
- **El tramo siempre termina.** Cada partido aguantado descuenta una fecha, así que aunque nunca
  recaigas llegás al alta jugando. Sin eso quedabas en un bucle de riesgo eterno.
- **Tiene voz:** `postsDeLesion` en ChutSocial, con dos repertorios distintos según estés de baja o
  jugando roto — el médico advirtiéndote, la hinchada aplaudiendo el huevo, Vélez llamándolo mala
  gestión.

**Comprobado:** `npm run validar:lesiones` (14 casos) y el panel agregado a `validar:pantallas`
(24 combinaciones). Los dos se vieron FALLAR con un bug inyectado antes de darlos por buenos.

### 3. Renovación de contrato con negociación ⏸️ OMITIDA POR AHORA

Decisión del autor (14 de agosto de 2026): se omite. **No está descartada** — se pospone.

Se deja acá lo que se averiguó abriendo el código, para que la próxima vez no haya que
re-descubrirlo:

- **Hoy la renovación no renueva nada.** `handleRequestRenewal` (App.tsx ~1769) es un botón con un
  dado: ~50% y sale bono + suba de prima, o prestigio −6. No hay mesa, no hay contraoferta.
- **No existen contratos con fecha de vencimiento.** El propio comentario del código lo dice. Y ése
  es el problema de fondo: sin vencimiento no hay urgencia, y sin urgencia no hay negociación —
  podés pedir renovación en la fecha 3 o en la 300 y es exactamente igual.
- **El agente ya existe** (`Agent` en types.ts, con `reputation` 1-5) pero sólo cobra comisión en
  traspasos. En una negociación real sería la palanca obvia.
- **`appearanceBonus` ya existe** y ya tiene tensión propia (cobrarla te empuja a jugar exhausto y
  eso enfría al DT), así que sería palanca gratis.
- La cláusula de rescisión que mencionaba la idea original **ya estaba descartada** por el autor (ver
  la tabla de abajo), así que habría que reemplazarla por otra palanca.

**Si se retoma, la decisión estructural es una sola:** si los contratos pasan a tener vencimiento
(toca el estado guardado y necesita migración, como se hizo con `activeInjury`) o si sólo se mejora
la mesa dejando el contrato indefinido (mucho más barato, pero la renovación sigue sin urgencia).

### 4. La lista de convocados

Que antes de la fecha FIFA salga la nómina en el feed y veas si estás o no, con la prensa
discutiendo tu ausencia. Hoy te convocan en silencio.

### 5. Momento de forma visible

Una racha que el juego reconozca: tres partidos seguidos con buena nota da un plus, una mala racha lo
quita. Da continuidad entre partidos, que hoy son bastante independientes entre sí.

### 6. El retiro como documental

Al colgar los botines, un repaso narrado: récords, dónde quedaste en la historia, qué no alcanzaste.
Los datos ya están todos — palmarés, logros, Balón de Oro, tablas por competición.

---

### 7. El técnico te habla en el entretiempo

Si vas perdiendo te pide algo concreto ("andá a buscarla al medio"). Cumplirlo sube la relación con
él; ignorarlo y ganar igual sube tu ego pero lo enfría. Usa las decisiones que ya existen en el
partido.

### 8. Rival de carrera

Un jugador de otro club que sube contigo y al que te comparan toda la carrera. El feed los enfrenta;
superarlo vale más que superar a cualquiera.

### 9. El bajón anímico

`mentalHealth` ya existe pero hoy es un número sin consecuencia. Se convierte en un ESTADO con
salida:

- **Se entra** por acumulación, no por un mal partido suelto: dos o tres derrotas con nota baja, una
  lesión larga, o un escándalo. Tiene que sentirse merecido.
- **Mientras dura** el costo se ve en la cancha: menos energía inicial, las decisiones arriesgadas
  salen peor, y el feed lo nota. Si el bajón no se ve jugando, es decoración.
- **Se sale decidiendo**, y ninguna opción es obviamente correcta: psicólogo del club (cuesta plata y
  que el DT se entere), volver al barrio (perdés una fecha), o apretar los dientes (gratis, podés
  hundirte más).

Reutiliza decisiones, feed y "Visitar a los tuyos", que ya está en Entorno.

### 10. Rachas de TU historia

**La fuente cambia respecto de la idea original, y eso la vuelve viable.** Buscar rachas reales de
600 clubes no lo es: no existe esa base, habría que scrapear décadas y quedaría vieja al día
siguiente.

Pero el juego ya guarda tu historia entera -- cada resultado con su fecha, todas las temporadas,
todos los títulos. Así que las rachas salen de tu carrera: *"no le ganás a Nacional hace 6
partidos"*, *"cuarta final consecutiva que perdés"*. Cero datos externos, cero mantenimiento, y pesa
más: es una racha que viviste, no una que leíste.

Costo real: escribir las consultas sobre `datedResults` y elegir cuáles son interesantes.

### 11. El fichaje que te tapa

El club compra a alguien de tu puesto y tenés que pelear el lugar.

**Viable y de bajo riesgo, verificado:** `decideLineupStatus` (App.tsx ~2219) ya decide cada semana
si sos titular, suplente o ni convocado, comparando tu prestigio contra un umbral que sale de la
reputación del club. Ser suplente ya funciona, con entrada desde el banco incluida.

Osea que el fichaje NO necesita un sistema nuevo: es subir ese umbral temporalmente y bajarlo a
medida que rendís. No toca calendario ni motor -- los dos lugares donde vivieron casi todos los bugs.

**Tope obligatorio:** nunca puede dejarte en `not_called`, sólo en `substitute`. Así el peor caso es
banco de más, nunca una temporada sin jugar.

### 12. Publicar vos en ChutSocial

Un botón en el feed, UNA publicación por fecha. Se abre con tres o cuatro opciones escritas según tu
último partido -- no texto libre, que no hay forma de evaluar.

- Después de ganar: agradecer a la hinchada / reconocer al rival / picantear el próximo clásico.
- Después de perder: hacerte cargo / señalar al equipo / no decir nada.

Cada una mueve fans, prestigio y relación con el DT en direcciones distintas, y **ninguna es gratis**:
picantear da fans y enfría al técnico; hacerte cargo da respeto y baja el ánimo.

Y el feed RESPONDE, reusando el mecanismo de la rueda de prensa: se guarda el saldo de la publicación
y las voces reaccionan. Así el feed deja de ser de una sola vía sin inventar nada nuevo.

---

## Descartadas, con el motivo

Anotadas para no volver a proponerlas.

| Idea | Motivo |
|---|---|
| El capitán | Descartada por el autor. |
| Cláusula de rescisión | Descartada por el autor. |
| Sorteo en vivo | Descartada por el autor. |
| Equipo del año | Descartada por el autor. |
| Partido homenaje | Descartada por el autor. |
| Hijos futbolistas | Buena idea pero traería muchos bugs: toca retiro, generaciones y estado guardado a la vez. |
| **VAR** | Haría el juego injusto. Un gol anulado por algo que el jugador no controla es frustración sin decisión detrás. |
| Pelear por el número | Descartada por el autor. |
| Primas por objetivos | Descartada por el autor. |
| Pretemporada y gira | Descartada por el autor. |
| La entrevista larga | Descartada por el autor. |

**Sin decidir todavía:** adaptación al extranjero, barra brava, el casi-traspaso.

---

## Lo grande que quedó a medias

- **Goleadores reales en las copas.** Hoy el motor atribuye goleadores en los partidos de LIGA de
  cada fecha, pero en las copas resuelve el cuadro entero de una sola vez, y atribuir ahí adelantaría
  el torneo en pantalla. Ver [goleadores_reales_plan](../../.claude/…) en memoria.
- **Conference League.** No se puede importar de `UCOL.json` (alias rotos y clubes de ligas que no
  tenemos). Necesita un reparto de cupos sobre las 7 ligas europeas cargadas.
