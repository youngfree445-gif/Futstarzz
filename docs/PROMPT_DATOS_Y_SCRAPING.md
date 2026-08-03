# Prompt de datos y scraping — Fut Starzz

**Cómo usarlo:** pegale a Claude el enlace de este archivo (o su contenido) cuando vayas a pedirle
trabajo de datos. Está escrito para que no se repitan errores que ya costaron sesiones enteras.

---

## 0. Las cinco reglas que no se negocian

1. **Solo datos reales y actualizados a hoy.** Nada inventado, nada "aproximado", nada de memoria.
   Si un dato no se consigue, se dice — no se rellena con algo plausible.
2. **Los homónimos se resuelven por ID, jamás por nombre.** Ver §3. Esto ya rompió el juego dos
   veces.
3. **ESPN primero para calendarios; Transfermarkt para planteles** y para lo que ESPN no tenga o
   tenga desactualizado. Ver §2.
4. **Cada competencia tiene su reglamento y no se mezclan.** Colombia ≠ Argentina ≠ el resto.
   Ver §4.
5. **Verificar antes de cantar victoria.** `tsc` no alcanza: hay que renderizar. Ver §6.

---

## 1. Cómo se scrapea (recetas que YA funcionan)

### ESPN — calendarios con fecha exacta

```
https://www.espn.com.co/futbol/equipo/calendario/_/id/<ID>   → próximos
https://www.espn.com.co/futbol/equipo/resultados/_/id/<ID>   → jugados
https://www.espn.com.co/futbol/equipo/plantel/_/id/<ID>      → plantel
https://www.espn.com.co/futbol/equipos/_/liga/<LIGA>         → IDs de la liga (col.1, arg.1, esp.1…)
```

Script listo: `scripts/scrape_espn_calendario.mjs`

**Trampas ya resueltas — no volver a tropezar:**

| Síntoma | Causa | Solución |
|---|---|---|
| 202 con cuerpo vacío | El `fetch` de Node lo toma por bot | Usar `curl` vía `execFile` |
| 202 con cuerpo vacío | UA que menciona Chrome | UA exactamente `Mozilla/5.0`, nada más |
| 0 bytes | `--compressed` sin soporte gzip | Sacar `--compressed` |
| Página sin datos | Slug derivado del nombre de data.ts | URL **sin slug**: solo `/_/id/<ID>` |
| "No hay `__espnfitt__`" | Regex hasta `</script>` | Recortar **contando llaves** (el JSON trae `</script>` escapado) |
| `undefined` en el torneo | `ev.league` es string, no objeto | Leerlo como string |
| Faltan partidos jugados | Solo se leyó una rama | Leer `content.fixtures.events` **y** `content.results.events` |

Rutas del payload: `page.content.fixtures.events`, `page.content.results.events`,
`page.content.squad.groups[].athletes[]`.

### Transfermarkt — planteles

```
https://www.transfermarkt.co/<slug>/startseite/verein/<ID>/saison_id/<AÑO>
```

**Mejor que ESPN para planteles** porque da la posición detallada (lateral izquierdo, pivote,
extremo derecho) en vez de las cuatro genéricas de ESPN.

Script listo y genérico: `scripts/actualizar_plantel_tm.mjs data/planteles_tm/<club>.json [--dry]`
→ Para un club nuevo alcanza con crear el JSON. **Correr siempre `--dry` primero.**

### X / Twitter — para tono de ChutSocial

La API pide pago (402), pero **`https://r.jina.ai/https://x.com/<cuenta>` sí devuelve los tuits**
con emoji y mayúsculas. Los tuits salen como líneas que empiezan con `*   [![`.
No todas las cuentas responden siempre: **reintentar**, en el segundo intento suelen salir.

### Si nada funciona

Decirlo derecho y pedir **capturas de pantalla** — se leen sin problema. Nunca inventar el dato.

---

## 2. Qué fuente usar para qué

| Dato | Fuente | Por qué |
|---|---|---|
| Calendario con fechas | **ESPN** | Trae fecha exacta, torneo, local/visitante, IDs |
| Plantel | **Transfermarkt** | Posiciones detalladas; ESPN solo da 4 genéricas |
| Club que ESPN tiene mal | **Transfermarkt** | Ej: recién ascendidos que ESPN sigue listando en Segunda |
| Reglamentos | **Sitio oficial** (Dimayor, AFA/LPF) + prensa para confirmar el año en curso | Los formatos cambian entre temporadas |

