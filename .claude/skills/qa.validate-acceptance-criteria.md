---
name: qa.validate-acceptance-criteria
owner: QA Agent
project: Todo App (Phase 1)
purpose: Validate that task acceptance criteria are deterministic, testable, and complete
---

## Purpose
Ensure every task in the approved tasks.md has acceptance criteria that are:
- **Deterministic**: Outcome is identical across multiple runs with same inputs
- **Testable**: Success can be verified objectively (pass/fail, not subjective)
- **Complete**: Covers happy path, edge cases, and error conditions
- **Traceable**: Maps to specification requirements

## When to Use
- After `/sp.tasks` approval, before `/sp.implement` begins
- When reviewing task AC before developer starts coding
- When validating completion of implemented task
- During phase-1 quality gate checks

## Inputs
1. **tasks.md path** - Location of approved tasks file (typically `specs/<feature>/tasks.md`)
2. **spec.md path** - Location of specification (typically `specs/<feature>/spec.md`)
3. **Task IDs** (optional) - Specific Task IDs to validate; if omitted, validates all tasks

## Step-by-Step Process

### Phase 1: Load and Parse
1. Read `tasks.md` and extract all tasks with their IDs and acceptance criteria
2. Read `spec.md` and extract all requirements
3. Create mapping: Task ID → Requirements covered
4. Flag missing Task IDs (format: `TASK-NNN`)

### Phase 2: Determinism Check
For each acceptance criterion:
1. **Does it use subjective language?** (e.g., "should be fast", "looks good", "user happy")
   - ❌ FAIL if present
   - ✅ PASS if uses objective metrics (e.g., "completes in <100ms", "returns JSON with keys X, Y, Z")
2. **Does it specify input values explicitly?**
   - ❌ FAIL if vague (e.g., "given input", "with data")
   - ✅ PASS if concrete (e.g., "given `todo add "Buy milk"`, command returns exit code 0")
3. **Does it describe exact expected output?**
   - ❌ FAIL if approximate (e.g., "shows list", "displays tasks")
   - ✅ PASS if specific (e.g., "stdout contains exactly: 'Task 1: Buy milk [pending]'")

### Phase 3: Testability Check
For each criterion, verify it can be automated:
1. **CLI Input**: Can input be provided via stdin/args? ✅ PASS
2. **Output Validation**: Can exit code, stdout, or stderr be captured and asserted? ✅ PASS
3. **File State**: Can file system state be checked (when in-memory allows)? ✅ PASS
4. **Duration**: Can timeout/duration be measured? ✅ PASS
5. **Non-deterministic elements** (e.g., "within 2 seconds", "eventually", "may vary"):
   - ❌ FAIL if not quantified with tolerance
   - ✅ PASS if tolerance specified (e.g., "completes within 100-500ms")

### Phase 4: Completeness Check
For each task:
1. **Does it cover happy path?** ✅ At least one criterion for success case
2. **Does it cover error path?** ✅ At least one criterion for failure/invalid input
3. **Does it cover boundary/edge cases?** ✅ At least one for limits (empty, max, special chars)
4. **Requirements mapping**: Does spec have requirement that this task doesn't cover?
   - ❌ FAIL if gaps exist in coverage
   - ✅ PASS if all spec requirements have task coverage

### Phase 5: Lint Check
1. Verify all criteria use consistent formatting (not prose paragraphs)
2. Verify no criteria exceed 2 sentences
3. Verify "Given-When-Then" or "When-Then" structure used consistently
4. Flag duplicate criteria across tasks

## Output

### Success Output (All Checks Pass)
```
✅ VALIDATION PASSED: qa.validate-acceptance-criteria

Task ID Count: 12
Coverage: 100% of spec requirements mapped to tasks

Determinism: 12/12 ✅
Testability: 12/12 ✅
Completeness: 12/12 ✅
Lint: 0 issues ✅

Summary:
- All tasks use objective, measurable language
- All criteria testable via CLI (exit codes, stdout, stderr)
- All spec requirements covered by task acceptance criteria
- No blocking issues detected

Next: Ready for `/sp.implement`
```

### Failure Output (Issues Found)
```
❌ VALIDATION FAILED: qa.validate-acceptance-criteria

Issues Found: 5

TASK-001 (Add Task):
  ❌ Determinism: Criterion 2 uses vague language ("should display nicely")
  ❌ Completeness: Missing edge case for task title >200 characters

TASK-003 (List Tasks):
  ❌ Testability: Criterion 1 cannot be verified programmatically (requires visual inspection)
  ❌ Completeness: Missing error case for corrupted task file

GENERAL:
  ❌ Gap: Spec requires "undo" functionality but no task covers it
  ❌ Lint: 2 criteria use inconsistent Given-When-Then structure

Blocking Issues: 3
Non-Blocking: 2

Remediation:
1. Rewrite vague criteria with objective metrics
2. Add edge case criteria to TASK-001
3. Add acceptance criteria to TASK-003 covering error scenarios
4. Create new task for "undo" feature
5. Standardize acceptance criteria format

After fixes, re-run: qa.validate-acceptance-criteria <tasks.md>
```

## Failure Handling

| Scenario | Action |
|----------|--------|
| tasks.md not found | Exit with error: "File not found: [path]" |
| spec.md not found | Exit with error: "File not found: [path]" (required for coverage mapping) |
| Task lacks ID | Flag with error: "TASK-X: Task ID missing; format required: TASK-NNN" |
| No acceptance criteria in task | Exit with error: "TASK-X: No acceptance criteria defined" |
| All tasks valid but gaps exist | Return FAILED with gap list; suggest new task IDs |
| Criteria format unreadable | Flag specific task: "TASK-X: Criterion unreadable; cannot parse" |
| Determinism ambiguous | Suggest specific rewording in output |

## Success Criteria
- Zero subjective language in any criterion
- All criteria testable via CLI automation
- 100% of spec requirements covered by task acceptance criteria
- All Task IDs present and formatted correctly
- No lint errors in criteria format

## Notes
- **Phase 1 context**: Validates against CLI + in-memory constraints only
- **Automation**: All checks are designed to be scriptable for CI/CD pipeline
- **Owner responsibility**: QA Agent reports gaps; domain owner must fix
- **Reusability**: Can be run at any point; provides diff-based feedback if re-run
