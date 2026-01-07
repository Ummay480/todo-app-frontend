# Tasks: Add Task

**Input**: Design documents from `/specs/001-add-task/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/cli-contract.md

**Tests**: Following TDD approach as specified in quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project structure: `src/`, `tests/` at repository root
- Paths follow plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory structure (src/, tests/, src/models/, src/services/, src/lib/, src/cli/, tests/unit/, tests/integration/)
- [x] T002 Initialize Python project with pyproject.toml and configure Python 3.11+ requirement
- [x] T003 [P] Install and configure pytest with pytest-cov for testing
- [x] T004 [P] Install and configure black for code formatting
- [x] T005 [P] Install and configure mypy for type checking (optional)
- [x] T006 [P] Create __init__.py files in all src/ and tests/ subdirectories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create Task TypedDict and TaskStatus type in src/models/task.py
- [x] T008 Implement is_valid_title() validation function in src/models/task.py
- [x] T009 Create TaskStorage class with __init__ in src/lib/storage.py
- [x] T010 Implement generate_id() method in TaskStorage class (src/lib/storage.py)
- [x] T011 Implement add_task() method in TaskStorage class (src/lib/storage.py)
- [x] T012 Implement get_all_tasks() method in TaskStorage class (src/lib/storage.py)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create a simple task (Priority: P1) 🎯 MVP

**Goal**: Users can add a single task with a title and receive confirmation, with proper validation for empty titles

**Independent Test**: User runs `todo add "Buy groceries"` and receives success confirmation with task ID. User runs `todo add ""` and receives clear error message.

### Tests for User Story 1 (TDD - Write First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T013 [P] [US1] Write unit test for is_valid_title() with valid titles in tests/unit/test_task.py
- [x] T014 [P] [US1] Write unit test for is_valid_title() rejecting empty strings in tests/unit/test_task.py
- [x] T015 [P] [US1] Write unit test for is_valid_title() rejecting whitespace-only strings in tests/unit/test_task.py
- [x] T016 [P] [US1] Write unit test for is_valid_title() rejecting 1001+ character strings in tests/unit/test_task.py
- [x] T017 [P] [US1] Write unit test for TaskStorage.add_task() in tests/unit/test_storage.py
- [x] T018 [P] [US1] Write unit test for TaskStorage.generate_id() sequential IDs in tests/unit/test_storage.py
- [x] T019 [P] [US1] Write unit test for TaskService.add_task() with valid title in tests/unit/test_task_service.py
- [x] T020 [P] [US1] Write unit test for TaskService.add_task() rejecting empty title in tests/unit/test_task_service.py
- [x] T021 [P] [US1] Write integration test for CLI "todo add 'Buy groceries'" in tests/integration/test_cli.py
- [x] T022 [P] [US1] Write integration test for CLI "todo add ''" error case in tests/integration/test_cli.py

### Implementation for User Story 1

- [x] T023 [US1] Create TaskService class with __init__(storage: TaskStorage) in src/services/task_service.py
- [x] T024 [US1] Implement TaskService.add_task(title: str) with validation and error handling in src/services/task_service.py
- [x] T025 [US1] Create TodoError custom exception class in src/models/task.py
- [x] T026 [US1] Implement argparse CLI parser with 'add' command in src/cli/main.py
- [x] T027 [US1] Implement handle_add(args, service) function with output formatting in src/cli/main.py
- [x] T028 [US1] Implement main() function with TaskStorage and TaskService initialization in src/cli/main.py
- [x] T029 [US1] Add error message formatting with ERROR/Suggestion/Code format in src/cli/main.py
- [x] T030 [US1] Configure CLI entry point and exit code handling (0 for success, 1 for errors) in src/cli/main.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Run `pytest` to verify all US1 tests pass.

---

## Phase 4: User Story 2 - Multiple Task Entry (Priority: P2)

**Goal**: Users can add multiple tasks sequentially and all tasks are retained in the in-memory list

**Independent Test**: User adds three different tasks (`todo add "Task 1"`, `todo add "Task 2"`, `todo add "Task 3"`) and verifies all three are stored with sequential IDs (1, 2, 3)

### Tests for User Story 2 (TDD - Write First)

- [ ] T031 [P] [US2] Write unit test for TaskStorage with multiple add_task() calls in tests/unit/test_storage.py
- [ ] T032 [P] [US2] Write unit test for get_all_tasks() returning all added tasks in tests/unit/test_storage.py
- [ ] T033 [P] [US2] Write integration test for CLI adding three sequential tasks in tests/integration/test_cli.py

### Implementation for User Story 2

- [ ] T034 [US2] Verify TaskStorage.get_all_tasks() correctly returns list of all tasks (should already work from Phase 2)
- [ ] T035 [US2] Verify TaskService handles multiple sequential add_task() calls correctly (should already work from US1)
- [ ] T036 [US2] Add session state management test to ensure in-memory list persists across multiple commands (integration test validation)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Run `pytest tests/integration/` to verify multiple task scenarios.

---

## Phase 5: User Story 3 - Duplicate Detection (Priority: P3)

**Goal**: Users receive a warning when adding a task with a duplicate title, but the task is still created

**Independent Test**: User adds "Buy groceries" twice. First succeeds normally, second succeeds but displays warning message indicating duplicate exists with original ID.

### Tests for User Story 3 (TDD - Write First)

- [ ] T037 [P] [US3] Write unit test for TaskStorage.has_duplicate(title: str) method in tests/unit/test_storage.py
- [ ] T038 [P] [US3] Write unit test for TaskService.add_task() returning warning on duplicate in tests/unit/test_task_service.py
- [ ] T039 [P] [US3] Write integration test for CLI duplicate warning with ⚠ indicator in tests/integration/test_cli.py

### Implementation for User Story 3

- [ ] T040 [US3] Implement has_duplicate(title: str) method using case-sensitive exact match in src/lib/storage.py
- [ ] T041 [US3] Update TaskService.add_task() to check for duplicates and include warning in return dict in src/services/task_service.py
- [ ] T042 [US3] Update handle_add() to display warning message when duplicate detected (⚠ symbol + note) in src/cli/main.py
- [ ] T043 [US3] Ensure exit code remains 0 for duplicate warnings (not an error) in src/cli/main.py

**Checkpoint**: All user stories should now be independently functional. Run `pytest` to verify complete test suite passes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T044 [P] Add docstrings to all public functions and classes following Google style
- [ ] T045 [P] Run black formatter on all Python files to ensure PEP 8 compliance
- [ ] T046 [P] Run mypy type checker and fix any type hint issues
- [ ] T047 [P] Add edge case tests for Unicode characters in titles (tests/integration/test_cli.py)
- [ ] T048 [P] Add edge case tests for special characters in titles (tests/integration/test_cli.py)
- [ ] T049 [P] Add edge case tests for 1000-character title (max valid length) (tests/integration/test_cli.py)
- [ ] T050 Verify all tests pass with pytest --cov=src --cov-report=html
- [ ] T051 Review code against constitution compliance checklist (.specify/memory/constitution.md)
- [ ] T052 Manual smoke test following quickstart.md verification checklist
- [ ] T053 Verify performance requirement: add command completes in < 100ms

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1) can start after Foundational
  - User Story 2 (P2) can start after Foundational (mostly uses existing US1 code)
  - User Story 3 (P3) can start after Foundational (extends US1 functionality)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **REQUIRED FOR MVP**
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on US1 (validates existing behavior)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends US1 but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Models/validation before services
- Services before CLI handlers
- Core implementation before edge cases
- Story complete and tested before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: Tasks T003, T004, T005, T006 can run in parallel

**Phase 2 (Foundational)**: Tasks T007-T012 have some dependencies:
- T007, T008 can run in parallel (different concerns in same file)
- T009 must complete before T010-T012
- T010, T011, T012 can run in parallel (different methods)

**Phase 3 (US1 Tests)**: Tasks T013-T022 can all run in parallel (different test files/functions)

**Phase 3 (US1 Implementation)**:
- T023-T025 have dependencies (T025 before T024)
- T026-T030 have dependencies (T026 before T027-T030)

**Phase 4 (US2)**: Tasks T031-T033 can run in parallel (different test files)

**Phase 5 (US3 Tests)**: Tasks T037-T039 can run in parallel (different test files)

**Phase 6 (Polish)**: Tasks T044-T049 can run in parallel (different concerns)

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all unit tests for US1 together (TDD - write these first):
Task T013: "Write unit test for is_valid_title() with valid titles"
Task T014: "Write unit test for is_valid_title() rejecting empty strings"
Task T015: "Write unit test for is_valid_title() rejecting whitespace-only"
Task T016: "Write unit test for is_valid_title() rejecting 1001+ chars"
Task T017: "Write unit test for TaskStorage.add_task()"
Task T018: "Write unit test for TaskStorage.generate_id() sequential IDs"
Task T019: "Write unit test for TaskService.add_task() with valid title"
Task T020: "Write unit test for TaskService.add_task() rejecting empty title"
Task T021: "Write integration test for CLI 'todo add Buy groceries'"
Task T022: "Write integration test for CLI 'todo add' empty error"
```

