## Obiettivo
Allineare con precisione i pulsanti cliccabili (hotspot) della mappa anatomica ai cerchi indicati nell'immagine di riferimento, sia nella vista FRONT che in quella SIDE.

## Problema attuale
In `src/components/AnatomyMap.tsx`, le coordinate degli hotspot (array `HOTSPOTS`, righe 16-38) sono approssimative: spalle, gomiti, polsi, anche, ginocchia e caviglie risultano traslate di alcuni punti percentuali rispetto ai cerchietti effettivi disegnati sull'immagine `anat-map-blueprint.png`.

## Modifica
Aggiornare le coordinate `x/y` di ogni voce del solo array `HOTSPOTS` (nessun cambio di logica, struttura, JSX o stile). Niente altro viene toccato.

### Vista FRONT
```
cervicale            x: 28.4   y: 27.9
spalla dx            x: 15.7   y: 34.3
spalla sx            x: 39.8   y: 34.3
gomito dx            x: 10.4   y: 46.5
gomito sx            x: 45.5   y: 46.5
polso dx             x: 10.4   y: 56.4
polso sx             x: 45.5   y: 56.4
anca dx (hip)        x: 22.7   y: 57.5
anca sx (hip)        x: 32.7   y: 57.5
ginocchio dx         x: 22.7   y: 76.7
ginocchio sx         x: 32.7   y: 76.7
caviglia dx          x: 24.2   y: 94.0
caviglia sx          x: 32.0   y: 94.0
```

### Vista SIDE
```
cervicale            x: 74.1   y: 25.9
spine (thoracic)     x: 77.7   y: 37.7
spine (lombare)      x: 75.6   y: 49.5
anca (hip)           x: 74.1   y: 59.4
ginocchio            x: 77.7   y: 80.2
caviglia             x: 78.4   y: 94.0
```

## Note tecniche
- Le percentuali sono state misurate ritagliando l'immagine `src/assets/anat-map-blueprint.png` (704×1012) sui cerchietti verdi associati alle etichette.
- Il container usa `aspectRatio: 704 / 1004` con `object-cover`: lo scarto verticale dell'immagine reale (~1012 px) è < 1% quindi le coordinate restano valide.
- Dopo la modifica verifico visivamente in `/stability` che ogni cerchio pulsante coincida con il dot disegnato.
