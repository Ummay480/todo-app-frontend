---
name: qa.generate-test-matrix
owner: QA Agent
project: Todo App (Phase 1)
purpose: Generate comprehensive test matrix from specification requirements and acceptance criteria
---

## Purpose
Create a structured test matrix that systematically maps specification requirements to test cases, covering happy path, error paths, edge cases, and boundary conditions. Ensures test coverage is complete and deterministic.

## When to Use
- During task specification review (`/sp.specify` phase) to identify testing gaps
- Before creating acceptance criteria to ensure all scenarios are considered
- Before implementation to establish what "done" looks like
- For compliance/audit: verify spec requirements have test coverage
- When adding new features to Todo App Phase 1

## Inputs
1. **spec.md path** - Specification document (typically `specs/<feature>/spec.md`)
2. **tasks.md path** (optional) - Existing tasks to check coverage against
3. **Coverage threshold** (optional) - Minimum coverage % required (default: 90%)
4. **Output format** - markdown (default), csv, or json

## Step-by-Step Process

### Phase 1: Extract Requirements from Spec
1. Parse `spec.md` and identify all functional requirements
2. Extract acceptance criteria format: `As a [user], I want [capability], so [benefit]`
3. Identify constraints, rules, and error conditions
4. Catalog dependencies and preconditions
5. List boundary values (limits, max/min, special cases)

Example extraction:
```
Requirement: User can add a task
Capability: todo add "<title>"
Constraint: Title cannot be empty
Constraint: Title must be ≤200 characters
Rule: Task IDs auto-increment starting from 1
Error Case: Empty title → exit 1 with error message
Boundary: Single char title, 200 char title, 201 char title (should fail)
Dependency: None
```

### Phase 2: Classify Scenarios
For each requirement, create test matrix rows:

| Scenario Type | Example | Coverage |
|---------------|---------|----------|
| **Happy Path** | Add valid task → succeeds | ✅ Required |
| **Error Path** | Add empty title → error | ✅ Required |
| **Boundary** | Title exactly 200 chars → success | ✅ Required |
| **Boundary** | Title 201 chars → error | ✅ Required |
| **Edge Case** | Special chars in title: `!@#$%` | ✅ Required |
| **Edge Case** | Unicode in title: émojis 🎯 | ✅ Required |
| **Sequence** | Add → List → Verify order | ✅ Required |
| **State** | Add two tasks → IDs auto-increment | ✅ Required |
| **Regression** | No data loss on concurrent adds | ✅ Phase 1? (see decision) |

### Phase 3: Build Test Matrix Table
Create structured table with:

| ID | Requirement | Scenario | Input | Expected Output | Assertion Type | Priority |
|----|-------------|----------|-------|-----------------|-----------------|----------|
| TC-001 | Add task | Happy path: add valid task | `todo add "Buy milk"` | Exit 0, stdout: "Task 1: Buy milk [pending]" | Exit code + output | P0 |
| TC-002 | Add task | Error path: empty title | `todo add ""` | Exit 1, stderr: "Error: ..." | Exit code + error | P0 |
| TC-003 | Add task | Boundary: 200 chars | (200-char string) | Exit 0, task created | Exit code + state | P1 |
| TC-004 | Add task | Boundary: 201 chars | (201-char string) | Exit 1, error message | Exit code + error | P1 |
| TC-005 | Add task | Edge: special chars | `todo add "Buy @#$%!"` | Exit 0, task created | Exit code + output | P1 |
| TC-006 | List tasks | Happy path: list all | `todo list` | Stdout: all tasks | Output format | P0 |
| TC-007 | List tasks | Edge: no tasks | (before any add) | Exit 0, empty list | Output format | P1 |
| TC-008 | Complete task | Happy path: mark done | `todo complete 1` | Exit 0, Task 1 marked [done] | Exit code + state | P0 |
| TC-009 | Complete task | Error: invalid ID | `todo complete 999` | Exit 1, error message | Exit code + error | P0 |

### Phase 4: Assign to Tasks
Map each test case to a task in tasks.md:

| Test Case | Task ID | AC# | Status |
|-----------|---------|-----|--------|
| TC-001 | TASK-001 | AC1 | ✅ Mapped |
| TC-002 | TASK-001 | AC2 | ✅ Mapped |
| TC-003 | TASK-001 | AC3 | ✅ Mapped |
| TC-004 | TASK-001 | AC4 | ✅ Mapped |
| TC-005 | TASK-001 | AC5 | ✅ Mapped |
| TC-006 | TASK-002 | AC1 | ✅ Mapped |
| TC-007 | TASK-002 | AC2 | ✅ Mapped |
| TC-008 | TASK-003 | AC1 | ❌ MISSING (create TASK-003) |
| TC-009 | TASK-003 | AC2 | ❌ MISSING (create TASK-003) |

### Phase 5: Identify Gaps
1. Test cases with no task mapping → **Coverage gap**
2. Requirements with no test cases → **Spec gap**
3. Acceptance criteria with no test case → **AC gap**
4. Calculate coverage percentage: `(mapped tests / total tests) * 100%`

### Phase 6: Generate Report
1. Create test matrix markdown file
2. Calculate coverage by priority: P0 (critical), P1 (important), P2 (nice-to-have)
3. List unmapped tests (candidates for new tasks)
4. Provide remediation roadmap

## Output

