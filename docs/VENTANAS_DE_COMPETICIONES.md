# Ventanas de las competiciones

> **Generado por `node scripts/generar_ventanas.mjs`.** No editar a mano: se regenera desde
> `src/realCalendarDates.ts`, que es la única fuente de fechas del juego.

Cuándo empieza y termina cada torneo en la **temporada 1** de la carrera. De la temporada 2 en
adelante son las mismas fechas corridas un año (ver `competicionEnTemporada`).

Estas ventanas se **respetan**, no son informativas: cuando el calendario tiene que mover un partido
para que entre sin pisar otro, sólo puede moverlo dentro de la ventana de su propia competición
(ver `acomodarFechas` y `reservarFechasDeCopa` en `src/dateSchedule.ts`). Una final de copa no se
va a noviembre porque la liga siga jugando.

**La carrera no empieza el mismo día para todos.** Arranca con la primera fecha de TU liga: en
agosto si jugás en Europa, en enero si jugás en Sudamérica, en febrero en la MLS. Ver
`inicioDeCarrera`.

## Ligas

| competición | país | arranca | termina | clubes | partidos |
|---|---|---|---|---:|---:|
| 2. Bundesliga | Alemana | 01 ago 2025 | 17 may 2026 | 18 | 306 |
| Bundesliga | Alemana | 22 ago 2025 | 16 may 2026 | 18 | 306 |
| Liga Profesional Argentina | Argentina | 22 ene 2026 | 08 nov 2026 | 30 | 494 |
| Primera Nacional | Argentina | 13 feb 2026 | 31 oct 2026 | 36 | 639 |
| División Profesional Boliviana | Boliviana | 03 abr 2026 | 09 ago 2026 | 16 | 112 |
| Brasileirão Serie A | Brasileña | 28 ene 2026 | 02 dic 2026 | 20 | 380 |
| Brasileirão Serie B | Brasileña | 21 mar 2026 | 14 nov 2026 | 20 | 380 |
| Primera División de Chile | Chilena | 30 ene 2026 | 06 dic 2026 | 16 | 238 |
| Liga BetPlay Dimayor | Colombiana | 16 ene 2026 | 08 nov 2026 | 20 | 394 |
| Torneo BetPlay | Colombiana | 23 ene 2026 | 03 ago 2026 | 16 | 160 |
| LigaPro Ecuador | Ecuatoriana | 21 feb 2026 | 13 sep 2026 | 16 | 228 |
| LaLiga | Española | 15 ago 2025 | 24 may 2026 | 20 | 380 |
| LaLiga Hypermotion | Española | 15 ago 2025 | 31 may 2026 | 22 | 462 |
| MLS | Estadounidense | 21 feb 2026 | 08 nov 2026 | 30 | 510 |
| Ligue 2 | Francesa | 09 ago 2025 | 09 may 2026 | 18 | 306 |
| Ligue 1 | Francesa | 15 ago 2025 | 17 may 2026 | 18 | 306 |
| Eredivisie | Holandesa | 08 ago 2025 | 17 may 2026 | 18 | 306 |
| Eerste Divisie | Holandesa | 08 ago 2025 | 24 abr 2026 | 20 | 380 |
| Championship | Inglesa | 08 ago 2025 | 02 may 2026 | 24 | 552 |
| Premier League | Inglesa | 15 ago 2025 | 24 may 2026 | 20 | 380 |
| Serie B | Italiana | 21 ago 2025 | 14 may 2026 | 20 | 380 |
| Serie A | Italiana | 23 ago 2025 | 24 may 2026 | 20 | 380 |
| Liga MX | Mexicana | 17 jul 2026 | 23 nov 2026 | 18 | 147 |
| Primera División Paraguaya | Paraguaya | 23 ene 2026 | 29 nov 2026 | 12 | 264 |
| Liga 1 Perú | Peruana | 30 ene 2026 | 14 nov 2026 | 17 | 272 |
| Primeira Liga | Portuguesa | 07 ago 2025 | 16 may 2026 | 15 | 209 |
| Primera División Uruguaya | Uruguaya | 06 feb 2026 | 10 ago 2026 | 16 | 185 |
| Venezuela Primera División | Venezolana | 29 ene 2026 | 18 oct 2026 | 14 | 205 |

