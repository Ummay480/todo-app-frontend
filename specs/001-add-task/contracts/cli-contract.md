# CLI Contract: Add Task Command

**Feature**: 001-add-task
**Date**: 2025-12-30
**Purpose**: Define exact command syntax, arguments, and behavior for the `add` command

## Command Overview

The `add` command creates a new todo task with a specified title.

## Command Syntax

```bash
todo add <title>
```

**Alternative forms**:
```bash
todo add "title with spaces"
todo add 'title with spaces'
```

## Arguments

| Argument | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `title` | string | Yes | The description of the task to create | `"Buy groceries"` |

## Options

**None** for Phase-1. Future phases may add:
- `--priority <level>`: Set task priority
- `--due <date>`: Set due date
- `--tag <name>`: Add tag to task

## Success Response

### Exit Code: 0

### Output Format

```
✓ Task added: "<title>" (ID: <id>)
```

**Example**:
```bash
$ todo add "Buy groceries"
✓ Task added: "Buy groceries" (ID: 1)
```

### Output Specification

| Element | Format | Notes |
|---------|--------|-------|
| Success indicator | `✓` (Unicode U+2713) or `[OK]` | Platform-dependent |
| Message | `Task added: "<title>" (ID: <id>)` | Title quoted, ID shown |
| Title display | Exact user input, no truncation | Handles long titles |
| ID display | Integer, no leading zeros | Human-readable |

## Warning Response (Duplicate Detected)

### Exit Code: 0 (still succeeds)

### Output Format

```
⚠ Task added: "<title>" (ID: <id>)
  Note: A task with this title already exists (ID: <existing_id>)
```

**Example**:
```bash
$ todo add "Buy groceries"
✓ Task added: "Buy groceries" (ID: 1)

$ todo add "Buy groceries"
⚠ Task added: "Buy groceries" (ID: 2)
  Note: A task with this title already exists (ID: 1)
```

### Behavior

- Task IS created despite duplicate (FR-006: "warn but allow")
- Warning message IS displayed
- Exit code remains 0 (not an error)

## Error Responses

### Error 1: Empty Title

**Exit Code**: 1

**Output Format**:
```
ERROR: Task title cannot be empty
Suggestion: Provide a non-empty title, e.g., todo add "Buy groceries"
Code: EMPTY_TITLE
```

**Triggers**:
- `todo add ""`
- `todo add "   "` (whitespace only)
- `todo add` (no argument)

**Example**:
```bash
$ todo add ""
ERROR: Task title cannot be empty
Suggestion: Provide a non-empty title, e.g., todo add "Buy groceries"
Code: EMPTY_TITLE
```

### Error 2: Title Too Long

**Exit Code**: 1

**Output Format**:
```
ERROR: Task title exceeds maximum length (1000 characters)
Suggestion: Shorten your title to 1000 characters or less
Code: TITLE_TOO_LONG
```

**Triggers**:
- `todo add "<1001+ character string>"`

**Example**:
```bash
$ todo add "$(python -c 'print("a" * 1001)')"
ERROR: Task title exceeds maximum length (1000 characters)
Suggestion: Shorten your title to 1000 characters or less
Code: TITLE_TOO_LONG
```

### Error 3: Invalid Command Usage

**Exit Code**: 2

**Output Format**:
```
usage: todo add <title>
todo add: error: the following arguments are required: title
```

**Triggers**:
- `todo add` (missing title argument)

**Example**:
```bash
$ todo add
usage: todo add <title>
todo add: error: the following arguments are required: title
```

## Edge Case Handling

### Edge Case 1: Special Characters in Title

**Input**: `todo add "Task with 'quotes' and \"escapes\""`

**Behavior**: Accept as-is, no escaping required

**Output**:
```
✓ Task added: "Task with 'quotes' and "escapes"" (ID: 1)
```

### Edge Case 2: Title Starts with Command Keyword

**Input**: `todo add "list all items"`

**Behavior**: Treat as literal title, not a command

**Output**:
```
✓ Task added: "list all items" (ID: 1)
```

**Rationale**: Title is a positional argument, parsed separately from commands

### Edge Case 3: Unicode and Emoji

**Input**: `todo add "📝 Buy groceries 日本語"`

**Behavior**: Accept all Unicode characters

**Output**:
```
✓ Task added: "📝 Buy groceries 日本語" (ID: 1)
```

### Edge Case 4: Newlines in Title (Shell-dependent)

**Input**: `todo add $'Line1\nLine2'` (bash syntax)

**Behavior**: Accept multi-line titles if shell allows

