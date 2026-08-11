# Pendientes de UI / UX

Lista viva de mejoras de interfaz. Nace de cuatro auditorías externas de diseño y usabilidad sobre el
build publicado: escritorio, móvil (375–390px) y una que simuló un partido completo.

**Regla de esta lista:** cada punto se verifica contra el código **antes** de anotarlo, y la lista
guarda el veredicto, no la observación cruda. Una auditoría externa ve la pantalla, no el árbol de
componentes, y ahí se cuela el error caro: describir bien un síntoma y atribuirlo a la causa
equivocada. Un punto en `DESCARTADO` no es un capricho: es un arreglo que habría empeorado el código.

Balance de las cuatro: la de móvil fue la más sólida (5 de 5 puntos ciertos); las de escritorio
trajeron dos falsos positivos. Ninguna llegó más allá de las pantallas de entrada salvo la de
partido, así que **nada de esto valida motor, calendarios ni datos**.

---

## Hecho

### Bugs

- **Trofeo fantasma en la vitrina.** Una carrera recién creada mostraba un título de liga sin haber
  jugado. `palmares.ts` confundía **"no quedan partidos"** con **"no hay partidos"**: las ligas con
  calendario real nacen con `fixtures: []` a propósito, así que `[].some(...)` daba `false`, el
  torneo se leía como terminado y se coronaba al primero de una tabla en cero — que por el orden
  estable de `sortTable` es el primer club del array de la liga. Medido: **53 ligas, 53 clubes**
  afectados antes; 0 después, con los dos caminos legítimos intactos (`cupTitles` y deducción sobre
  fixture terminado).
- **"1 encuentros oficiales".** El sustantivo ahora concuerda con el número.
- **Relato del partido fuera de orden.** El aviso de "te deja en el banco" (minuto 0) se empujaba al
  final del array de arranque, después del ambiente del minuto 4, así que la transmisión abría con un
  0' publicado debajo de un 4'. Se ordenó el arranque y además el render ordena por minuto con sort
  estable, para que un evento agregado tarde no vuelva a desordenar la narración.
- **El texto de la decisión contradecía el marcador.** Dos de los 35 prompts afirman el resultado
  ("tu equipo gana por la mínima") y se sorteaban sin mirar el tanteador: salían con un 2-0 en
  pantalla. `MatchDecision` ahora acepta `requiereDiferencia`, y esas dos decisiones sólo entran al
  sorteo si la diferencia de gol coincide de verdad.

### Móvil

- **El nav se colapsa.** La barra lateral es `w-full` en pantallas chicas y desplegaba las once
  pestañas arriba del contenido. Ahora hay un botón de menú (sólo móvil) que las abre y las cierra
  solo al elegir. **La ficha del jugador NO se colapsa**: es identidad, no navegación.
- **Las métricas son una tira horizontal.** Eran una grilla de 2 columnas: tres filas altas que con
  el header fijo se comían media pantalla.
- **Header de stats sticky.** Siempre estuvo en todas las pestañas — se renderiza fuera de los
  condicionales de `activeTab` — pero se iba con el scroll, y en Entrenamiento eso dejaba el aviso de
  "no te alcanza el capital" sin poder ver el capital.
- **Colchón inferior de 96px.** Los controles de música y sonido son `fixed bottom-4` en las dos
  esquinas y tapaban el último bloque de cada pestaña.
- **Panel de narración en `min(420px, 60vh)`.** La altura fija se comía la pantalla de un teléfono y,
  como tiene scroll propio, el dedo movía la narración en vez de la página. En escritorio queda igual.
- **Zonas táctiles de 44px** en el nav, las pestañas de inicio, los botones de ranura y el de
  renovación.

### Legibilidad y accesibilidad

- **Fuera las mayúsculas sostenidas** de los textos largos (comparador de temporadas, vitrina vacía,
  nota de entrenamiento): eran oraciones completas, no etiquetas.
- **Contraste**: los rótulos de las métricas y varios textos chicos pasaron de `slate-500` a
  `slate-400`, y algunos de `text-3xs` a `text-2xs`.
- **Pestañas con roles reales** (`tablist` / `tab` / `tabpanel` + `aria-selected`), en el Dashboard y
  en la pantalla de inicio, con un `focus-visible` claro.
- **`aria-label` por ranura**: las seis decían "Nueva Partida" y eran indistinguibles de corrido.
- **Truncamiento en la vitrina**: el club tiene su propio renglón. El `truncate` se queda (está para
  que un nombre largo no rompa la tarjeta) pero ahora tiene el ancho entero y hay `title` con el
  nombre completo.
- **La renovación explica qué falta.** El botón deshabilitado ahora muestra cuánta Relación DT te
  falta, visible en pantalla y no sólo en un `title` — en un teléfono no hay hover.
- **Watermark de la Sala de Prensa** de 0.08 a 0.05: textura de fondo, no competencia con la pregunta.
- **Transiciones** en las barras de progreso, para que un cambio de energía o prestigio se vea mover.

### Respaldo de partidas

**Exportar / importar en JSON** (`src/partidaArchivo.ts`). Una carrera puede durar 32 temporadas y
vivía sólo en `localStorage`: un "borrar datos de navegación", un teléfono nuevo, y no quedaba nada.