### Success Output (Complete Coverage)
```
✅ TEST MATRIX GENERATED: qa.generate-test-matrix

Specification: specs/task-management/spec.md
Total Requirements: 4
Test Cases Generated: 18
Coverage: 100% (18/18)

Coverage Breakdown:
  P0 (Critical): 8/8 mapped ✅
  P1 (Important): 7/7 mapped ✅
  P2 (Nice-to-have): 3/3 mapped ✅

Matrix File: specs/task-management/test-matrix.md

Summary:
- All spec requirements have test coverage
- Happy path: 4 scenarios ✅
- Error path: 5 scenarios ✅
- Boundary cases: 6 scenarios ✅
- Edge cases: 3 scenarios ✅

All tests mapped to approved tasks.md (TASK-001 through TASK-005)

Next: Proceed to acceptance criteria validation with qa.validate-acceptance-criteria
```

### Partial Coverage Output (Gaps Found)
```
⚠️  TEST MATRIX GENERATED: qa.generate-test-matrix

Specification: specs/task-management/spec.md
Total Requirements: 4
Test Cases Generated: 18
Coverage: 83% (15/18)

Coverage Breakdown:
  P0 (Critical): 8/8 mapped ✅
  P1 (Important): 5/7 mapped ⚠️  (2 gaps)
  P2 (Nice-to-have): 2/3 mapped ⚠️  (1 gap)

Matrix File: specs/task-management/test-matrix.md

Unmapped Test Cases (3):

TC-009: Edit existing task
  Requirement: "User can edit task title"
  Scenario: Update task 1 to "New Title"
  Input: todo edit 1 "New Title"
  Expected: Exit 0, Task 1 updated
  Priority: P1
  Action: Create TASK-004 (Edit Task) with AC covering this scenario

TC-014: Undo last action
  Requirement: "User can undo last action"
  Scenario: Add task, undo, verify task not in list
  Input: todo add "X" && todo undo
  Expected: Task not created
  Priority: P2
  Action: Evaluate scope; may defer to Phase 2

TC-018: Filter completed tasks
  Requirement: "User can filter by status"
  Scenario: List only completed tasks
  Input: todo list --status=done
  Expected: Only [done] tasks shown
  Priority: P1
  Action: Create TASK-005 (Filter Tasks) or extend TASK-002 (List)

Remediation Roadmap:
1. Create TASK-004: Edit Task (covers TC-009)
   Acceptance Criteria:
   - AC1: Edit existing task title (happy path)
   - AC2: Invalid task ID error handling
   - AC3: Title validation (empty, length)

2. Create TASK-005: Filter Tasks (covers TC-014, TC-018)
   Acceptance Criteria:
   - AC1: Filter by status (--status=done)
   - AC2: Filter by partial match (--search="keyword")
   - AC3: Combined filters

3. Defer: Undo functionality (TC-014) to Phase 2

After remediation, re-run: qa.generate-test-matrix specs/task-management/spec.md

Target: 100% coverage before `/sp.tasks` approval
```

## Output Formats

### Markdown (Default)
```markdown
# Test Matrix: Task Management

## Mapped Test Cases
[Table with all test cases mapped to tasks]

## Unmapped Test Cases
[Table with gaps]

## Coverage Summary
[Chart and stats]
```

### CSV Export
```
TC-ID,Requirement,Scenario,Input,Expected Output,Task ID,AC#,Mapped
TC-001,Add task,Happy path,todo add "Buy milk",Exit 0; Task 1,TASK-001,AC1,✅
TC-008,Complete task,Happy path,todo complete 1,Exit 0; Task marked [done],TASK-003,AC1,❌
```

### JSON Export
```json
{
  "specification": "specs/task-management/spec.md",
  "generated": "2025-12-28T09:30:00Z",
  "coverage": 0.83,
  "test_cases": [
    {
      "id": "TC-001",
      "requirement": "Add task",
      "scenario": "Happy path",
      "input": "todo add \"Buy milk\"",
      "expected": "Exit 0; stdout: Task 1: Buy milk [pending]",
      "task_id": "TASK-001",
      "ac_number": 1,
      "mapped": true
    }
  ]
}
```

## Failure Handling

| Scenario | Action |
|----------|--------|
| spec.md not found | Exit with error: "Specification file not found: [path]" |
| No requirements found in spec | Exit with error: "No requirements extracted from spec.md; verify format" |
| Ambiguous requirement | Flag in report: "Requirement [N] is ambiguous; suggest clarification" |
| Output file already exists | Ask user: overwrite or save with timestamp suffix |
| Coverage below threshold | Return warning: "Coverage [X]% below target [Y]%; [N] gaps identified" |
| Circular dependencies found | Flag in report: "Circular dependency detected: [A] → [B] → [A]" |

## Success Criteria
- All spec requirements have at least one test case
- Test cases cover happy path, error path, and edge cases
- Coverage ≥ 90% (or configured threshold)
- All test cases mapped to task acceptance criteria
- Test matrix is actionable (can be used to create tasks)
- No ambiguities or gaps in coverage

## Notes
- **Phase 1 context**: Focuses on CLI + in-memory behavior only
- **Determinism**: All test scenarios are deterministic and reproducible
- **Reusability**: Test matrix can be used for multiple testing cycles
- **Traceability**: Full audit trail from spec → test → task → code
- **Owner responsibility**: QA Agent generates matrix; domain owner validates scenarios
- **Living document**: Matrix should be updated as spec evolves
- **Automation**: Output formats support CI/CD pipeline integration

## Matrix File Location
- Default: `specs/<feature>/test-matrix.md`
- Export (CSV): `specs/<feature>/test-matrix.csv`
- Export (JSON): `specs/<feature>/test-matrix.json`
