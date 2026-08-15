# Plan de trabajo

Lo que falta y lo que viene. Se arma el 13 de agosto de 2026, después de una sesión larga de
arreglos y features.

**Regla de esta lista:** cada punto dice *por qué* vale la pena y *qué toca*, no sólo qué es. Una
lista de ideas sin eso se vuelve un depósito y nadie la usa. Y lo que está medido va con el número
al lado — los que dicen "verificado" se comprobaron contra el código, no de memoria.

---

## Pendiente concreto

### Datos que faltan

- **Copa de Perú y Copa de Paraguay.** Son los únicos **2 de 19** países con liga cargada y sin copa
  nacional (verificado). Cierran el mapa de Sudamérica. Es scraping, y la red funciona desde los
  scripts — ver `scripts/bajar_fotos_tienda.mjs` como referencia de cómo se hizo con las fotos.
- **El arquero de la liga colombiana.** La tarjeta de "portería menos vencida" quedó vacía a
  propósito al sacar a Santiago Mele, que pasó a Independiente de Argentina. Hace falta el dato real;
  va en `REAL_LEAGUE_LEADERS` (`src/data.ts`).

### Deuda técnica que ya costó bugs

- **`scripts/validar_pantallas.jsx` ✅ TERMINADO.** Ya está conectado y corre con
  `npm run validar:pantallas`: dibuja el Dashboard en **42 combinaciones** de club, paso, pestaña, ánimo,
  lesión, forma y convocatoria.

  **Por qué importaba:** dos bugs le llegaron al jugador porque nada dibujaba el Dashboard en el
  build. `tsc` no ve el orden de ejecución (por eso pasó la pantalla negra por zona muerta temporal)
  y el chequeo de SSR entra por la pantalla de bienvenida, no por el Dashboard. Correrlo antes de
  cada commit que toque `Dashboard.tsx` sigue siendo la red que atrapa esa familia de errores.

### Interfaz

- **Campo 2D con micro-animaciones** durante el partido, en vez de círculos estáticos. La más
  vistosa y la más larga.
- El resto está en [PENDIENTES_UI_UX.md](PENDIENTES_UI_UX.md).

---

## Features acordadas, en orden sugerido

El orden no es por tamaño: es por **cuánto aprovechan lo que ya está construido**. Las primeras
reutilizan sistemas existentes y no tocan el motor ni el calendario, que es donde vivieron casi
todos los bugs.

### 1. El clásico ✅ HECHA

Marcar ciertos partidos como derbi: más presión en las decisiones, el feed lo anticipa toda la
semana, ganarlo da fans desproporcionados y perderlo duele el doble.

**Por qué primero:** ya existen las rivalidades y el feed. Es casi todo reutilización, y se siente
enseguida — un partido que pesa distinto cambia cómo lo encarás.

### 2. Lesión con rehabilitación jugable ✅ HECHA

Hoy la lesión es un número que baja. Podría ser un tramo con decisiones: sesiones de recuperación,
la tentación de volver antes con riesgo de recaída, el DT presionando.

**Por qué:** convierte un castigo pasivo en algo que jugás.

**Lo que se encontró al abrirla, y que cambió la tarea.** `ActiveInjury` ya llevaba
`treatmentChoice: 'fast' | 'natural'` y `handleTreatInjury` ya funcionaba, así que no había que
construir un sistema sino extender uno. Pero además apareció algo que no se veía desde afuera:

> **El roll de recaída ya existía y era CÓDIGO MUERTO.** Las dos puertas al partido
> (`handleAdvanceWeek` y `startMatchflow`) cortaban con `weeksRemaining > 0`, así que era imposible
> llegar a jugar con lesión activa — y por lo tanto imposible recaer. El aviso del tratamiento
> rápido, *"hay riesgo de recaída si volvés a jugar"*, era literalmente un farol: ese riesgo no se
> ejecutaba nunca.

Osea que **volver antes de tiempo** no agregó un sistema: abrió la puerta que dejaba muerto al que ya
estaba escrito.

**Cómo quedó** (`src/lesion.ts`, con la regla en un solo lugar):

- Tercera opción **"Volver antes de tiempo"**, ofrecida durante TODA la lesión y no sólo al
  principio — la decisión interesante no aparece el día que te lesionás, aparece a mitad de camino
  cuando ves la final en el calendario.
- **El riesgo escala con lo que te salteás**, no es plano: 23% con una semana pendiente, 45% con
  tres, 72% de tope. Un porcentaje fijo volvería la decisión trivial (forzás siempre o nunca); así
  la pregunta pasa a ser *"¿fuerzo ahora o espero dos fechas más?"*.