**ESPN falla con los recién ascendidos**: los deja en Segunda con el plantel vacío. Pasó con Cúcuta
y Jaguares. Ante un club sin datos en ESPN → Transfermarkt.

---

## 3. Homónimos — la regla que ya se rompió dos veces

**Nunca emparejar clubes ni jugadores por nombre. Siempre por ID.**

Casos reales que costaron caro:

- **Clubes**: hay 7 pares con el mismo nombre (Everton chileno/inglés, Liverpool uruguayo/inglés,
  Nacional uruguayo/paraguayo, Athletic brasileño/español, Leones FC colombiano/ecuatoriano,
  Universidad Católica chilena/ecuatoriana, Comunicaciones argentino/guatemalteco).
  El Everton de Chile llegó a alinear a los jugadores del inglés.
- **Jugadores**: emparejar por apellido unió a "Edwin Martínez" (lateral) con "Diego Martínez"
  (arquero) y le cambió la posición al arquero. Jaguares tiene **tres** Mosquera.

**Reglas:**
- Clubes → por `club.id`, y para desambiguar usar `resolverClubDeCalendario` con el torneo.
- Jugadores → nombre completo exacto, o apellido **+ algún nombre de pila coincidente**.
  Apellido solo, jamás.
- Al scrapear rivales → resolver por el **ID numérico de la fuente**, no por el texto.
- Después de importar, **verificar siempre**: 0 planteles compartidos, y la distribución de
  posiciones (ver §5).

---

## 4. Reglamentos — cada país el suyo

Documentados en `docs/`:
- `REGLAMENTO_COLOMBIA_2026.md` — Dimayor
- `REGLAMENTO_ARGENTINA_2026.md` — AFA / LPF

**Implementado** (`src/promocionDescenso.ts`):

| | Colombia | Argentina |
|---|---|---|
| Descienden | 2 | 4 |
| Criterio | **Promedio** (pts ÷ partidos), ventana 3 años | Tabla del año, sin promedio |
| Ascienden | 2 (campeón doble / líder anual / Gran Final / Repechaje) | 2 (Final a partido único + Reducido) |

**No mezclar nunca.** La puerta de entrada es `reglasDeLiga(league)`, que devuelve `null` para
cualquier liga sin reglamento cargado: así ninguna otra hereda reglas ajenas por accidente.

**Antes de implementar otra liga: buscar su reglamento vigente del año en curso.** Los formatos
cambian — en 2026 Argentina sumó cruces interzonales (36 fechas, no 18+18) y el Torneo BetPlay pasó
de 14 a 16 clubes. Documentarlo en `docs/` con las fuentes enlazadas.

---

## 5. Verificaciones obligatorias después de tocar datos

```
0 planteles compartidos entre clubes
0 días con más partidos de los reales
distribución de posiciones sana (¿hay laterales izquierdos? ¿2+ arqueros por club?)
medias dentro del rango de la liga (Colombia: 55-78, mediana 68)
los clubes sin plantel siguen siendo los mismos de antes (sin regresiones)
```

**Trampa de ESPN**: solo publica 4 posiciones (Goalkeeper/Defender/Midfielder/Forward). Mapearlas
directo dejó a **toda la liga con 5 laterales y ningún lateral izquierdo** — equipos imposibles de
parar en cancha. Hay que repartir posiciones concretas dentro de cada línea.

---

## 6. Cómo verificar la UI (tsc NO alcanza)

`tsc` y `vite build` **no atrapan** los `ReferenceError` por TDZ que dejan la pantalla en blanco.
Lo que sí funciona:

```bash
npx vite build --ssr <entry>.jsx --outDir <dir> --logLevel error
node <dir>/<entry>.js
```

Entry y outDir **dentro del repo** (fuera no resuelve `node_modules`).

Callejones ya recorridos, no repetir:
- `ssrLoadModule('react')` → `ERR_AMBIGUOUS_MODULE_SYNTAX`
- Importar React con el `import` de Node → dos copias, "Invalid hook call"

Datos para el mock: items de tienda = `INITIAL_LIFESTYLE_ITEMS`; selección Colombia = `wc_colombia`.

**Regla de oro:** calcular cualquier variable que use el JSX **arriba del componente**, nunca cerca
del JSX que la consume — el archivo tiene ~3700 líneas y el TDZ ya dejó la pantalla en blanco una vez.

---

## 7. LO QUE FALTA (estado real, medido el 2-ago-2026)

### 7.1 Calendario real — 151 de 643 clubes

Colombia y las cinco grandes de Europa ya tienen fechas reales (importadas de `ALLgames.json`,
ver §7.4). **El resto del mundo sigue con calendario generado.**

