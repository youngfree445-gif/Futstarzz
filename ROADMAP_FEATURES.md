# Roadmap de Features Nuevas — Fút Starzz

Documento de diseño de todo lo conversado. Organizado en 3 fases según
dependencias: la Fase 1 es la base de la que dependen varias cosas de las
Fases 2 y 3, así que va primero aunque no sea "lo más divertido".

---

## FASE 1 (REVISADA 2026-07-21) — Alcance ampliado, decisiones cerradas

Durante la planificación de la Fase 1 original (solo calendario+tabla de
UNA liga) surgieron requisitos que la expanden bastante. Decisiones ya
cerradas con el usuario, no volver a preguntar:

- **Simulación de partidos que no jugás vos:** resultado pseudo-aleatorio
  ponderado por `reputation`/`marketValue` de cada club. Nada más
  sofisticado por ahora.
- **Motor paralelo, no solo "tu liga":** TODAS las ligas/divisiones del
  juego corren su calendario y tabla en simultáneo semana a semana, sin
  importar en cuál estés jugando vos. Por qué: al transferirte a otra
  liga a mitad de temporada, "se mantienen los mismos datos y tablas, lo
  único que cambia es que ahora jugás para ese equipo" — la tabla de la
  liga nueva ya tiene que existir y venir corriendo de fondo, no se
  regenera de cero. El calendario global solo se reinicia al terminar la
  temporada (ver sincronización más abajo), dando paso al año siguiente.
- **Sincronización entre ligas de distinto tamaño:** temporada = número
  fijo de semanas igual para TODAS las ligas (ej. 38), sin importar
  cuántos equipos tenga cada una. Una liga con menos equipos que termina
  su vuelta ida-y-vuelta antes de llegar a esa semana global regenera un
  fixture nuevo (otra vuelta) para llenar el resto de la temporada. Esto
  es lo que permite sincronizar copas continentales y el ciclo de 4 años
  de los torneos de selecciones.
- **Copas continentales con clasificación real** (no más rival gigante
  random cada 3 semanas): Copa Libertadores para clubes de ligas
  sudamericanas (Conmebol) + **Copa Sudamericana** para los clubes que NO
  clasifican a Libertadores (segundo escalón, no se quedan afuera).
  Champions League y Europa League como competiciones SEPARADAS (no
  unificadas) para clubes de ligas europeas (UEFA): Champions para los
  mejores, **Europa League para los clubes europeos que no clasifican a
  Champions**.
- **Torneos de selecciones jugables:** Mundial, Copa América y Eurocopa,
  con periodicidad de cada 4 años (calculable ahora que hay semana fija
  por temporada). Si tu prestigio/nivel alcanza el umbral, te convocan a
  la selección de tu país (ver `NATIONAL_TEAMS_DATABASE` en `data.ts`) y
  jugás esos partidos con el mismo `MatchSimulator` existente, tratando a
  la selección como si fuera "tu club" esa semana/torneo.

