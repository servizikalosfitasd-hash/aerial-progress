## Obiettivo
Sostituire le immagini delle skill nel progetto con le 10 immagini brandizzate "A.S.D KALOS Fit" caricate in chat, mantenendo gli stessi nomi file in `src/assets/` così che gli import in `src/data/skills.ts` continuino a funzionare senza modifiche al codice.

## Mappatura upload → file di destinazione

| Immagine caricata | File sostituito in `src/assets/` | Skill |
|---|---|---|
| `Fontlever.jpg.jpeg` | `skill-front-lever.jpg` | Front Lever |
| `Planche.jpg.jpeg` | `skill-planche.jpg` | Planche |
| `human_flag.jpg.jpeg` | `skill-human-flag.jpg` | Human Flag |
| `ironcross.jpg.jpg` | `skill-iron-cross.jpg` | Iron Cross |
| `impossible_dips.jpg.jpeg` | `skill-impossible-dips.jpg` | Impossible Dips |
| `Hefesto.jpg.jpeg` | `skill-hefesto.jpg` | Hefesto |
| `Handstand.jpg.jpeg` | `skill-handstand.jpg` | Handstand |
| `Backlever.jpg.jpeg` | `skill-back-lever.jpg` | Back Lever |
| `Muscleupanelli.jpg.jpeg` | `skill-muscle-up-rings.jpg` | Muscle Up agli Anelli |
| `Muscleupsbarra.jpg.jpeg` | `skill-muscle-up-bar.jpg` | Muscle Up alla Sbarra |

## Skill NON coperte dagli upload (restano invariate)
- `skill-pull.jpg` (Pull)
- `skill-push.jpg` (Push)
- `skill-manna.jpg` (Manna)
- `skill-press-handstand.jpg` (Press Handstand)

Se vuoi sostituire anche queste, caricale in un messaggio successivo.

## Note tecniche
- Le immagini caricate hanno proporzioni circa 4:3 o 1:1, mentre le card usano `aspect-[4/5]` con `object-cover` → il crop centrale taglierà parte sinistra/destra del logo "KALOS". Funzionerà comunque, ma il logo potrebbe risultare parzialmente visibile.
- Nessuna modifica al codice TypeScript: gli import in `src/data/skills.ts` restano identici perché sostituiamo i file mantenendo i nomi.
- Operazione: `code--copy` da `user-uploads://` a `src/assets/<nome-esistente>.jpg` per ciascuna delle 10 coppie.

## Risultato
Tutte le card delle 10 skill principali mostreranno le nuove immagini brandizzate Kalos Fit. Le 4 skill rimanenti continueranno a usare le immagini attuali finché non fornirai le nuove.
