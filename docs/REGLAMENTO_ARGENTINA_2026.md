# Ascenso y descenso en Argentina — reglas reales (AFA / LPF)

Extraído de los boletines oficiales de la AFA:

- **Boletín 6823** (30.01.2026) — Reglamento del Campeonato de **Primera Nacional 2026**
- **Boletín 6616** (21.01.2025) — Reglamento de los Torneos de **Primera División (LPF)**
- **Boletín 6614** (17.01.2025) — Reglamento de la **Copa Argentina**

Complementa a `REGLAMENTO_COLOMBIA_2026.md`. Argentina es el otro caso que el
motor tiene que soportar, y su formato es **muy distinto** al colombiano: no hay
Apertura/Clausura con promedio plurianual, sino dos torneos de zonas con playoffs
y una tabla anual acumulada.

El `data.ts` ya coincide con esta estructura: **30 clubes en división 1, 36 en
división 2 y 20 en división 3**.

## Primera División (LPF) — 30 equipos

### Formato de cada torneo (Apertura y Clausura)

- **Fase de Zonas**: dos zonas ("A" y "B") de **15 equipos cada una**, a una sola
  rueda. Cada fecha son 14 partidos (7 por zona) más un **interzonal** entre los
  dos equipos que quedaron libres. Más una fecha entera de interzonales.
  **Total: 16 fechas.**
- **Playoffs**: clasifican los **8 primeros de cada zona** (16 en total).
  Octavos → Cuartos → Semis → Final, **todo a partido único**, en cancha del
  mejor ubicado en la fase de zonas. Empate → penales directo (sin alargue),
  salvo la Final, que sí tiene 30' de alargue antes de los penales.
- El Clausura usa **el mismo fixture** que el Apertura con las **localías
  invertidas**.

**Regla importante para la simulación:** un club en zona de descenso (o que deba
jugar desempate por el descenso) **no puede disputar los playoffs del Clausura**,
aunque haya clasificado por posición. Su lugar lo toma el siguiente mejor de su
zona.

### Tabla General de Posiciones

Suma los puntos de la **Fase de Zonas del Apertura + la del Clausura** (no
incluye playoffs). Es la tabla que define cupos internacionales y descensos.

### Descensos

El boletín 6616 remite al **artículo 93 del Estatuto de AFA** para el número de
descensos, y aclara que pueden ser **por promedio o por posición en la Tabla
General**. Ante empate en zona de descenso hay **partido de desempate**
obligatorio (art. 111 R.G.) — no se resuelve por diferencia de gol.

### Otros límites que afectan la simulación

- **Extranjeros**: hasta 6 contratos registrados, pero solo **5 pueden firmar
  planilla** por partido. Si un club llega al máximo, al menos 2 de ellos deben
  tener 10+ partidos en la selección mayor de su país.
- **Planilla**: 23 jugadores (11 titulares + 12 suplentes), **5 sustituciones**.
- **Amarillas**: cada 5 en un mismo torneo = 1 fecha de suspensión. Las
  acumuladas **se borran al terminar cada torneo** y también **antes de los
  playoffs** — salvo que la quinta haya caído en el último partido de zonas.
- Un jugador puede registrarse en hasta 3 clubes por temporada pero solo puede
  **jugar en 2**.

## Primera Nacional (división 2) — 36 equipos

### Formato

Dos zonas de **18 equipos**, todos contra todos **a dos ruedas** (local y
visitante) más una fecha interzonal. 18 + 18 fechas.

### Ascensos (2 cupos)

1. **Primer ascenso**: los dos ganadores de zona juegan una **Final a partido
   único en cancha neutral**. El ganador es campeón y asciende. Empate → 30' de
   alargue → penales.
2. **Segundo ascenso — Torneo "Reducido"**: lo juegan los ubicados **2° a 8° de
   cada zona** (14 clubes) **más el perdedor de la Final**, que entra
   directamente en Segunda Fase y se lo considera **1° de la tabla** a efectos
   de cruces.
   - *Primera Fase*: a partido único, local el mejor ubicado; **si empatan,
     avanza el mejor ubicado** (no hay penales).
   - *Segunda Fase, Semifinales y Final*: **ida y vuelta**, local en la vuelta
     el mejor ubicado. Si empatan en puntos y diferencia de gol, avanza el mejor
     ubicado — salvo en la Final, que se define por penales.

### Descensos (4)

Bajan los **2 últimos de cada zona** (4 en total), a Primera B o Torneo Federal A
según corresponda. Ante empate hay **partido de desempate**.

### Otros

- Hasta **40 jugadores** inscribibles por club.
- Hasta 4 incorporaciones en el mercado de mitad de temporada.

## Copa Argentina

Participan clubes de **las cinco categorías** (Primera, Primera Nacional, B, C y
Federal A) — 64 equipos en la fase final, **todo a partido único** en cancha
neutral, empate → penales directo.

El campeón se clasifica a la **Libertadores** del año siguiente; si es de una
categoría del ascenso o desciende, **pierde el cupo** y pasa al siguiente mejor
de Primera.

## Qué implica para el juego

Argentina necesita cosas que Colombia no:

- **Zonas dentro de una misma división** (dos grupos de 15 o 18), que el motor
  actual no modela: hoy `LeagueSeasonState` asume una sola tabla por liga.
- **Playoffs a partido único** con penales directos, distinto de las llaves a ida
  y vuelta que ya existen para Colombia (`TwoLegBracket`).
- Una **Tabla General anual** que acumula las dos fases regulares, separada de
  las tablas de cada torneo.
- El **Reducido** de la Primera Nacional, que mezcla partido único e ida y vuelta
  según la ronda y usa "avanza el mejor ubicado" en vez de penales.

Igual que en Colombia, una primera versión puede simplificar los playoffs y
quedarse con lo esencial: **2 ascienden, 4 descienden en la Primera Nacional**, y
los descensos de Primera por Tabla General.

---

## Actualización con el sorteo y el formato 2026 confirmados

Verificado contra Infobae, Wikipedia y el reglamento LPF (agosto 2026):

- **36 equipos en dos zonas de 18**, sorteadas el 22 de diciembre de 2025.
- **Cambio respecto del año anterior: ahora SÍ hay cruces interzonales**, así que
  cada club juega **36 fechas** en total, no 18+18 de su zona. El resumen previo
  de este documento decía «18 + 18 fechas más una interzonal» y quedó desactualizado.
- El torneo arranca el primer fin de semana de febrero y **se juega incluso durante
  el Mundial** de Estados Unidos, México y Canadá.
- Se confirma: **2 ascensos** (Final a partido único en cancha neutral entre los
  ganadores de zona + Reducido del 2° al 8° de cada zona) y **4 descensos** (los
  dos últimos de cada zona), a Primera B Metropolitana o Federal A según la
  afiliación del club.

Fuentes: [Infobae](https://www.infobae.com/deportes/2025/12/22/se-sorteo-la-primera-nacional-2026-asi-quedaron-conformadas-las-dos-zonas-con-los-36-equipos-que-buscaran-subir-a-la-liga-profesional/),
[Wikipedia](https://es.wikipedia.org/wiki/Campeonato_de_Primera_Nacional_2026),
[Reglamento LPF 2026](https://www.ligaprofesional.ar/wp-content/uploads/2026/01/Reglamento-Torneos-LPF-Primera-2026-1.pdf)
