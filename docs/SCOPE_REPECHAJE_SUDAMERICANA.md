# El tercero del grupo baja a la Sudamericana

> **HECHO** (agosto 2026, commits `bd15c4b` y `ba0ac84`). Se eligió el formato **real**, desde la
> **temporada 1**, y **dos avisos separados** el día que bajás. Lo que sigue queda como registro de
> por qué se hizo así y de lo que se midió antes de empezar.
>
> Lo que salió distinto de lo previsto: no hizo falta crear estado nuevo. Quién bajó se deduce del
> cuadro guardado de la Libertadores, que ya dice quién quedó tercero, así que no hubo migración.
> Y apareció un costo que el scope no había visto: la bolsa de fechas tuvo que subir de 13 a 15
> **para las dos copas** -- el club no sabe en cuál va a terminar --, lo que subió la congestión del
> calendario de 1165 a 1263 hallazgos de descanso.

Scope, no implementación. Todo lo que dice está medido contra el código y los datos actuales
(agosto 2026), no recordado.

---

## Qué pasa hoy

Doce clubes tienen partidos de las **dos** copas continentales en su calendario de la temporada 1:

```
Junior de Barranquilla   Libertadores: 6  · Sudamericana: 7
Independiente Santa Fe   Libertadores: 6  · Sudamericana: 11
Independiente Medellín   Libertadores: 10 · Sudamericana: 9
Deportes Tolima          Libertadores: 12 · Sudamericana: 7
River Plate · Tigre · São Paulo · Vasco da Gama · O'Higgins ·
Boston River · Macará · Caracas FC          (2 de una y 11 de la otra)
```

Son reales: el calendario de Transfermarkt trae el repechaje al que baja el tercero de cada grupo
de Libertadores. El juego **los juega** — el rival sale del calendario, el resultado se anota — pero
el motor no le arma cuadro a esa segunda copa, porque el club no figura entre sus participantes. O
sea que se juegan partidos de un torneo que no existe: sin ronda, sin rival del cuadro, sin
eliminación y sin campeón posible.

`jugar_carrera.ts` ya lo dice desde el último commit, para que deje de pasar en silencio:

```
Copa Sudamericana   2 partido(s) del calendario · SIN CUADRO en el motor, no hay campeon
```

---

## Qué modela el motor hoy

Las dos copas son **idénticas** y no se hablan:

| | Libertadores | Sudamericana |
|---|---|---|
| participantes | 32 | 32 |
| se solapan | — | 0 clubes |
| forma | 8 grupos de 4 | 8 grupos de 4 |
| pasan al cuadro | los 2 primeros de cada grupo (16) | los 2 primeros de cada grupo (16) |
| pasos hasta el campeón | 13 | 13 |

Medido con `getOrCreateCupState`. La Sudamericana es hoy una copia de la Libertadores con otros
32 clubes.

---

## Qué habría que cambiar

### 1. La Sudamericana necesita una ronda más

El formato real: los **8 ganadores de grupo** pasan directo a octavos; los **8 segundos** juegan un
repechaje a ida y vuelta contra los **8 terceros de la Libertadores**, y los 8 que ganan completan
los octavos.

Eso son **15 pasos** en vez de 13: 6 de grupos + 2 de repechaje + 2 + 2 + 2 + 1 (la final es a
partido único).

Toca `resolveCupStep` en `leagueEngine.ts`, en la transición grupos → cuadro. Hoy
`seedFromCupGroups` devuelve 16 clubes y siembra los octavos directo.

### 2. Las dos copas tienen que hablarse

Los 8 terceros salen de un `CupState` y entran en otro. Hoy cada copa se crea sola, sin conocer a
la otra. Hace falta:

- que la Libertadores **publique** sus terceros al cerrar los grupos (un campo nuevo en `CupState`,
  o derivarlos de sus tablas de grupo, que ya están guardadas);
- que la Sudamericana los **reciba** al sembrar su repechaje.

Es la parte con más riesgo de diseño: quien las conecte tiene que ser un solo lugar, o vuelve el
patrón de dos fuentes que este proyecto viene sacando.

### 3. La copa del jugador cambia a mitad de temporada

Hoy `conmebolCupId` es una función pura de las listas de participantes, y se calcula en **dos
sitios** (`App.tsx` y `Dashboard.tsx`). Entre los dos archivos, `conmebolCupId`/`activeCupId`
aparecen **39 veces**.