- **Cuesta en la cancha**, no sólo en el aviso: −9 a todos los atributos mientras jugás roto,
  encadenado donde ya vivía el descuento por fatiga. Es más alto que el de fatiga (6) a propósito —
  jugar roto tiene que pesar más que jugar cansado.
- **El tramo siempre termina.** Cada partido aguantado descuenta una fecha, así que aunque nunca
  recaigas llegás al alta jugando. Sin eso quedabas en un bucle de riesgo eterno.
- **Tiene voz:** `postsDeLesion` en ChutSocial, con dos repertorios distintos según estés de baja o
  jugando roto — el médico advirtiéndote, la hinchada aplaudiendo el huevo, Vélez llamándolo mala
  gestión.

**Comprobado:** `npm run validar:lesiones` (14 casos) y el panel agregado a `validar:pantallas`
(24 combinaciones). Los dos se vieron FALLAR con un bug inyectado antes de darlos por buenos.

### 3. Renovación de contrato con negociación ⏸️ OMITIDA POR AHORA

Decisión del autor (14 de agosto de 2026): se omite. **No está descartada** — se pospone.

Se deja acá lo que se averiguó abriendo el código, para que la próxima vez no haya que
re-descubrirlo:

- **Hoy la renovación no renueva nada.** `handleRequestRenewal` (App.tsx ~1769) es un botón con un
  dado: ~50% y sale bono + suba de prima, o prestigio −6. No hay mesa, no hay contraoferta.
- **No existen contratos con fecha de vencimiento.** El propio comentario del código lo dice. Y ése
  es el problema de fondo: sin vencimiento no hay urgencia, y sin urgencia no hay negociación —
  podés pedir renovación en la fecha 3 o en la 300 y es exactamente igual.
- **El agente ya existe** (`Agent` en types.ts, con `reputation` 1-5) pero sólo cobra comisión en
  traspasos. En una negociación real sería la palanca obvia.
- **`appearanceBonus` ya existe** y ya tiene tensión propia (cobrarla te empuja a jugar exhausto y
  eso enfría al DT), así que sería palanca gratis.
- La cláusula de rescisión que mencionaba la idea original **ya estaba descartada** por el autor (ver
  la tabla de abajo), así que habría que reemplazarla por otra palanca.

**Si se retoma, la decisión estructural es una sola:** si los contratos pasan a tener vencimiento
(toca el estado guardado y necesita migración, como se hizo con `activeInjury`) o si sólo se mejora
la mesa dejando el contrato indefinido (mucho más barato, pero la renovación sigue sin urgencia).

### 4. La lista de convocados ✅ HECHA

Que antes de la fecha FIFA salga la nómina en el feed y veas si estás o no, con la prensa
discutiendo tu ausencia. Hoy te convocan en silencio.

**Lo que se encontró:** la convocatoria ya funcionaba y era **completamente muda**. La regla vivía
suelta dentro de `startMatchflow` y se evaluaba en el instante de arrancar el partido: si dabas el
corte aparecía un partido de eliminatorias sin aviso, y si no lo dabas **no pasaba nada** — ni te
enterabas de que había habido lista. El mayor premio de una carrera entraba y salía en silencio.

**Cómo quedó** (`src/convocatoria.ts`):

- La regla se mudó a un solo lugar y la consumen **los dos lados**: el feed que la anuncia y
  `startMatchflow` que la ejecuta. Con dos copias se desincronizarían y el diario te pondría en una
  nómina a la que el juego después no te lleva — un anuncio que miente rompe más que uno que falta.
- **La nómina sale con nombres reales de la base** (Colombia: Luis Díaz, James Rodríguez, Jhon
  Arias, Richard Ríos, Davinson Sánchez) y el DT real. No se rellena hasta 23 con nombres
  inventados: lista corta y verdadera antes que larga y falsa.
- **La ausencia se explica con números**: *"Te falta 7 de prestigio y 3 partidos"*. Los dos cortes
  son cosas que podés mover, así que decirlo convierte la ausencia en un objetivo y no en un muro.
- Dos repertorios de voces distintos, porque estar en la lista es una noticia y quedar afuera es una
  discusión.

**Y destapó dos agujeros del validador de pantallas**, que ahora están cerrados:

1. **Sólo dibujaba UNA pestaña.** El Dashboard abre en `carrera` y las otras diez —el feed, la
   prensa, los traspasos, las tablas, el calendario— no las dibujaba nadie, mientras el validador
   decía "todo OK". Ahora recorre las once (`initialTab`, que sólo usa el script).