**Orden de construcción interno acordado** (para no intentar todo de una,
siguiendo la regla de "una fase/incremento a la vez, verificado antes de
seguir"):
1. **1a — Motor de liga paralelo:** fixture + tabla real para todas las
   ligas/divisiones, simuladas en background, reemplaza la elección
   random de rival semanal por el fixture real de tu equipo. Tab "Tablas"
   en `Dashboard.tsx` muestra la tabla real. Sin copas ni selecciones
   todavía — esto es la base de la que depende todo el resto.
2. **1b — Copas continentales:** Copa Libertadores / Champions / Europa
   League con clasificación real por confederación, reemplazando el
   sistema actual de "cada 3 semanas, rival gigante random".
3. **1c — Torneos de selecciones:** Mundial / Copa América / Eurocopa
   jugables cada 4 años vía convocatoria, usando `NATIONAL_TEAMS_DATABASE`.

Este documento original de abajo (Fase 1 original más corta, Fase 2, Fase
3) sigue vigente tal cual para todo lo que no sea el punto 1.1, que quedó
reemplazado por lo de arriba.

---

## FASE 1 (ORIGINAL, ver revisión arriba) — La base

### 1.1 Calendario de liga + tabla de posiciones en vivo
**La pieza más grande de todo el roadmap.** Todo lo demás de "dificultad
según rival" y "panel social con reacciones a otros partidos" depende de
esto.

**Qué cambia:**
- `types.ts`: `TableTeam` ya existe pero no se usa — hay que darle uso real.
  Se necesita también un `Fixture` (o `MatchweekSchedule`): lista de
  partidos con `matchweek`, `homeTeamId`, `awayTeamId`, `played`,
  `homeGoals`, `awayGoals`.
- Al crear la carrera (`SetupScreen.tsx` → `handleFinishSetup`): generar el
  calendario completo ida y vuelta de la liga del club elegido (todos
  contra todos, doble rueda), y guardarlo en el estado de la carrera.
- Cada semana (`handleAdvanceWeek` en `App.tsx`): además de resolver TU
  partido, simular en resumen (sin pantalla propia, solo resultado) los
  partidos de esa fecha entre los demás equipos de tu liga, y actualizar
  la tabla (`TableTeam[]`) con puntos, PJ, G, E, P, GF, GC.
- Guardar la tabla y el calendario en el `localStorage` junto con el resto
  del save.

**Por qué primero:** sin esto, "mostrar la posición del rival antes del
partido" y "tabla actualizada en Copas y Tablas" no tienen datos reales
de dónde salir — hoy el rival se elige al azar de un pool, no de un
fixture.

---

## FASE 2 — Con el calendario ya andando

### 2.1 Dificultad según fuerza del rival + mostrar posiciones en el partido
- Antes de cada partido, mostrar en pantalla la posición en la tabla de tu
  equipo y del rival (ya calculado en 1.1).
- Un multiplicador de dificultad basado en esa posición (ej. rival puntero
  reduce tu ventana de éxito en las decisiones del partido), reusando el
  patrón que ya tenés pensado tipo `pressureMultiplier`.

### 2.2 Panel de redes sociales con reacciones a partidos ajenos
- Depende del calendario: cada fecha, generar 2-3 posts de "hinchas
  reaccionando" a los resultados de otros partidos de la jornada, no solo
  el tuyo. Contenido generado con plantillas, no requiere IA en vivo.

---

## FASE 3 — Contenido y sistemas que reusan lo que ya existe

Ninguno de estos necesita el calendario para funcionar, así que se pueden
hacer en paralelo o incluso antes si se prefiere variedad rápida.

### 3.1 Modo de creación "Jugador Veterano"
- Nueva opción en `SetupScreen.tsx`: edad inicial 32-35, atributos altos
  de arranque (en vez de los bajos actuales de "Juvenil").
- Cada fin de temporada (o cada N semanas) a partir de cierta edad: los
  atributos físicos bajan en vez de subir con el entrenamiento — invertir
  el signo de la función de progreso actual.
- Sistema de "reconversión de posición": UI para elegir cambiar de
  posición (ej. extremo → mediocampista), con reglas de qué atributos se
  conservan al cambiar.
- Condición de retiro forzado: chequeo semanal (similar al que ya existe
  para energía baja en `handleAdvanceWeek`) que termina la carrera si el
  jugador ya no es contratable.

### 3.2 Arquero con decisiones propias (sin minijuego de reflejos)
- Si `position === 'Arquero'`, el `MatchDecision` que se muestra durante
  el partido usa un set de opciones distinto (achicar / estirarse /
  quedarse parado / salir a cortar centro) en vez de las de jugador de
  campo.
- El éxito se calcula igual que las decisiones actuales: atributos del
  jugador + `pressureMultiplier` del rival, mismo patrón que ya existe,
  solo con otro pool de opciones.
- Fallar una decisión de arquero = gol en contra + posible golpe a
  `fans`/`mentalHealth` si se implementa 3.4 (blooper viral).

### 3.3 Vicios con consecuencias probabilísticas
- Nuevos eventos en `LOBBY_RANDOM_EVENTS` (o un pool aparte): salir de
  fiesta, fumar, tomar antes de un partido.
- Cada uno con una probabilidad de escándalo/consecuencia negativa (multa,
  caída de `prestige` o `fans`, penalización temporal a un atributo),
  usando el mismo patrón de `effects: { prestige, fans, energy, capital }`
  que ya tenés en `DecisionCenter`.

### 3.4 Vestuario y hinchada (usa `prestige` y `fans` ya existentes, sin campos nuevos)
- Egoísmo con la pelota (tirar en vez de pasar cuando el pase era mejor
  opción) — baja `prestige`. Por debajo de un umbral: menos asistencias
  probables en el próximo partido, o el DT te lo reclama en una pregunta
  de prensa/`DecisionCenter`. **No hace falta relación por compañero
  individual** — es un golpe al `prestige` general del vestuario, como se
  definió en la charla.
- Fallar una ocasión clara en un partido importante — mismo `prestige`,
  mismo tipo de evento de reclamo del DT.
- Hinchada: acciones que suman `fans` (buenos partidos, buena prensa) y
  que restan (autogoles, penales fallados, fiesta tras perder un clásico).
  Si `fans` cae por debajo de un umbral: la hinchada te "pita" (penalidad
  temporal a un atributo en el próximo partido) y se habilita/fuerza un
  botón de solicitar traspaso.

### 3.5 Salud mental (`mentalHealth`)
- Campo nuevo en `PlayerProfile` (`mentalHealth: number`, 0-100).
- Qué la baja: leer comentarios tóxicos en redes tras una eliminación,
  fallar un penal decisivo, rachas de derrotas.
- Qué la sube: buenos resultados, buena prensa, descansar en vez de
  entrenar/salir de fiesta.
- Qué afecta ella: en vez de "ralentizar reacciones" (no aplica, el juego
  es de decisiones, no de reflejos en tiempo real), que baje el % de
  éxito de las decisiones del próximo partido — mismo mecanismo que ya
  usás para otros modificadores.

### 3.6 Prensa más profunda
- Ampliar `PRESS_QUESTIONS_POOL` (ya es extensible, es contenido puro):
  más preguntas trampa, más ramas de polémica, preguntas sobre bajo nivel
  de compañeros o rumores de traspaso.
- Ninguna estructura nueva — mismo formato `PressQuestion` que ya existe.

### 3.7 Patrocinios casi infinitos
- Extender el patrón de `ShopItem` / marcas ya existente con muchas más
  marcas cotidianas y de TV (parodias), cada una con su propio efecto.
- Reglas simples de conflicto (no podés tener dos marcas de la misma
  categoría a la vez) usando validación sobre el array de patrocinios
  activos, sin sistema legal complejo.

### 3.8 Saludos de famosos en redes
- Si el rating del partido es muy alto, generar un post parodia de un
  famoso felicitándote, con un pequeño bonus de valor comercial.
  Contenido puro, mismo patrón que los posts sociales que ya existen.

### 3.9 Economía más dura
- Ajuste de números: bajar ingresos base y/o subir precios de la tienda
  y patrocinios. Tuning, no requiere cambios estructurales.

---

## Resumen de orden sugerido

1. **Fase 1** (calendario + tabla) — obligatorio primero, es la única
   dependencia dura del roadmap.
2. **Fase 3** en paralelo o inmediatamente después — todo reusa
   `prestige`/`fans`/`ShopItem`/`PressQuestion` ya existentes, así que se
   puede ir sumando de a partes sueltas sin romper nada.
3. **Fase 2** al final, porque necesita 1.1 funcionando para tener datos
   reales de qué mostrar.
