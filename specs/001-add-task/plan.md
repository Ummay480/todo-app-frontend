# Implementation Plan: Add Task

**Branch**: `001-add-task` | **Date**: 2025-12-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-add-task/spec.md`

## Summary

Implement the Add Task feature for the Todo CLI Application, enabling users to create new todo items with a title via the `todo add <title>` command. The feature validates input, assigns unique IDs, sets default "pending" status, and warns on duplicate titles while still allowing creation. Implementation follows Test-Driven Development (TDD) with deterministic, in-memory storage.

**Primary Requirement**: Users can add a todo task with a single CLI command that provides immediate feedback.

**Technical Approach**: Python 3.11+ with argparse (stdlib), service layer architecture, in-memory list storage, pytest for testing.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: `argparse` (standard library), `pytest` (testing)
**Storage**: In-memory Python list (no persistence)
**Testing**: pytest with parametrized test cases
**Target Platform**: Cross-platform CLI (Linux, macOS, Windows)
**Project Type**: Single-project CLI application
**Performance Goals**: < 100ms response time for add command
**Constraints**: < 200ms p95 latency, deterministic behavior, no global mutable state
**Scale/Scope**: Phase-1 MVP - single session, in-memory only, no persistence

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Phase-1 Scope Compliance

| Rule | Status | Evidence |
|------|--------|----------|
| CLI-only | ✅ PASS | `argparse` command-line interface, no GUI/web |
| In-memory data only | ✅ PASS | Python `list[dict]`, no database or file I/O |
| Single-user execution | ✅ PASS | No authentication, no multi-user support |
| Synchronous commands | ✅ PASS | No async/await, no background workers |
| Deterministic operations | ✅ PASS | Auto-increment IDs, case-sensitive matching, no timestamps |

### ✅ Forbidden Features (None Detected)

| Forbidden | Status | Notes |
|-----------|--------|-------|
| UI / Frontend | ✅ PASS | No web/mobile/desktop GUI |
| Databases | ✅ PASS | No SQL, NoSQL, or file-based persistence |
| External APIs | ✅ PASS | No network calls |
| Background services | ✅ PASS | No daemons or workers |
| Async/multi-threading | ✅ PASS | Single-threaded synchronous execution |
| Plugins/extensions | ✅ PASS | No plugin system |
| Global mutable state | ✅ PASS | Storage encapsulated in `TaskStorage` class |
| Code duplication | ✅ PASS | DRY principle enforced via service layer |

### ✅ Specification-Driven Development

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Approved specification exists | ✅ PASS | `spec.md` status = "Approved" |
| Acceptance criteria defined | ✅ PASS | 3 user stories with scenarios |
| Edge cases documented | ✅ PASS | Empty, whitespace, long input, duplicates |
| Error conditions specified | ✅ PASS | Empty title error, validation error |

### ✅ Deterministic Behavior

| Aspect | Implementation | Determinism Guarantee |
|--------|----------------|----------------------|
| ID generation | Auto-increment counter starting at 1 | Same operation sequence → same IDs |
| Duplicate detection | Case-sensitive exact match | Same inputs → same results |
| Error messages | Static strings from constants | Consistent across runs |
| Status assignment | Hard-coded "pending" | No variation |

### ✅ Post-Design Re-Evaluation

**Date**: 2025-12-30 (after Phase 1 design artifacts completed)

| Gate | Status | Notes |
|------|--------|-------|
| Scope boundaries | ✅ PASS | No scope creep detected in research, data model, or contracts |
| Deterministic design | ✅ PASS | All algorithms are predictable (auto-increment, linear scan) |
| Testability | ✅ PASS | TDD approach with unit and integration tests |
| Simplicity | ✅ PASS | Minimal dependencies, straightforward architecture |
| Constitution alignment | ✅ PASS | All rules followed, no violations |

**Conclusion**: Design is constitution-compliant and ready for task generation.

## Project Structure

### Documentation (this feature)

```text
specs/001-add-task/
├── spec.md                 # Feature specification (approved)
├── plan.md                 # This file (implementation plan)
├── research.md             # Phase 0: Technical decisions and rationale
├── data-model.md           # Phase 1: Task entity schema and validation
├── quickstart.md           # Phase 1: Developer implementation guide
├── contracts/
│   └── cli-contract.md     # Phase 1: CLI command specification
├── checklists/
│   └── requirements.md     # Specification quality validation
└── tasks.md                # Phase 2: Task breakdown (created by /sp.tasks)
```

### Source Code (repository root)

```text
src/
├── __init__.py
├── models/
│   ├── __init__.py
│   └── task.py             # Task TypedDict, validation functions
├── services/
│   ├── __init__.py
│   └── task_service.py     # Business logic (add, validate, duplicate check)
├── lib/
│   ├── __init__.py
│   └── storage.py          # In-memory list manager, ID generation
└── cli/
    ├── __init__.py
    └── main.py             # Argparse setup, command handlers, output formatting

