---
name: qa.cli-integration-testing
owner: QA Agent
project: Todo App (Phase 1)
purpose: Execute CLI commands, capture outputs, and validate behavior against acceptance criteria
---

## Purpose
Execute task acceptance criteria as automated CLI tests to verify implementation matches specification. Validate exit codes, stdout, stderr, state transitions, and command interactions.

## When to Use
- After implementation of a task (`/sp.implement TASK-ID`) completes
- During code review to verify task completion
- For regression testing when changes are made
- When debugging unexpected CLI behavior
- In CI/CD pipeline for automated quality gates

## Inputs
1. **Task ID** - Single task to test (e.g., `TASK-001`)
2. **tasks.md path** - Location of acceptance criteria
3. **App entry point** - Command to invoke (e.g., `python -m todo`, `./todo-app`)
4. **Environment** - Clean in-memory state (no persisted data)
5. **Test timeout** - Maximum seconds per test (default: 5s)

## Step-by-Step Process

### Phase 1: Parse Acceptance Criteria
1. Load `tasks.md` and extract acceptance criteria for the given Task ID
2. Parse each criterion into: **Given**, **When**, **Then** components
3. Identify assertion type for each criterion:
   - Exit code validation (e.g., exit 0, exit 1)
   - Stdout content matching
   - Stderr presence/absence
   - State verification (task list contents)
   - Sequence validation (multiple commands)

### Phase 2: Prepare Test Environment
1. Clear all in-memory state (restart app or reset service)
2. Set up any prerequisite data (e.g., if testing "delete" task, create a task first)
3. Initialize stdin/stdout/stderr capture
4. Start timer for test execution

### Phase 3: Execute Each Criterion
For each acceptance criterion:

1. **Extract inputs**
   - CLI command with exact arguments
   - stdin data (if any)
   - Environment variables (if any)

2. **Execute command**
   ```
   timeout <timeout> <command> < <stdin>
   capture: exit_code, stdout, stderr
   ```

3. **Wait for completion**
   - If timeout exceeded: ❌ FAIL (execution exceeded limit)
   - If crash detected: ❌ FAIL (exception or core dump)

4. **Validate outputs**
   - Exit code matches expected? ✅ or ❌
   - Stdout matches expected pattern? ✅ or ❌
   - Stderr validation (presence/content)? ✅ or ❌

5. **Log result**
   - Test name: `TASK-001-AC1` (TASK-[ID]-AC[Number])
   - Status: ✅ PASS or ❌ FAIL
   - Elapsed time
   - Actual vs. expected output (if mismatch)

### Phase 4: State Validation (If Multiple Commands)
For criteria involving state changes:
1. After first command: capture internal state (task list, data)
2. Execute second command
3. Verify state transition is correct
4. Example: Add task → List tasks → Verify new task in list

### Phase 5: Generate Report
1. Count total criteria tested
2. Calculate pass rate: `(passing / total) * 100%`
3. List all failures with diffs
4. Identify root cause patterns (e.g., "output format mismatch")
5. Calculate total execution time

## Output

### Success Output (All Tests Pass)
```
✅ INTEGRATION TEST PASSED: TASK-001 (Add Task)

Acceptance Criteria: 5
Status: 5/5 passed ✅

TASK-001-AC1: ✅ PASS (45ms)
  When: todo add "Buy milk"
  Expected: exit 0, stdout "Task 1: Buy milk [pending]"
  Actual: exit 0, stdout "Task 1: Buy milk [pending]"

TASK-001-AC2: ✅ PASS (38ms)
  When: todo add ""
  Expected: exit 1, stderr "Error: task title cannot be empty"
  Actual: exit 1, stderr "Error: task title cannot be empty"

TASK-001-AC3: ✅ PASS (42ms)
  When: todo add with 256-char title
  Expected: exit 0, task created with full title
  Actual: exit 0, task created with full title

TASK-001-AC4: ✅ PASS (40ms)
  When: multiple adds in sequence
  Expected: task IDs increment (1, 2, 3)
  Actual: task IDs increment (1, 2, 3) ✅

TASK-001-AC5: ✅ PASS (51ms)
  When: add task, list tasks
  Expected: new task appears in list
  Actual: new task appears in list ✅

Total Time: 216ms
Pass Rate: 100%

Next: Ready for merge / PR review
```

### Failure Output (Tests Failed)
```
❌ INTEGRATION TEST FAILED: TASK-001 (Add Task)

Acceptance Criteria: 5
Status: 3/5 passed, 2/5 failed ❌

TASK-001-AC1: ✅ PASS (45ms)
TASK-001-AC2: ✅ PASS (38ms)

TASK-001-AC3: ❌ FAIL (42ms)
  When: todo add with 256-char title
  Expected: exit 0, task created with full title
  Actual: exit 1, stderr "Error: title too long (max 200 chars)"
  Issue: Implementation enforces 200-char limit but AC spec says 256-char
  Root Cause: Spec requirement mismatch or AC incorrect

TASK-001-AC4: ❌ FAIL (40ms)
  When: multiple adds in sequence
  Expected: task IDs increment (1, 2, 3)
  Actual: task IDs are (1, 1, 2)  ← ID collision detected
  Issue: Task ID generation is not incrementing properly
  Root Cause: Likely state sharing or ID counter not reset

TASK-001-AC5: ✅ PASS (51ms)

Total Time: 216ms
Pass Rate: 60% (3/5)

Failures: 2 (blocking)

Blockers:
1. TASK-001-AC3: Title length limit mismatch (spec vs implementation)
   → Verify spec.md requirement; adjust AC or code accordingly
2. TASK-001-AC4: Task ID collision in sequence
   → Check ID generator; ensure stateless/idempotent behavior

Remediation:
1. Fix task ID generator to properly increment
2. Clarify title length limit in spec and AC
3. Re-run: qa.cli-integration-testing TASK-001

Test output saved: test-reports/TASK-001-cli-integration.log
```

## Failure Handling

| Scenario | Action |
|----------|--------|
| App crashes on startup | ❌ FAIL all tests; log crash dump; exit code: 1 |
| Command timeout (>5s) | ❌ FAIL criterion; flag as performance issue |
| Exit code mismatch | ❌ FAIL criterion; show actual vs expected |
| Stdout content mismatch | ❌ FAIL criterion; show diff (expected → actual) |
| Stderr validation fails | ❌ FAIL criterion; log unexpected error output |
| State corruption detected | ❌ FAIL; stop remaining tests; alert ops |
| Test environment setup fails | Skip criterion; log setup error; continue others |
| Input file not found | ❌ FAIL criterion; suggest file path check |

## Success Criteria
- Exit code matches specification
- Stdout content matches expected output format
- Stderr properly captures error cases
- No unexpected exceptions or crashes
- Pass rate ≥ 95% (allows 1 flaky test per 20)
- Execution completes within timeout

## Notes
- **Phase 1 context**: Tests CLI commands with in-memory state only
- **Determinism**: Each test run should produce identical results
- **Isolation**: Tests run in clean state; no data carries between criteria
- **Logging**: All tests logged to timestamped file for audit trail
- **Regression**: Can be re-run at any time to verify no regressions
- **CI/CD ready**: Formatted output suitable for CI pipeline integration
- **Owner responsibility**: QA Agent executes tests; developer fixes failures

## Test Report Locations
- Default: `test-reports/<TASK-ID>-cli-integration.log`
- Summary: `test-reports/cli-integration-summary.txt`
- Artifacts: `test-reports/<TASK-ID>-*.input`, `test-reports/<TASK-ID>-*.output`
