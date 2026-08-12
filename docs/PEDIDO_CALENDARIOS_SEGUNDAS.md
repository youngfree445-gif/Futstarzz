# Pedido de datos: calendarios de las Segundas divisiones

> Este archivo es el pedido completo y autosuficiente. Se puede pegar entero como prompt en
> cualquier IA con acceso a internet, o usarlo como especificación para scrapear a mano.

## 1. Qué necesito, en una frase

El **calendario completo de una temporada** (todos los partidos, con fecha exacta, local y
visitante) de estas cinco Segundas divisiones:

| # | Competición | País (`league` en el juego) | ESPN | Transfermarkt |
|---|---|---|---|---|
| 1 | **Championship** | Inglesa | `eng.2` | `GB2` |
| 2 | **LaLiga Hypermotion** (Segunda) | Española | `esp.2` | `ES2` |
| 3 | **2. Bundesliga** | Alemana | `ger.2` | `L2` |
| 4 | **Ligue 2** | Francesa | `fra.2` | `FR2` |
| 5 | **Eerste Divisie** | Holandesa | `ned.2` | `NL2` |

**Orden de prioridad** si no se pueden todas: Championship → LaLiga Hypermotion → 2. Bundesliga →
Ligue 2 → Eerste Divisie. Cada una sirve por separado; no hace falta tenerlas todas.

## 2. Para qué

Hoy el juego tiene la Primera de esos cinco países pero no la Segunda, así que **el descenso está
congelado ahí**: bajar mandaría al jugador a un club que el calendario no sabe hacer jugar. Con el
calendario cargado, el ascenso y el descenso se activan solos — no hay nada más que programar.

## 3. Qué temporada

**Preferida: 2025/26** (arranca agosto 2025, termina mayo 2026). Es la que están jugando la Premier,
LaLiga, la Bundesliga, la Ligue 1 y la Eredivisie dentro del juego, y la carrera empieza el **12 de
enero de 2026**, a mitad de ella.

**Si sólo hay otra temporada disponible, SIRVE IGUAL.** Una temporada pasada completa funciona como
molde: yo le corro las fechas los años que haga falta para alinearla. Ya se hizo con la Serie B
italiana, que vino como 2026/27 y se corrió un año atrás.

⚠️ **Lo único imprescindible: decirme de qué temporada es.** Si no sé el año, no puedo alinearla y
un club de Segunda terminaría empezando su carrera en agosto en vez de enero.

## 4. Formato exacto

Un archivo JSON por competición. **Éste es el formato ideal** — es literalmente el que consume el
juego, así que entra sin conversión:

```json
{
  "id": "gb2",
  "name": "Championship",
  "kind": "league",
  "league": "Inglesa",
  "temporada": "2025/26",
  "firstDate": "2025-08-08",
  "lastDate": "2026-05-03",
  "matches": [
    { "date": "2025-08-08", "home": "Ipswich Town", "away": "Birmingham City" },
    { "date": "2025-08-09", "home": "Norwich City", "away": "Millwall" },
    { "date": "2025-08-09", "home": "Watford", "away": "Charlton Athletic" }
  ]
}
```

### Reglas de los campos

| campo | obligatorio | detalle |
|---|---|---|
| `date` | **sí** | `YYYY-MM-DD`, la fecha real del partido. Sin hora, sin zona horaria |
| `home` | **sí** | nombre del club **local** |
| `away` | **sí** | nombre del club **visitante** |
| `league` | **sí** | exactamente uno de: `Inglesa`, `Española`, `Alemana`, `Francesa`, `Holandesa` |
| `temporada` | **sí** | `"2025/26"`, `"2023/24"`, lo que sea — pero que esté |
| `kind` | sí | siempre el texto `"league"` |
| `id`, `name` | sí | ver la tabla del punto 1 |
| `firstDate`/`lastDate` | no | los calculo yo si faltan |
| `round` | no | si viene el número de jornada, mejor, pero no hace falta |