tests/
├── __init__.py
├── unit/
│   ├── __init__.py
│   ├── test_task.py        # Test validation functions
│   ├── test_task_service.py # Test business logic
│   └── test_storage.py     # Test storage operations
└── integration/
    ├── __init__.py
    └── test_cli.py         # End-to-end CLI tests
```

**Structure Decision**: Single-project structure (Option 1) selected because:
- Phase-1 is CLI-only (no frontend/backend split needed)
- In-memory storage doesn't require separate data layer
- Follows Python conventions for small-to-medium projects
- Supports Test-Driven Development with clear separation of concerns

## Complexity Tracking

**No violations detected.** Constitution gates all passed without exceptions.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Design Artifacts

### Phase 0: Research (Completed)

**File**: [research.md](./research.md)

**Key Decisions**:
1. **Python 3.11+**: Rapid development, excellent CLI tooling, strong testing ecosystem
2. **argparse (stdlib)**: Zero dependencies, sufficient for Phase-1 command structure
3. **In-memory list storage**: Simple, transparent, O(n) acceptable for demo scale
4. **Auto-increment IDs**: Deterministic, human-readable, no external dependencies
5. **pytest**: Industry standard, readable, parametrization support
6. **Case-sensitive duplicate detection**: Deterministic, matches CLI tool expectations
7. **Exception-based error handling**: Pythonic, clear error messages per constitution
8. **Service layer architecture**: Separation of concerns, testable, scalable

**Alternatives Considered**: Node.js (build complexity), Rust (slower iteration), Click (extra dependency), UUID (less readable)

### Phase 1: Data Model (Completed)

**File**: [data-model.md](./data-model.md)

**Core Entity**: `Task`

| Field | Type | Constraints | Default |
|-------|------|-------------|---------|
| `id` | int | > 0, unique, auto-increment | Generated |
| `title` | str | 1-1000 chars, non-whitespace | None |
| `status` | str | Enum: ["pending", "completed"] | "pending" |

**Validation Rules**:
- Title must contain at least one non-whitespace character
- Title max 1000 characters (handles edge case)
- ID uniqueness guaranteed by counter
- Status defaults to "pending" for all new tasks

**Storage**: Python `list[dict]` with O(n) operations acceptable for Phase-1 scale

### Phase 1: CLI Contract (Completed)

**File**: [contracts/cli-contract.md](./contracts/cli-contract.md)

**Command Syntax**:
```bash
todo add <title>
```

**Success Response** (Exit 0):
```
✓ Task added: "<title>" (ID: <id>)
```

**Warning Response** (Exit 0, duplicate detected):
```
⚠ Task added: "<title>" (ID: <id>)
  Note: A task with this title already exists (ID: <existing_id>)
```

**Error Response** (Exit 1):
```
ERROR: Task title cannot be empty
Suggestion: Provide a non-empty title, e.g., todo add "Buy groceries"
Code: EMPTY_TITLE
```

**Performance Contract**: < 100ms response time (SC-002)

### Phase 1: Implementation Guide (Completed)

**File**: [quickstart.md](./quickstart.md)

**TDD Implementation Steps**:
1. Define Task model + validation (10 min)
2. Implement storage layer (15 min)
3. Implement task service (20 min)
4. Implement CLI layer (25 min)
5. Integration testing (15 min)

**Total Estimated Time**: 85 minutes

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    CLI Layer                        │
│  (src/cli/main.py)                                  │
│  - Argparse command parser                          │
│  - Output formatting (success/error/warning)        │
│  - Exit code handling                               │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│                 Service Layer                       │
│  (src/services/task_service.py)                     │
│  - Business logic (add, validate)                   │
│  - Duplicate detection                              │
│  - Error handling and messaging                     │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│   Model Layer    │  │  Storage Layer   │
│  (src/models/)   │  │  (src/lib/)      │
│  - Task schema   │  │  - In-memory list│
│  - Validation    │  │  - ID generation │
└──────────────────┘  └──────────────────┘
```

**Data Flow (Add Task)**:
1. User: `todo add "Buy groceries"`
2. CLI Layer: Parse arguments → extract title
3. Service Layer: Validate title → check duplicates → create task dict
4. Storage Layer: Generate ID → append to list
5. Service Layer: Return result with warning if duplicate
6. CLI Layer: Format output → print message → exit with code

## Testing Strategy

### Unit Tests (Target: 100% coverage)

**Models** (`tests/unit/test_task.py`):
- Valid title validation
- Empty/whitespace title rejection
- Long title rejection (> 1000 chars)
- Unicode support

**Storage** (`tests/unit/test_storage.py`):
- Add task to empty list
- Add multiple tasks (ID generation)
- Duplicate detection (case-sensitive)
- Get all tasks

**Service** (`tests/unit/test_task_service.py`):
- Add valid task (success)
- Add empty title (error)
- Add duplicate (warning)
- Add whitespace title (error)

### Integration Tests