2. **Sólo comprobaba que no reventara.** Un bloque que devuelve vacío no revienta: simplemente no
   sale, y el caso pasa igual. Así se coló la lista de convocados — pasaba en verde sin dibujarse.
   Ahora los casos con contenido verifican que el TEXTO esté en el HTML.

De 24 a **37 combinaciones**, y las pestañas pesan de verdad (mi_club 124 KB, tienda 101 KB,
chutsocial 73 KB) donde antes todo daba 47 KB.

### 5. Momento de forma visible ✅ HECHA

Una racha que el juego reconozca: tres partidos seguidos con buena nota da un plus, una mala racha lo
quita. Da continuidad entre partidos, que hoy son bastante independientes entre sí.

**Lo que había:** `lastMatchRating` (sólo el último partido) y `sumaCalificacionesHistoricas` (toda
la carrera). Entre esos dos extremos, nada — no existía forma de saber si venías en racha. Fue la
primera de estas features que necesitó un **campo nuevo** en el estado guardado.

**Cómo quedó** (`src/forma.ts`):

- Ventana de **5 partidos**; **3 seguidos** con nota ≥ 7.0 es racha, ≤ 5.5 es bajón.
- **La regla que separa forma de promedio: los parates la cortan.** Cada nota se guarda con el paso
  en que se jugó, y si entre dos partidos pasaron más de 6 fechas la racha se corta ahí. Sin esto,
  volvías de dos meses lesionado todavía "en racha" por partidos de antes de romperte — eso es
  memoria, no forma. La mitad de los casos del validador son sobre huecos en el calendario.
- **Efecto chico y simétrico: ±5** en todos los atributos, tercer eslabón de la misma cadena donde
  ya viven la fatiga (6) y jugar lesionado (9). El más chico de los tres a propósito: si la mala
  racha pesara más que jugar roto sería una espiral sin salida. Simétrico porque premiar la buena
  tanto como castigar la mala es lo que la hace un momento y no un impuesto.
- **Se ve:** panel con las últimas 5 notas en crudo, coloreadas, para que la racha no aparezca como
  un número de la nada.
- **Se comenta**, pero sólo cuando hay racha definida — comentar todas las fechas sería ruido.
- Las partidas viejas arrancan **sin historial**, no con notas inventadas desde el promedio: una
  racha que no jugaste no es tuya.

**Comprobado:** `npm run validar:forma` (20 casos) y 3 estados nuevos en `validar:pantallas`
(**40 combinaciones**). Se vio fallar con la regla del parate desactivada.

### 6. El retiro como documental

Al colgar los botines, un repaso narrado: récords, dónde quedaste en la historia, qué no alcanzaste.
Los datos ya están todos — palmarés, logros, Balón de Oro, tablas por competición.

---

### 7. El técnico te habla en el entretiempo

Si vas perdiendo te pide algo concreto ("andá a buscarla al medio"). Cumplirlo sube la relación con
él; ignorarlo y ganar igual sube tu ego pero lo enfría. Usa las decisiones que ya existen en el
partido.

### 8. Rival de carrera

Un jugador de otro club que sube contigo y al que te comparan toda la carrera. El feed los enfrenta;
superarlo vale más que superar a cualquiera.

### 9. El bajón anímico ✅ HECHA

`mentalHealth` ya existe pero hoy es un número sin consecuencia. Se convierte en un ESTADO con
salida:

- **Se entra** por acumulación, no por un mal partido suelto: dos o tres derrotas con nota baja, una
  lesión larga, o un escándalo. Tiene que sentirse merecido.
- **Mientras dura** el costo se ve en la cancha: menos energía inicial, las decisiones arriesgadas
  salen peor, y el feed lo nota. Si el bajón no se ve jugando, es decoración.
- **Se sale decidiendo**, y ninguna opción es obviamente correcta: psicólogo del club (cuesta plata y
  que el DT se entere), volver al barrio (perdés una fecha), o apretar los dientes (gratis, podés
  hundirte más).

Reutiliza decisiones, feed y "Visitar a los tuyos", que ya está en Entorno.


**Lo que se encontró al abrirla, y que corrige el enunciado:** `mentalHealth` no era del todo un
número sin consecuencia. Por debajo de 35 ya aplicaba un 0.94 a las decisiones del partido y ya se
avisaba en la pantalla previa. Lo que no tenía era **fondo**: no se nombraba, no se explicaba, y no
había nada que hacer al respecto — se salía sola ganando partidos, que es justo lo que cuesta cuando
estás mal.

