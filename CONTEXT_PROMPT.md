# Prompt de contexto — Fut Starzz 2026

> Pegá todo este archivo al arranque de una conversación nueva en claude.ai
> (la versión web no tiene acceso a este repo ni memoria de conversaciones
> anteriores) para que Claude entienda el proyecto sin que se lo tengas que
> re-explicar. Si la pregunta es sobre un archivo puntual, pegá también el
> contenido de ese archivo — esto es solo el mapa general.

> **Si vas a tocar datos, scraping, planteles o reglamentos: leé primero
> `docs/PROMPT_DATOS_Y_SCRAPING.md`.** Tiene las recetas que ya funcionan
> (ESPN, Transfermarkt, X), las trampas resueltas, la regla de homónimos y la
> lista viva de lo que falta.

Estás ayudando con **Fut Starzz 2026**, un simulador de
carrera futbolística estilo "modo carrera" de FIFA/EA FC: el usuario crea un
jugador, elige club y va jugando semana a semana (partidos con decisiones
tácticas, prensa, redes sociales, patrocinios, fichajes, selección
nacional), mientras TODAS las ligas del juego (no solo la del usuario)
corren su calendario y tabla en simultáneo de fondo.

## Stack

- React 19 + TypeScript + Vite 6 + Tailwind CSS 4
- `lucide-react` (íconos), `motion` (animaciones), `xlsx` (import de datos)
- **Capacitor 8** para empaquetar como app Android/iOS nativa
- Deploy web: GitHub Pages (`npm run deploy`) — el juego es 100% frontend,
  sin backend ni base de datos; todo el estado vive en memoria + localStorage

## Mapa de archivos (todo bajo `src/`)

- `App.tsx` (~1200 líneas) — máquina de estados de pantallas
  (`welcome` → `setup` → `dashboard` → `match` → `post_match` / `event` /
  `penalty_shootout` → `career_summary`), y toda la lógica de avanzar semana
- `leagueEngine.ts` (~1500 líneas) — el motor: calendario, tablas, formato
  Apertura/Clausura, copas continentales, Champions/Europa, Mundial,
  ventanas de fichaje, mapeo semana↔fecha real. **Es el corazón del juego.**
- `data.ts` (~4100 líneas) — la base de datos completa: clubes, eventos
  aleatorios, preguntas de prensa, ítems de tienda/patrocinios, selecciones
  del Mundial. Es contenido, no lógica.
- `types.ts` — todos los tipos/interfaces compartidos
- `components/` — `Dashboard.tsx` (hub principal, tablas, redes sociales),
  `MatchSimulator.tsx`, `DecisionCenter.tsx` (eventos random), `PostMatch.tsx`,
  `PenaltyShootout.tsx`, `SetupScreen.tsx`, `WelcomeScreen.tsx`,
  `CareerSummary.tsx`, `ClubBadge.tsx`
- `soccerDatabase.ts`, `clubExtras.ts` — datos auxiliares de clubes
- `audio.ts` — motor de SFX (gol, tarjeta, silbato). Archivos en `public/sfx/`,
  ver [docs/SFX.md](docs/SFX.md)
- `musicPlaylist.ts` + `components/MusicPlayer.tsx` — widget flotante de música:
  el jugador pega su playlist de Spotify/YouTube y suena mientras juega

## Audio: dos capas que no se pueden mezclar

- **SFX (`audio.ts`)** — archivos nuestros en `public/sfx/`, así que el juego los
  dispara en el momento exacto (gol, tarjeta, silbatazo). Es la capa que da la
  sensación tipo FIFA. El volumen/mute se persisten en `localStorage`.
