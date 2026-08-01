# Fotos de la tapa del periódico

El resumen de post-partido muestra una foto según cómo te fue. Dejá los archivos
en la carpeta que corresponda y listo: **se detectan solas**, no hay que
registrarlas en ninguna lista ni tocar código.

```
victoria/   -> ganaste
empate/     -> empataste
derrota/    -> perdiste
```

Se elige una al azar por partido, y queda fija para ese partido (no parpadea al
volver a dibujar la pantalla). Podés poner las que quieras en cada carpeta;
mientras una esté vacía, el juego dibuja una escena con SVG en su lugar.

## Qué formato conviene

- **Formatos:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`
- **Proporción:** se recorta a 16:7 desde arriba (`object-top`), porque en una
  foto de fútbol lo que importa —el jugador, su cara, sus manos— está en la
  mitad superior. Una foto vertical funciona igual.
- **Tamaño:** con 1200 px de ancho sobra. Las fotos de 6000 px de los bancos de
  imágenes conviene reducirlas antes: entran enteras al bundle y engordan la
  descarga inicial del juego, sobre todo en móvil.

## Licencias

Solo imágenes con **licencia de uso comercial**: bancos libres (Unsplash,
Pexels, Pixabay) o propias.

**No usar fotografía de prensa deportiva** (Getty, AFP, EFE, Reuters). Quitarle
la marca de agua o borrar las vallas publicitarias no resuelve el problema: es
una obra derivada, y suprimir la información de identificación agrava la
infracción en vez de evitarla. El juego tiene documentación legal propia
(`docs/LEGAL.md`, sección 3.1) y trámites de registro en DNDA y SIC que dependen
de que este material esté limpio.

Conviene que las fotos sean **genéricas**: fútbol amateur o semiprofesional, sin
partidos reconocibles ni caras identificables. Una foto de un jugador famoso en
un partido real, aunque tenga licencia libre, arrastra además derechos de imagen
de esa persona.
