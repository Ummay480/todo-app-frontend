# Research: Add Task Feature

**Feature**: 001-add-task
**Date**: 2025-12-30
**Purpose**: Resolve technical unknowns and establish implementation approach

## Technical Decisions

### Decision 1: Programming Language and Version

**Decision**: Python 3.11+

**Rationale**:
- CLI development well-supported with `argparse` (standard library) or `click`/`typer` (popular libraries)
- Excellent for rapid prototyping while maintaining production quality
- Strong standard library for in-memory data structures (list, dict)
- Rich ecosystem for testing (`pytest`, `unittest`)
- Cross-platform compatibility (Linux, macOS, Windows)
- Hackathon-friendly: fast iteration, readable code, minimal boilerplate

**Alternatives Considered**:
- **Node.js/TypeScript**: Good CLI tooling (`commander`, `yargs`), but adds build complexity for TypeScript
- **Rust**: Excellent performance and safety, but slower development velocity for Phase-1 scope
- **Go**: Clean CLI patterns, but overkill for in-memory todo app
- **Bash**: Lightweight, but limited for structured data and testing

### Decision 2: CLI Framework

**Decision**: Python `argparse` (standard library)

**Rationale**:
- Zero external dependencies (aligns with simplicity principle)
- Sufficient for basic command structure: `todo add "task title"`
- Built-in help generation and error messages
- Deterministic behavior guaranteed
- Well-documented and stable

**Alternatives Considered**:
- **Click**: More features (command groups, decorators), but adds dependency
- **Typer**: Modern CLI with type hints, but adds dependency and complexity
- **Fire**: Google's library, but too magical (violates determinism principle)
- **Manual sys.argv parsing**: Too low-level, error-prone

### Decision 3: In-Memory Storage Structure

**Decision**: Python `list` of `dict` objects

**Rationale**:
- Simple and transparent: `[{"id": 1, "title": "...", "status": "pending"}, ...]`
- Direct mapping from spec's Key Entities (Task with ID, Title, Status)
- O(n) lookup acceptable for Phase-1 scope (no performance requirement for large datasets)
- Easy to implement duplicate detection (iterate and compare titles)
- Serializable for future persistence (JSON-compatible)
- No global mutable state if encapsulated in a class

**Alternatives Considered**:
- **Dictionary by ID**: `{1: {"title": "...", "status": "..."}}` - requires separate index for duplicate detection
- **Custom Task class**: Over-engineering for Phase-1; dict is sufficient
- **SQLite in-memory**: Violates constitution (databases forbidden in Phase-1)
- **Pandas DataFrame**: Heavy dependency for simple todo list

### Decision 4: ID Generation Strategy

**Decision**: Auto-incrementing integer starting from 1

**Rationale**:
- Deterministic and predictable (aligns with constitution)
- Human-readable for CLI output
- Simple to implement: track `next_id` counter
- No external dependencies (vs UUID requiring `uuid` module)
- Sufficient for single-session, single-user Phase-1 scope

**Alternatives Considered**:
- **UUID**: Globally unique, but overkill for in-memory single-session app; harder to read
- **Timestamp-based ID**: Not deterministic (violates constitution)
- **Hash of title**: Not guaranteed unique, complex error handling

### Decision 5: Testing Framework

**Decision**: `pytest`

**Rationale**:
- Industry standard for Python testing
- Simple assertion syntax (no `self.assertEqual` boilerplate)
- Excellent fixture support for test data setup
- Built-in parametrization for edge case testing
- Clear, readable test reports
- Integrates with CI/CD for future phases

**Alternatives Considered**:
- **unittest**: Standard library, but more verbose and less readable
- **nose2**: Outdated, pytest supersedes it
- **doctest**: Good for examples, but insufficient for comprehensive testing

### Decision 6: Duplicate Detection Algorithm

**Decision**: Case-sensitive exact string match with O(n) linear scan

**Rationale**:
- Spec requires warning on duplicate title detection (FR-006)
- Simple implementation: `any(task["title"] == new_title for task in tasks)`
- Deterministic behavior (constitution requirement)
- Case-sensitive matches common CLI tool expectations
- Performance acceptable for Phase-1 scope (no scale requirement)

