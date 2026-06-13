# Climbing Training — Multi-Agent Orchestration System

This project is a **four-agent system for generating and managing climbing training mesocycles**. One orchestrator agent designs the high-level structure; three specialist agents (Hangboard, Physical Training, Climbing) generate detailed session plans.

## Project Structure

```
climbing_training/
├── .claude/
│   └── CLAUDE.md                  ← Root instructions, shared KB access
│
├── orchestrator/                  ← PHASE 1: Weekly session planning
│   ├── .claude/CLAUDE.md          ← Orchestrator role & workflow
│   ├── plans/                     ← Output: mesocycle structures
│   └── logs/                      ← Input: session logs from other agents
│
├── hangboard/                     ← PHASE 2: Finger-strength sessions
│   ├── .claude/CLAUDE.md          ← Hangboard agent role
│   ├── sessions/                  ← Output: hangboard CSV files
│   └── progressions.md            ← Data: max hangs, rep records
│
├── physical/                      ← PHASE 2: S&C sessions
│   ├── .claude/CLAUDE.md          ← Physical training agent role
│   ├── sessions/                  ← Output: S&C CSV files
│   └── progressions.md            ← Data: lift PRs, progression notes
│
└── climbing/                      ← PHASE 2: Climbing sessions
    ├── .claude/CLAUDE.md          ← Climbing agent role
    ├── sessions/                  ← Output: climbing CSV files
    └── progressions.md            ← Data: sends, projects, technique notes
```

## How It Works

### Phase 1: Orchestrator Plans the Mesocycle

**You do this once per mesocycle (e.g., every 3–4 weeks).**

1. Open Claude Code from the `orchestrator/` folder.
2. Provide a mesocycle prompt that includes:
   - Goal (e.g., "improve finger strength", "train for a comp", "base building")
   - Duration (in weeks)
   - Climbing level and discipline focus
   - Weekend usage (one or both days, indoor/outdoor)
   - Any injuries or limitations
   - Target event or peak date (if applicable)

3. The orchestrator produces:
   - **Weekly session counts** per type (Hangboard, Physical, Climbing)
   - **Placement preferences** (which days each session type should fall on)
   - **Rationale** (why the structure fits your goal)

4. Save the output to `orchestrator/plans/mesocycle-{N}.md` (e.g., `mesocycle-1.md`)

### Phase 2: Specialists Generate Sessions

**You do this once per week, or as needed.**

For each week of the mesocycle, you invoke the three specialist agents:

#### 1. Hangboard Agent

**When:** You need hangboard sessions for a specific week.

**How:**
1. Open Claude Code from the `hangboard/` folder.
2. Provide:
   - Reference to the mesocycle plan (e.g., "Week 3 of mesocycle-1")
   - The week number, position in progression (accumulation/intensification/peak/deload), and assigned hangboard session count
   - Any finger-specific limitations
3. Agent outputs a CSV to `hangboard/sessions/week-{N}.csv`

**Update `progressions.md`** after each session with:
- Max hang baseline updates
- Rep record improvements
- Edge size & load notes

#### 2. Physical Training Agent

**When:** You need strength & conditioning sessions for a specific week.

**How:**
1. Open Claude Code from the `physical/` folder.
2. Provide:
   - Reference to the mesocycle plan (e.g., "Week 3 of mesocycle-1")
   - The week number, phase, assigned physical-training session count, and any load constraints from other session types
   - Injuries or limitations
3. Agent outputs a CSV to `physical/sessions/week-{N}.csv`

**Update `progressions.md`** after each session with:
- Lift PRs achieved
- Dumbbell/load progressions
- Exercise substitutions and notes

#### 3. Climbing Agent

**When:** You need climbing sessions for a specific week.

**How:**
1. Open Claude Code from the `climbing/` folder.
2. Provide:
   - Reference to the mesocycle plan (e.g., "Week 3 of mesocycle-1")
   - The week number, discipline focus, assigned climbing session count, day placement, progression phase, and weekend usage
3. Agent outputs a CSV to `climbing/sessions/week-{N}.csv`

**Update `progressions.md`** after each session with:
- Sends (projects completed)
- Ongoing projects and attempt count
- Technique notes (footwork, movement patterns, etc.)

---

## File Naming Conventions

All phase-2 sessions follow the pattern: `sessions/week-{N}.csv`