**Output**:
```
✓ Task added: "Line1
Line2" (ID: 1)
```

**Note**: Output may wrap or escape newlines depending on terminal

### Edge Case 5: Very Long Title (Under 1000 chars)

**Input**: `todo add "$(python -c 'print("a" * 999)')"`

**Behavior**: Accept and display full title (may truncate in terminal)

**Output**:
```
✓ Task added: "aaaaaaa..." (ID: 1)
```

**Note**: Full title stored in memory, display truncation is terminal-dependent

## Performance Requirements

Derived from Success Criteria:

| Metric | Requirement | Measurement |
|--------|-------------|-------------|
| Response time | < 100ms (SC-002) | Time from command invocation to output display |
| Success rate | 100% for valid input | All valid titles must be accepted |
| Rejection rate | 100% for empty titles (SC-004) | All empty/whitespace-only titles must be rejected |

## Testing Contract

### Unit Test Cases

```python
def test_add_valid_task():
    """Test adding a task with a valid title."""
    result = run_cli(["add", "Buy groceries"])
    assert result.exit_code == 0
    assert "✓ Task added" in result.output
    assert "Buy groceries" in result.output
    assert "(ID: 1)" in result.output

def test_add_empty_title():
    """Test that empty titles are rejected."""
    result = run_cli(["add", ""])
    assert result.exit_code == 1
    assert "ERROR: Task title cannot be empty" in result.output

def test_add_whitespace_only_title():
    """Test that whitespace-only titles are rejected."""
    result = run_cli(["add", "   "])
    assert result.exit_code == 1
    assert "ERROR: Task title cannot be empty" in result.output

def test_add_duplicate_task():
    """Test that duplicate titles trigger a warning."""
    run_cli(["add", "Buy groceries"])
    result = run_cli(["add", "Buy groceries"])
    assert result.exit_code == 0  # Still succeeds
    assert "⚠" in result.output or "Note:" in result.output
    assert "already exists" in result.output

def test_add_long_title():
    """Test that titles over 1000 characters are rejected."""
    long_title = "a" * 1001
    result = run_cli(["add", long_title])
    assert result.exit_code == 1
    assert "exceeds maximum length" in result.output

def test_add_unicode_title():
    """Test that Unicode characters are supported."""
    result = run_cli(["add", "📝 日本語"])
    assert result.exit_code == 0
    assert "📝 日本語" in result.output
```

### Integration Test Cases

Derived from spec User Scenarios:

**User Story 1, Scenario 1**:
```bash
$ todo add "Buy groceries"
✓ Task added: "Buy groceries" (ID: 1)
# Task should be retrievable in future list command
```

**User Story 1, Scenario 2**:
```bash
$ todo add ""
ERROR: Task title cannot be empty
Suggestion: Provide a non-empty title, e.g., todo add "Buy groceries"
Code: EMPTY_TITLE
# Exit code: 1
```

**User Story 2, Scenario 1**:
```bash
$ todo add "Task 1"
✓ Task added: "Task 1" (ID: 1)
$ todo add "Task 2"
✓ Task added: "Task 2" (ID: 2)
# Both tasks retained in memory
```

**User Story 3, Scenario 1**:
```bash
$ todo add "Buy groceries"
✓ Task added: "Buy groceries" (ID: 1)
$ todo add "Buy groceries"
⚠ Task added: "Buy groceries" (ID: 2)
  Note: A task with this title already exists (ID: 1)
# Both tasks created, warning shown
```

## Backward Compatibility

**Phase-1**: No compatibility concerns (initial implementation)

**Future Phases**: If command syntax changes, maintain backward compatibility:
- Optional arguments (use defaults if omitted)
- Deprecation warnings for old syntax
- Migration guide for breaking changes

## Security Considerations

### Command Injection

**Risk**: User input passed directly to shell
**Mitigation**: No shell execution in Phase-1 (pure Python)

### Input Sanitization

**Risk**: SQL injection, XSS
**Mitigation**: No database or web output in Phase-1

### Input Length

**Risk**: Memory exhaustion from extremely long input
**Mitigation**: 1000-character limit enforced

## Accessibility

### Screen Reader Compatibility

- Success/warning/error indicators use text (not just symbols)
- Alternative: `[OK]`, `[WARN]`, `[ERROR]` if Unicode not supported

### Color Blindness

- Do not rely solely on color for success/error indication
- Use symbols + text combination

## Localization (Future Phase)

**Phase-1**: English only
**Future**: Support for i18n error messages while keeping command names English
