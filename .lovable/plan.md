

## Goal
Replace the top "Livello attuale" card (which only shows the first/last group's progression) with a single row containing trophy badges for ALL groups (Isometria + Dinamico), so both current levels are visible at a glance.

## Changes (single file: `src/pages/SkillDetail.tsx`)

### 1. Top progress card — restructure the header
Currently lines 109–125 show a single trophy + `latestName` (which is overwritten by the loop on lines 41–45, ending up showing only the LAST group's value).

Replace with a single horizontal row of trophy "chips" — one per group — each showing:
- Trophy icon
- Group label (e.g. "Isometria" / "Dinamico")
- Current progression name (or "Non iniziata")

Layout sketch:
```text
┌──────────────────────────────────────────────────────────┐
│ [🏆 ISOMETRIA   ] [🏆 DINAMICO   ]      [Reset]         │
│  Tuck Front 50°    Pull up                               │
└──────────────────────────────────────────────────────────┘
```

On mobile the chips wrap; on `sm+` they sit side-by-side in a flex row.

### 2. Remove the now-redundant "Per-group current levels" grid (lines 127–152)
The new unified trophy row replaces it, so we delete that block to avoid duplication.

### 3. Keep the per-group banner inside each `ProgressionGroupBlock` (lines 237–251)
This stays — it provides context within each progression list section, as the user requested ("il livello attuale con il trofeo dev'essere sia per isometria che per dinamico in ogni sezione").

### 4. Remove the now-unused `latestName` computation (lines 41–45)

## Result
- Top card: ONE unified row with a trophy badge per group (Iso + Dinamico), each showing its own current progression. No more "only the first/last" bug.
- Each progression section below still has its own trophy banner showing that group's current level.
- Selection remains immediate (already fixed in previous turn via `currentIndex` prop).

