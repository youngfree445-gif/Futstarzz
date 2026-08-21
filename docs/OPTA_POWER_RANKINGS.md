# El ranking mundial de Opta, cruzado con nuestros clubes

**Qué es:** el Opta Power Rankings — un puntaje de 0 a 100 para **14.612 clubes masculinos de 226
países**, con su puesto en el ranking mundial y en su confederación. Es el mismo número que usa
The Analyst para decir quién es el mejor equipo del mundo.

**Dónde está:** `data/opta_power_rankings.json` — 590 de nuestros clubes, ya enlazados.

---

## Cómo se consiguió (la receta, para poder repetirla)

La página del artículo **no sirve**: la tabla es un widget de JavaScript y el HTML del artículo no
trae ni una fila. Lo que sí sirve:

```
https://dataviz.theanalyst.com/opta-power-rankings/index.js
```

Son **17 MB de JS minificado con los datos EMBEBIDOS** — no hay ninguna API que llamar. Cada equipo
es un objeto que arranca con `{"rank":N,"contestantId":"…"` y trae:

| campo | qué es |
|---|---|
| `currentRating` | el puntaje, 0 a 100 |
| `currentGlobalRank` | puesto en el mundo |
| `currentConfederationRank` | puesto en su confederación |
| `domesticLeagueName`, `association`, `confederation` | liga, país, confederación |
| `seasonAverageRating`, `highestSeasonRating`, `lowestSeasonRating`, `lastWeekRating` | la evolución |
| `optaId`, `contestantId` | los identificadores de Opta |

```bash
curl -s -A "Mozilla/5.0" "https://dataviz.theanalyst.com/opta-power-rankings/index.js" -o dv.js
python scripts/extraer_opta.py dv.js          # -> opta.json (15.984 equipos)
npx vite-node scripts/cruzar_opta.ts opta.json data/opta_power_rankings.json
```

### Y una tercera, encontrada después de dar el trabajo por terminado

**Había dos "Dijon" en Francia**: uno con `domesticLeagueName: null` y rating 75.5 (puesto 95 del
mundo) y el Dijon FCO de Ligue 2, con 72.7 y puesto 936. El cruce tomaba el primero que apareciera y
se quedaba con el equivocado — el de `null` es el **femenino**, que Opta no clasifica y que por eso
el filtro por nombre de liga no tocaba.

Se notó mirando la lista de clubes sin plantel: *un club de la segunda francesa no puede ser el
número 95 del mundo*. El arreglo son dos líneas — descartar los que no declaran liga, y desempatar
por liga también en las dos primeras pasadas, no sólo en la de contención.

Y quedó una medición útil para la próxima: **comparar el ranking contra el rating**. Si el orden de
uno contradice al otro, hay matches mal hechos. Después del arreglo quedan 154 pares "fuera de
orden" sobre 572, pero **ninguno grave**: son clubes separados por menos de dos puntos de rating,
donde el ranking y el rating vienen de fotos con horas de diferencia. La fuente cruda tiene el mismo
5,5% de ruido.

**Ojo con `currentGlobalRank`: se corta en 9999.** Para los clubes por debajo de ese puesto hay que
usar `rank`, que llega hasta 13.791.

### Dos trampas que ya costaron una vuelta

1. **El bundle es UTF-8.** Un primer intento lo leyó como latin-1 porque la consola de Windows
   mostraba `Bayern M?nchen` — pero el `?` era la consola, no el archivo (`errors='replace'` da
   **cero** bytes inválidos). Leyéndolo como latin-1 todos los acentos quedaban rotos y el cruce
   caía de 92% a 71%: "Atlético Nacional" no enlazaba con "Atlético Nacional".
2. **`/tmp` de Git Bash no es el `/tmp` que ve Python en Windows.** Descargar al scratchpad.

---

## Cómo se cruzó, y por qué así

**Nunca por nombre solo.** Cada club nuestro trae su liga, de la liga sale el país, y el candidato
de Opta tiene que coincidir en nombre **y** país. Cuatro pasadas, de la más estricta a la más
flexible:

| pasada | qué hace | cuántos |
|---|---|---|
| exacta | el nombre coincide tal cual | 482 |
| normalizada | sin acentos, sin `FC`/`CD`/`Deportivo`/`de` | 64 |
| por contención | uno contiene al otro (`Junior de Barranquilla` ↔ `Junior`) | 37 |
| desempate por liga | dos candidatos del mismo país, gana el de nuestra división | 7 |
| **total** | | **590** |

**21 quedaron ambiguos y NO se eligieron a propósito.** En Argentina hay dos `Ferro Carril Oeste`,
tres `Talleres`, siete clubes con `Ferro`. Elegir uno al azar es exactamente como se rompió el juego
dos veces. Prefiero 590 ciertos que 611 con cinco mentiras adentro.

**47 sin match**, casi todos del ascenso argentino con el nombre abreviado en nuestra base
(`C. Bolivar`, `A. Rafaela`, `J. Antoniana`). Se resuelven agregando alias, uno por uno y
verificando cada uno.

**60 clubes sin país mapeado**: los europeos sueltos que existen sólo para las copas.

---

## Qué se puede hacer con esto

Hoy la fuerza de un club en el juego es `reputation`, un número **del 1 al 5 puesto a mano**. De él
dependen la vara de titularidad (`25 + reputation * 11`), qué clubes te fichan y cuánto pagan.

Con el rating de Opta hay un número **real, de 0 a 100, comparable entre ligas**:

```
Arsenal            100.0   #1 del mundo
Bayern München      99.7   #2
Manchester City     97.6   #3
…
mediana de nuestra base   76.8
FC Andorra          56.5   #4603
Central Córdoba     46.7   #8425
```

Eso convierte la escalera del mercado en algo con relieve de verdad: hoy Junior y Boca comparten
`reputation` y con Opta hay 15 puntos entre ellos.

**No está conectado al motor todavía** — reemplazar una escala de 5 escalones por una de 100 cambia
la vara de titularidad, el mercado, la lista de transferibles y la selección de una sola vez, y eso
es una decisión de diseño, no una de datos.
