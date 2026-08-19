# Calendario Internacional Masculino de la FIFA, 2023-2030

Transcrito del PDF oficial (edición de **abril de 2026**), que es la fuente de las fechas de
selección. No está resumido ni interpretado: son las filas del documento tal cual.

**Dónde vive el documento** (ninguno de los dos links que se probaron primero lo tiene —
`inside.fifa.com/es/legal/documents` es sólo gobernanza, y `inside.fifa.com/es/tournament-organisation`
es la página institucional):

- Índice: <https://inside.fifa.com/tournament-organisation/international-match-calendars>
- PDF en español: <https://digitalhub.fifa.com/m/525cb3879ff3d44a/original/Men-s-International-Match-Calendar-2023-2030_ES.pdf>

---

## Lo que este documento SÍ resuelve

- **Las ventanas de partidos internacionales**, con fechas exactas hasta 2030. Son los días que el
  calendario del juego tiene que apartar para la selección.
- **La ventana del Mundial 2026: 11 de junio – 19 de julio.** Ya coincide con lo que usa el juego
  (`MUNDIAL_DESDE`/`MUNDIAL_HASTA` en `dateSchedule.ts`), así que ese dato estaba bien.
- **La forma del ciclo**, que es lo que hacía falta para modelar Copa América y Eurocopa: los
  torneos continentales de selecciones van en **junio/julio de los años pares que no son de
  Mundial**. Mundial 2026 → continentales 2028 → Mundial 2030.

## Lo que NO resuelve

**La Eurocopa y la Copa América 2028 figuran como "Junio/julio", sin días.** El IPC de abril de 2026
todavía no las fijó. Para reservarles días en el calendario alcanza — es una ventana de mes y medio,
igual que el Mundial — pero **no hay fixture partido por partido**, que para este proyecto siempre
salió de Transfermarkt, no de la FIFA.

---

## 2026

| Fechas | Tipo | Confederación | Máx. partidos |
|---|---|---|---|
| 21 dic 2025 – 18 ene 2026 | Copa Africana de Naciones | CAF | |
| 23-31 marzo | Ventana de partidos internacionales | Todas | 2 |
| 1-9 junio | Ventana de partidos internacionales \* | Todas | 2 |
| **11 junio – 19 julio** | **Copa Mundial de la FIFA 2026** | | |
| 21 septiembre – 6 octubre | Ventana de partidos internacionales | Todas | 4 |
| 9-17 noviembre | Ventana de partidos internacionales | Todas | 2 |

\* Reservada para amistosos de preparación del Mundial. El periodo de descanso y cesión del Mundial
empieza el **lunes 25 de mayo de 2026**, con excepciones hasta el 30 de mayo para quienes jueguen
finales de torneos de clubes de las confederaciones.

## 2027

| Fechas | Tipo | Confederación | Máx. partidos |
|---|---|---|---|
| 7 enero – 5 febrero | Copa Asiática (Arabia Saudí) | AFC | |
| 22-30 marzo | Ventana de partidos internacionales | Todas | 2 |
| 7-15 junio | Ventana de partidos internacionales | Todas | 2 |
| 19 junio – 11 julio | Copa Oro | Concacaf | |
| 19 junio – 17 julio | Copa Africana de Naciones | CAF | |
| 20 septiembre – 5 octubre | Ventana de partidos internacionales | Todas | 4 |
| 8-16 noviembre | Ventana de partidos internacionales | Todas | 2 |

## 2028

| Fechas | Tipo | Confederación | Máx. partidos |
|---|---|---|---|
| 20-28 marzo | Ventana de partidos internacionales | Todas | 2 |
| 29 mayo – 6 junio | Ventana de partidos internacionales \* | Todas | 2 |
| **Junio/julio** | **Eurocopa** | UEFA | |
| **Junio/julio** | **Copa América** | CONMEBOL | |
| Junio/julio | Copa de Naciones | OFC | |
| 18 septiembre – 3 octubre | Ventana de partidos internacionales | Todas | 4 |
| 13-21 noviembre | Ventana de partidos internacionales | Todas | 2 |

\* Reservada para partidos oficiales o amistosos de preparación de las fases finales continentales.

## 2029

| Fechas | Tipo | Confederación | Máx. partidos |
|---|---|---|---|
| 19-27 marzo | Ventana de partidos internacionales | Todas | 2 |
| 4-12 junio | Ventana de partidos internacionales | Todas | 2 |
| Junio/julio | Copa Oro | Concacaf | |
| 24 septiembre – 9 octubre | Ventana de partidos internacionales | Todas | 4 |
| 12-20 noviembre | Ventana de partidos internacionales | Todas | 2 |

## 2030

| Fechas | Tipo | Confederación | Máx. partidos |
|---|---|---|---|
| 18-26 marzo | Ventana de partidos internacionales | Todas | 2 |
| 3-11 junio | Ventana de partidos internacionales | Todas | 2 |
| Junio/julio | Copa Mundial de la FIFA 2030 | | |
| 23 septiembre – 8 octubre | Ventana de partidos internacionales | Todas | 4 |
| 11-19 noviembre | Ventana de partidos internacionales | Todas | 2 |

---

## Lo que cambia para el juego

La ventana de septiembre pasó a ser **de cuatro partidos y ~16 días** a partir de 2026 (antes eran
dos ventanas de dos partidos, septiembre y octubre). El juego reparte hoy los días de eliminatorias
por su cuenta; si alguna vez se quiere calcar el calendario real, ésta es la fila que cambia.
