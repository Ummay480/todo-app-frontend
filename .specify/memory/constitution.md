<!--
Sync Impact Report - Constitution v1.0.0
========================================
Version: 0.0.0 → 1.0.0 (MAJOR: Initial ratification)
Date: 2025-12-28

Changes:
- Initial constitution ratification for Phase-1 Todo CLI Application
- Established 10 foundational principles (Purpose, Philosophy, Scope, Agent Architecture, QA, Specification, Workflow, Error Handling, Evaluation, Enforcement)
- Defined hard scope boundaries (CLI-only, in-memory, no databases, no UI)
- Established strict agent hierarchy (Main Agent > Sub-Agents > Skills)
- Enforced quality gates and workflow order

Templates Status:
- ✅ spec-template.md: Aligned - mandatory user scenarios, acceptance criteria, edge cases match Section 6
- ✅ plan-template.md: Aligned - Constitution Check section ready for validation gates
- ✅ tasks-template.md: Aligned - user story organization supports deterministic execution
- ⚠ Command files: Located in .claude/commands/*.md (non-standard location; .specify/templates/commands/*.md not found)

Follow-up Actions:
- None - all templates validated and aligned with constitution principles
-->

# Todo CLI Application Constitution

This Constitution defines the non-negotiable laws, constraints, and quality standards of the project.

All agents, sub-agents, skills, specifications, tasks, and implementations MUST comply with this Constitution.

**No exceptions. No overrides.**

---

## 1. Project Purpose

The goal of Phase-1 is to build a robust, production-grade CLI Todo Application using AI-Driven Development with strict governance.

This phase is intentionally minimal in scope but maximal in quality.

### Core Objectives

- **Spec-Driven Development (SDD)**: No code without specification
- **Agent Orchestration**: Not prompt hacking - structured agent workflows
- **Reusable Intelligence**: Skills as durable, stateless units
- **Automatic QA Enforcement**: Quality gates block progress when violated
- **Deterministic Behavior**: Same input → same output, no randomness
- **Clear Separation of Concerns**: Agent hierarchy enforces responsibility boundaries
- **Zero Vibe-Coding**: Every decision traceable to specification or architectural record

---

## 2. Development Philosophy (Foundation Laws)

### 2.1 Specification is the Source of Truth

**Principle**: Specifications override assumptions, preferences, and shortcuts.

**Rules**:
- No code may exist without an approved specification
- Ambiguity MUST be resolved before planning begins
- Incomplete specifications are invalid and MUST be rejected
- Specifications are human-readable and machine-enforceable

**Rationale**: Prevents scope creep, reduces rework, ensures stakeholder alignment before resource investment.

---

### 2.2 Agents, Not Prompts

**Principle**: All meaningful work MUST be executed by agents or sub-agents. Skills are reusable intelligence units.

**Rules**:
- Ad-hoc prompting is FORBIDDEN
- Each agent has a defined scope and authority level
- Skills are stateless, deterministic, and invoked explicitly
- One-off instructions violate the architecture

**Rationale**: Ensures repeatability, traceability, and composability. Prevents workflow fragmentation and undocumented decision-making.

---

### 2.3 Quality Gate Over Speed

**Principle**: Fast but incorrect = FAILURE. Partial correctness = FAILURE.

**Rules**:
- Quality is enforced BEFORE progress is allowed
- Failing a quality gate MUST halt execution
- No "move fast and break things" exemptions
- Tests, linters, contract checks are non-negotiable

**Rationale**: Technical debt compounds exponentially. Early quality enforcement prevents cascading failures and reduces long-term cost.

---

### 2.4 Deterministic Behavior

**Principle**: Same input → same output. No randomness. No hidden or implicit state.

**Rules**:
- All CLI commands MUST produce predictable, documented output
- No stochastic algorithms without explicit seed control
- Global mutable state is FORBIDDEN
- Error messages MUST be consistent and machine-parseable

**Rationale**: Enables automated testing, debugging, and user trust. Critical for hackathon demo reliability.

---

## 3. Phase-1 Scope Boundaries (Hard Limits)

### Allowed

- CLI-based interaction ONLY
- In-memory data ONLY (no persistence across sessions)
- Single-user execution
- Synchronous commands
- Deterministic operations

### Forbidden (Automatic Failure)

The following are STRICTLY PROHIBITED in Phase-1 and will result in IMMEDIATE REJECTION:

- UI / Frontend (web, mobile, desktop GUI)
- Databases (SQL, NoSQL, file-based persistence)
- External APIs or network calls
- Background services or daemons
- Async workers or multi-threading
- Plugins or extension systems
- Uncontrolled global mutable state
- Code duplication (DRY principle violations)

**Rationale**: Phase-1 is a proof-of-concept for SDD governance. Scope creep is the primary risk. Hard boundaries force focus on architecture quality over feature breadth.

---

## 4. Agent Architecture Rules

### 4.1 Main Agent (Primary Authority)

**Agent**: `todo-spec-manager`

**Responsibilities**:
- Owns the Constitution and enforces compliance
- Approves or rejects specifications, plans, tasks, and implementations
- Owns all architectural decisions
- Acts as Brain + Controller + Judge

**Authority**: FINAL. No appeal mechanism. Main agent decisions are binding.

---

### 4.2 Sub-Agents

**Example**: `todo-domain-agent`

**Rules**:
- Advisory role ONLY - no approval authority
- CANNOT write code
- CANNOT create tasks
- CANNOT bypass main agent
- Operate strictly under main-agent supervision

**Rationale**: Prevents authority fragmentation. Sub-agents provide expertise; main agent retains decision rights.

---

### 4.3 Skills (Reusable Intelligence)

**Definition**: Stateless, deterministic, reusable units of work.

**Rules**:
- No decision-making authority
- Executed ONLY when invoked
- Must be idempotent where possible
- MUST NOT depend on external state

**Authority Flow**:
```
Constitution
   ↓
Main Agent (todo-spec-manager)
   ↓
Sub-Agents (todo-domain-agent, python-cli-expert, hackathon-review-agent)
   ↓
Skills (qa.validate-acceptance-criteria, qa.cli-integration-testing, etc.)
   ↓
Implementation
```

**Rationale**: Clear hierarchy prevents circular dependencies and authority conflicts. Skills enable reuse without coupling.

---

## 5. Quality Assurance (Mandatory)

**QA is NOT optional.**

### Quality Gates

- **FAIL**: Execution MUST stop immediately. No bypass mechanism.
- **CONDITIONAL**: Must be resolved before proceeding. Requires main agent approval.
- **PASS**: Proceed to next stage.

**Any QA violation results in automatic rejection.**

### Enforcement

Quality gates are checked:
- After specification creation
- After planning
- After task generation
- Before and after implementation
- During code review

**Rationale**: Automated quality enforcement removes human bias and ensures consistent standards.

---

## 6. Specification Rules

Every specification MUST include:

1. **Acceptance Criteria**: Clear, testable conditions for completion
2. **Edge Cases**: Boundary conditions, error scenarios, and invalid inputs
3. **Error Conditions**: Expected error messages and status codes
4. **Explicit CLI Commands**: Exact syntax and expected output
5. **Predictable Behavior**: Deterministic outcomes documented
6. **Human-Readable & Machine-Enforceable Format**: Structured YAML/Markdown

**Incomplete specifications are invalid and MUST be rejected.**

**Rationale**: Prevents ambiguity. Specifications serve as contracts between stakeholders, planners, and implementers.

---

## 7. Enforced Workflow Order (Strict)

The following workflow MUST be followed in order. Skipping or reordering steps is STRICTLY FORBIDDEN:

1. **Constitution**: Establish governance (this document)
2. **Specification**: Define requirements and acceptance criteria
3. **Planning**: Design architecture and implementation approach
4. **Task Creation**: Break plan into discrete, testable units
5. **Implementation**: Execute tasks with TDD discipline
6. **QA Validation**: Run automated quality checks
7. **Checklist Verification**: Manual review against constitution compliance

**Rationale**: Each stage builds on the previous. Out-of-order execution causes rework and scope drift.

---

## 8. Error Handling Principles

### Rules

- Errors MUST be clear and user-friendly (no jargon or internal codes exposed)
- Silent failures are FORBIDDEN (all errors MUST be logged and reported)
- Stack traces MUST NOT be exposed to end users (development mode exception allowed)
- CLI error messages MUST be deterministic and documented in specification

### Error Message Format

```
ERROR: [User-friendly description]
Suggestion: [Actionable next step]
Code: [Internal error code for debugging]
```

**Rationale**: Errors are user touchpoints. Poor error UX destroys trust. Consistent error handling enables automated testing.

---

## 9. Evaluation Criteria (Judge-Aligned)

This project will be evaluated on:

1. **Agent Architecture Clarity**: Is the agent hierarchy enforced? Are responsibilities clear?
2. **Skill Reusability**: Are skills stateless, documented, and reused across workflows?
3. **Specification Completeness**: Do specs include acceptance criteria, edge cases, and error conditions?
4. **QA Enforcement Discipline**: Are quality gates consistently applied? Any bypasses?
5. **Deterministic Behavior**: Can demos be repeated reliably? Are outputs predictable?
6. **Simplicity with Correctness**: Is the solution minimal yet complete? No over-engineering?

**Rationale**: These criteria align with hackathon judging rubrics (clarity, demo-ability, technical rigor).

---

## 10. Enforcement Clause

**Violation of any rule in this Constitution results in:**

**IMMEDIATE REJECTION OF THE WORK**

No negotiation. No exceptions.

---

## Governance

### Amendment Process

1. Proposed changes MUST be documented in an ADR (Architecture Decision Record)
2. Main agent (`todo-spec-manager`) MUST approve
3. Amended constitution MUST increment version according to semantic versioning
4. All dependent templates (spec, plan, tasks) MUST be updated for consistency
5. Migration plan required for breaking changes

### Versioning Policy

- **MAJOR**: Backward-incompatible governance changes (e.g., removing a principle)
- **MINOR**: New principles or sections added
- **PATCH**: Clarifications, typos, non-semantic refinements

### Compliance Review

- All specifications MUST reference constitution compliance
- All plans MUST include "Constitution Check" section
- All tasks MUST map to approved specifications
- All implementations MUST pass QA gates

### Runtime Guidance

- Development guidance: See `CLAUDE.md` for agent-specific instructions
- Governance log: See `.specify/memory/governance-log.md` for decision history

---

**Version**: 1.0.0 | **Ratified**: 2025-12-28 | **Last Amended**: 2025-12-28
