# La medición de partida

Dónde termina una carrera **antes** de que existan las mecánicas de vida
([`OCHO_MECANICAS_DE_VIDA.md`](OCHO_MECANICAS_DE_VIDA.md)). Sin esta vara, cuando algo se
desbalancee no va a haber forma de saber si lo rompió una mecánica nueva o ya venía así — y peor,
cuál de las mecánicas fue.

Medido el 5 de septiembre de 2026, con el árbol en `ec1741a`, antes de tocar nada.

---

## 1. El prestigio por partido (`npm run medir:balance`)

Coincide con lo que ya estaba documentado en el propio script después del rebalanceo, así que la
base no se movió:

| | por partido | de 50 a 100 |
|---|---|---|
| juvenil flojo (55) | +0.77 | 65 partidos |
| jugador promedio (70) | +2.11 | 24 partidos |
| Delantero / Mediocampista / Defensor / Arquero | +2.07 / +2.32 / +2.06 / +2.48 | 25 / 22 / 25 / 21 |

Y la decisión del partido sigue teniendo tensión real: ganando 1-0 la conservadora y la arriesgada
pagan casi igual (+2.35 contra +2.39), y perdiendo 0-1 la arriesgada paga bastante más (+2.96 contra
+2.16). O sea que el partido pide cosas distintas según cómo va, que es el punto.

---

## 2. La carrera larga, 12 temporadas (`npx vite-node scripts/jugar_carrera_larga.ts "Junior de Barranquilla" 12`)

```
  T 1 · 18a ·  0T/38B ·  1g · vest  59 · pres 35(-7) · atr 64
  T 2 · 19a ·  9T/29B · 12g · vest 100 · pres 76     · atr 66
  T 3 · 20a · 34T/ 4B · 26g · vest 100 · pres 98     · atr 70
  T 4 · 21a · 38T/ 0B · 35g · vest 100 · pres 97     · atr 74
  T 5..12   · 38T/ 0B · 22 a 43g · vest 100 · pres 100 · atr 78 -> 99

   390 partidos · 357 goles · 493 asistencias
   385 de titular · 71 en el banco · 3 veces te sacó el técnico por jugar mal
   22 lesiones · 66 fechas afuera · 0 secuelas
   atributos finales: todo en 99
```

**Lo que dice esta tabla, y es la razón de ser de la mitad de las ocho mecánicas: a partir de la
temporada 4 no vuelve a pasar nada.** 38 titularidades de 38, ocho temporadas seguidas, con el
vestuario y el prestigio clavados en 100 y los atributos subiendo solos. En 390 partidos el técnico
lo sacó por jugar mal **tres veces**.

---

## 3. Las barras, al cerrar (`npm run jugar:ui`, Junior, 3 temporadas)

El banco que juega la app de verdad, a clicks. Llega hasta la mitad de la tercera temporada (tope de
vueltas del bucle), 141 partidos:

```
  edad 19 · 141 partidos · 97 goles · 39 asistencias · 2 titulos
  capital $189.225 · prestigio 100 · hinchada 100 · energia 5
  salud mental 63 · entorno 48
```

**Las cuatro barras no están en el mismo lugar, y eso decide dónde puede pegar cada mecánica:**

| barra | termina en | margen que queda |
|---|---|---|
| hinchada | **100** (techo) | sólo puede BAJAR. Cualquier premio en hinchada se pierde contra el tope |
| energía | **5** (piso) | sólo puede SUBIR. Una mecánica que "cuesta energía" no se va a sentir: ya no hay |
| salud mental | 63 | margen para los dos lados |
| entorno | 48 | margen para los dos lados, y es la barra más libre de las cuatro |

Dos consecuencias directas para lo que viene:

1. **La sequía de gol se calibró contra esto.** Como la hinchada vive en el techo, un rebote que
   sume no se siente; lo único que se siente es el castigo. Por eso la cuenta de la temporada tiene
   que quedar en rojo para el que no marca y en cero para el que marca, y no al revés. Ver
   `validar:sequia`, sección E.
2. **Fiesta y entorno no pueden apoyarse en la energía.** "Ir a la fiesta te baja la energía" no es
   un costo si la energía ya está en 5. Esas dos tienen que cobrarse en `entorno` y en salud mental,
   que son las que tienen recorrido.

Y el ritmo de gol de referencia: **0,69 goles por partido** en el banco de UI y **0,92** en la
carrera larga. A ese ritmo la sequía no se dispara nunca, que es lo correcto — se dispara cuando el
jugador está fallando, no como impuesto de fondo.

---

## Cómo repetir la medición

```
npm run medir:balance
npx vite-node scripts/jugar_carrera_larga.ts "Junior de Barranquilla" 12
node scripts/ui/correr.mjs "Junior de Barranquilla" Colombiana 3
```

El tercero tarda unos 12 minutos y es el único que reporta las cuatro barras. Reportarlas fue parte
de esta medición: `correr.mjs` mostraba capital, prestigio, hinchada y energía, y le faltaban
justamente **salud mental y entorno**, que son las dos que más van a mover estas mecánicas.
