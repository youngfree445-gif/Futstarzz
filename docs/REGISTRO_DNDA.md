# Documentación para el registro de soporte lógico ante la DNDA

Material preparado para completar el formulario de **Registro de Soporte Lógico
(Software)** de la Dirección Nacional de Derecho de Autor de Colombia.

> Este documento reúne la información técnica que exige el formulario. No es el
> trámite en sí: hay que transcribirlo o adjuntarlo en la plataforma de la DNDA.

---

## DATOS GENERALES DE LA OBRA

| Campo del formulario | Valor |
|---|---|
| **Título de la obra** | Fut Starzz |
| **Tipo de obra** | Soporte lógico (software) |
| **Clase de obra** | Obra originaria e individual |
| **Año de creación** | 2026 |
| **Primera publicación** | 2026, Colombia (distribución web gratuita) |
| **País de origen** | Colombia |
| **Carácter** | Inédito en cuanto a su código fuente; publicado en cuanto a su ejecución |

### Autor y titular

| Campo | Valor |
|---|---|
| **Nombre del autor** | *(completar con nombre completo como aparece en la cédula)* |
| **Documento de identidad** | *(completar)* |
| **Nacionalidad** | Colombiana |
| **Domicilio** | *(completar)* |
| **Correo electrónico** | youngfree445@gmail.com |
| **Titular de los derechos patrimoniales** | El mismo autor (obra por cuenta propia, sin encargo ni relación laboral) |

**Declaración de autoría:** el código fuente, la arquitectura, la lógica de
simulación y los textos originales fueron escritos por el autor mediante
decisiones libres y creativas propias.

---

## 1. DESCRIPCIÓN BREVE DE LAS FUNCIONES PRINCIPALES

**Fut Starzz** es un videojuego de simulación de carrera deportiva que permite al
usuario crear un futbolista ficticio y dirigir su trayectoria profesional
completa, desde el debut hasta el retiro, a lo largo de múltiples temporadas.

Funciones principales del programa:

1. **Creación de personaje.** El usuario define nombre, posición, edad,
   nacionalidad, dorsal, altura, superstición personal y club inicial. El
   programa calcula los atributos iniciales según posición y edad.

2. **Simulación de partidos con decisiones.** Durante cada encuentro el programa
   narra el desarrollo minuto a minuto y presenta al usuario situaciones de juego
   con opciones. El resultado de cada decisión se resuelve probabilísticamente
   según los atributos del personaje, su energía, su salud mental y el nivel del
   rival.

3. **Motor de competiciones en paralelo.** El programa simula simultáneamente el
   calendario y la tabla de posiciones de todas las ligas y divisiones incluidas,
   con independencia de en cuál compita el usuario, además de copas continentales
   y torneos de selecciones.

4. **Gestión de la vida profesional.** Entrenamiento de atributos, negociación de
   traspasos, contratos con patrocinadores, adquisición de bienes con efecto en el
   juego, conferencias de prensa y una red social simulada.

5. **Sistema de relaciones y estado.** El programa mantiene cuatro métricas
   interdependientes (prestigio ante el club, conexión con la afición, salud
   mental y energía) que se afectan mutuamente y condicionan el rendimiento.

6. **Envejecimiento y relevo generacional.** Los personajes envejecen entre
   temporadas, sufren declive físico, se retiran y son reemplazados por jugadores
   juveniles generados por el programa.

7. **Persistencia local.** El estado completo de la partida se guarda en el
   dispositivo del usuario, sin servidores ni transmisión de datos.

---

## 2. ESTRUCTURA DEL CÓDIGO: MÓDULOS, CLASES Y FUNCIONES

### 2.1. Datos generales

| Concepto | Detalle |
|---|---|
| **Lenguaje** | TypeScript |
| **Paradigma** | Programación funcional con componentes declarativos |
| **Framework de interfaz** | React 19 |
| **Herramienta de construcción** | Vite |
| **Empaquetado móvil** | Capacitor (Android e iOS) |
| **Extensión aproximada** | ~76.000 líneas de código de autoría propia |
| **Módulos principales** | 25 archivos fuente |

### 2.2. Módulos y su responsabilidad

#### Núcleo de simulación

**`leagueEngine.ts`** (~1.760 líneas) — Motor de competiciones. Es el módulo
central del programa. Expone 51 elementos públicos (funciones, constantes e
interfaces), entre los que destacan:

| Función | Responsabilidad |
|---|---|
| `getOrCreateLeagueSeason` | Crea o recupera el estado de una temporada de liga |
| `simulateMatch` | Resuelve un partido entre dos clubes |
| `simulatePenaltyShootout` | Resuelve una definición por penales |
| `sortTable` | Ordena la tabla de posiciones con criterios de desempate |
| `getOrCreateApeturaClausuraSeason` | Gestiona ligas con formato de dos torneos semestrales |
| `resolveApeturaClausuraWeek` | Avanza una semana en ese formato |
| `generateLeagueLeadersFromTable` | Deriva estadísticas individuales de la tabla |
| `getSeasonYear`, `leagueKeyFor` | Utilidades de calendario e identificación de liga |

