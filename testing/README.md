# `testing/` — Periodic Fitness Test Battery

Documentation for future agents working with this folder.

## What this folder is

A standardized, periodically-repeated **physical fitness test battery** for the athlete,
used to monitor training adaptation over time. It is the measurement counterpart to the
training performed under `hangboard/`, `physical/`, and `climbing/`.

## Files

| File | Role |
|---|---|
| `fitness-test-protocol.md` | The protocol itself: ground rules, test descriptions, and a fill-in results table. This is the source of truth for **how** to run the tests and **where** to record them. |
| `README.md` | This file — orientation for agents. |

The original coach document (`Test massimali 2.1 - 10.2.2025.pdf`) lives in the repo root
as the historical source. The protocol here supersedes it.

## Origin & rationale

`fitness-test-protocol.md` is a refinement of the SZ Performance coach battery. It **keeps**
the parts that already matched best practice (20 mm edge, bodyweight-normalized loads, 3RM
pull-up, confirmed MVC7, defined recovery times) and **fixes** the weak parts:

1. **Critical Force test replaced.** The old multi-load-to-exhaustion CF test was never
   completed in any historical round (the 45%/10-min anchor was always skipped → no usable
   CF value) and used too-short recovery between bouts. Replaced with the Giles (2021)
   single 4-minute all-out 7:3 test (preferred, needs a load cell), with the corrected
   multi-load version kept as a fallback that **must be completed in full**.
2. **Grip standardized** to half-crimp on all finger tests (was unspecified → non-comparable).
3. **RFD hang added** (rate of force development — separates elite from sub-elite; missed by
   static max hangs). Requires a load cell / Tindeq.
4. **Unilateral MVC7 added** to catch left/right asymmetry (injury-prevention signal).
5. **Fixed cadence** (every 6–8 weeks / mesocycle boundary), rested, same time of day.

Scientific basis is in `/bibliografia` (Giles 2021 Critical Force, Draper 2021 IRCRA battery,
Faggian 2024 determinants review) and the LightRAG knowledge base (see root `.claude/CLAUDE.md`).

## How agents should use it

- **Recording a completed test:** fill a `Test N` column in the results table in
  `fitness-test-protocol.md`. Preserve prior columns; do not overwrite past data.
- **Comparing to training:** MVC7 (± relative %BW) is the primary finger-strength KPI; CF/W′
  is the primary fatigue-resistance KPI; 3RM pull + AMRAP track pulling strength/endurance.
  Cross-reference against the relevant `progressions.md` when evaluating whether a mesocycle
  worked.
- **Interpreting values:** relative (per-kg-bodyweight) finger metrics predict climbing far
  better than absolute ones — always report the relative figure, and watch bodyweight, since a
  dropping bodyweight can flatter relative numbers without a real strength gain.
- **Scheduling:** a test round is due ~6–8 weeks after the previous one, or at a mesocycle
  boundary. Confirm the athlete is rested before treating results as valid.

## Conventions

- Units in kg unless noted; `—` means "not done".
- "Total Load (CC)" = bodyweight + overload (or − unload).
- Keep one row of history per date; never delete past results.