Ya con fechas: Colombiana 30, Inglesa 20, Italiana 20, Española 20, Alemana 18, Francesa 16.

| Liga | Clubes | Con plantel | Con fechas |
|---|---|---|---|
| Colombiana | 36 | 35 | **30** |
| Brasileña | 40 | 37 | 5 |
| Uruguaya | 16 | 10 | 4 |
| Ecuatoriana | 28 | 20 | 3 |
| Peruana | 19 | 16 | 3 |
| Mexicana | 33 | 32 | **0** |
| Holandesa | 17 | 13 | **0** |
| Portuguesa | 18 | 12 | **0** |

**Siguiente paso sugerido:** Argentina (ya tiene reglamento cargado). Ojo: Holanda, Portugal,
Brasil, MLS y Turquía **están en `ALLgames.json`** pero se descartaron porque menos del 70% de sus
clubes existen en el juego — primero hay que crear esos clubes, después el calendario entra solo.

### 7.2 Planteles genéricos — 82 clubes sin jugadores reales

Lazio, Atalanta, Ludogorets, Maccabi, Pafos, Kairat y varios sudamericanos. No están en
`playersDatabase.json` y **no aparecen en ninguna fuente ya cargada** → hay que scrapearlos de
Transfermarkt uno por uno.

Ligas con más agujeros: Resto del Mundo (18/30), Portuguesa (12/18), Chilena (24/32),
Ecuatoriana (20/28), Italiana (33/40).

### 7.3 Reglamentos sin implementar

- **Argentina**: falta modelar las **zonas** (dos grupos de 18) — hoy `LeagueSeasonState` asume una
  sola tabla por liga. También la Tabla General anual y el Reducido completo.
- **Resto de ligas**: ninguna tiene ascenso/descenso. Hay que buscar el reglamento vigente de cada
  una antes de tocar código.

### 7.4 JSON sin importar — OJO, no todo es basura

**Lección aprendida: "nadie lo importa" NO significa "no sirve".** Al revisarlos uno por uno
aparecieron datos valiosos que casi se borran.

**Tienen datos que SÍ sirven — no borrar:**

| Archivo | Contenido |
|---|---|
| `ALLgames.json` (70M) | **88.958 partidos con FECHA EXACTA** de Transfermarkt, hasta la temporada 2025/26. Incluye Premier, LaLiga, Serie A, Bundesliga y Ligue 1 completas — justo las ligas que no tenían fechas |
| `schedule_2026.json` (20K) | Calendario real del **Mundial 2026**, 72 partidos con fecha |
| `clubs.json` (488K) | 796 clubes con market value, squad size, edad promedio |
| `national_teams.json` (76K) | 124 selecciones con escudo y datos |

**Duplicado exacto — borrar sin riesgo:**
- `games.json` (70M) — mismo contenido que `ALLgames.json`, verificado registro a registro

**Descartables:**
- `world_cup.json` (8K) — historial de Mundiales viejos
- `fifa_ranking_2026-06-08.json` (44K) — ranking de un día puntual
- `competitions.json` (28K), `most_valuable_teams (1).json` (28K)

*(Verificar de nuevo antes de borrar: `grep -rl "<archivo>" src/` **y abrir el archivo**.)*

Además: `src/realCalendar.ts` (1.1 MB, el calendario **viejo por semanas**) y `src/realSchedule.ts`
siguen vivos porque los clubes sin fechas reales todavía los usan. **Se podrán borrar recién cuando
todas las ligas tengan fechas reales** — no antes.

### 7.5 Bugs conocidos

- El **cruce Libertadores/Superliga** se arregló varias veces; si reaparece, buscar **todos** los
  sitios que escriben `nextMatchOpponent` (hay 3) antes de tocar uno.
- Cinco cuentas de X no siempre devuelven tuits; reintentar.

---

## 8. Checklist antes de decir "listo"

- [ ] Los datos salen de una fuente real y verificable, y quedó anotada
- [ ] Homónimos resueltos por ID, no por nombre
- [ ] `tsc --noEmit` limpio
- [ ] Render SSR OK (§6)
- [ ] Sin regresiones: mismos clubes sin plantel que antes, 0 planteles compartidos
- [ ] Scratch files borrados del repo
- [ ] Desplegado a **los tres destinos**: `main` (Netlify) + `npm run deploy` (GitHub Pages) +
      `npm run cap:sync` (móvil)
- [ ] Verificado que el sitio en vivo sirve el build nuevo (comparar hash de `dist-ghpages/`)