**Alternatives Considered**:
- **Case-insensitive matching**: Could confuse users ("Buy groceries" vs "buy groceries")
- **Fuzzy matching**: Non-deterministic, violates constitution
- **Hash-based index**: Premature optimization for Phase-1

### Decision 7: Error Handling Strategy

**Decision**: Exception-based with user-friendly messages

**Rationale**:
- Constitution requires clear, actionable error messages
- Use custom exception class: `TodoError` for app-specific errors
- Map exceptions to exit codes: success (0), validation error (1), system error (2)
- Never expose stack traces to user (log only)
- Format: `ERROR: <description>\nSuggestion: <action>\nCode: <code>`

**Alternatives Considered**:
- **Return codes**: Less Pythonic, harder to propagate errors
- **Result objects**: Over-engineering for Phase-1 CLI
- **Silent failures**: Forbidden by constitution

### Decision 8: Project Structure

**Decision**: Single-project structure (Option 1 from template)

**Rationale**:
- Phase-1 is CLI-only (no frontend/backend split needed)
- Constitution forbids UI, databases, external APIs
- Simple structure supports rapid development:
  ```
  src/
  ├── models/      # Task data structure
  ├── services/    # Business logic (add, validate)
  ├── cli/         # Argparse command handlers
  └── lib/         # Shared utilities (ID generation)

  tests/
  ├── unit/        # Unit tests for services, models
  └── integration/ # End-to-end CLI tests
  ```

**Alternatives Considered**:
- **Web app structure**: Violates Phase-1 scope (no frontend allowed)
- **Flat structure**: Poor organization for future features
- **Monolithic script**: Untestable, violates separation of concerns

## Implementation Approach

### Architecture Pattern

**Pattern**: Service Layer Architecture

**Components**:
1. **CLI Layer** (`src/cli/`): Argparse handlers, input parsing, output formatting
2. **Service Layer** (`src/services/`): Business logic (add task, validate, duplicate check)
3. **Model Layer** (`src/models/`): Data structures and validation rules
4. **Storage Layer** (`src/lib/storage.py`): In-memory list management

**Data Flow**:
```
User Input → CLI Parser → Service → Model Validation → Storage → Response Formatter → User Output
```

### Key Technical Constraints

| Constraint | Implementation Strategy |
|------------|------------------------|
| 100ms feedback (SC-002) | No I/O, pure in-memory operations |
| 100% empty title rejection (SC-004) | Validate before adding: `if not title.strip()` |
| Deterministic behavior | No randomness, no timestamps in logic |
| No global state | Encapsulate storage in `TaskManager` class |
| Session-only persistence | No file writes, data cleared on exit |

### Testing Strategy

1. **Unit Tests**:
   - Test each service function independently
   - Mock storage layer for isolation
   - Parametrize edge cases (empty, whitespace, long titles)

2. **Integration Tests**:
   - Invoke CLI commands programmatically
   - Capture stdout/stderr for assertion
   - Test full user scenarios from spec

3. **Contract Tests**:
   - Validate command syntax matches spec
   - Ensure error messages match constitution format
   - Verify exit codes for different scenarios

## Dependencies

### Core Dependencies

- **Python 3.11+**: Runtime environment
- **argparse**: CLI framework (standard library, no install needed)

### Development Dependencies

- **pytest**: Testing framework
- **pytest-cov**: Code coverage reporting
- **black**: Code formatter (PEP 8 compliance)
- **mypy**: Type checking (optional but recommended)

### Dependency Justification

All dependencies align with constitution principles:
- Minimal external dependencies (only testing tools)
- No databases, no web frameworks
- No async libraries (synchronous only)

## Risk Analysis

| Risk | Mitigation |
|------|------------|
| Argparse complexity for multi-command CLI | Start simple, refactor if needed in Phase-2 |
| Linear scan performance with 1000+ tasks | Acceptable for Phase-1 demo; defer optimization |
| Case-sensitive duplicate detection UX | Document behavior clearly in help text |
| No undo for duplicate creation | Accept as Phase-1 limitation; add in Phase-2 |

## Next Steps

1. Create `data-model.md` defining Task entity schema
2. Design CLI contract (command syntax, arguments, options)
3. Generate test cases from acceptance scenarios
4. Implement service layer with TDD discipline
