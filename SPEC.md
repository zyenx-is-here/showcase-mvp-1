# ZyenxBoard - Specification

## Overview
A local Kanban board for task management between Bastian (human) and Zyenx (AI).
Single HTML file with embedded CSS/JS. No server required.

## Design
- **Theme:** Dark futuristic, electric blue (#00D4FF) + deep black (#0a0a0f)
- **Style:** Glassmorphism, soft rounded corners (16px), subtle glow effects
- **Font:** Inter or system sans-serif
- **Animations:** Smooth transitions (200-300ms), subtle hover effects

## Layout
```
┌─────────────────────────────────────────────────────────┐
│  ⚡ ZyenxBoard                          [+ New Task]    │
├─────────────────────────────────────────────────────────┤
│  BACKLOG    │  IN PROGRESS  │  REVIEW    │  DONE       │
│  ─────────  │  ───────────  │  ───────   │  ────       │
│  ┌───────┐  │  ┌───────┐    │            │  ┌───────┐  │
│  │ Task  │  │  │ Task  │🔵  │            │  │ Task  │  │
│  │       │  │  │       │    │            │  │       │  │
│  └───────┘  │  └───────┘    │            │  └───────┘  │
│             │               │            │             │
└─────────────────────────────────────────────────────────┘
```

## Features

### Core
- 4 columns: Backlog, In Progress, Review, Done
- Drag & drop tasks between columns
- LocalStorage persistence
- Task cards with: title, description, priority, due date, created date

### Zyenx Signature Features
1. **Pulse Indicator (🔵)** - Blue pulsing dot on tasks marked "Zyenx Working"
2. **Quick Add** - Text input at top, press Enter to add to Backlog
3. **Task JSON Export/Import** - For syncing with Zyenx
4. **Due Dates** - Visual indicator for upcoming and overdue tasks

## Task Card Structure
```json
{
  "id": "uuid",
  "title": "Task title",
  "description": "Optional description",
  "priority": "low|medium|high",
  "status": "backlog|progress|review|done",
  "dueDate": "YYYY-MM-DD",
  "zyenxWorking": false,
  "createdAt": "ISO date",
  "completedAt": "ISO date or null"
}
```

## Technical
- Single index.html file
- No external dependencies (vanilla JS)
- CSS Grid for layout
- Native drag & drop API
- LocalStorage for persistence

## File Output
Create: `index.html` (single file, complete and working)
