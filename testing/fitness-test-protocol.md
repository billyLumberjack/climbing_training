# Periodic Fitness Test Battery — Climbing

> Adapted from the SZ Performance "Test massimali 2.1" battery (coach protocol, 10.2.2025),
> refined against current climbing science (Giles 2021 finger-flexor Critical Force,
> Draper 2021 IRCRA test battery, Faggian 2024 determinants review — all in `/bibliografia`).
>
> **Purpose:** track physical fitness over time with reliable, comparable numbers.
> Retested on a fixed cadence, this battery shows whether training is working and flags
> regressions (e.g. pulling strength) or imbalances before they become problems.

---

## Ground rules (read every time — reliability depends on these)

These are what make numbers comparable across months. Do not improvise them.

| Variable | Fixed standard | Why |
|---|---|---|
| **Cadence** | Every **6–8 weeks**, ideally at each mesocycle boundary | Distinguishes training effect from noise; irregular testing (as in past logs: Nov'23 → Nov'24 → Feb'25) cannot |
| **State** | Rested (≥1 easy/rest day before), same time of day | Fatigue swings finger force by more than a real training adaptation |
| **Bodyweight** | Weigh pre-session, same clothing, not-fasted (never train fasted) | Relative loads depend on it |
| **Edge** | **20 mm** wooden edge, same board every time | 20–23 mm is the validated, most reliable/predictive standard |
| **Grip** | **Half-crimp** for all finger tests — thumb NOT engaged, ~90° at PIP | Locking one grip forever is what makes MVC7 comparable; half-crimp is the stronger performance discriminator |
| **Arm position (hangs)** | Arms extended overhead (~170–180° shoulder flexion), slight elbow bend, shoulders engaged ("in tenuta", elbow not locked/dead-hanging) | Standard MIFS position |
| **Loading** | Add weight via harness; unload via pulley when target < bodyweight | Lets you hit sub-bodyweight targets precisely |
| **Recovery** | Warm-up sets 1–2′ · intermediate 2–3′ · before a max attempt **4′**. Suspensions can be 30″–1′ shorter than pull-ups | From original protocol — keep |
| **Video** | Film pull-up tests | Lets a coach/agent audit execution technique |

**Pull-up technique (correct rep):** (1) lower sternum drives toward the bar, (2) shoulders move
away from the bar as you rise, (3) face stays behind the bar, in line with the spine.
Stop the test at the first load/rep where technique breaks.

---

## The tests

### 1. Bodyweight
Pre-session weigh-in, standard clothing. Records the denominator for every relative metric.

### 2. 3RM weighted pull-up *(kept as-is)*
3 max reps, pronated grip, added load. Warm up with progressively heavier sets; when a set
feels genuinely hard, round the estimated 3RM **down**, and test. Keep testing up in small
steps until technique fails. Record the last clean 3RM overload (kg added).
> *Kept deliberately: 3RM is safer and more repeatable for self-testing than the IRCRA 1RM.
> Note pull-up strength is only a moderate predictor of climbing — track it, don't over-weight it.*

### 3. AMRAP pull-ups *(kept as-is)*
Bodyweight, max clean reps. Done straight after the 3RM while warm.

### 4. MVC7 — max finger strength *(refined: grip now fixed)*
Max **7-second** half-crimp hang on the 20 mm edge. Warm up with 10–15″ hangs, approach with
8–10″ hangs at increasing load, then 7″ hangs to the max.
- **Must be confirmed:** repeat the top load a second time to make it official.
- Record **added/removed load** and **Total Load (CC)** = bodyweight ± overload.

### 5. RFD hang — rate of force development *(NEW — requires a load cell / Tindeq)*
On the 20 mm half-crimp, one hand, pull to max as **fast** as possible from rest; record peak
RFD (or force at 200 ms) from the device. *Skip if you have no load cell.*
> *Added because RFD is one of the clearest separators of elite vs sub-elite climbers and is
> exactly what a static max hang misses. Nearly free once a load cell is on hand for the CF test.*

### 6. Unilateral MVC7 — asymmetry check *(NEW — do at least occasionally)*
Same as MVC7 but **one hand at a time** (pulley-assisted as needed), left and right. Flag any
gap > ~10% between sides.
> *Added because bilateral hangs hide left/right imbalances that precede finger injuries.*

### 7. Finger-flexor Critical Force (CF) — fatigue resistance *(REPLACED — this is the big fix)*

> **Why replaced:** the old battery derived CF from multiple to-exhaustion bouts (80/60/45% CC)
> in one session with 15–20′ rest. In every past log the 45%/10-min anchor was skipped, so **no
> usable CF value was ever produced**, and the short rest contaminates later bouts.

**Preferred method — Giles single all-out test (needs a load cell):**
1. Standardized warm-up, incl. a few 7:3 hangs at ~50% and ~75% perceived max.
2. **4 minutes** of **7:3** repeaters (7″ max half-crimp pull : 3″ rest), one hand, max force
   *every* rep, with live force feedback on screen. No forearm shaking during rest.
3. From the trace:
   - **CF** = mean force of the **last 6 contractions** (last 60 s).
   - **W′** = force–time impulse **above** CF (kg·s); normalize per kg bodyweight.

**Fallback method — no load cell (weighted 7:3 to exhaustion):**
Same 7:3 repeater sets to failure at loads set from your confirmed MVC7 total load (CC),
biggest first, **full recovery between loads**:
- CC80% = CC(MVC7) × 0.80
- CC60% = CC(MVC7) × 0.60
- CC45% = CC(MVC7) × 0.45 → cap at 600″ (10′)

Record reps/time-to-exhaustion at each load.
> **Non-negotiable if you use the fallback: complete ALL THREE loads, every time.** An unfinished
> CF test (as in the historical logs) yields nothing. If a single session can't fit all three with
> real recovery, split across days rather than skip the 45% anchor.

### 8. Deadlift 1RM *(kept — optional general-strength anchor)*
Standard barbell 1RM. Not climbing-specific; retest less often (e.g. every 2nd battery).

---

## Fill-in table

Test 1–3 are the prior coach-battery rounds, carried across for continuity. **Test 4 is the
upcoming round** — fill its blank cells when you run it. Add a Test 5 column for the next one.
Units as shown; `—` = not done / not applicable that round.

| Metric | Test 1 | Test 2 | Test 3 | Test 4 |
|---|---|---|---|---|
| **Date** | 16.11.2023 | 17.11.2024 | 7.2.2025 | **2026-09-11 (planned)** |
| Mesocycle / context | — | — | — | Start of autumn on-sight 7a+ meso |
| Rested? (Y/N) | — | — | — | |
| **Bodyweight** (kg) | 65 | 64 | 63 | |
| **3RM pull-up** — overload (kg) | 29 | 22.5 | 24.5 | |
| **AMRAP pull-ups** (reps) | 15 | 12 | 15 | |
| **MVC7** — overload ± (kg) | +28 | +30.3 | +31.5 | |
| MVC7 — Total Load CC (kg) | 93 | 94.3 | 94.5 | |
| MVC7 — relative (%BW) | 143% | 147% | 150% | |
| MVC7 confirmed? (Y/N) | — | — | — | |
| **RFD** peak (N/s or device unit) | — | — | — | |
| **Unilateral MVC7 L** (kg CC) | — | — | — | |
| **Unilateral MVC7 R** (kg CC) | — | — | — | |
| L/R asymmetry (%) | — | — | — | |
| **CF** (kg) *[all-out]* | — | — | — | |
| **W′** (kg·s, /kg BW) *[all-out]* | — | — | — | |
| CC80% load / time-to-exhaustion *[fallback]* | 74.4 / 2′ (12 rep) | 75.4 / 1′40″ (10 rep) | 75.6 / (10 rep) | |
| CC60% load / time-to-exhaustion *[fallback]* | 55.8 / 5′30″ (33 rep) | 56.6 / 3′40″ (22 rep) | 56.7 / (23 rep) | |
| CC45% load / time (cap 10′) *[fallback]* | 41.85 / not done | not done | not done | |
| **Deadlift 1RM** (kg) | — | — | 46.3 | |
| Notes / video links | | | | |

Trends across Test 1→3: **MVC7 rising steadily** (28 → 31.5 kg; 143% → 150% BW — good), **3RM
pull dropped then partly recovered** (29 → 22.5 → 24.5 kg — watch pulling strength), bodyweight
**drifting down** (65 → 63 kg — flatters the relative numbers). CF was never completed in any
round (45% anchor always skipped) — the refined protocol fixes that for Test 4 onward.

---

## Glossary

- **CC / Total Load** — bodyweight + overload (or − unload). All loads normalized to this.
- **Overload / Scarico** — kg added to / subtracted from bodyweight.
- **MVC7** — Maximal Voluntary Contraction held 7 s on the chosen edge.
- **CF** — Critical Force: the force asymptote that fatigue resistance settles to.
- **W′** — work capacity available *above* CF (the "battery" for hard, above-threshold efforts).
- **RFD** — Rate of Force Development: how fast you reach force (contact-strength / recruitment speed).
- **AMRAP** — As Many Reps As Possible.
