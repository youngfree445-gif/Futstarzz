# Ascenso y descenso en Colombia — reglas reales (Dimayor 2026)

Extraído de los reglamentos oficiales publicados por la Dimayor (V0 - 14/01/26):

- `REGLAMENTO-LIGA-2026-V0.pdf` — Liga BetPlay (primera división)
- `REGLAMENTO-TORNEO-2026-V0.pdf` — Torneo BetPlay (segunda división / "la B")
- `REGLAMENTO-COPA-2026-V0.pdf` — Copa BetPlay

Esto es la fuente para el **Paso 2** del plan (ascenso/descenso). Se documenta
acá porque el sistema colombiano NO es el clásico "bajan los últimos 3 de la
tabla": usa promedio plurianual y el ascenso se define por campeones de dos
torneos semestrales, no por posición final.

## Descenso (Liga → Torneo)

> «Los clubes que ocupen las **dos últimas posiciones** en la tabla de Descenso
> de la Liga BetPlay DIMAYOR descenderán a la Categoría "B" del año siguiente,
> ocupando su lugar los dos clubes que adquieran el derecho a participar en la
> categoría "A".»

Son **2 clubes**, no 3.

### La tabla de descenso NO es la tabla de posiciones

Se calcula por **promedio de puntos**, no por puntos totales:

> «Este promedio se calculará dividiendo el **total de puntos obtenidos entre el
> total de partidos disputados**.»

El promedio es **plurianual** y su ventana depende de hace cuánto el club está
en primera:

- **Clubes recién ascendidos** (ej. Llaneros FC y Unión Magdalena, que subieron
  en 2024): solo cuentan los puntos y partidos de la Fase I de las dos ligas
  semestrales del año en curso (Dimayor I + II).
- **Clubes con dos años en primera** (ej. Fortaleza FC): suma de puntos de la
  Fase I de Dimayor I y II del año anterior **más** los del año en curso,
  dividido entre el total de partidos de ambos años.

Es decir: un club recién ascendido arranca con la ventana corta y va acumulando
años. Esto protege al recién llegado de un solo semestre malo, y castiga al que
lleva años rindiendo poco.

## Ascenso (Torneo → Liga)

Son **2 cupos**. El año de la B tiene dos torneos semestrales (Torneo I y
Torneo II), cada uno con su campeón, más una Tabla de Reclasificación Total que
suma todo el año. Los cuatro caminos posibles:

1. **Un mismo club gana Torneo I y Torneo II** → asciende automático. El segundo
   cupo se define por **Repechaje** entre los dos mejores de la Reclasificación
   Total. No hay Gran Final.
2. **Los dos campeones ocupan 1° y 2° de la Reclasificación Total** → ascienden
   ambos directamente. Sin Gran Final ni Repechaje.
3. **Un campeón está 1° o 2° en la Reclasificación** → ese asciende primero. El
   segundo cupo sale de un **Repechaje** entre el otro campeón y el mejor
   ubicado de la Reclasificación.
4. **Ninguno de los anteriores** → **Gran Final** entre los dos campeones.

Tanto la Gran Final como el Repechaje se juegan a **ida y vuelta**, y se define
por mayor puntuación en los dos partidos (no por goles). En ambos es visitante
en la ida el club mejor ubicado en la Reclasificación Total.

## Detalles que afectan la simulación

- **Máximo 3 jugadores extranjeros** alineados simultáneamente en cancha.
- Plantilla profesional: **25 jugadores** inscribibles, más hasta **5 juveniles**
  (nacidos desde el 1/1/2006) si venían del mismo club en la Super Copa Juvenil.
- Si un club desciende pero ganó cupo a Libertadores o Sudamericana, **pierde el
  cupo**: pasa al mejor ubicado en la Tabla de Reclasificación Total.
- Los cupos a Libertadores/Sudamericana salen de la **Reclasificación Total**,
  no de la tabla de cada semestre.

## Qué implica para el juego

El motor actual (`leagueEngine.ts`) ya corre Apertura/Clausura con `semester` y
playoffs a ida y vuelta para Colombia, así que la estructura de dos torneos
semestrales ya existe. Lo que falta para el Paso 2:

- Una **tabla de descenso por promedio** separada de la tabla de posiciones, con
  ventana plurianual por club (hace falta guardar puntos/partidos históricos).
- El intercambio de `division` entre los 2 que bajan y los 2 que suben.
- Los caminos de ascenso (Gran Final / Repechaje) se pueden simplificar en una
  primera versión a "ascienden los 2 mejores del año", dejando el Repechaje para
  después — pero conviene que la tabla de descenso sí use el promedio real,
  porque es lo que hace que un club histórico pueda descender pese a tener una
  buena temporada suelta.