**No guarda nada nuevo en la partida.** La tentación era agregar `bajonAnimico: { desdePaso, motivo }`
al perfil. No hace falta: **el acumulador ya es `mentalHealth`**. Cada derrota con nota baja, cada
semana de lesión y cada escándalo ya lo empujan para abajo, así que "estar en bajón" es simplemente
haber acumulado suficiente — medido: **11 golpes** desde un ánimo sano, así que un mal partido suelto
no alcanza, que era el requisito. Mismo criterio que `lideresDeCopa.ts`: sin migración y sin riesgo
para una carrera en curso.

**Cómo quedó** (`src/animo.ts`):

- **Se entra** por debajo de 30. Entre 30 y 35 queda el escalón de "cabeza floja" que ya existía, así
  que el bajón es un lugar del que se sale y no un interruptor que se prende y se apaga con ±1.
- **Se nota jugando:** −12 de energía al arrancar el partido (menos que jugar lesionado, que son 14 —
  una rotura pesa más que dormir mal) y un 0.88 en el multiplicador de decisiones, contra el 0.94 de
  cabeza floja. Sigue por encima del piso de 0.82: tiene que notarse, no volver el partido injugable.
  Una espiral de la que no se sale ya fue un problema en este mismo cálculo y no se reintrodujo.
- **Se dice POR QUÉ**, con lo que de verdad pasó: la lesión larga tapa a todo lo demás, después la
  racha de partidos flojos, después la hinchada. Sin un motivo claro se dice eso mismo, en vez de
  inventar uno — un "estás anímicamente mal" a secas se lee como un castigo arbitrario.
- **Se sale decidiendo**, y cada salida cobra en una moneda distinta: **psicólogo del club** (dinero e
  imagen: −5 de prestigio porque el cuerpo técnico se entera), **unos días en casa** (la que más
  levanta, pero −30 de energía: llegas corto al próximo partido) y **apretar los dientes** (gratis,
  45% de que salga bien; si no, te hundes un poco más). Ninguna es la correcta, que era el pedido.

**Diferencia con el enunciado original:** "volver al barrio" decía *perder una fecha*. El camino de
descanso vive dentro de `handleAdvanceWeek`, detrás de la confirmación de energía baja, y extraerlo
habría sido un refactor del archivo donde vivieron casi todos los bugs. Se cobra en energía, que es
la moneda con la que el juego ya modela llegar corto a un partido.

El panel vive en la pestaña **Carrera**, al lado del de lesión — no en la columna de Entorno, que
está dentro de ChutSocial. Es donde el jugador va a buscar qué le pasa y qué puede hacer.

Validadores: `npm run validar:animo` (33 casos) y dos combinaciones nuevas en `validar:pantallas` —
el panel dibujado en bajón, y comprobado que NO aparece con el ánimo sano.

### 10. Rachas de TU historia

**La fuente cambia respecto de la idea original, y eso la vuelve viable.** Buscar rachas reales de
600 clubes no lo es: no existe esa base, habría que scrapear décadas y quedaría vieja al día
siguiente.

Pero el juego ya guarda tu historia entera -- cada resultado con su fecha, todas las temporadas,
todos los títulos. Así que las rachas salen de tu carrera: *"no le ganás a Nacional hace 6
partidos"*, *"cuarta final consecutiva que perdés"*. Cero datos externos, cero mantenimiento, y pesa
más: es una racha que viviste, no una que leíste.

Costo real: escribir las consultas sobre `datedResults` y elegir cuáles son interesantes.

### 11. El fichaje que te tapa

El club compra a alguien de tu puesto y tenés que pelear el lugar.

**Viable y de bajo riesgo, verificado:** `decideLineupStatus` (App.tsx ~2219) ya decide cada semana
si sos titular, suplente o ni convocado, comparando tu prestigio contra un umbral que sale de la
reputación del club. Ser suplente ya funciona, con entrada desde el banco incluida.

Osea que el fichaje NO necesita un sistema nuevo: es subir ese umbral temporalmente y bajarlo a
medida que rendís. No toca calendario ni motor -- los dos lugares donde vivieron casi todos los bugs.

**Tope obligatorio:** nunca puede dejarte en `not_called`, sólo en `substitute`. Así el peor caso es
banco de más, nunca una temporada sin jugar.

### 12. Publicar en ChutSocial ✅ HECHA

