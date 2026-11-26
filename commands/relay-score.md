---
description: Run the relay scoring gate on the current work (follow-the-flow check + score).
---
Load `skills/workflow-scorecard/SKILL.md` and `templates/scorecard.md`.

1. First the hard gate: did this work actually follow the relay flow (dispatch
   with the user's words, reviewed cases before saving, testers made their own
   data, per-step evidence, online report with synced IDs, defects filed +
   notified, no security red lines)? If a key step is missing or out of order,
   force the flow from the missing step before scoring.
2. Then score out of 100 against the rubric, one line of evidence per row.
3. Compare to the pass threshold (`PASS_SCORE`, default 80). If below, list the
   lost points, run targeted optimization, re-run those steps, and re-score —
   until it passes or you escalate.

Report: `flow: ok/not · score: NN/100 · verdict: pass / re-run (round k) / escalate`.