**`worldRetirements.ts`** (~253 líneas) — Envejecimiento y relevo generacional.
Contiene la curva de probabilidad de retiro por edad, el generador de jugadores
juveniles con nombres coherentes por región geográfica, y la resolución de
edades a partir de múltiples fuentes con índice de respaldo.

**`nationalTeamDuty.ts`** — Convocatorias a selección nacional y su costo en la
relación con el club.

**`realCalendar.ts` / `realSchedule.ts`** — Calendario de fechas y correspondencia
entre las semanas de juego y fechas reales.

#### Estado y orquestación

**`App.tsx`** (~2.180 líneas) — Componente raíz. Concentra el estado de la
partida y la lógica de transición entre temporadas. Funciones destacadas:

| Función | Responsabilidad |
|---|---|
| `applySeasonTransitions` | Orquesta todos los efectos del cambio de temporada |
| `applyAgingIfNewSeason` | Envejecimiento y declive físico |
| `applyWorldRetirementsIfNewSeason` | Retiros de otros jugadores |
| `freezeSeasonLeadersIfNewSeason` | Congela el palmarés de cada temporada |
| `applyMentorshipIfNewSeason` | Resuelve la mentoría de juveniles |
| `resolveRetirementCheckpoint` | Decisión de retiro del usuario |
| `recordSeasonHistory` | Registra el historial de carrera |

**`types.ts`** (~378 líneas) — Definición de las estructuras de datos del
programa: `PlayerProfile`, `Club`, `LeagueSeasonState`, `TableTeam`, `Fixture`,
`MatchDecision`, `SeasonHistory`, `CupState`, entre otras.

#### Interfaz de usuario

| Módulo | Líneas | Función |
|---|---|---|
| `Dashboard.tsx` | ~3.390 | Panel principal: carrera, plantilla, red social, prensa, traspasos, tienda, tablas |
| `MatchSimulator.tsx` | ~2.260 | Simulación interactiva del partido con narración y decisiones |
| `SetupScreen.tsx` | ~585 | Creación del personaje |
| `MusicPlayer.tsx` | ~355 | Reproductor de música ambiental |
| `PostMatch.tsx` | ~290 | Resumen posterior al partido |
| `WelcomeScreen.tsx` | ~286 | Pantalla inicial y gestión de partidas guardadas |
| `InteractivePenaltyShootout.tsx` | ~268 | Definición por penales jugable |
| `DecisionCenter.tsx` | ~149 | Presentación de decisiones dentro del partido |
| `CareerSummary.tsx` | ~126 | Resumen de carrera al retirarse |
| `SoundSettings.tsx` | ~122 | Configuración de audio |

#### Datos y utilidades

| Módulo | Función |
|---|---|
| `data.ts` | Base de clubes, competiciones, preguntas de prensa, artículos de tienda y logros |
| `audio.ts` | Gestión de efectos de sonido |
| `clubTheme.ts` | Aplicación dinámica de los colores del club a la interfaz |
| `leagueDisplay.ts` | Presentación de nombres de ligas y copas |
| `musicPlaylist.ts` | Lista de reproducción musical |

---

## 3. PROCEDIMIENTOS ÚNICOS O INNOVADORES

Elementos que constituyen aporte original del autor:

### 3.1. Motor de ligas en ejecución paralela

A diferencia de la aproximación habitual —simular únicamente la competición del
usuario— el programa mantiene simultáneamente el estado completo de **todas** las
ligas y divisiones. Cada una avanza su calendario y su tabla semana a semana con
independencia de dónde compita el usuario.

Esto permite que, al transferirse a otra liga a mitad de temporada, el usuario se
incorpore a una competición **ya en curso**, con su tabla e historial coherentes,
en lugar de a una liga regenerada desde cero.

### 3.2. Sincronización entre ligas de distinto tamaño

Las ligas incluidas tienen entre 12 y 38 clubes, por lo que sus calendarios
tienen duraciones naturales distintas. El programa las sincroniza en una duración
común de temporada: las ligas que completan su rueda antes del cierre generan un
fixture adicional para cubrir el resto. Esto es lo que permite coordinar copas
continentales y el ciclo cuatrienal de los torneos de selecciones.

### 3.3. Derivación determinística de estadísticas individuales

El programa no genera números aleatorios sueltos para las estadísticas de
jugadores: **reparte los goles y tarjetas reales de cada club** entre su plantilla
según ponderaciones por posición táctica, escalando con los partidos disputados.
El mismo estado de tabla produce siempre el mismo resultado, y la suma repartida
nunca excede lo que el club efectivamente anotó.

### 3.4. Resolución de identidad de jugadores entre fuentes heterogéneas

Un mismo jugador aparece con denominaciones distintas según la fuente de datos.
El programa implementa una resolución en tres niveles: coincidencia exacta,
índice de respaldo por apellido normalizado (sin acentos ni sufijos de posición),
y finalmente una función hash estable del nombre. Ante colisión de apellidos, el
criterio de desempate se elige según la consecuencia del error en cada uso.