All 10 test tasks can be written in parallel before any implementation begins.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (Tasks T001-T006)
2. Complete Phase 2: Foundational (Tasks T007-T012) - CRITICAL
3. Complete Phase 3: User Story 1 (Tasks T013-T030)
   - Write all tests first (T013-T022) - ensure they FAIL
   - Implement functionality (T023-T030) - make tests PASS
4. **STOP and VALIDATE**: Run `pytest` - all US1 tests should pass
5. **MANUAL TEST**: Run `todo add "Test task"` and `todo add ""`
6. Deploy/demo if ready - **This is your MVP!**

### Incremental Delivery

1. **Foundation** (Phase 1 + 2): Setup + Core models/storage → ~6 tasks → Foundation ready
2. **MVP** (Phase 3): Add User Story 1 → ~18 tasks → Test independently → **Deployable MVP!**
3. **Enhancement 1** (Phase 4): Add User Story 2 → ~6 tasks → Test independently → Deploy/Demo
4. **Enhancement 2** (Phase 5): Add User Story 3 → ~7 tasks → Test independently → Deploy/Demo
5. **Production Ready** (Phase 6): Polish → ~10 tasks → Final validation → Production deploy

Each phase adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. **Setup Phase**: Team completes together (~1 hour)
2. **Foundational Phase**: Team completes together (CRITICAL - ~2 hours)
3. **Once Foundational is done**:
   - Developer A: Write all US1 tests (T013-T022)
   - Developer B: Write all US2 tests (T031-T033)
   - Developer C: Write all US3 tests (T037-T039)
