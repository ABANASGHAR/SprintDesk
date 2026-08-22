# SprintDesk — Production Sprint Management Dashboard

SprintDesk is a modern, production-grade sprint management application engineered with React 19, TypeScript (strict mode), Vite, TanStack Query v5, Zustand, Tailwind CSS, Recharts, and `@dnd-kit/core`.

---

## 🚀 Live Demo & Repository

- **Repository**: [https://github.com/ABANASGHAR/SprintDesk.git](https://github.com/ABANASGHAR/SprintDesk.git)
- **Demo Credentials**:
  - **Username**: `emilys`
  - **Password**: `emilyspass`

---

## 🛠 Tech Stack & Architecture

### Core Technologies
- **Framework**: React 19+ (Vite Bundler)
- **Language**: TypeScript (Strict mode enabled, `verbatimModuleSyntax`)
- **Server State & Querying**: TanStack Query v5
- **Client & Persistent State**: Zustand (with selective `localStorage` persistence)
- **Styling & Design System**: Tailwind CSS v4 (Scratch-built components, Dark/Light mode)
- **Drag & Drop**: `@dnd-kit/core` & `@dnd-kit/sortable`
- **Data Visualisation**: Recharts
- **Routing & Guards**: React Router v7 (`React.lazy` code splitting + `Suspense`)
- **Testing**: Vitest + React Testing Library (15/15 unit tests passing)

### System Architecture & Data Flow
```text
┌────────────────────────────────────────────────────────┐
│                   UI Layer (Views)                     │
│    LoginPage  │  DashboardPage  │  BoardPage  │  Analytics │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│          State & Data Management Layer                 │
│  - Zustand Stores: useAuthStore, useBoardStore,        │
│    useNotificationStore, useThemeStore                 │
│  - TanStack Query: Caching, Lifecycle, Polling         │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│               API / Service Layer                      │
│  - authApi.ts (DummyJSON Auth & Token Management)      │
│  - tasksApi.ts (Mock JSON Abstraction Layer)           │
│  - notificationsApi.ts (JSONPlaceholder Polling)       │
│  - client.ts (Axios + Silent Refresh Interceptor)      │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                   Data Sources                         │
│  - DummyJSON (Auth / Refresh endpoints)                │
│  - JSONPlaceholder (/posts real-time poll)             │
│  - public/mock-data.json (Initial 30 tasks dataset)    │
└────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features & Requirements

### 1. Authentication & Security (Task 01)
- **DummyJSON Auth**: POST to `https://dummyjson.com/auth/login`.
- **JWT Lifecyle**: Access tokens kept securely in-memory; Refresh tokens persisted in `localStorage`.
- **Axios Interceptor**: Automatically attaches `Bearer <token>` to requests.
- **Silent Refresh & Auto-Retry**: Intercepts `401 Unauthorized`, requests a fresh token, and replays queued requests without user disruption.
- **Session Persistence & Guards**: `ProtectedRoute` and `PublicRoute` prevent unauthorized access and preserve user sessions on refresh.

### 2. Interactive Kanban Sprint Board (Task 02)
- **4 Workflow Columns**: *Backlog*, *In Progress*, *Review*, and *Done*.
- **Drag-and-Drop**: Built with `@dnd-kit/core` with smooth animations and `DragOverlay`. Supports cross-column and intra-column reordering.
- **Task Management**: Create tasks, edit priority/assignee/due date/story points in a side drawer, delete with confirmation.
- **Comments Thread**: Real-time comment addition with author and timestamp.
- **Undo Capability**: 10-step history stack (`undoLastAction`).
- **Filters & Search**: Multi-filtering by priority, assignee, and live search.

### 3. Analytics & Performance Visualisations (Task 03)
- **Sprint Velocity**: Dynamic comparison of planned vs completed story points.
- **Task Status Distribution**: Interactive Donut/Pie chart derived from live board state.
- **Priority Breakdown**: Stacked bar chart mapping urgency by column.
- **Completion Trend**: Real-time completion trajectory curve.

### 4. Custom Design System (Task 04)
Scratch-built reusable components with Tailwind CSS:
- `Button` (5 variants, 3 sizes, loading state)
- `Input` (labels, error states, helper texts, left/right icons)
- `Select` (custom options, error validation)
- `Modal` (Escape key, backdrop click, accessibility attributes)
- `Toast` (4 types, auto-dismiss, action callbacks)
- `DataTable` (column sorting, live search filter, pagination)
- `Skeleton` (animated loading pulse)

### 5. Real-Time Notifications (Task 05)
- Polling against JSONPlaceholder `/posts?_limit=5`.
- Novel post detection triggers unread badge count, popover pagination, and toast alerts.
- Page visibility listeners pause polling when the browser tab is hidden and resume on focus.

---

## 🧪 Testing Suite (Task 06)

15 unit tests covering critical user flows and state operations:
```bash
npm run test
```

- **`useToast.test.tsx`**: Toast addition, manual/auto dismiss, action button callbacks.
- **`boardStore.test.ts`**: Zustand board operations (add, move, update, delete, undo, comments).
- **`authInterceptor.test.ts`**: Bearer token attachment, expired token simulation, silent refresh & request retry.

---

## 📦 Setup & Local Development

### Prerequisites
- Node.js 18+
- npm / pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ABANASGHAR/SprintDesk.git
cd SprintDesk

# Install dependencies
npm install

# Start local dev server
npm run dev

# Run unit tests
npm run test

# Build production bundle
npm run build
```

---

## 🛡 Security Notes
- No secrets, API keys, or private credentials are committed.
- Pure public endpoints (DummyJSON & JSONPlaceholder) used for demo simulation.