# Las ocho mecánicas de vida

Las ocho que el usuario eligió, con sus palabras, el diseño acordado para cada una y el orden en que
se hacen. **Está escrito acá porque ya se perdió una vez**: la lista vivía sólo en la conversación y
al cortarse el contexto hubo que reconstruirla del historial.

Ninguna es un torneo ni una regla de fútbol: todas son la vida alrededor del jugador. Y todas tocan
**las mismas tres barras** — salud mental, energía y hinchada. Eso es lo que las hace peligrosas
juntas y lo que decide el orden.

---

## Las ocho, como las pidió

> **Sequía de gol.** Un contador visible de partidos sin marcar que la prensa levanta y la hinchada
> nota. Presión acumulada, no un número aislado.
>
> **Racha de titularidad y pérdida del puesto.** Tres partidos flojos seguidos y el DT te sienta;
> volver cuesta. Hoy `lineupStatus` existe pero casi no se mueve. Convierte cada partido malo en
> consecuencia.
>
> **Entorno que te arrastra.** Amigos del barrio que te piden plata y fiestas. Cortar con ellos
> cuesta salud mental; no cortar, físico.
>
> **Redes sociales con costo real:** responder a un hater puede volverse escándalo; el silencio
> también se paga.
>
> **Fiesta antes de un partido importante.** Nadie se entera... salvo que salga una foto.
>
> **Vida de pareja con arco propio:** conocerla, crisis por las mudanzas de club, ruptura pública.
>
> **Un hijo.** Cambia la energía nocturna y la prioridad al elegir club: ya no vas donde pagan más.
>
> **Idioma y adaptación.** Ir a otro país con un idioma que no hablás baja el rendimiento los
> primeros meses.

Y la condición que puso sobre las tres últimas:

> "me gustan pero que las últimas 2 no pasen sí o sí sino que haya un porcentaje pequeño de
> probabilidad que pase, las últimas 3 mejor dicho"

O sea **pareja, hijo e idioma son probabilísticas**, no garantizadas.

---

## Lo que ya existía cuando se armó la lista

Cuatro de las ocho no son features nuevas: son **conexiones que faltan**. Eso abarata cuatro y es, a
la vez, la trampa principal — es fácil escribir una segunda respuesta a una pregunta que el juego ya
contestaba en otro lado.

| Ya en el juego | Qué hace |
|---|---|
| `forma.ts` | Racha reconocida: sabe si venís de tres partidos rompiéndola o del pozo |
| `rivalDePuesto.ts` | Un compañero te pelea el puesto, juega cuando vos no, y sus números se acumulan |
| `elVestuario.ts` | Tres puertas: si te la dan, si arrancás, si te sacan |
| `entorno` (0-100) | "La gente de tu vida fuera del club — mide lo que el fútbol te va costando" |
| `girlfriend` + `children` | Pareja con su medidor propio, y ya se pueden tener hijos |

---

## El diseño acordado, una por una

### 1. Sequía de gol

La más barata, y sirve de prueba del circuito **prensa → hinchada**.

El dato ya está: `careerStats` guarda goles y partidos. Es un contador de partidos sin marcar desde
el último gol. Vive en el perfil, se muestra en la ficha, y a partir de cierto número la prensa
(ChutSocial) y la hinchada lo levantan: `fans` baja de a poco. Cortar la sequía da un rebote grande,
más que un gol normal.

**El detalle que la hace buena:** el umbral depende del PUESTO. Cinco partidos sin gol de un
delantero es sequía; de un defensor no es nada. `posicion_especifica` ya está en la base.

### 2. Racha de titularidad y pérdida del puesto

La que más cambia el juego, y ya tiene todas las piezas.

Hoy `decideLineupStatus` mira tu **prestigio** contra la vara del club. El prestigio se mueve
lentísimo, así que tres partidos malos no cambian nada. La forma existe pero **no entra en esa
decisión**. Lo que falta es que la vara del DT lea `forma` además de prestigio: tres notas bajas
seguidas te bajan del umbral aunque tu prestigio sea alto, y volver exige rendir *desde el banco*,
que es más difícil porque jugás menos minutos. Ese desbalance es lo que hace que "volver cueste".

**La trampa:** que se vuelva una espiral sin salida. Si entrar al banco baja la forma y la forma baja
te mantiene en el banco, la carrera se muere. Necesita una válvula: entrar y hacer un gol te devuelve
el puesto de una.

