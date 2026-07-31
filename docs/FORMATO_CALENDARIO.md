# Formato del JSON de calendarios

Estructura para los datasets de las ligas sudamericanas y las copas Libertadores/Sudamericana.

**Alcance acordado:** Sudamérica + las 24 ligas de Transfermarkt van con calendario **real**. Las
ligas europeas menores (Noruega, Israel, Hungría, Bulgaria, Chipre, Kazajistán, Azerbaiyán) y los
606 clubes de `Internacional` se quedan con el calendario generado actual.

---

## Estructura

Un archivo por competición, o uno solo con todas. Ambas cosas sirven.

```json
{
  "competition": {
    "id": "PER1",
    "name": "Liga 1 Perú",
    "league": "Peruana",
    "country": "Perú",
    "type": "domestic_league",
    "format": "apertura_clausura",
    "season": 2025
  },
  "matches": [
    {
      "date": "2025-02-14",
      "round": "1. Matchday",
      "stage": "apertura",
      "home": "Alianza Lima",
      "away": "Sporting Cristal"
    },
    {
      "date": "2025-02-15",
      "round": "1. Matchday",
      "stage": "apertura",
      "home": "Universitario",
      "away": "Melgar"
    }
  ]
}
```

### Campos de `competition`

| Campo | Obligatorio | Qué es |
|---|---|---|
| `id` | sí | Código corto y único (`PER1`, `CHI1`, `LIB`, `SUD`) |
| `league` | sí | **Tiene que coincidir exacto** con `club.league` de `src/data.ts` (ver tabla abajo) |
| `name` | sí | Nombre para mostrar en pantalla ("Liga 1 Perú") |
| `type` | sí | `domestic_league`, `domestic_cup` o `international_cup` |
| `format` | sí | `round_robin`, `apertura_clausura` o `groups_knockout` |
| `season` | sí | Año de la temporada (número) |
| `country` | no | Informativo |

### Campos de cada partido

| Campo | Obligatorio | Qué es |
|---|---|---|
| `date` | sí | `YYYY-MM-DD`. Es lo más importante del dataset |
| `round` | sí | Jornada o ronda (ver formatos abajo) |
| `home` | sí | Nombre del club local |
| `away` | sí | Nombre del club visitante |
| `stage` | solo si aplica | `apertura`, `clausura`, `playoffs`, `grupos` |
| `leg` | solo ida/vuelta | `1` o `2` |
| `group` | solo fase de grupos | `"A"`, `"B"`, … |

Los goles **no hacen falta**: el juego simula los resultados. Si vienen, se ignoran.

### Formato de `round`

Se acepta cualquiera de estas formas (el importador las normaliza):

- Liga: `"1. Matchday"`, `"Jornada 1"`, `"Fecha 1"`, o simplemente `1`
- Eliminatoria: `"Round of 16"`, `"Octavos"`, `"Cuartos"`, `"Semifinal"`, `"Final"`
- Grupos: `"Group Stage"` o `"Fase de grupos"` (con `group` aparte)

---

## Lo crítico: los nombres de los clubes

El importador cruza `home`/`away` contra el campo `name` de `src/data.ts`. **Si un nombre no
matchea, ese partido se descarta.**

Los 198 nombres exactos que espera el juego están en
[`CLUBES_SUDAMERICA.txt`](CLUBES_SUDAMERICA.txt). Usalos tal cual si podés.

Si tu fuente usa otros nombres, hay dos salidas:

**1. Incluir un bloque de alias** (lo más cómodo):

```json
{
  "competition": { "...": "..." },
  "aliases": {
    "Club Alianza Lima": "Alianza Lima",
    "CSD Colo Colo": "Colo-Colo",
    "CA Boca Juniors": "Boca Juniors"
  },
  "matches": [ "..." ]
}
```

**2. Mandarlo como venga** y yo armo el mapeo a mano. Da más trabajo pero funciona.

### Valores válidos de `league`

Tienen que ser exactamente estos (con tilde y mayúscula inicial):

```
Peruana      Chilena      Uruguaya     Ecuatoriana
Boliviana    Venezolana   Paraguaya    Colombiana
Argentina    Brasileña
```

---

## Copas continentales

Libertadores y Sudamericana no están en el dataset actual y hoy el juego las inventa. Formato:

```json
{
  "competition": {
    "id": "LIB",
    "name": "Copa Libertadores",
    "type": "international_cup",
    "format": "groups_knockout",
    "season": 2025
  },
  "matches": [
    { "date": "2025-04-02", "round": "Group Stage", "group": "A",
      "home": "Boca Juniors", "away": "Flamengo" },
    { "date": "2025-08-13", "round": "Round of 16", "leg": 1,
      "home": "River Plate", "away": "Palmeiras" },
    { "date": "2025-08-20", "round": "Round of 16", "leg": 2,
      "home": "Palmeiras", "away": "River Plate" }
  ]
}
```

Acá los clubes son de varios países: los nombres se validan contra toda la base, no contra una liga.

---

## Alternativa: CSV

Si te resulta más fácil, un CSV con estas columnas también sirve:

```csv
competition_id,league,season,round,stage,date,home,away
PER1,Peruana,2025,1,apertura,2025-02-14,Alianza Lima,Sporting Cristal
PER1,Peruana,2025,1,apertura,2025-02-15,Universitario,Melgar
```

Y si tenés un export en el **mismo formato que `ALLgames.json`**, mandalo tal cual: entra directo,
es el camino de menor fricción.

---

## Cómo validarlo antes de mandarlo

Cuando tengas el archivo, corré:

```
npx tsx scripts/validar_calendario.ts <ruta-al-json>
```

Te dice cuántos partidos entraron, qué nombres de club no matchean (**con sugerencias del nombre
correcto**), si hay fechas mal formadas, jornadas faltantes o equipos que juegan dos veces el mismo
día. Termina en `LISTO PARA IMPORTAR` cuando está todo bien.

Ejemplo de salida con nombres que no matchean:

```
equipos reconocidos:     14
nombres NO reconocidos:  6
    "CD América de Cali"  (20 partidos)
  Candidatos parecidos en la base del juego:
    "CD América de Cali" -> "América de Cali"
```

Hay un ejemplo real y válido en [`ejemplo_calendario.json`](ejemplo_calendario.json) (Colombia
2025, sacado del propio `ALLgames.json`): sirve de plantilla, incluido el bloque `aliases`.

---

## Lo mínimo que sirve

Si conseguir todo es difícil, **con esto ya se puede trabajar**:

1. `date` + `round` + `home` + `away` de la última temporada completa
2. Solo la fase regular (los playoffs los puedo generar con el formato conocido)
3. Una liga a la vez — no hace falta mandar todo junto

Con las fechas reales de la fase regular ya se arregla el problema de fondo: hoy el calendario es
una semana de copa cada 3, sin relación con la realidad de ningún país.
