# Quickstart Guide: Add Task Implementation

**Feature**: 001-add-task
**Date**: 2025-12-30
**For**: Developers implementing the Add Task feature

## Overview

This guide provides a step-by-step implementation path for the Add Task feature, following Test-Driven Development (TDD) principles.

## Prerequisites

- Python 3.11+ installed
- Virtual environment created
- pytest installed (`pip install pytest pytest-cov`)

## Project Structure

Create the following directory structure:

```
todo-app/
├── src/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Task data structure and validation
│   ├── services/
│   │   ├── __init__.py
│   │   └── task_service.py  # Business logic for task operations
│   ├── lib/
│   │   ├── __init__.py
│   │   └── storage.py       # In-memory storage manager
│   └── cli/
│       ├── __init__.py
│       └── main.py          # CLI entry point and command handlers
├── tests/
│   ├── __init__.py
│   ├── unit/
│   │   ├── __init__.py
│   │   ├── test_task.py
│   │   ├── test_task_service.py
│   │   └── test_storage.py
│   └── integration/
│       ├── __init__.py
│       └── test_cli.py
└── pyproject.toml           # Project configuration
```

## Implementation Steps (TDD Cycle)

### Step 1: Define Task Model (10 min)

**File**: `src/models/task.py`

**What to implement**:
- `Task` TypedDict definition
- `is_valid_title()` validation function
- Constants for status values

**Test first** (`tests/unit/test_task.py`):
```python
def test_valid_title():
    assert is_valid_title("Buy groceries") == True

def test_empty_title_invalid():
    assert is_valid_title("") == False

def test_whitespace_title_invalid():
    assert is_valid_title("   ") == False

def test_long_title_invalid():
    assert is_valid_title("a" * 1001) == False
```

**Expected result**: 4 failing tests → implement → 4 passing tests

**Reference**: See `data-model.md` for validation rules

---

### Step 2: Implement Storage Layer (15 min)

**File**: `src/lib/storage.py`

**What to implement**:
- `TaskStorage` class with in-memory list
- `add_task(task: Task) -> None` method
- `get_all_tasks() -> list[Task]` method
- `has_duplicate(title: str) -> bool` method
- `generate_id() -> int` method

**Test first** (`tests/unit/test_storage.py`):
```python
def test_add_task():
    storage = TaskStorage()
    task = {"id": 1, "title": "Test", "status": "pending"}
    storage.add_task(task)
    assert len(storage.get_all_tasks()) == 1

def test_generate_sequential_ids():
    storage = TaskStorage()
    assert storage.generate_id() == 1
    assert storage.generate_id() == 2
    assert storage.generate_id() == 3

def test_has_duplicate():
    storage = TaskStorage()
    storage.add_task({"id": 1, "title": "Task 1", "status": "pending"})
    assert storage.has_duplicate("Task 1") == True
    assert storage.has_duplicate("Task 2") == False
```

**Expected result**: 3 failing tests → implement → 3 passing tests

**Reference**: See `data-model.md` for storage design

---

### Step 3: Implement Task Service (20 min)

**File**: `src/services/task_service.py`

**What to implement**:
- `TaskService` class (depends on `TaskStorage`)
- `add_task(title: str) -> dict` method returning `{"success": bool, "task": Task, "warning": str | None}`
- Input validation logic
- Duplicate detection logic

**Test first** (`tests/unit/test_task_service.py`):
```python
def test_add_valid_task():
    service = TaskService()
    result = service.add_task("Buy groceries")
    assert result["success"] == True
    assert result["task"]["title"] == "Buy groceries"
    assert result["task"]["status"] == "pending"
    assert result["warning"] is None

def test_add_empty_title_fails():
    service = TaskService()
    result = service.add_task("")
    assert result["success"] == False
    assert "error" in result

def test_add_duplicate_warns():
    service = TaskService()
    service.add_task("Task 1")
    result = service.add_task("Task 1")
    assert result["success"] == True
    assert result["warning"] is not None
    assert "already exists" in result["warning"]
```

**Expected result**: 3 failing tests → implement → 3 passing tests

**Reference**: See `contracts/cli-contract.md` for behavior spec

---

### Step 4: Implement CLI Layer (25 min)

**File**: `src/cli/main.py`

**What to implement**:
- `argparse` setup for `add` command
- `handle_add(args)` function
- Output formatting (success/warning/error messages)
- Exit code handling

**Test first** (`tests/integration/test_cli.py`):
```python
from click.testing import CliRunner  # or use subprocess

def test_cli_add_success():
    result = run_cli(["add", "Buy groceries"])
    assert result.exit_code == 0
    assert "✓ Task added" in result.output
    assert "Buy groceries" in result.output

def test_cli_add_empty_title():
    result = run_cli(["add", ""])
    assert result.exit_code == 1
    assert "ERROR" in result.output
    assert "cannot be empty" in result.output

def test_cli_add_duplicate_warning():
    run_cli(["add", "Task 1"])
    result = run_cli(["add", "Task 1"])
    assert result.exit_code == 0
    assert "⚠" in result.output or "Note:" in result.output
```

