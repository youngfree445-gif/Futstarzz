# -*- coding: utf-8 -*-
"""Saca el ranking de Opta del bundle de dataviz.theanalyst.com.

Los datos vienen EMBEBIDOS en el index.js (17 MB), no por una API: cada equipo es un objeto con
rank / contestantName / currentRating / domesticLeagueName / association. Se buscan los objetos por
su forma y se parsean de a uno, contando llaves -- un regex sobre 17 MB de JS minificado no cierra
bien los objetos anidados.
"""
import io, json, re, sys

RUTA = "/tmp/dv.js" if len(sys.argv) < 2 else sys.argv[1]
SALIDA = r"C:/Users/camil/AppData/Local/Temp/claude/c--Users-camil-Downloads-futbol-star---calcio-manager-2026--1-/eafc62dc-91f0-47b6-b8b1-f8f69bc62404/scratchpad/opta.json"

s = io.open(RUTA, encoding="utf-8").read()

equipos = []
# Cada entrada arranca con {"rank": N,"contestantId":"...
for m in re.finditer(r'\{"rank":\d+,"contestantId":"', s):
    ini = m.start()
    prof = 0
    fin = None
    for i in range(ini, min(ini + 4000, len(s))):
        c = s[i]
        if c == '{':
            prof += 1
        elif c == '}':
            prof -= 1
            if prof == 0:
                fin = i + 1
                break
    if fin is None:
        continue
    try:
        o = json.loads(s[ini:fin])
    except Exception:
        continue
    equipos.append(o)

# Puede haber duplicados si el bundle trae la tabla mas de una vez.
vistos = {}
for e in equipos:
    cid = e.get("contestantId")
    if cid and cid not in vistos:
        vistos[cid] = e
lista = sorted(vistos.values(), key=lambda x: x.get("rank", 99999))

print(f"objetos encontrados: {len(equipos)}  ->  unicos: {len(lista)}")
if lista:
    print("campos:", sorted(lista[0].keys()))
    print("primeros 5:")
    for e in lista[:5]:
        print(f'  {e.get("rank"):>4}  {e.get("contestantName","?"):<28} {e.get("domesticLeagueName","?"):<22} {e.get("currentRating",0):.1f}')
    print("ultimos 3:")
    for e in lista[-3:]:
        print(f'  {e.get("rank"):>4}  {e.get("contestantName","?"):<28} {e.get("domesticLeagueName","?"):<22} {e.get("currentRating",0):.1f}')
    paises = {}
    for e in lista:
        paises[e.get("association", "?")] = paises.get(e.get("association", "?"), 0) + 1
    print(f"paises distintos: {len(paises)}")
    io.open(SALIDA, "w", encoding="utf-8").write(json.dumps(lista, ensure_ascii=False, indent=1))
    print("guardado en opta.json")