4. **After tests written**:
   - Developer A: Implement US1 (T023-T030)
   - Developer B: Implement US2 (T034-T036)
   - Developer C: Implement US3 (T040-T043)
5. **Integration**: Each story completes independently, integrate at end

**Estimated Time** (per quickstart.md):
- Setup: 15 min
- Foundational: 25 min
- US1: 45 min (10 min models + 15 min storage + 20 min service/CLI)
- US2: 10 min (validation of existing behavior)
- US3: 15 min (extend duplicate detection)
- Polish: 20 min
- **Total**: ~130 minutes (~2 hours)

---

## Task Summary

| Phase | Task Count | Can Parallelize | Time Estimate |
|-------|-----------|-----------------|---------------|
| Phase 1: Setup | 6 | 4 tasks | 15 min |
| Phase 2: Foundational | 6 | 2-3 tasks | 25 min |
| Phase 3: US1 (MVP) | 18 | 10 tests | 45 min |
| Phase 4: US2 | 6 | 3 tests | 10 min |
| Phase 5: US3 | 7 | 3 tests | 15 min |
| Phase 6: Polish | 10 | 6 tasks | 20 min |
| **TOTAL** | **53 tasks** | **28 parallel** | **~130 min** |

### MVP Scope (Recommended)

**Include**: Phase 1 + Phase 2 + Phase 3 (User Story 1)
**Total**: 30 tasks
**Deliverable**: Users can add tasks with validation
**Time**: ~85 minutes

This MVP demonstrates:
- Complete TDD workflow
- Constitution compliance
- Deterministic behavior
- Clear error handling
- Production-quality code

---

## Notes

- [P] tasks = different files/functions, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD Discipline**: Write tests first (T013-T022), watch them FAIL, then implement (T023-T030)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution compliance: No databases, no UI, deterministic behavior, in-memory only