**CLI** (`tests/integration/test_cli.py`):
- User Story 1, Scenario 1: Add simple task
- User Story 1, Scenario 2: Reject empty title
- User Story 2, Scenario 1: Multiple tasks retained
- User Story 3, Scenario 1: Duplicate warning
- Edge cases: Unicode, special chars, long titles

### Contract Tests

- Verify exact output format matches CLI contract
- Verify exit codes (0 for success/warning, 1 for error)
- Verify error message format matches constitution

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Argparse learning curve | Low | Low | Simple one-command structure, abundant docs |
| Performance regression | Low | Medium | Benchmark tests, O(n) acceptable for demo |
| Unicode handling issues | Medium | Low | UTF-8 default in Python 3, test coverage |
| Duplicate detection UX confusion | Medium | Low | Clear warning message, document behavior |
| Test brittleness (output format) | Medium | Medium | Use regex patterns, not exact string matching |

## Dependencies

### Runtime

- **Python 3.11+**: Core runtime
- **argparse**: CLI parsing (standard library, no install)

### Development

- **pytest**: Testing framework
- **pytest-cov**: Coverage reporting
- **black**: Code formatting (PEP 8)
- **mypy** (optional): Type checking

### Installation

```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install pytest pytest-cov black mypy
```

## Success Criteria Mapping

| Success Criterion | Implementation | Verification |
|-------------------|----------------|--------------|
| SC-001: Add with 1 command | `todo add <title>` | Integration test |
| SC-002: Feedback < 100ms | In-memory operations only | Benchmark test |
| SC-003: 100% retrievable | List storage persists in session | Unit test |
| SC-004: 100% empty rejection | Validation in service layer | Unit + integration test |

## Non-Functional Requirements

### Performance

- **Target**: < 100ms response time (SC-002)
- **Measurement**: `time todo add "Test"` command
- **Bottleneck**: None (pure in-memory operations)

### Reliability

- **Error Handling**: All errors caught and reported with user-friendly messages
- **Edge Cases**: Tested (empty, whitespace, long, unicode, duplicates)
- **Robustness**: No crashes on invalid input

### Maintainability

- **Code Style**: PEP 8 (enforced by black)
- **Type Hints**: Full coverage (validated by mypy)
- **Documentation**: Docstrings on all public functions
- **Test Coverage**: Target 100% for service layer, > 90% overall

### Usability

- **Error Messages**: Clear, actionable, non-technical
- **Output Format**: Consistent, parseable (for future automation)
- **Help Text**: Auto-generated by argparse

## Future Phases (Deferred)

Not included in Phase-1 scope:

- **Persistence**: Save tasks to file/database between sessions
- **List Command**: View all tasks
- **Complete Command**: Mark task as completed
- **Delete Command**: Remove tasks
- **Update Command**: Edit task title
- **Filtering**: By status, search by keyword
- **Priorities/Tags**: Additional metadata
- **Due Dates**: Temporal data

These will be addressed in Phase-2+ after Phase-1 demonstrates governance quality.

## Next Steps

1. **Run `/sp.tasks`**: Generate task breakdown from this plan
2. **Execute tasks**: Implement with TDD discipline (Red → Green → Refactor)
3. **Quality Gates**: Pass all tests, linters, type checks
4. **Constitution Compliance**: Verify against checklist
5. **Demo Preparation**: Practice command scenarios for presentation

## Architectural Decision Record (ADR) Suggestions

### ADR Candidates

The following decisions meet significance criteria (long-term impact, alternatives considered, cross-cutting):

1. **Python + argparse for CLI** (research.md, Decision 1 & 2)
   - Impact: Foundation for entire application
   - Alternatives: Node.js, Rust, Go, Bash, Click, Typer
   - Scope: Affects all future features

2. **Service Layer Architecture** (research.md, Implementation Approach)
   - Impact: Code organization and testability
   - Alternatives: Flat structure, monolithic script, hexagonal architecture
   - Scope: Influences all future feature implementations

3. **In-Memory List Storage** (research.md, Decision 3)
   - Impact: Data access patterns and performance
   - Alternatives: Dict-by-ID, custom class, SQLite in-memory
   - Scope: Constrains Phase-1, affects Phase-2 persistence strategy

**Recommendation**: Create ADRs for decisions #1 and #2 before Phase-2 planning. Decision #3 can be deferred until persistence requirements are defined.

**Suggested Command**:
```
/sp.adr "Python and argparse for CLI foundation"
/sp.adr "Service layer architecture pattern"
```

Wait for user consent before creating ADRs (per constitution Section 4.3).

## Approval Checklist

Before proceeding to `/sp.tasks`:

- [x] All Phase 0 research questions resolved
- [x] All Phase 1 design artifacts created
- [x] Constitution gates passed (pre and post design)
- [x] Data model validated against spec entities
- [x] CLI contract mapped to functional requirements
- [x] No scope creep detected
- [x] Complexity tracking shows zero violations
- [x] ADR suggestions identified

**Status**: ✅ Ready for task generation (`/sp.tasks`)