### Lo que NO necesito
Resultados, goleadores, estadios, horarios, árbitros, asistencia, IDs internos. **Sólo fecha, local
y visitante.** Si el scraper los trae de regalo no molestan, pero no los busques.

## 5. Cómo tienen que llamarse los clubes

El juego cruza los partidos con su base **por nombre**. Estos son los nombres que ya conoce. Usalos
tal cual siempre que se pueda:

**Championship** (`Inglesa`, 24 clubes)
> Birmingham City · Blackburn Rovers · Bolton Wanderers · Bristol City · Cardiff City · Charlton
> Athletic · Coventry City · Derby County · Hull City · Ipswich Town · Lincoln City · Middlesbrough ·
> Millwall · Norwich City · Portsmouth · Preston North End · Queens Park Rangers · Sheffield United ·
> Southampton · Stoke City · Swansea City · Watford · West Bromwich Albion · Wrexham

**LaLiga Hypermotion** (`Española`, 22 clubes)
> AD Ceuta FC · Albacete BP · Burgos CF · CD Castellón · CD Leganés · CD Mirandés · Cultural Leonesa ·
> Cádiz CF · Córdoba CF · FC Andorra · Granada CF · Málaga CF · R. Racing Club · R. Sporting ·
> R. Valladolid CF · RC Deportivo · Real Sociedad B · Real Zaragoza · SD Eibar · SD Huesca ·
> UD Almería · UD Las Palmas

**2. Bundesliga** (`Alemana`, 18 clubes)
> 1. FC Kaiserslautern · 1. FC Nürnberg · Arminia Bielefeld · Darmstadt 98 · Dynamo Dresden ·
> Eintracht Braunschweig · FC Schalke 04 · Fortuna Düsseldorf · Greuther Fürth · Hannover 96 ·
> Hertha BSC · Holstein Kiel · Karlsruher SC · Magdeburg · Preußen Münster · SC Paderborn 07 ·
> SV Elversberg · VfL Bochum

**Ligue 2** (`Francesa`, 19 clubes)
> AC Ajaccio · AS Nancy Lorraine · AS Saint-Étienne · Clermont Foot 63 · Dijon FCO · EA Guingamp ·
> ESTAC Troyes · FC Annecy · FC Sochaux-Montbéliard · Grenoble Foot 38 · Le Mans FC · Montpellier HSC ·
> Pau FC · Red Star FC · Rodez AF · Stade Lavallois · Stade de Reims · US Boulogne · USL Dunkerque

**Eerste Divisie** (`Holandesa`, 16 clubes)
> Almere City FC · De Graafschap · FC Den Bosch · FC Dordrecht · FC Eindhoven · FC Emmen ·
> FC Volendam · Helmond Sport · Heracles Almelo · MVV Maastricht · NAC Breda · RKC Waalwijk ·
> Roda JC Kerkrade · SBV Vitesse · TOP Oss · VVV-Venlo

### Si un nombre no coincide
**No lo fuerces ni lo inventes.** Dejá el nombre tal como lo da la fuente y, si podés, agregá al
final del archivo:

```json
"sinCoincidencia": ["Sheffield Wednesday", "Oxford United"]
```

Yo decido qué hacer con cada uno. Emparejar a ojo es exactamente como se cruzaron los planteles una
vez: *Racing Club* (Avellaneda) terminó tomando los partidos del *Racing* uruguayo.

## 6. Dos cosas que rompen el juego si se cuelan

Las dos ya pasaron y costaron caro. Vale la pena revisarlas antes de mandar el archivo.

### a) Que TODOS los clubes jueguen la misma cantidad de partidos
Una liga de N clubes ida y vuelta son **N × (N−1)** partidos, y **2 × (N−1) por club**:

| liga | clubes | partidos totales | por club |
|---|---|---|---|
| Championship | 24 | 552 | 46 |
| Hypermotion | 22 | 462 | 42 |
| 2. Bundesliga | 18 | 306 | 34 |
| Ligue 2 | 18–20 | 306–380 | 34–38 |
| Eerste Divisie | 20 | 380 | 38 |