**Cómo se verifica:** el banco de UI (`npm run jugar:ui`) juega temporadas enteras. Se mide cuántas
fechas seguidas pasa en el banco un jugador promedio. Más de 8-10 seguidas es que está roto.

### 3. Entorno que te arrastra

La barra `entorno` ya existe, con el comentario que dice para qué es. **Lo que falta son las
decisiones que la muevan.**

Eventos entre partidos con dos salidas y **ninguna gratis**. "Tu amigo del barrio te pide plata para
un negocio": darle cuesta capital, negarle baja `entorno`, y `entorno` bajo hunde la salud mental.
Cortar con el grupo es una decisión de una sola vez, con costo alto y beneficio permanente.

**La clave para que no sea un impuesto aleatorio:** la frecuencia depende de tu situación. Al que
recién sube de la nada le pasa seguido; al consagrado de diez años, casi nunca.

### 4. Redes sociales con costo real

ChutSocial ya publica; falta que **vos puedas responder**.

Un hater aparece tras un partido malo. Tres salidas: **responder** (chance de escándalo que pega en
`fans` y prestigio, pero si sale bien te vuelve ídolo), **ignorar** (no pasa nada, pero se acumula),
o que **lo conteste el club** (seguro, y te hace ver tutelado).

**Lo que la hace real:** que el silencio también tenga costo. Si ignorar siempre es lo óptimo, nadie
responde nunca y la mecánica no existe.

### 5. Fiesta antes de un partido importante

Aparece sólo la noche previa a un partido grande — clásico, final, Libertadores; el juego ya sabe
cuál es cuál. Ir sube `entorno` y baja energía. **Y hay un dado escondido:** una chance de que salga
la foto. Si sale, escándalo grande.

**El detalle que la hace memorable:** el resultado de la foto se decide al ir, pero **se revela días
después**. Esa espera es la mecánica.

### 6, 7 y 8 — las probabilísticas

El dado **entra por parámetro**, como todas las reglas del juego:

```ts
function hayCrisisDePareja(dado: number, mudanzas: number): boolean
```

La función recibe el número aleatorio en vez de tirarlo adentro. Parece un detalle y no lo es: es lo
único que hace que un evento con azar **se pueda probar**. Sin eso, verificar "esto pasa 1 de cada 20
veces" es imposible — ya pasó con el ritual, un evento aleatorio que nadie podía medir y que resultó
dispararse 6 o 7 veces por temporada.

- **Pareja:** la crisis se dispara con probabilidad baja, más alta cuanto más te mudaste de club. Las
  mudanzas ya están en el historial.
- **Hijo:** nunca automático. Aparece como decisión sólo si hay pareja estable, y con chance baja.
  Cambia energía nocturna y, sobre todo, **el criterio del mercado**: los clubes lejanos valen menos.
- **Idioma:** al fichar en un país de otro idioma, una chance de que te cueste adaptarte. Si toca,
  unos meses de rendimiento bajo y eventos de adaptación. Si no toca, encajaste rápido — que también
  pasa en la vida real.

---

## El orden, y por qué

**Las ocho se pisan entre sí.** Todas tocan `mentalHealth`, `energy` y `fans`. Si cada una resta por
su cuenta, el jugador termina en cero por acumulación, ninguna se siente, y no hay forma de saber
**cuál** lo hundió. Por eso no van en paralelo:

1. **Sequía de gol** — la más barata, y prueba el circuito prensa → hinchada.
2. **Racha de titularidad** — la que más cambia el juego, y ya tiene las piezas puestas.
3. **Entorno** — con eventos, ahora que hay dos consumidores de las barras y se puede calibrar.
4. **Redes y fiesta** — cuelgan del entorno y de la prensa.
5. **Las tres probabilísticas** — al final: son las que menos afectan el partido y las que más fácil
   se calibran una vez que el resto está medido.

## Estado

- **Pareja (6) e hijo (7): postergadas** por decisión del usuario el 5 de septiembre de 2026 — "dale
  pero pareja e hijo se dejan para después". Se hacen las otras seis, idioma incluida y
  probabilística.
- La **medición de partida** está en [`MEDICION_DE_PARTIDA.md`](MEDICION_DE_PARTIDA.md). Sin ese
  punto de partida no hay forma de saber si una mecánica nueva desbalanceó algo o ya venía así.
