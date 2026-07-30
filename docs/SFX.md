# Efectos de sonido

Los `.wav` de `public/sfx/` son **placeholders sintéticos**: tonos generados por código (fanfarria
de gol, silbato, ruido de multitud filtrado). Suenan a "sonido de sistema", no a estadio real.
Están para que el motor de audio funcione y sea probable de entrada, y para no meter audio con
copyright en el repo.

## Reemplazarlos por sonidos reales

Los archivos van en `public/sfx/`. Sustituí uno manteniendo el nombre y ya funciona — no hay nada
que registrar en el código. Si bajás `.mp3` (recomendado, pesa mucho menos), cambiá la extensión en
`SFX_FILES` dentro de [`src/audio.ts`](../src/audio.ts).

| Archivo | Cuándo suena |
|---|---|
| `goal.wav` | Gol del jugador (decisión, penal o tiro libre) |
| `crowd_cheer.wav` | Junto al gol, y en asistencias |
| `card.wav` | Amarilla o roja |
| `crowd_boo.wav` | Expulsión, y penal errado |
| `whistle.wav` | Silbatazo inicial y final |
| `success.wav` | Decisión exitosa sin gol ni asistencia |
| `fail.wav` | Decisión fallida (sin tarjeta) |
| `click.wav` | Interacción de UI |

## Dónde bajarlos legalmente

- **[freesound.org](https://freesound.org)** — el más completo para ambiente de estadio y silbatos.
  Ojo con la licencia de cada sample: filtrá por CC0 (dominio público) para no tener que atribuir.
- **[pixabay.com/sound-effects](https://pixabay.com/sound-effects/)** — licencia propia permisiva,
  sin atribución obligatoria. Buscar "stadium crowd", "referee whistle".
- **[mixkit.co/free-sound-effects](https://mixkit.co/free-sound-effects/)** — gratis para uso
  comercial, curado y de buena calidad.
- **[opengameart.org](https://opengameart.org)** — pensado para juegos, mucho CC0.

**Lo que no hay que hacer:** rippear audio de FIFA/EA, de transmisiones de TV o de YouTube. Es
material con derechos y el juego se publica en la web.

## Regenerar los placeholders

El generador quedó fuera del repo (era un script de una sola vez). Los archivos actuales son WAV
PCM 16-bit mono a 44.1 kHz; cualquier WAV o MP3 con esos nombres funciona igual.

## Por qué los efectos y la música están separados

Los efectos de acá los controla el juego: sabe exactamente cuándo entra un gol y puede dispararlos
en el momento justo. La música de la playlist (widget de Spotify/YouTube, ver
[`src/components/MusicPlayer.tsx`](../src/components/MusicPlayer.tsx)) vive en un iframe de otro
dominio, así que el navegador no nos deja leerla ni mezclarla — no se le puede bajar el volumen en
un gol. Esa es la diferencia real con FIFA, que es nativo y dueño de toda su música.