Si un club aparece con 5 partidos y otro con 46, el archivo es un **fragmento**, no una temporada.
Un fragmento es exactamente lo que hacía que las copas no coronaran campeón nunca. **Mejor mandarme
"no conseguí la temporada completa" que mandar la mitad.**

### b) Clubes que en el juego están en Primera
Si el calendario es de una temporada **posterior** a la que corre el juego, va a traer a los que
descendieron — y esos, adentro del juego, siguen en Primera. Jugarían las dos ligas a la vez.

**No hace falta que lo arregles vos.** Sólo avisame de qué temporada es (punto 3) y yo hago la
sustitución, como se hizo con la Serie B italiana (Hellas Verona, Pisa y Cremonese salieron y
entraron Monza, Venezia y Frosinone).

## 7. Dónde dejar los archivos

En la carpeta `data/calendarios_allgames/`, con estos nombres:

```
data/calendarios_allgames/gb2_championship.json
data/calendarios_allgames/es2_hypermotion.json
data/calendarios_allgames/l2_bundesliga2.json
data/calendarios_allgames/fr2_ligue2.json
data/calendarios_allgames/nl2_eerste.json
```

Si es más cómodo pegar el JSON en el chat, también sirve — sobre todo para una sola liga.

## 8. Otros formatos que también sirven

Si el scraper ya produce otra forma, **no la conviertas a mano**: mandala como sale y yo escribo el
importador. Estos tres ya tienen lector en el repo:

**ESPN por liga** (`data/calendarios_espn/*_liga.json`)
```json
{ "espnLeagueId": "eng.2", "temporada": "2025/26",
  "equipos": { "349": "Ipswich Town", "382": "Norwich City" },
  "partidos": [ { "fecha": "2025-08-08", "local": "Ipswich Town", "visita": "Birmingham City" } ] }
```

**Transfermarkt / Gesamtspielplan** (`data/calendarios/*.json`)
```json
{ "competition": { "id": "GB2", "league": "Inglesa", "season": 2025 },
  "matches": [ { "date": "2025-08-08", "round": "1. Matchday",
                 "home": "Ipswich Town", "away": "Birmingham City" } ] }
```

**CSV**, una fila por partido, con cabecera:
```csv
date,home,away
2025-08-08,Ipswich Town,Birmingham City
```

## 9. Qué hago yo cuando llegue

1. Verifico que los partidos por club estén parejos (punto 6a) y que los nombres crucen con la base.
2. Corro las fechas los años que haga falta para alinearla con la Primera de ese país.
3. La injerto en `src/realCalendarDates.ts` — **injertar, no regenerar**: regenerar lee una copia
   vieja de la base y deshace correcciones hechas a mano (ver la cabecera de
   `scripts/importar_calendarios_espn_liga.mjs`).
4. Corro los tres validadores: `validar:uncalendario`, `validar:copas`, `validar:calendario`.
5. Activo ascenso y descenso de ese país en `src/promocionDescenso.ts`.

Resultado: esos clubes pasan a ser jugables, y en ese país vuelve a haber ascenso y descenso.

## 10. Prompt corto, listo para copiar

> Necesito el calendario completo de la temporada 2025/26 de la **[Championship inglesa]**. Dame un
> JSON con esta forma exacta:
>
> ```json
> { "id": "gb2", "name": "Championship", "kind": "league", "league": "Inglesa",
>   "temporada": "2025/26",
>   "matches": [ { "date": "2025-08-08", "home": "Ipswich Town", "away": "Birmingham City" } ] }
> ```
>
> Requisitos:
> - `date` en formato YYYY-MM-DD, la fecha real de cada partido.
> - TODOS los partidos de la temporada regular: 24 clubes, 552 partidos, 46 por club. Si no podés
>   conseguirla completa, decímelo en vez de mandar una parte.
> - `home` es el local y `away` el visitante — no los inviertas.
> - Nombres de club en su forma habitual en inglés (Ipswich Town, no Ipswich Town FC).
> - No necesito resultados, goleadores, horarios ni estadios.
> - Al final, decime de qué temporada es y cuántos partidos trae en total.
