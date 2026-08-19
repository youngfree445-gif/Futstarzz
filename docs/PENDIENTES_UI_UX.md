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

### Rótulos

- **"Relación DT" no era una etiqueta mentirosa: era un dato con DOS nombres.** La auditoría lo
  anotó como "el botón de renovación le pone nombre a un dato que es otro", porque el gate lee
  `playerProfile.prestige` y el cartel dice "Relación DT". Verificado contra el código: es
  deliberado y está documentado en `src/tecnico.ts` — `prestige` **es** la relación con el DT, y
  crear un campo paralelo dejaría "dos números peleando por el mismo rótulo".

  Lo que sí estaba mal era otra cosa, y la auditoría no la vio: el mismo número se mostraba como
  **"Relación DT"** en la tira de estado, la renovación y el comparador de temporadas, y como
  **"Prestigio"** en los logros de la pantalla de inicio y **"Pres:"** en la lista de partidas
  guardadas. Un dato con dos nombres públicos hace que el jugador crea que son dos cosas y busque
  en vano la segunda. Ahora se llama Relación DT en las cinco.

### Móvil

- **El nav se colapsa.** La barra lateral es `w-full` en pantallas chicas y desplegaba las once
  pestañas arriba del contenido. Ahora hay un botón de menú (sólo móvil) que las abre y las cierra
  solo al elegir. **La ficha del jugador NO se colapsa**: es identidad, no navegación.
- **Las métricas son una tira horizontal.** Eran una grilla de 2 columnas: tres filas altas que con
  el header fijo se comían media pantalla.
- **Header de stats: se probó sticky y se revirtió.** La auditoría pedía fijarlo porque en
  Entrenamiento el aviso de "no te alcanza el capital" quedaba sin el capital a la vista. Fijado,
  en uso real **tapaba contenido** al bajar y molestaba más de lo que resolvía. Volvió a scrollear
  con la página, pero **más compacto**: la fecha lleva `whitespace-nowrap` y el bloque `shrink-0`
  (sin eso, "miércoles 11 de marzo de 2026" se partía en tres renglones y era lo que estiraba la
  barra a lo alto), y las tarjetas de métrica pasaron de `p-1.5` a `px-2 py-1`.

  Queda como recordatorio de que una recomendación de auditoría puede ser correcta en el papel y
  peor en la mano: lo decide el uso, no el informe.
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
3. **Campo 2D con micro-animaciones** — **EL ENUNCIADO ESTÁ DESACTUALIZADO. Verificado contra el
   código.** Ya no hay círculos estáticos: `src/components/PlayHighlightCanvas.tsx` (525 líneas) es
   un campo 2D animado en Canvas, con **6 tipos de jugada** (`gol`, `pase`, `gambeta`, `defensa`,
   `duelo_fisico`, `arquero`) repartidos en las opciones de las 35 decisiones del partido. Y no es un
   borrador: su cabecera documenta una reescritura posterior a una auditoría geométrica que encontró
   remates terminando fuera de la cancha y goles que no tocaban el arco. Hoy deriva el terreno y los
   arcos de tres constantes, calcula la velocidad de cada tramo por la distancia real a recorrer, y
   pasa toda posición por un clamp antes de dibujarla.

   **Lo que de verdad falta es otra cosa, y es una decisión antes que un trabajo:** un campo
   **continuo** durante la simulación minuto a minuto. Hoy el canvas aparece en las jugadas
   decisivas; el resto del partido se sigue por el relato.

   El problema no es dibujar: es que **el motor no produce posiciones**. Simula marcadores y eventos
   (ver `triggerRandomMatchEvent` y el modelo tipo Poisson de `MatchSimulator`), no dónde está cada
   jugador en cada minuto. Un campo continuo obliga a elegir entre dos caminos con costos muy
   distintos:

   - **Coreografía ambiental:** los 22 se mueven de forma plausible pero **decorativa**, sin relación
     con lo que el motor calculó. Barato, y con el riesgo de mentir — mostrar tu equipo atacando en
     el minuto en que el rival marcó.
   - **Posiciones reales:** el motor pasa a simular ubicaciones. Es un cambio de fondo en el único
     lugar donde vivieron casi todos los bugs, y para un juego que se mira en el relato y no en la
     cancha.

   Sin esa decisión tomada, no se empieza.
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

### Entorno: familia y amigos — hecho

Una barra nueva (0-100) para la gente de tu vida fuera del club, familia y amigos juntos sin
separarlos. La **pareja no entra**: tiene su propio medidor y sus propias acciones desde antes.

