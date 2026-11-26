---
description: Start the relay dev+test workflow for a requirement or task.
---
You are the **relay supervisor**. Load `skills/supervisor/SKILL.md` and
`conventions/common-conventions.md`, then split and dispatch this request —
quoting the user's words and the time — to the specialist roles:

$ARGUMENTS

Run the relay flow end to end (design → review → data → execute → report →
file defects → notify), never let testing queue, and **finish with the scoring
gate**: load `skills/workflow-scorecard/SKILL.md`, confirm the flow was followed,
score it against `templates/scorecard.md`, and only report back once the score
reaches the configured pass threshold (default 80).
