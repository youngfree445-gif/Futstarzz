# Calendario realista — qué datos hacen falta

Plan acordado: reemplazar el calendario actual (una semana de copa cada 3, 38 semanas por
temporada) por **fechas reales por liga**, con el criterio "fiel a la realidad": 38 jornadas de
liga + copas entremedio + parones FIFA, aunque la temporada pase a durar ~50 semanas de juego.

Estado: **esperando datasets de las ligas faltantes** antes de implementar.

## Lo que YA tenemos

`src/ALLgames.json` (dataset de Transfermarkt, 88.958 partidos, temporadas 2012-2025) cubre
**24 de las 40 ligas** del juego, con fecha real, jornada (`round`) y competición.

Ligas cubiertas: España, Inglaterra, Italia, Alemania, Francia, Portugal, Países Bajos, Turquía,
Bélgica, Escocia, Grecia, Dinamarca, Suecia, Austria, Suiza, Croacia, Serbia, Rumania, Chequia,
Rusia, Ucrania, Polonia, Arabia Saudí, Australia, Corea del Sur, Argentina, Brasil, México,
Estados Unidos (MLS) y **Colombia**.

También trae competiciones europeas y copas nacionales reales: Champions (`CL`), Europa League
(`EL`), Conference (`UCOL`), FA Cup (`FAC`), Copa del Rey (`CDR`), DFB-Pokal (`DFB`), Coppa Italia
(`CIT`), y varias más.

### Campos que usa el importador

```
competition_id, season, round, date, home_club_name, away_club_name, competition_type
```

`round` viene como `"1. Matchday"`, `"Round of 16"`, `"Final"`, etc.

## Lo que FALTA

### Prioridad alta — ligas sudamericanas (108 clubes)

Ninguna está en el dataset. Son las que más se notan porque el juego arranca en Colombia y tiene
Libertadores/Sudamericana:

| Liga | Clubes en el juego |
|---|---|
| Perú (Liga 1) | 18 |
| Chile (Primera División) | 16 |
| Uruguay (Primera División) | 16 |
| Ecuador (LigaPro) | 16 |
| Bolivia (División Profesional) | 16 |
| Venezuela (Liga FUTVE) | 14 |
| Paraguay (Primera División) | 12 |

### Prioridad alta — copas continentales sudamericanas

**No hay ni Libertadores ni Sudamericana en el dataset.** Hoy el juego las simula con un formato
inventado (32 equipos, 8 grupos). Con fechas reales quedarían como las europeas.

### Prioridad media — ligas europeas menores (8 clubes)

Noruega, Israel, Hungría, Bulgaria, Chipre, Kazajistán, Azerbaiyán.

### Bloqueado por datos, no por calendario — `Internacional` (606 clubes)

El grupo más grande de la base. **No se puede resolver con un dataset de partidos**: estos clubes
tienen `league: 'Internacional'` en `src/data.ts`, sin país propio. Antes de asignarles un
calendario hay que asignarles una liga real. Es trabajo de datos previo.

Mientras tanto seguirán con calendario generado.

## Formato ideal para lo que mandes

Cualquiera de estos sirve; el primero es el que menos trabajo requiere:

1. **Mismo formato que `ALLgames.json`** — ideal, entra directo.
2. **CSV/JSON con estas columnas mínimas**:
   ```
   competicion, temporada, jornada, fecha (YYYY-MM-DD), equipo_local, equipo_visitante
   ```
3. **Calendario oficial de la federación** (PDF/HTML) — se puede parsear, pero da más trabajo y más
   riesgo de error.

### Detalle importante: los nombres de los clubes tienen que poder matchearse

El importador cruza `home_club_name` contra `name` en `src/data.ts`. Si los nombres no coinciden
exactamente hay que mapearlos a mano — ya pasó con el pool de rivales de relleno, donde 8 nombres
("CR Flamengo", "CA Boca Juniors"...) no existían en la base. Si el dataset trae un `club_id`
estable de Transfermarkt, mejor: se mapea una vez y no depende del texto.

## Nota sobre Colombia

`COL1` está en el dataset con 200 partidos y jornadas correctas (Clausura 2025, 12/07 a 14/11),
pero le falta el valor de `competition_type` (viene vacío). Se completa en el importador, no hace
falta un dataset nuevo.

## Formatos que habrá que modelar aparte

Estas ligas no son un todos-contra-todos corrido, y el calendario real lo refleja:

- **Colombia y Argentina**: Apertura + Clausura con playoffs (el motor ya los trata distinto, ver
  `isApeturaClausuraLeague` en `leagueEngine.ts`).
- **MLS**: conferencias Este/Oeste + playoffs.
- **México**: Apertura/Clausura con liguilla.
- **Brasil**: año calendario (no cruza de año como las europeas).

---

# Estado: calendarios bajados (31 ligas + 8 copas)

## El problema que había en las copas

El motor no le da fechas a cada copa: **avanza un paso por "semana de copa"**, y las semanas de copa
son un cupo global (`week % 3 === 0`) que se reparten todos los torneos. Auditado con el motor real:

| Copa | Pasos que necesita | Semanas disponibles | Resultado |
|---|---|---|---|
| Champions / Europa | 22 | 9 | tardaba **2,4 temporadas** en coronar |
| Libertadores / Sudamericana | 11 | 9 | **no coronaba nunca** |

Las cuatro estaban rotas, no solo la Champions. El presupuesto real es **9** semanas (12 menos las
3 que se come el parón del Mundial), y de ahí venía el bug ya reportado: *"me eliminan de
Libertadores y en julio vuelve a aparecer la fase de grupos"*.

## Cómo lo arregla el calendario real

Con fechas propias por competición el cupo compartido desaparece:

| Copa | Semanas reales | Rondas | Margen |
|---|---|---|---|
| UEFA Europa League | 17 | 10 | +7 |
| UEFA Champions League | 16 | 9 | +7 |
| UEFA Conference League | 14 | 9 | +5 |
| Copa del Rey | 9 | 8 | +1 |
| Coppa Italia | 8 | 8 | 0 |
| FA Cup | 8 | 8 | 0 |
| DFB-Pokal | 8 | 5 | +3 |
| KNVB Beker | 7 | 6 | +1 |

**Requisito para el importador:** cada competición usa su propio calendario y se elimina el contador
`cupWeeksElapsed*`. Mantener el sistema de pasos *y* cambiar las semanas rompería todo — es
exactamente el bug que ya ocurrió.

## Copas domésticas: qué se perdió y por qué

Las copas nacionales las juegan también equipos de divisiones inferiores (Maidstone United,
Eastleigh…) que no existen en `data.ts`, que solo modela primera. Se conservan los partidos donde
ambos equipos existen en el juego: la FA Cup pasa de 148 a 18 partidos, la Copa del Rey de 123 a 21.

Es una pérdida consciente — la FA Cup real arranca con 700 equipos; acá arranca cuando entran los de
primera.

**Dinamarca, Grecia y Escocia se descartaron**: quedaban en 0 partidos porque sus clubes viven en la
bolsa `Internacional` sin país asignado.

## Lo que sigue faltando

- **Libertadores y Sudamericana**: no están en `ALLgames.json` ni las publica Transfermarkt en un
  código que haya encontrado. Siguen con el formato inventado (32 equipos, 8 grupos).
- **Ligas menores** (Turquía, Suecia, Bélgica, Grecia…): los calendarios están bajados, pero
  `data.ts` solo tiene 2 clubes turcos, 1 sueco y 3 belgas. No es un problema de calendario sino de
  los 606 clubes en `Internacional` sin país.