### 3.5. Sistema de decisiones con multiplicadores interdependientes

El éxito de cada decisión dentro del partido se calcula combinando los atributos
del personaje con su energía, salud mental, fatiga acumulada y ritual personal.
Estas variables se afectan entre sí, de modo que el estado del personaje fuera de
la cancha condiciona su rendimiento dentro de ella.

### 3.6. Generación de relevo generacional con coherencia regional

Al retirarse un jugador, el programa genera su reemplazo con un nombre coherente
con el país del club (listas por región elaboradas por el autor), edad de
promoción de inferiores y verificación de no colisión con la plantilla existente.
La generación es determinística por temporada y club: la misma partida produce
siempre los mismos juveniles.

---

## 4. DECLARACIONES IMPORTANTES

### 4.1. Ausencia de contenido generado por inteligencia artificial

El código fuente, los textos de la interfaz, la narración de partidos, las
preguntas de prensa y las listas de nombres son producto de **decisiones libres y
creativas del autor**. El programa no incorpora imágenes, textos ni música
generados por sistemas de inteligencia artificial como obra propia.

Esto es relevante porque la normativa colombiana exige que la obra registrada sea
resultado de la creación humana.

### 4.2. Elementos de terceros no incluidos en el registro

El registro recae **exclusivamente** sobre el código fuente, la arquitectura y los
textos originales del autor. **No se reclama titularidad** sobre:

- Nombres, escudos, logotipos ni signos distintivos de clubes de fútbol.
- Nombres de futbolistas, entrenadores, periodistas ni otras personas reales.
- Nombres de ligas, competiciones o federaciones.
- Bibliotecas de terceros utilizadas (React, Vite, Capacitor, entre otras), cada
  una bajo su propia licencia de software libre.
- Datos deportivos de terceros empleados con finalidad referencial.

### 4.3. Alcance de la protección

Conforme al régimen colombiano, el derecho de autor protege la **expresión** —el
código y los textos tal como fueron escritos— y **no las ideas ni las reglas de
juego** subyacentes. El término de protección comprende la vida del autor y
**80 años** adicionales.

---

## 5. MATERIAL A ADJUNTAR EN EL TRÁMITE

La DNDA solicita una muestra del código fuente. Recomendación de qué presentar:

1. **Primeras y últimas 10 páginas del código fuente**, formato habitualmente
   aceptado. Sugerencia de archivos representativos:
   - `src/leagueEngine.ts` (motor de simulación)
   - `src/types.ts` (estructuras de datos)
   - `src/worldRetirements.ts` (relevo generacional)
2. **Este documento** como memoria descriptiva.
3. Manual de usuario, si se elabora.

---

# ANEXO — Registro de marca ante la SIC

El nombre **Fut Starzz** **no** se protege por derecho de autor. Para protegerlo
hay que registrarlo como marca ante la **Superintendencia de Industria y
Comercio**, en trámite independiente.

## Datos para ese trámite

| Campo | Valor sugerido |
|---|---|
| **Signo a registrar** | Fut Starzz |
| **Tipo de signo** | Nominativo (solo el nombre) o mixto (nombre + logotipo) |
| **Clase de Niza** | **Clase 9** — software y programas de videojuegos descargables |
| **Clase adicional** | **Clase 41** — servicios de entretenimiento y videojuegos en línea |
| **Titular** | *(nombre completo y cédula del autor)* |

## Pasos

1. **Búsqueda de antecedentes** en la base de datos de la SIC, para verificar que
   no exista una marca idéntica o confundible en las mismas clases. Se recomienda
   antes de pagar la tasa.
2. **Presentación** por la plataforma en línea (SIPI) de la SIC.
3. **Pago de la tasa oficial**, por clase solicitada.
4. **Publicación** en la Gaceta de Propiedad Industrial, con plazo para oposiciones
   de terceros.
5. **Decisión.** De concederse, la marca dura **10 años** renovables
   indefinidamente.

## Advertencia

Registrar la marca protege el nombre del juego, pero **no legitima el uso de
marcas ajenas** (escudos y nombres de clubes). Son cuestiones independientes: la
primera es un derecho propio, la segunda un riesgo que se administra con la
declaración de no afiliación y el procedimiento de retirada previstos en
`docs/LEGAL.md`.

---

## Estado de los trámites

| Trámite | Estado |
|---|---|
| Registro de soporte lógico (DNDA) | **Pendiente** — documentación lista |
| Registro de marca (SIC) | **Pendiente** — no iniciado |
| Aviso legal publicado | ✅ Completado (`docs/LEGAL.md`) |

**Nota:** el derecho de autor sobre el código **nace con la creación**, sin
necesidad de registro. El registro ante la DNDA no crea el derecho: aporta prueba
de autoría y fecha cierta, lo que facilita defenderlo. La marca, en cambio, **sí**
requiere registro para existir como tal.