**Expected result**: 3 failing tests → implement → 3 passing tests

**Reference**: See `contracts/cli-contract.md` for exact output format

---

### Step 5: Integration Testing (15 min)

**File**: `tests/integration/test_cli.py`

**What to test**:
- Full user scenarios from `spec.md`
- Edge cases (special characters, unicode, long titles)
- Multiple sequential operations

**Test cases**:
```python
def test_user_story_1_scenario_1():
    """User adds a simple task."""
    result = run_cli(["add", "Buy groceries"])
    assert result.exit_code == 0
    assert "Buy groceries" in result.output
    assert "(ID: 1)" in result.output

def test_user_story_2_scenario_1():
    """User adds multiple tasks sequentially."""
    run_cli(["add", "Task 1"])
    run_cli(["add", "Task 2"])
    result = run_cli(["add", "Task 3"])
    assert "(ID: 3)" in result.output

def test_edge_case_unicode():
    """Unicode characters are supported."""
    result = run_cli(["add", "📝 日本語"])
    assert result.exit_code == 0
    assert "📝 日本語" in result.output
```

**Expected result**: All integration tests pass

---

## Running the Application

### Development Mode

```bash
# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run directly with Python
python -m src.cli.main add "Buy groceries"

# Or with entry point (if configured in pyproject.toml)
todo add "Buy groceries"
```

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run only unit tests
pytest tests/unit/

# Run only integration tests
pytest tests/integration/

# Run specific test file
pytest tests/unit/test_task_service.py

# Run with verbose output
pytest -v
```

## Verification Checklist

Before marking implementation complete, verify:

- [ ] All unit tests pass (target: 100% coverage for service layer)
- [ ] All integration tests pass
- [ ] Manual smoke test: `todo add "Test task"` works
- [ ] Error handling: `todo add ""` shows proper error message
- [ ] Duplicate warning: Adding same task twice shows warning
- [ ] Edge case: `todo add "$(python -c 'print("a" * 1001)')"` rejected
- [ ] Code formatted with `black` (PEP 8 compliance)
- [ ] Type hints added (run `mypy` if available)
- [ ] No hardcoded values (use constants from models)
- [ ] Constitution compliance: No databases, no UI, deterministic behavior

## Common Pitfalls

### Pitfall 1: Global Mutable State

**Problem**: Using module-level variables for storage
```python
# BAD
tasks = []  # Global mutable state

def add_task(title):
    tasks.append(...)  # Modifies global state
```

**Solution**: Encapsulate in a class
```python
# GOOD
class TaskStorage:
    def __init__(self):
        self._tasks = []  # Instance variable

    def add_task(self, task):
        self._tasks.append(task)
```

### Pitfall 2: Forgetting Validation

**Problem**: Adding task without checking title validity
```python
# BAD
def add_task(title):
    task = {"id": 1, "title": title, "status": "pending"}
    storage.add_task(task)
```

**Solution**: Always validate first
```python
# GOOD
def add_task(title):
    if not is_valid_title(title):
        return {"success": False, "error": "Invalid title"}
    task = {"id": storage.generate_id(), "title": title, "status": "pending"}
    storage.add_task(task)
    return {"success": True, "task": task}
```

### Pitfall 3: Inconsistent Exit Codes

**Problem**: Returning success exit code on errors
```python
# BAD
if error:
    print("ERROR: ...")
    sys.exit(0)  # Wrong! Should be non-zero
```

**Solution**: Use proper exit codes
```python
# GOOD
if error:
    print("ERROR: ...")
    sys.exit(1)  # Validation error
```

### Pitfall 4: Not Testing Edge Cases

**Problem**: Only testing happy path

**Solution**: Test from `spec.md` edge cases:
- Empty titles
- Whitespace-only titles
- 1000+ character titles
- Unicode characters
- Duplicate titles
- Special characters

## Performance Tips

### Tip 1: Avoid Unnecessary Loops

```python
# BAD: O(n²) for duplicate check
for task in tasks:
    for other in tasks:
        if task["title"] == other["title"]:
            ...

# GOOD: O(n) for duplicate check
return any(task["title"] == new_title for task in tasks)
```

### Tip 2: Reuse Storage Instance

```python
# BAD: Creating new storage for each command
def add_task(title):
    storage = TaskStorage()  # Fresh instance each time
    storage.add_task(...)

# GOOD: Singleton or passed instance
storage = TaskStorage()
service = TaskService(storage)
service.add_task(title)
```

## Next Steps

After completing Add Task implementation:

1. Run `/sp.tasks` to generate task breakdown
2. Execute tasks in order with TDD discipline
3. Create git commits for each completed task
4. Run constitution compliance check
5. Prepare demo for hackathon presentation

## Support Resources

- **Data Model**: `specs/001-add-task/data-model.md`
- **CLI Contract**: `specs/001-add-task/contracts/cli-contract.md`
- **Technical Decisions**: `specs/001-add-task/research.md`
- **Feature Spec**: `specs/001-add-task/spec.md`
- **Constitution**: `.specify/memory/constitution.md`
