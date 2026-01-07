# Feature Specification: Advanced Todo Features

**Feature Branch**: `005-advanced-features`
**Created**: 2025-12-31
**Status**: Draft
**Input**: User request for categories, tags, search, filters, and undo

## Overview

Extends the Todo CLI with advanced productivity features including categorization, tagging, search, filtering, and undo capabilities.

## User Scenarios & Testing

### User Story 1 - Categorize tasks (Priority: P1)

As a user, I want to assign categories to tasks so I can organize them by project or area.

**Acceptance Scenarios**:
1. **Given** I add a task, **When** I specify `--category work`, **Then** the task is tagged with "work" category
2. **Given** I list tasks, **When** I filter by `--category work`, **Then** only work tasks are shown

### User Story 2 - Tag tasks (Priority: P1)

As a user, I want to add multiple tags to tasks for flexible organization.

**Acceptance Scenarios**:
1. **Given** I add a task, **When** I specify `--tags urgent,important`, **Then** both tags are attached
2. **Given** I filter by tag, **When** I use `--tag urgent`, **Then** all urgent tasks appear

### User Story 3 - Search tasks (Priority: P2)

As a user, I want to search tasks by keywords to quickly find what I need.

**Acceptance Scenarios**:
1. **Given** I have multiple tasks, **When** I search for "bug", **Then** all tasks containing "bug" are shown

### User Story 4 - Filter tasks (Priority: P2)

As a user, I want to filter tasks by status, category, and tags to focus on specific work.

**Acceptance Scenarios**:
1. **Given** tasks with different statuses, **When** I filter `--status pending`, **Then** only pending tasks show
2. **Given** tasks with categories, **When** I combine `--category work --status pending`, **Then** only pending work tasks show

### User Story 5 - Undo last action (Priority: P3)

As a user, I want to undo my last action in case of mistakes.

**Acceptance Scenarios**:
1. **Given** I deleted a task by mistake, **When** I run `todo undo`, **Then** the task is restored

## Requirements

### Functional Requirements

**Task Model Enhancements**:
- FR-001: Tasks MUST support optional category field (string)
- FR-002: Tasks MUST support optional tags field (list of strings)
- FR-003: Tasks MUST track creation and modification timestamps

**Search & Filter**:
- FR-004: System MUST provide keyword search across title, category, and tags
- FR-005: System MUST support filtering by status (pending/completed)
- FR-006: System MUST support filtering by category
- FR-007: System MUST support filtering by tags (any/all modes)
- FR-008: System MUST support combined filters

**Undo System**:
- FR-009: System MUST track last destructive action (delete, complete, update)
- FR-010: System MUST provide undo command to reverse last action
- FR-011: Undo MUST work for delete, complete, and update operations

**CLI Commands**:
- FR-012: `add` command MUST accept `--category` and `--tags` options
- FR-013: `search <keyword>` command MUST search all text fields
- FR-014: `list` command MUST accept filter options
- FR-015: `undo` command MUST reverse last action

## Enhanced Data Model

```python
Task = {
    "id": int,
    "title": str,
    "status": "pending" | "completed",
    "category": str | None,        # NEW
    "tags": list[str],             # NEW
    "created_at": str,             # NEW (ISO format)
    "updated_at": str              # NEW (ISO format)
}
```

## CLI Command Reference

```bash
# Add with category and tags
todo add "Fix bug" --category work --tags urgent,bug

# List all
todo list

# Filter by status
todo list --status pending

# Filter by category
todo list --category work

# Filter by tag
todo list --tag urgent

# Combined filters
todo list --status pending --category work --tag urgent

# Search
todo search "bug"

# Complete
todo complete <id>

# Update with new category/tags
todo update <id> "New title" --category personal --tags home

# Delete
todo delete <id>

# Undo last action
todo undo

# Exit (if interactive mode)
todo exit
```

## Success Criteria

- SC-001: Users can categorize tasks
- SC-002: Users can tag tasks with multiple tags
- SC-003: Users can search by keyword
- SC-004: Users can filter by status, category, or tags
- SC-005: Users can undo last destructive action
- SC-006: All filters can be combined
