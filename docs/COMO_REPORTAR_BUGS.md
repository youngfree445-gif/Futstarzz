# Cómo reportar un bug de Fut Starzz

Para arreglar un bug hacen falta dos cosas: **qué esperabas** (eso sólo lo sabés vos) y **el estado
de la partida** (eso lo saca el juego solo). Este documento es cómo conseguir la segunda.

---

## Por qué no sirve un servicio de errores

Sentry, LogRocket, Highlight y compañía capturan **excepciones**: el JavaScript revienta y llega el
stack trace. Los bugs de este juego casi nunca son eso.

De los cinco bugs encontrados el 17 de agosto de 2026, **ninguno tiró una excepción**:

| Lo que se veía | Lo que pasaba | ¿Excepción? |
|---|---|---|
| "no se jugaban las vueltas de los playoffs" | el calendario apartaba 3 fechas en vez de 6 | no |
| "decía Libertadores y entraba a Copa Colombia" | dos módulos contestaban distinto de quién era el día | no |
| "siempre me sale que fui eliminado" | un estado de React quedaba pegado | no |
| "cada vez me sale otro ganador del Balón de Oro" | el podio se recalculaba al mostrarlo | no |
| "el global no sale en las copas domésticas" | la continental se quedaba con los días de la nacional | no |

En los cinco el juego siguió funcionando y **hizo otra cosa**. Un stack trace no habría dicho nada,
porque no hubo stack. Lo que hace falta es el ESTADO.

---

## 1. El botón de adentro del juego (lo normal)

En la barra lateral del Dashboard, abajo de todo: **🐞 Reportar un bug**.

Abre un panel con una foto de la partida en ese momento:

- el paso de carrera, la fecha y el torneo en curso;
- **qué dice el calendario de ese día** (competición, si es una fecha reservada, si es de
  cuadrangular, y si hay más de un partido el mismo día);
- el estado guardado de cada copa continental, de la copa nacional y del cuadrangular, con la ronda,
  el cruce, la pierna y el global;
- los últimos 8 partidos registrados.

Tocás **Copiar** y lo pegás en el chat. **Agregá siempre qué esperabas que pasara** — el reporte dice
lo que el juego hizo, no lo que tendría que haber hecho.

El texto se muestra además de copiarse a propósito: en el celular y dentro de la app de Capacitor el
portapapeles a veces no está disponible, y con el texto a la vista siempre se puede seleccionar
a mano.

> Tocalo **en el momento**. La foto es del paso actual: si avanzás dos partidos, ya es otra.

---

## 2. Si se queda la pantalla en negro

No hace falta hacer nada especial: `PantallaDeError` atrapa la caída y ahora muestra **el mismo
reporte de estado más el stack trace**. Botón "Copiar detalle" y al chat.

Tu partida no se pierde: el guardado ocurre antes del dibujo de la pantalla.

---

## 3. Mandar la partida entera (para bugs que tardan en aparecer)

Cuando el bug se ve recién después de varias temporadas, lo que sirve es la partida completa:

1. Menú de inicio → tu ranura → **Exportar partida**. Sale un `.json`.
2. Pasame ese archivo.

Con eso se reconstruye tu carrera exacta, porque **el calendario es una función pura del nombre del
club**: las mismas fechas siempre, sin azar ni estado guardado. Lo que decidió tu juego en el paso 33
se puede volver a ver acá.

Para leerlo sin abrir el juego:

```
npm run revisar -- ruta\a\la\partida.json
npm run revisar -- partida.json 40      # además, 40 pasos alrededor del actual
```

Imprime el mismo reporte y, debajo, el calendario alrededor del paso actual. La mayoría de los bugs
de calendario se ven de un vistazo ahí: una ronda sin su vuelta, un día que le toca a dos torneos,
un cuadrangular partido entre dos semestres.

---

## 4. Antes de publicar: jugar la temporada de prueba

```
npm run jugar "Millonarios FC"
```

Juega una temporada entera contra el motor real -- calendario, copas, cuadrangulares -- y al final
exige desenlace en todas las competiciones. Cierra con una lista de **rarezas**; si dice "ninguna",
la temporada cerró limpia.

Es lo que delató el bug de los cuadrangulares antes de tocar una línea: *"el cuadrangular del
Apertura terminó SIN campeón"*.

Y `npm run lint` más los `npm run validar:*` (hay 20) para lo demás.

---

## 5. Errores de la gente que no te va a escribir (opcional)

El juego está publicado. Si a alguien que no seas vos se le queda la pantalla en negro, no te enterás
nunca: esa persona cierra y no vuelve.

`src/reporteRemoto.ts` manda esas caídas a Sentry, con el reporte de estado adjunto. **Viene apagado**
y sin DSN no descarga ni un byte del SDK (se comprobó: 0 chunks de Sentry en el build). Para
encenderlo:

1. Cuenta gratis en sentry.io → nuevo proyecto → plataforma **React**.
2. Copiar el DSN (`https://algo@oXXXX.ingest.sentry.io/YYYY`).
3. Ponerlo en `VITE_SENTRY_DSN`:
   - **Netlify**: Site settings → Environment variables.
   - **Local**: un archivo `.env` con `VITE_SENTRY_DSN=https://...`
4. Volver a compilar.

Sirve **sólo para caídas**. Los bugs de lógica siguen necesitando el botón de arriba.

---

## El resumen

| Situación | Qué hacer |
|---|---|
| Algo se ve raro y el juego sigue | 🐞 Reportar un bug → Copiar → pegar + qué esperabas |
| Pantalla en negro | Copiar detalle → pegar |
| Bug que aparece después de varias temporadas | Exportar partida → mandar el `.json` |
| Antes de publicar | `npm run jugar` + `npm run lint` |