- **Música (`MusicPlayer.tsx`)** — playlist del jugador embebida en un iframe.
  Los dos providers no son equivalentes y la UI los trata distinto a propósito:
  - **YouTube** (recomendado): canciones completas y encadenadas. Se controla por
    `postMessage` (IFrame API), así que el iframe se colapsa a 1x1px y sigue
    sonando de fondo con play/pausa/siguiente/volumen propios en el widget.
    Colapsar con `display:none` o `width:0` **no sirve**: varios navegadores
    pausan un iframe realmente oculto. Va a 1px con `opacity:.01`.
    El embed usa `www.youtube.com`, **no** `youtube-nocookie.com`: el dominio sin
    cookies rechaza muchas playlists de YouTube Music (los mixes `RD...` quedan
    en negro con "video no disponible").
  - **Spotify**: su embed solo da **previews de 30s** salvo que el visitante
    tenga sesión Premium en el navegador, y no expone API de control. No se
    arregla desde acá (haría falta el Web Playback SDK: OAuth + Premium por
    jugador), así que su reproductor queda visible y la limitación se avisa en la
    UI.
  - Igual **no se puede mezclar** ninguno de los dos con el audio del juego: es
    otro dominio y same-origin lo impide, así que no hay forma de bajar la música
    automáticamente en un gol. De ahí que haya dos sliders separados y que el de
    efectos diga explícitamente "efectos del partido".
- Los navegadores **bloquean el audio hasta el primer gesto del usuario**
  (autoplay policy). No se puede esquivar: `playSfx` falla en silencio a
  propósito, y el silbatazo inicial puede no sonar si el jugador entró directo a
  un partido sin haber clickeado nada antes en esa carga.
- El widget se monta en `App.tsx` junto a los toasts, **fuera** de los bloques
  por pantalla: si viviera dentro de `Dashboard` o `MatchSimulator`, cambiar de
  pantalla recrearía el iframe y cortaría la canción.
- Las rutas de los sfx se arman con `import.meta.env.BASE_URL`, no absolutas:
  los tres destinos tienen bases distintas (`/`, `/Futstarzz/`, `./`).

## Modelo de simulación (lo no obvio)

- `SEASON_LENGTH_WEEKS = 38`. Cada 3ª semana es semana de copa
  (`isCupWeek`), salvo durante el Mundial, que ahora ocupa un bloque propio
  de 9 semanas SEGUIDAS (`isWorldCupBreakWeek`) — antes compartía turno con
  Libertadores/Champions cada 3 semanas y eso generaba fechas superpuestas
  que no pasan en la vida real.
- Semana 1 de la carrera = **18 de enero de 2026** (fecha real de la J1 del
  fútbol colombiano; antes arrancaba en julio). Puramente cosmético
  (`getRealDate`/`formatRealDate`), no reemplaza `currentWeek`.
- Ventanas de fichaje: semanas 1-7 y 19-22 de cada temporada de 38, pensadas
  para calzar con enero / mitad de año reales.
- Dos motores de liga, elegidos por país (`isApeturaClausuraLeague`):
  - **Motor simple** (la mayoría de ligas): tabla larga ida y vuelta.
  - **Apertura/Clausura** (Colombia y Argentina): todos-contra-todos a una
    vuelta (19 fechas Colombia / 14 Argentina) → top 8 → playoffs, **dos
    veces por año** (semestre 1 = Apertura, semestre 2 = Clausura).
    - Colombia: playoffs = **Cuartos, Semifinal y Final, TODO a ida y
      vuelta** (formato real vigente desde 2024) — `twoLegKnockout` en
      `LeagueSeasonState`.
    - Argentina: playoffs a partido único (simplificación deliberada) —
      `knockout` en `LeagueSeasonState`.
- Copas continentales: Libertadores/Sudamericana (Conmebol, grupos de 4 +
  eliminación directa) y Champions/Europa League (UEFA, fase de liga estilo
  Swiss + playoff + eliminación a ida y vuelta desde octavos). Clasificación
  por cupo-por-país usando `reputation`, no por tabla en vivo.
- Mundial cada 4 años, 48 selecciones, formato real 2026 (grupos → ronda de
  32 → ... → final), todo a partido único.
- Todo el catch-up (ligas/copas que el jugador no visitó en un rato) es
  perezoso: `getOrCreate*State` simula de golpe los pasos que faltan la
  primera vez que hace falta esa liga/copa.

## Empaquetado móvil (Capacitor)

- `npm run build` / `build:netlify` → `dist/` (Netlify, `base: '/'`)
- `npm run build:ghpages` / `deploy` → `dist-ghpages/` (Pages, `base: '/Futstarzz/'`)
- `npm run build:capacitor` / `npm run cap:sync` → `dist-mobile/` → se copia
  a `android/app/src/main/assets/public` e `ios/App/App/public` (`base: './'`)