Con el repechaje pasa a ser: *"tu copa, salvo que te hayan bajado"*. Eso es una pregunta con una
sola respuesta que dos archivos necesitan — exactamente lo que `decisionDelDia.ts` existe para
contestar. Ahí debería vivir, derivada del estado guardado (sin campo nuevo, sin migración).

### 4. Faltan dos días de calendario

Un club que baja necesita 15 días de copa continental en el año. Medido: **27 de los 30** clubes de
Libertadores con calendario propio tienen **13**.

`FECHAS_DE_COPA_CONTINENTAL` es hoy un solo número por confederación (13 Conmebol, 17 UEFA), así que
subirlo a 15 es una línea. Precedente: subirlo para la UEFA no apretó nada — 1165 hallazgos de
descanso antes y 1165 después, medido sobre las 32 temporadas.

### 5. Lo que se ve en pantalla

Cada una es chica, pero son varias y todas se notan si falta:

- el panel de copa (título, cuadro, y el nombre de la ronda de repechaje);
- la tarjeta de próximo partido y el rótulo del calendario (`etiquetaCompetencia`);
- la tabla de goleadores por competición;
- los avisos de eliminación y de pasar de ronda — **bajar no es ser eliminado**, y hoy no hay
  ningún estado que diga "seguís, pero en la otra copa";
- el reporte de bug, que muestra las copas guardadas.

### 6. Títulos y cupos

Ganar la Sudamericana después de bajar tiene que anotar el trofeo y repartir el cupo continental del
año siguiente. Hoy los trofeos continentales no se anotan al ganarlos: `palmares.ts` los deduce
recorriendo las copas guardadas. Con dos copas por club en el mismo año, ese recorrido hay que
revisarlo.

---

## Lo que hay que decidir antes de escribir código

**1. ¿Formato real o simplificado?**

- *Real* — el repechaje de 8 llaves. Es como se juega y es la razón por la que existen esos partidos
  en el calendario. Cuesta la ronda nueva y los dos días.
- *Simplificado* — los 8 terceros entran directo a los octavos junto a los 16 clasificados, sin
  repechaje. Serían 24 en una ronda de 16 llaves: no cierra sin inventar algo.

Recomiendo el real: el simplificado no ahorra tanto y deja un cuadro que no es un cuadro.

**2. ¿Desde qué temporada?**

De la 2 en adelante las copas ya no salen del calendario sino del motor, así que ahí el repechaje
sale gratis. En la temporada 1 hay partidos reales que respetar. Se puede hacer sólo de la 2 en
adelante (más barato, pero la primera temporada — la que todos juegan — queda sin él).

**3. ¿Qué ve el jugador el día que baja?**

Hay que inventar un aviso que hoy no existe: no es "eliminado" ni "pasaste de ronda". Algo como
*"Tercero del grupo: seguís en la Copa Sudamericana"*. Es una decisión de tono, no técnica.

---

## Esfuerzo y riesgo

| Parte | Tamaño | Riesgo |
|---|---|---|
| Ronda de repechaje en el motor | medio | bajo — es un cuadro más, y ya hay tres iguales |
| Conectar las dos copas | **medio-alto** | **el más alto**: es estado nuevo cruzando dos torneos |
| Copa del jugador que cambia | medio | medio — 39 usos, pero todos leen de un solo lugar si se hace bien |
| Dos días de calendario | chico | bajo, con precedente medido |
| Pantallas | medio | bajo, pero son cinco sitios |
| Títulos y cupos | chico | medio — la vitrina deduce, no lee un registro |
| Partidas ya empezadas | chico | medio — hay que no bajar retroactivamente a un club ya eliminado |

Es la pieza más grande que queda en la lista. No es difícil por partes; es difícil porque toca el
motor, el calendario, la pantalla y el guardado a la vez, y porque el estado cruzado entre dos
torneos es justo la forma que tienen los bugs que más costaron en este proyecto.

**Mi recomendación:** hacerlo en dos entregas.

1. **El repechaje dentro de la Sudamericana**, con los 8 terceros de la Libertadores tomados de sus
   tablas de grupo ya guardadas. Sin tocar la copa del jugador: si el jugador está entre los
   terceros, todavía no pasa nada visible. Se puede validar entero con `validar:copas` y
   `jugar_carrera.ts`.
2. **La copa del jugador que cambia**, con su aviso y sus pantallas, apoyada en lo anterior ya
   probado.

Así lo más riesgoso (el estado cruzado) queda comprobado antes de que nada de lo visible dependa
de él.