Es la única barra que **baja sola sin que hagas nada mal**. Las otras miden cómo te ve el fútbol
(DT, compañeros, hinchada); ésta mide lo que el fútbol te va costando: se enfría 6 puntos al cerrar
cada temporada, y el doble si la cerraste encadenando partidos sin parar nunca.

- **Recuperarla cuesta tiempo y plata**, no sólo plata: "Visitar a los tuyos" pide $900 **y 12 de
  energía**. Si costara sólo dinero sería un botón sin decisión.
- **Efecto**: por encima de 70 amortigua un 25% el golpe anímico de las derrotas; por debajo de 30
  lo profundiza un 25%. Nunca agranda una victoria — sólo actúa sobre caídas.
- Se combina con el referente: las dos redes juntas amortiguan más que una sola (una derrota pega
  −5 sin nada, −3 con una, −2 con las dos, −7 con el entorno abandonado).

Curva medida: sin visitar nunca cae a zona baja en **5 temporadas** a ritmo normal, **3** si además
no parás nunca. Una visita compensa más de una temporada de desgaste normal, pero no dos duras.

## Features derivadas

9. ~~**Lado receptor de la mentoría**~~ — **HECHO**. Ver abajo.
10. ~~**Señal de interés de los clubes grandes**~~ — **HECHO**. Ver abajo.

### Radar de interés, y el agujero que destapó — hecho

La auditoría pedía un indicador de cuánto le falta al jugador para que un gigante europeo lo mire.
Al ir a construirlo apareció que **la pregunta no tenía respuesta porque no había requisito**: con
una carrera modesta en Junior (prestigio 55, 30 partidos, 10 goles) los **691 clubes del juego ya
eran alcanzables**, Real Madrid y Manchester City incluidos.

La causa: el umbral salía de `reputation`, que va de 1 a 5, y Junior, Millonarios, Real Madrid y el
City son **todos 5**. El término que ajustaba por la diferencia contra tu club actual daba cero.

**Arreglo**, con el criterio ya existente y no uno nuevo: el umbral pasa a ser `clubStrength`
(reputación + valor de plantel), **la misma función que la simulación de partidos ya usaba** para
saber que el Madrid (85) no es Junior (58). Sólo hubo que exportarla.

**Y el rendimiento del jugador ahora incluye sus atributos**, con el mismo peso que el prestigio.
Sin eso, la única forma de que un gigante te mirara era acumular temporadas, y un jugador que
explota en su primer año quedaba invisible. De paso corrige un sesgo de posición: con la fórmula
vieja mandaba el aporte por partido, así que un central o un arquero tenían techo bajo por
definición.

Curva resultante, medida:

| Perfil | Rendimiento | Clubes accesibles | ¿Real Madrid? |
|---|---|---|---|
| Debutante (0 PJ) | 37 | 0 / 691 | no |
| Modesto (30 PJ) | 52 | 582 / 691 | no |
| Buen primer año | 75 | 674 / 691 | no |
| Primer año excepcional | 89 | 691 / 691 | **sí** |
| Consagrado | 100 | 691 / 691 | sí |

El **radar** muestra una escalera, no los cuatro clubes más cercanos: se agrupa por peldaño, se toma
el club más reconocible de cada uno y se reparten de punta a punta. Ordenar por cercanía a secas
devolvía cuatro nombres intercambiables a los que les faltaba 1 punto — inútil, y encima escondía el
club con el que el jugador sueña.

Usa el mismo criterio que las ofertas reales, así que si dice "te faltan 10", a los 10 aparece la
oferta. Verificado con 17 chequeos.

### El referente (lado receptor de la mentoría) — hecho

El problema era de primera impresión: la carrera arranca a los 17 y lo único que un juvenil veía en
Plantilla de Club era un cartel diciéndole que no podía apadrinar a nadie. Un callejón sin salida en
la pantalla más vista del juego.

Ahora, mientras tengas `MENTEE_SELF_MAX_AGE` (23) años o menos, elegís a un veterano del plantel
(`MENTOR_MIN_AGE`, 30+) como referente. Los dos umbrales no se pisan, así que ningún compañero puede
ser ahijado y referente a la vez.

**Qué da** (decisión del usuario: vestuario y cabeza, no atributos):
- **+2 a Compañeros** al cerrar cada temporada.
- **Amortigua un 40% el golpe anímico de las derrotas.** Sólo la caída: un referente te levanta
  después de perder, no te hace festejar más una victoria.

**Qué lo corta:** cumplir años, que él deje de estar en el plantel, o cambiar de club. Los vínculos
de vestuario son con compañeros y no cruzan la puerta — se cortan en traspaso, préstamo y vuelta de
préstamo. De paso se corrigió lo mismo para el ahijado, que sí seguía al jugador de club en club.