For multi-week mesocycles, organize like:
```
hangboard/sessions/
  ├── week-1.csv
  ├── week-2.csv
  ├── week-3.csv
  └── ...

physical/sessions/
  ├── week-1.csv
  ├── week-2.csv
  └── ...

climbing/sessions/
  ├── week-1.csv
  ├── week-2.csv
  └── ...
```

## Key Constraints & Shared Rules

### Home-Gym Equipment

Available for hangboard and physical training only:
- Moon hangboard
- Dumbbells
- Weight bench
- Pulley system
- Free weights
- Mat
- TRX
- Ankle weights
- Pull-up bar
- Loading pin (for weighted exercises)
- Small portable edge (for finger deadlifts and pinch training)

### Weekly Schedule

- **MON, TUE, FRI** — home available all day; hangboard & physical training preferred
- **WED, THU** — office hours (no home gym); training only from 18:00 onwards
- **SAT, SUN** — fully available for climbing

### Load & Intensity

- All prescribed loads are **RPE-based** (1–10 scale), never kg or percentage of 1RM
- Sessions are always output as **CSV files**, never prose
- Each agent stays strictly within its scope; overlap is forbidden

### Data Persistence

- Each agent reads its folder's `progressions.md` to calibrate load and progression
- After each session, **you update the relevant `progressions.md`** with actual performance
- Sub-agents check `progressions.md` to avoid over-reaching or under-loading

---

## Workflow Summary for Humans

1. **Week 0:** Write a mesocycle prompt → open `orchestrator/` → save the plan to `orchestrator/plans/`
2. **Week 1–N:** For each week:
   - Open `hangboard/` → request Week X → save CSV
   - Open `physical/` → request Week X → save CSV
   - Open `climbing/` → request Week X → save CSV
   - Execute sessions, log performance, update each `progressions.md`

---

## Workflow Summary for Agents

Each agent **reads its `.claude/CLAUDE.md`** to understand its role. When invoked:

1. **Check inputs:** Ask for missing context (mesocycle reference, week number, session count, progression phase).
2. **Read context:** Query LightRAG (KB) or local files for historical data (existing plans, equipment specs).
3. **Read progressions.md:** Review the agent's `progressions.md` to calibrate load and progression.
4. **Generate plan:** Produce the exact CSV format specified in `.claude/CLAUDE.md`.
5. **Write to disk:** Save output to `sessions/week-{N}.csv` in the agent's folder.

---

## Knowledge Base (LightRAG)

The root `.claude/CLAUDE.md` provides access to a climbing-training knowledge base via the `lightrag-kb` MCP server. All agents can query it for:

- Training protocols (finger strength, S&C, periodization)
- Technique cues and movement patterns
- Injury prevention and recovery frameworks
- Historical training data (if indexed)

Use the `hybrid` query mode for most questions; see the root CLAUDE.md for full KB documentation.

---

## Example Mesocycle Workflow

### Week 0: Plan the Mesocycle

```
You: "I want a 4-week base-building block focused on finger strength. 
     I'm V6–V7 bouldering indoors mostly. 
     Weekends: Saturday climbing, Sunday rest.
     No injuries. Peak date: mid-July (target V7+ flash)."

Orchestrator outputs:
  Week 1 (Accumulation):
    Hangboard: 2 sessions
    Physical: 2 sessions
    Climbing: 2 sessions
  ...
```

### Week 1: Generate Sessions

```
You open hangboard/:
  "Week 1 of mesocycle-1. I have 2 hangboard sessions assigned.
   Currently in accumulation phase. No finger limitations."

Hangboard Agent outputs:
  → hangboard/sessions/week-1.csv
  
(Repeat for physical/ and climbing/)

You complete all three sessions, update progressions.md files.
```

### Week 2–4: Repeat

Same process for each week; agent loads / progression naturally escalates.

---

## Tips for Users

- **Keep `progressions.md` up-to-date** — it's the agent's memory of your training trajectory.
- **Save mesocycle plans** — you may want to revisit or tweak them.
- **Be specific in mesocycle prompts** — vague inputs lead to clarification questions, not plans.
- **Let agents ask** — if context is missing, agents will ask; provide it rather than guessing.

## Tips for Agents

- **Always verify inputs** — stop and ask before inferring missing context.
- **Respect scope** — if it's not your domain, defer to the other sub-agent.
- **Use progressions.md as ground truth** — it's the user's actual performance, not the plan.
- **Output CSV only** — no explanations or prose unless clarifying missing inputs.
- **Save to `sessions/week-{N}.csv`** — don't print to chat; write to disk.