## Copas nacionales

| competición | país | arranca | termina | clubes | partidos |
|---|---|---|---|---:|---:|
| DFB-Pokal | Alemana | 15 ago 2025 | 23 may 2026 | 26 | 25 |
| Copa Argentina | Argentina | 12 feb 2026 | 29 ago 2026 | 27 | 21 |
| Copa Bolivia | Boliviana | 01 may 2026 | 23 dic 2026 | 10 | 37 |
| Copa do Brasil | Brasileña | 11 mar 2026 | 06 ago 2026 | 33 | 46 |
| Copa Chile | Chilena | 26 ene 2026 | 11 dic 2026 | 22 | 69 |
| Superliga de Colombia | Colombiana | 16 ene 2026 | 22 ene 2026 | 2 | 2 |
| Copa BetPlay | Colombiana | 07 may 2026 | 18 ago 2026 | 36 | 54 |
| Copa Ecuador | Ecuatoriana | 09 may 2026 | 19 dic 2026 | 20 | 32 |
| Copa del Rey | Española | 16 dic 2025 | 18 abr 2026 | 16 | 12 |
| US Open Cup | Estadounidense | 21 may 2026 | 02 oct 2026 | 11 | 10 |
| Coupe de France | Francesa | 16 nov 2025 | 22 may 2026 | 20 | 16 |
| KNVB Beker | Holandesa | 29 oct 2025 | 19 abr 2026 | 16 | 13 |
| EFL Cup | Inglesa | 26 ago 2025 | 22 mar 2026 | 25 | 26 |
| FA Cup | Inglesa | 10 ene 2026 | 16 may 2026 | 24 | 22 |
| Coppa Italia | Italiana | 15 ago 2025 | 13 may 2026 | 31 | 32 |
| Copa MX | Mexicana | 26 jul 2026 | 01 nov 2026 | 15 | 29 |
| Taça de Portugal | Portuguesa | 21 sep 2025 | 22 abr 2026 | 12 | 9 |
| Copa Uruguay | Uruguaya | 10 sep 2026 | 15 oct 2026 | 4 | 2 |
| Copa Venezuela | Venezolana | 18 jun 2026 | 24 sep 2026 | 9 | 14 |

## Copas continentales

| competición | país | arranca | termina | clubes | partidos |
|---|---|---|---|---:|---:|
| Champions League | — | 16 sep 2025 | 30 may 2026 | 36 | 189 |
| Europa League | — | 24 sep 2025 | 20 may 2026 | 36 | 189 |
| Copa Libertadores | — | 18 feb 2026 | 19 ago 2026 | 21 | 34 |
| Copa Sudamericana | — | 05 mar 2026 | 20 ago 2026 | 15 | 20 |

## Copas cuyas fechas se acomodan

Su calendario viene de otra temporada, así que las fechas se corren de año y después se
**reubican** una por una al día libre más cercano, respetando el descanso y sin salirse de la
ventana de arriba. Ningún partido se pierde: se reprograma, que es lo que hacen las ligas de verdad
cuando dos torneos se superponen.

- Copa Argentina (Argentina)
- KNVB Beker (Holandesa)
- Copa Chile (Chilena)
- Copa Ecuador (Ecuatoriana)
- Copa Bolivia (Boliviana)
- Copa Uruguay (Uruguaya)
- Copa Venezuela (Venezolana)
- Copa MX (Mexicana)
- US Open Cup (Estadounidense)
- Coupe de France (Francesa)
- Taça de Portugal (Portuguesa)

## Total

51 competiciones · 10164 partidos.
