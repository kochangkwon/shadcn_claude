---
template: plan
version: 1.2
feature: api-usage-table-refactoring
date: 2026-02-01
author: Claude Sonnet 4.5
project: shadcn-cluade
version: 0.1.0
status: Draft
---

# API Usage Table Refactoring Planning Document

> **Summary**: Refactor 504-line api-usage-table.tsx into smaller, maintainable components following Single Responsibility Principle
>
> **Project**: shadcn-cluade
> **Version**: 0.1.0
> **Author**: Claude Sonnet 4.5
> **Date**: 2026-02-01
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

The current `components/dashboard/api-usage-table.tsx` file has grown to 504 lines, exceeding the recommended 300-line limit and violating the Single Responsibility Principle. This refactoring will:

- **Improve maintainability** by splitting concerns into focused components
- **Enhance readability** by reducing cognitive load per file
- **Enable reusability** by extracting common patterns
- **Facilitate testing** by creating isolated, testable units

### 1.2 Background

**Current Issues** (identified in Code Review):
- File exceeds 504 lines (300-line limit recommended)
- Combines multiple responsibilities:
  - Table rendering and layout
  - Drag-and-drop state management
  - Detail sheet with chart
  - Form fields and selectors
  - Mock data generation
- 5 separate useState hooks managing related state
- Hardcoded mock data (65 lines) at file top
- Chart data generation function called inline in JSX

**Code Review Score Impact**:
- Before P0 fixes: 62/100
- After P0 fixes: 88/100
- **This refactoring targets**: 92-95/100 (addressing P1 warnings)

### 1.3 Related Documents

- Code Review Report: Generated 2026-02-01 (agent ID: a179c7c)
- Original Issue: File length warning #7 from code-analyzer
- Referenced Best Practice: bkit Core Rules - Code Quality Standards

---

## 2. Scope

### 2.1 In Scope

- [x] **Split main component** into 4 sub-components:
  - `UsageTable` - Table UI and row selection logic
  - `UsageDetailSheet` - Detail view sheet with chart
  - `UsageTableRow` - Individual row rendering (optional)
  - Custom hook: `useDragReorder` - Drag-and-drop state management

- [x] **Extract data layer**:
  - Move `initialData` to `lib/data/mock-usage-data.ts`
  - Move `generateDetailChartData()` to `lib/utils/chart-data-generator.ts`

- [x] **Extract utility functions**:
  - `getStatusBadge()` → `lib/utils/status-badge.tsx`
  - `detailChartConfig` → move to chart component or config file

- [x] **Preserve all functionality**:
  - Table rendering with drag-and-drop reordering
  - Row selection (individual + select all)
  - Detail sheet opening on row click
  - Chart display in detail sheet
  - Form fields in detail sheet

- [x] **Maintain performance improvements**:
  - Keep `useMemo` for chart data (P0 fix)

### 2.2 Out of Scope