- **Los tres builds están aislados** (`vite.config.ts` decide `outDir` y `base`
  según `CAPACITOR` / `GH_PAGES`): compilar un destino nunca pisa a los otros,
  aunque comparten el mismo código fuente React. Antes Pages y Netlify
  compartían `dist/`, y como el build de Pages prefija los assets con
  `/Futstarzz/`, correr `deploy` dejaba en `dist/` un build que en Netlify da
  404 en todo → pantalla en blanco.

### Netlify se sube arrastrando la carpeta a mano

A Netlify se le sube `dist/` con drag & drop, **no** desde el repo. Dos
consecuencias que hay que tener presentes:

- `netlify.toml` **no se aplica** (Netlify solo lo lee cuando buildea él
  mismo). Las reglas de caché viven además en `public/_headers`, que sí viaja
  dentro de `dist/` y por eso sigue funcionando con drag & drop.
- Como la subida es manual, nada valida que `dist/` sea el build correcto: por
  eso importa que cada destino tenga su carpeta propia. Antes de arrastrar,
  `dist/index.html` tiene que pedir `/assets/...` — si dice `/Futstarzz/assets/...`
  es el build de Pages y va a quedar en blanco.
- Carpeta `android/` ya generada y funcional (Gradle + Capacitor 8); appId
  `com.futstarz.app`.

## Convenciones del repo

- Comentarios en español, explican el **por qué** (una regla real del
  fútbol que se está modelando o simplificando a propósito), nunca el qué —
  el código ya es legible por sí solo.
- El repo va a quedar público: **no mencionar IA/Claude/Anthropic en
  comentarios ni commits**, ver commit `093a50e`.
- Sin backend: todo el estado corre en el cliente, se persiste a
  localStorage (`saveGameState` en `App.tsx`).
- Preferir extender los patrones ya existentes (`ShopItem`, `PressQuestion`,
  `effects: { prestige, fans, energy, capital }`) antes que inventar
  estructuras nuevas — ver `ROADMAP_FEATURES.md` para el criterio de diseño
  usado en cada fase ya construida.

## Estado actual (26 jul 2026)

- Fases 1, 2 y 3 del roadmap original ya implementadas (liga paralela,
  copas continentales reales, Mundial jugable, vicios/vestuario/prensa/
  patrocinios/salud mental/Modo Veterano).
- Empaquetado Android recién configurado y probado (compila y corre en
  dispositivo físico vía Gradle + adb).
- Últimos fixes: pantalla negra al resolver una decisión justo antes de una
  semana de fecha FIFA sin partido (faltaba volver a `setScreen('dashboard')`
  en `handleResolveEvent`), calendario reubicado a enero 2026, y playoffs de
  Colombia reescritos a ida y vuelta real (Cuartos/Semis/Final) para que no
  se repitan siempre los mismos cruces entre semestres.
- `App.tsx`/`startMatchflow`: durante semanas de copa (Libertadores/
  Sudamericana en fase de grupos, Champions/Europa en fase de liga) ahora sí
  se calcula la posición real en la tabla de grupo/fase de liga (antes
  quedaba siempre en `null` para cualquier semana de copa, así que ganar en
  Libertadores no se reflejaba ni en el marcador del partido ni en el
  `pressureMultiplier` — bug reportado y corregido).
- Dashboard: tarjeta de "próximo partido" simplificada (sin texto de relleno,
  solo escudo del rival, competición, posición en tabla si aplica y jornada
  en una esquina) y con botón "Pasar a Siguiente Fecha" cuando hay fecha FIFA
  sin convocatoria. Calendario mensual ahora conserva el historial de
  partidos jugados (V/E/D + marcador + escudo) además de los próximos, vía
  `getRealDateFor{League,Cup}StepsBehind` en `leagueEngine.ts`. ChutSocial
  suma posts de los periodistas reales de la Sala de Prensa (con foto) y un
  sistema de likes/comentarios local (el jugador puede comentar lo que
  quiera bajo su propio nombre).