Un botón en el feed, UNA publicación por fecha. Se abre con tres o cuatro opciones escritas según tu
último partido -- no texto libre, que no hay forma de evaluar.

- Después de ganar: agradecer a la hinchada / reconocer al rival / picantear el próximo clásico.
- Después de perder: hacerte cargo / señalar al equipo / no decir nada.

Cada una mueve fans, prestigio y relación con el DT en direcciones distintas, y **ninguna es gratis**:
picantear da fans y enfría al técnico; hacerte cargo da respeto y baja el ánimo.

Y el feed RESPONDE, reusando el mecanismo de la rueda de prensa: se guarda el saldo de la publicación
y las voces reaccionan. Así el feed deja de ser de una sola vía sin inventar nada nuevo.

---

## Descartadas, con el motivo

Anotadas para no volver a proponerlas.

| Idea | Motivo |
|---|---|
| El capitán | Descartada por el autor. |
| Cláusula de rescisión | Descartada por el autor. |
| Sorteo en vivo | Descartada por el autor. |
| Equipo del año | Descartada por el autor. |
| Partido homenaje | Descartada por el autor. |
| Hijos futbolistas | Buena idea pero traería muchos bugs: toca retiro, generaciones y estado guardado a la vez. |
| **VAR** | Haría el juego injusto. Un gol anulado por algo que el jugador no controla es frustración sin decisión detrás. |
| Pelear por el número | Descartada por el autor. |
| Primas por objetivos | Descartada por el autor. |
| Pretemporada y gira | Descartada por el autor. |
| La entrevista larga | Descartada por el autor. |

**Sin decidir todavía:** adaptación al extranjero, barra brava, el casi-traspaso.

---

## Lo grande que quedó a medias

- **Conference League.** No se puede importar de `UCOL.json` (alias rotos y clubes de ligas que no
  tenemos). Necesita un reparto de cupos sobre las 7 ligas europeas cargadas.

### Goleadores reales en las copas ✅ HECHA

La tabla de una copa contaba **sólo los partidos del jugador**: los otros cruces de la ronda los
resolvía el motor de fondo sin atribuir un gol, así que el goleador de la Libertadores eras vos con
dos goles y no figuraba nadie más. En la liga ya estaba resuelto (los otros nueve partidos de la
fecha se reparten en `handleMatchComplete`), pero una copa no tiene un "momento de la fecha" donde
anotarla: avanza en semanas donde no jugás (`syncBackgroundCups`) y se termina de golpe cuando
quedás eliminado (`terminarTorneoSinElJugador`).

**El cambio de enfoque que lo hizo viable:** no anotarla, **deducirla**. El estado de una copa ya
guarda el historial completo — las seis fechas de cada grupo con su marcador y todas las llaves de
todas las rondas con ida y vuelta — así que la tabla se calcula del cuadro cada vez que se mira
(`src/lideresDeCopa.ts`). Tres consecuencias:

- **No cambia el formato de la partida.** Era el riesgo grande anotado en el plan original: un
  cambio de formato a medias corrompe carreras en curso. Al no guardar nada nuevo, una carrera vieja
  abre igual y muestra los goleadores de su copa en curso desde el primer vistazo.
- **No puede contar doble** — no hay acumulador, se recalcula — ni quedarse corta por un punto de
  enganche olvidado.
- **No adelanta el torneo**, que era la objeción que lo tenía frenado: sólo se leen partidos que el
  cuadro ya tiene jugados, y el cuadro nunca corre más allá de un partido pendiente tuyo.

El reparto se siembra con el lugar del partido en el cuadro en vez de `Math.random`, así el goleador
no cambia de nombre en cada render. Tus partidos quedan afuera de la deducción: ésos ya se anotan con
los datos reales.

**Lo que destapó al correrlo contra la base real:** `ULTIMATE_CLUBS_DATABASE` le saca la posición al
plantel (`'Rodrigo Rey (GK)'` → `'Rodrigo Rey'`; 453 de 697 clubes con posición en `CLUBS_DATABASE`,
10 de 1107 en ULTIMATE), y de esa etiqueta viven las dos reglas del reparto. Con ULTIMATE el arquero
de Independiente salió goleador de la Libertadores con 7 y la portería menos vencida quedó vacía:
cero arqueros en 125 partidos. La atribución usa `CLUBS_DATABASE`, que cubre los 32 clubes de la
Libertadores, los 32 de la Sudamericana y los 36 de la Champions.

Validador: `npm run validar:goleadorescopa` (32 casos, con una Libertadores real de 125 partidos).