- Adding new features or functionality
- API integration (still using mock data)
- Changing component behavior or UX
- Adding tests (separate task after refactoring)
- Removing hardcoded trend percentages (P1 warning #19, separate task)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | Main component delegates to sub-components without losing functionality | High | Pending |
| FR-02 | Drag-and-drop reordering works identically after split | High | Pending |
| FR-03 | Row selection state managed consistently | High | Pending |
| FR-04 | Detail sheet opens with correct data and chart | High | Pending |
| FR-05 | All imports and exports remain functional | High | Pending |
| FR-06 | File sizes reduced below 300 lines each | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Code Quality | File length < 300 lines per file | Line count verification |
| Performance | No performance regression (useMemo preserved) | Manual testing + comparison |
| Type Safety | All TypeScript types preserved and correct | tsc --noEmit |
| Maintainability | Clear separation of concerns | Code review |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [x] `api-usage-table.tsx` reduced to < 150 lines (orchestration only)
- [x] Sub-components created with clear responsibilities
- [x] Data and utilities moved to `/lib` folder
- [x] All existing functionality works identically
- [x] TypeScript compilation succeeds with no errors
- [x] Code review score improves to 92+/100

### 4.2 Quality Criteria

- [x] No file exceeds 300 lines
- [x] Each component has single, clear responsibility
- [x] No code duplication introduced
- [x] Build succeeds without warnings
- [x] Gap analysis shows 95%+ match with design

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Breaking existing functionality during split | High | Medium | Incremental refactoring with verification at each step |
| Import circular dependencies | Medium | Low | Careful import structure planning, use barrel exports |
| State management issues across components | High | Medium | Use custom hook pattern, prop drilling minimized |
| Performance degradation | Medium | Low | Preserve memoization, verify no unnecessary re-renders |
| Type errors after splitting | Low | Medium | Run `tsc --noEmit` after each file creation |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | ☑ |
| **Dynamic** | Feature-based modules, services layer | Web apps with backend, SaaS MVPs | ☐ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems, complex architectures | ☐ |

**Rationale**: Current project uses Starter-level structure (`components/`, `lib/`, `app/`). Refactoring will follow existing pattern.

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Component Split Pattern | Feature-based / Layer-based | Layer-based | Matches existing Starter structure |
| State Management | Props / Context / Zustand | Props + Custom Hook | Simple, no external dependency needed |
| File Organization | Flat / Nested | Nested by concern | `/lib/data`, `/lib/utils` separation |
| Import Pattern | Named / Default | Named (shadcn convention) | Consistency with existing codebase |

### 6.3 Folder Structure (After Refactoring)

```
components/
├── dashboard/
│   ├── api-usage-table.tsx              (150 lines - orchestration)
│   ├── usage-table.tsx                  (NEW - 120 lines - table UI)
│   ├── usage-detail-sheet.tsx           (NEW - 180 lines - detail sheet)
│   └── hooks/
│       └── use-drag-reorder.ts          (NEW - 80 lines - DnD logic)
lib/
├── data/
│   └── mock-usage-data.ts               (NEW - 70 lines - initialData)
└── utils/
    ├── chart-data-generator.ts          (NEW - 30 lines - generateDetailChartData)
    └── status-badge.tsx                 (NEW - 25 lines - getStatusBadge)
```

**Line Distribution**:
- `api-usage-table.tsx`: 504 → **~150 lines** (70% reduction)
- New components: 4 files totaling ~505 lines
- **Average file size**: ~126 lines (all under 200-line target)

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [x] `CLAUDE.md` exists (checked)
- [ ] `docs/01-plan/conventions.md` exists (not yet)
- [ ] ESLint configuration (`.eslintrc.*`) - not found
- [x] Prettier configuration (`.prettierrc`) - using defaults
- [x] TypeScript configuration (`tsconfig.json`)

### 7.2 Conventions to Apply

| Category | Rule | Source |
|----------|------|--------|
| **Naming** | PascalCase components, camelCase functions | Existing codebase |
| **Folder structure** | `/components/dashboard`, `/lib/data`, `/lib/utils` | Starter level convention |
| **Import order** | React → UI libs → local components → utils | shadcn convention |
| **File naming** | kebab-case for files, PascalCase exports | Next.js convention |
| **Hook naming** | `use-{purpose}.ts` in `/hooks` folder | React best practice |

### 7.3 Component Responsibility Map

| Component | Responsibility | Dependencies |
|-----------|----------------|--------------|
| `ApiUsageTable` | Orchestration, layout | Sub-components |
| `UsageTable` | Table rendering, selection UI | UI components |
| `UsageDetailSheet` | Sheet content, chart display | UI, chart components |
| `useDragReorder` | DnD state + handlers | React useState |

---

## 8. Implementation Strategy

### 8.1 Phase 1: Extract Data Layer (Low Risk)

**Files to create**:
1. `lib/data/mock-usage-data.ts` - Export `initialData`, `UsageData` type
2. `lib/utils/chart-data-generator.ts` - Export `generateDetailChartData()`
3. `lib/utils/status-badge.tsx` - Export `getStatusBadge()`

**Verification**: Import in main file, run build

### 8.2 Phase 2: Extract Custom Hook (Medium Risk)

**File to create**:
- `components/dashboard/hooks/use-drag-reorder.ts`

**Exports**:
```typescript
export function useDragReorder<T extends { id: string }>(initialData: T[]) {
  // Returns: { data, draggedItem, dragOverId, handlers }
}
```

**Verification**: Replace useState calls in main file

### 8.3 Phase 3: Extract Detail Sheet (Medium Risk)

**File to create**:
- `components/dashboard/usage-detail-sheet.tsx`

**Props**:
```typescript
interface UsageDetailSheetProps {
  item: UsageData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}
```

**Verification**: Sheet opens correctly with data

### 8.4 Phase 4: Extract Table Component (Low Risk)

**File to create**:
- `components/dashboard/usage-table.tsx`

**Props**:
```typescript
interface UsageTableProps {
  data: UsageData[]
  selectedRows: Set<string>
  onSelectAll: (checked: boolean) => void
  onSelectRow: (id: string, checked: boolean) => void
  onRowClick: (item: UsageData) => void
  dragHandlers: DragHandlers // from useDragReorder
}
```

**Verification**: Table renders and selection works

### 8.5 Phase 5: Cleanup Main File (Final)

- Remove extracted code
- Import sub-components
- Verify build and functionality

---

## 9. Testing Checklist

### 9.1 Functional Tests (Manual)

- [ ] Table displays 8 mock data rows
- [ ] Drag-and-drop reordering works
- [ ] "Select all" checkbox functions correctly
- [ ] Individual row selection works
- [ ] Clicking row Type opens detail sheet
- [ ] Detail sheet displays correct item data
- [ ] Chart renders in detail sheet
- [ ] Chart doesn't flicker on interactions (useMemo working)
- [ ] Sheet close button works
- [ ] Form fields display in sheet

### 9.2 Code Quality Tests

- [ ] `npm run build` succeeds
- [ ] `tsc --noEmit` passes with 0 errors
- [ ] No new ESLint warnings
- [ ] All files < 300 lines
- [ ] No code duplication detected

---

## 10. Rollback Plan

If critical issues occur:

1. **Git rollback**: `git checkout components/dashboard/api-usage-table.tsx` (pre-refactor version)
2. **Delete new files**: Remove created files in `/lib` and sub-components
3. **Restore imports**: Revert changes in parent components

**Backup Strategy**: Create git branch `refactor/api-usage-table` before starting

---

## 11. Next Steps

1. [ ] Create design document (`api-usage-table-refactoring.design.md`)
   - Component interface specifications
   - Props and type definitions
   - File structure diagram

2. [ ] Team review and approval (if applicable)

3. [ ] Start implementation (follow phases 1-5)

4. [ ] Gap analysis after implementation

5. [ ] Generate completion report

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-01 | Initial draft | Claude Sonnet 4.5 |