- Cada ranura ocupada tiene **Descargar copia**; el archivo lleva las dos claves de la ranura (perfil
  y tienda), porque una partida sin sus objetos comprados vuelve incompleta.
- **Restaurar copia** aparece sólo en ranuras **vacías**, para que importar no pueda pisar una
  carrera en curso por un clic de más.
- La importación **valida el perfil campo por campo** antes de escribir, y no toca el almacenamiento
  si algo falla: un archivo editado a mano puede traer el rótulo correcto y adentro basura, y eso
  rompe la partida recién en el próximo arranque, cuando ya es tarde para entender por qué.

### Escala de elevación

Antes el fondo de página y los cuadros internos compartían el mismo `#0b0a0d`, así que no había forma
de ver qué está apoyado sobre qué. Ahora hay cuatro niveles separados, definidos en `index.css` como
**tokens** y no clase por clase (el juego usa `bg-slate-950/900/800` en cientos de lugares):

```
body #08070a  <  slate-950 #100d12  <  slate-900 #1c181d  <  slate-800 #2b2521 (bordes)
```

Además se recalibraron `--shadow-md/lg/xl/2xl`: las de Tailwind están hechas para páginas claras
—negro al 10% sobre un fondo casi negro no se ve— así que las tarjetas quedaban recortadas sólo por
su borde.

**No se usaron los hexes que proponía la auditoría** (`#0D0E12`, `#16181F`, `#21242E`). Son gris
azulado y el tema es grafito **cálido** a propósito, el "Noche de Campeones" documentado en
`index.css`. Se tomó la idea —tres niveles y sombras de verdad— dentro de la paleta existente. Con
los hexes de la auditoría el juego habría quedado como un dashboard genérico.

---

## Descartado (el síntoma existe, la causa no era esa)

### La barra de stats "desaparece en algunas pantallas" — FALSO

Se reportó que Energía, Capital y Relación DT sólo se ven en cuatro pestañas. **No era cierto:** el
bloque está fuera de todo condicional de `activeTab`. Lo que faltaba era `sticky`, no replicar el
header en cuatro pantallas donde ya estaba. Arreglado como corresponde, arriba.

### "Lógica de mentoría invertida" — NO ES UN BUG

El mensaje avisa que ningún **compañero** tiene ≤20 años, y en un plantel profesional eso suele ser
cierto; el jugador no se cuenta a sí mismo. Lo que falta es el lado receptor, que es feature nueva.

### "Botones desalineados en Tienda y Patrocinios" — FALSO

Ambas secciones son grillas (`grid sm:grid-cols-2 lg:grid-cols-3` y `grid md:grid-cols-2`), así que
las tarjetas de una misma fila ya tienen igual altura; y la tarjeta de Tienda además lleva
`flex flex-col` con `mt-auto` en la fila del precio. Los botones ya estaban alineados.

Lo único cierto detrás del reporte es una **inconsistencia de criterio** entre las dos pantallas:
Tienda ancla precio y botón abajo, Patrocinios los pone arriba a la derecha. Es decisión de diseño,
no un defecto.

---

## Pendiente

### Medio

2. **Barras de progreso en la Galería de Balones de Oro.** Necesita una decisión antes de codearla:
   la galería se ve **antes** de cargar una carrera, así que "progreso" no tiene un dueño obvio.
   ¿Se mide contra la carrera más avanzada, contra una elegida, o se muestra sólo dentro de la
   partida?
3. **Campo 2D con micro-animaciones** durante la simulación, en vez de círculos estáticos.
4. **Overlay uniforme sobre las imágenes de la Tienda**, que varían en brillo y recorte. Ya tienen un
   degradado; falta emparejar el brillo.

### Bajo / dirección de diseño

Esto no son defectos: son propuestas de rediseño que conviene decidir antes de tocar, porque afectan
a toda la app.

5. **Escala de elevación** (fondo, tarjeta y contenedor interno en tres grises) con sombra suave.
6. **Color de acento con criterio:** rojo sólo para gastos y estados críticos; verde o cian para
   ganancias de Capital y Energía.
7. **Barra de navegación inferior en móvil.** Se implementó el menú colapsable, que es la otra mitad
   de la propuesta. Las dos juntas son redundantes: con once pestañas, una barra inferior entra con
   4 o 5 accesos y necesita igual un "más".

### Rechazado por costo oculto

8. **"Subir el tamaño mínimo de fuente a 14px".** No es gratis. El comentario de `index.css` explica
   que los escalones `text-2xs/3xs/4xs` existen justamente para que las etiquetas densas de las
   fichas no desborden ni se partan en varias líneas; subirlas de golpe reintroduce ese desborde. El
   camino es rediseñar la densidad tarjeta por tarjeta, no cambiar el token. Se subieron sólo los
   textos que son oraciones, no los rótulos.

---

## Features derivadas

9. **Lado receptor de la mentoría:** que un juvenil pueda ser apadrinado por un veterano, y ocultar
   el panel de mentor cuando el jugador es demasiado joven para serlo.
10. **Señal de interés de los clubes grandes:** hoy no hay forma de saber cuánto prestigio falta para
    que un club europeo se fije en vos.
