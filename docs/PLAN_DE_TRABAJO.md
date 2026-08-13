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

- **Terminar `scripts/validar_pantallas.jsx`.** Dibuja el Dashboard con un perfil a mitad de
  temporada. Está escrito pero NO conectado: su perfil sintético está incompleto y falla por el
  andamio, no por el juego.

  **Por qué importa:** dos bugs le llegaron al jugador porque nada dibuja el Dashboard en el build.
  `tsc` no ve el orden de ejecución (por eso pasó la pantalla negra por zona muerta temporal) y el
  chequeo de SSR entra por la pantalla de bienvenida, no por el Dashboard.

  **Cómo terminarlo:** extraer la construcción del perfil de `SetupScreen.tsx` (~línea 189) a una
  función exportada y usarla desde el validador. Copiar los campos a mano se desincroniza al primer
  campo nuevo.

### Interfaz

- **Campo 2D con micro-animaciones** durante el partido, en vez de círculos estáticos. La más
  vistosa y la más larga.
- El resto está en [PENDIENTES_UI_UX.md](PENDIENTES_UI_UX.md).

---

## Features acordadas, en orden sugerido

El orden no es por tamaño: es por **cuánto aprovechan lo que ya está construido**. Las primeras
reutilizan sistemas existentes y no tocan el motor ni el calendario, que es donde vivieron casi
todos los bugs.

### 1. El clásico

Marcar ciertos partidos como derbi: más presión en las decisiones, el feed lo anticipa toda la
semana, ganarlo da fans desproporcionados y perderlo duele el doble.

**Por qué primero:** ya existen las rivalidades y el feed. Es casi todo reutilización, y se siente
enseguida — un partido que pesa distinto cambia cómo lo encarás.

### 2. Lesión con rehabilitación jugable

Hoy la lesión es un número que baja. Podría ser un tramo con decisiones: sesiones de recuperación,
la tentación de volver antes con riesgo de recaída, el DT presionando.

**Por qué:** convierte un castigo pasivo en algo que jugás.

### 3. Renovación de contrato con negociación

Pedís sueldo, cláusula, o que traigan refuerzos. El club acepta, contraoferta o se ofende. Encaja
con el agente que ya existe.

### 4. La lista de convocados

Que antes de la fecha FIFA salga la nómina en el feed y veas si estás o no, con la prensa
discutiendo tu ausencia. Hoy te convocan en silencio.

### 5. Momento de forma visible

Una racha que el juego reconozca: tres partidos seguidos con buena nota da un plus, una mala racha lo
quita. Da continuidad entre partidos, que hoy son bastante independientes entre sí.

### 6. El retiro como documental

Al colgar los botines, un repaso narrado: récords, dónde quedaste en la historia, qué no alcanzaste.
Los datos ya están todos — palmarés, logros, Balón de Oro, tablas por competición.

---

## Lo grande que quedó a medias

- **Goleadores reales en las copas.** Hoy el motor atribuye goleadores en los partidos de LIGA de
  cada fecha, pero en las copas resuelve el cuadro entero de una sola vez, y atribuir ahí adelantaría
  el torneo en pantalla. Ver [goleadores_reales_plan](../../.claude/…) en memoria.
- **Conference League.** No se puede importar de `UCOL.json` (alias rotos y clubes de ligas que no
  tenemos). Necesita un reparto de cupos sobre las 7 ligas europeas cargadas.
