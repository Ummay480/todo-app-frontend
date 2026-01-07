# Data Model: Add Task Feature

**Feature**: 001-add-task
**Date**: 2025-12-30
**Source**: Extracted from `spec.md` Key Entities section

## Core Entities

### Task

Represents a single todo item in the application.

**Schema**:

| Field | Type | Required | Constraints | Default | Description |
|-------|------|----------|-------------|---------|-------------|
| `id` | `int` | Yes | > 0, unique, auto-increment | Generated | Unique identifier for the task |
| `title` | `str` | Yes | 1-1000 chars, contains non-whitespace | None | Description of what needs to be done |
| `status` | `str` | Yes | Enum: ["pending", "completed"] | "pending" | Current state of the task |

**Python Type Representation**:

```python
from typing import TypedDict, Literal

TaskStatus = Literal["pending", "completed"]

class Task(TypedDict):
    id: int
    title: str
    status: TaskStatus
```

**Example Instance**:

```python
{
    "id": 1,
    "title": "Buy groceries",
    "status": "pending"
}
```

## Validation Rules

### Title Validation

Derived from FR-005: "System MUST validate that the title contains at least one non-whitespace character"

**Rules**:
1. **Non-empty**: Title cannot be an empty string
2. **Non-whitespace**: `title.strip()` must not be empty (catches spaces, tabs, newlines)
3. **Length limits**:
   - Minimum: 1 non-whitespace character
   - Maximum: 1000 characters (handles edge case from spec)
4. **Character types**: All Unicode characters allowed (supports internationalization)

**Validation Logic**:

```python
def is_valid_title(title: str) -> bool:
    """
    Validate task title according to FR-005.

    Returns:
        True if title is valid, False otherwise

    Examples:
        >>> is_valid_title("Buy groceries")
        True
        >>> is_valid_title("")
        False
        >>> is_valid_title("   ")
        False
        >>> is_valid_title("a" * 1001)
        False
    """
    if not isinstance(title, str):
        return False
    if not title.strip():  # Catches empty and whitespace-only
        return False
    if len(title) > 1000:  # Edge case from spec
        return False
    return True
```

### ID Generation

Derived from FR-004: "System MUST automatically assign a unique identifier to each task"

**Rules**:
1. **Auto-increment**: Start at 1, increment by 1 for each new task
2. **Uniqueness**: No two tasks can share the same ID within a session
3. **Determinism**: Given the same sequence of operations, IDs must be predictable

**Implementation Strategy**:

```python
class TaskManager:
    def __init__(self):
        self._tasks: list[Task] = []
        self._next_id: int = 1

    def generate_id(self) -> int:
        """Generate next unique task ID."""
        task_id = self._next_id
        self._next_id += 1
        return task_id
```

### Status Assignment

Derived from FR-003: "System MUST automatically assign a 'pending' status to newly created tasks"

**Rules**:
1. **Initial state**: All new tasks start with status "pending"
2. **No user override**: User cannot specify initial status (Phase-1 scope)
3. **Immutable on creation**: Status can only change via separate update commands (not in Phase-1)

## Data Relationships

### Current Phase (Phase-1: Add Task Only)

**No relationships**: Task is a standalone entity with no foreign keys or associations.

```
┌─────────────────┐
│      Task       │
├─────────────────┤
│ id: int (PK)    │
│ title: str      │
│ status: str     │
└─────────────────┘
```

### Future Phases (Deferred)

Potential relationships for future consideration (NOT implemented in Phase-1):
- Task → User (owner/creator)
- Task → Category/Tag (many-to-many)
- Task → Subtask (self-referential hierarchy)
- Task → DueDate (temporal data)

## Storage Model

### In-Memory Representation

**Structure**: Python `list` containing `dict` objects

```python
tasks: list[dict] = [
    {"id": 1, "title": "Buy groceries", "status": "pending"},
    {"id": 2, "title": "Write code", "status": "pending"},
    {"id": 3, "title": "Call dentist", "status": "pending"}
]
```

**Access Patterns**:

| Operation | Algorithm | Complexity | Justification |
|-----------|-----------|------------|---------------|
| Add task | Append to list | O(1) | Primary operation, must be fast |
| Check duplicates | Linear scan | O(n) | Acceptable for Phase-1 demo scale |
| Get task by ID | Linear scan | O(n) | Not required in Phase-1 |
| List all tasks | Iterate list | O(n) | Required for future list command |

**Why not dict-by-ID?**
- Add Task feature doesn't require ID lookup
- List structure simpler for iteration (future list command)
- Dictionary would require separate duplicate-check index

## State Transitions

### Task Status State Machine

**Current Phase (Phase-1)**:

```
┌─────────┐
│ Created │
└────┬────┘
     │
     ▼
┌──────────┐
│ pending  │  ◄── All new tasks
└──────────┘
```

**Future Phases (Deferred)**:

```
┌─────────┐
│ Created │
└────┬────┘
     │
     ▼
┌──────────┐      complete      ┌───────────┐
│ pending  │ ─────────────────► │ completed │
└──────────┘                     └───────────┘
     │                                 │
     │ delete                   delete │
     ▼                                 ▼
┌──────────┐                     ┌──────────┐
│ deleted  │ ◄──────────────────│ deleted  │
└──────────┘                     └──────────┘
```

## Duplicate Detection

Derived from FR-006: "System SHOULD check for existing tasks with the same title"

### Duplicate Definition

**Exact match**: Case-sensitive string equality

```python
def has_duplicate(tasks: list[Task], new_title: str) -> bool:
    """
    Check if a task with the same title already exists.

    Args:
        tasks: Existing task list
        new_title: Title of new task to check

    Returns:
        True if duplicate found, False otherwise

    Examples:
        >>> has_duplicate([{"id": 1, "title": "Buy groceries", "status": "pending"}], "Buy groceries")
        True
        >>> has_duplicate([{"id": 1, "title": "Buy groceries", "status": "pending"}], "buy groceries")
        False  # Case-sensitive
    """
    return any(task["title"] == new_title for task in tasks)
```

**Why case-sensitive?**
- CLI tools typically treat input as literal
- "Buy Groceries" vs "buy groceries" could be intentionally different
- User can always delete unwanted duplicates (future feature)

**Why not fuzzy matching?**
- Non-deterministic (violates constitution)
- Ambiguous threshold ("Buy groceries" vs "Buy grocery" - 90% similar?)
- Adds complexity without clear user benefit in Phase-1

## Data Constraints Summary

| Constraint | Enforcement Point | Error Handling |
|------------|-------------------|----------------|
| Title non-empty | Service layer validation | Return validation error, don't create task |
| Title max 1000 chars | Service layer validation | Return validation error, don't create task |
| ID uniqueness | Storage layer (auto-increment) | Cannot fail (guaranteed by counter) |
| Status = "pending" | Service layer defaults | Cannot fail (hard-coded) |
| Duplicate warning | Service layer check | Create task anyway, return warning message |

## Serialization (Future Phase)

**Not implemented in Phase-1**, but data model is JSON-serializable for future persistence:

```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "status": "pending"
  },
  {
    "id": 2,
    "title": "Write code",
    "status": "pending"
  }
]
```

This enables seamless migration to file-based or database storage in Phase-2.
