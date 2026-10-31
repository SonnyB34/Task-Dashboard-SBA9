# Task Dashboard

A task management app built with **React**, **TypeScript**, and **Vite**. You can add, edit, search, filter, sort, and reorder tasks, and your data is saved in the browser.

## Features

- Add, edit, and delete tasks
- Change a task's status: To do, In progress, or Done
- Form validation with clear error messages
- Search tasks by title or description
- Filter by status and priority, with active filter chips and a "Clear filters" button
- Sort by newest, due date, priority, or title
- Drag and drop to reorder tasks
- Dashboard statistics and a progress bar
- Light and dark mode toggle (your choice is remembered)
- Tasks are saved automatically with `localStorage`
- Export tasks to a JSON file and import them back
- Responsive layout and smooth transitions

## Setup

### Requirements

- [Node.js](https://nodejs.org/) version 18 or newer
- npm (comes with Node.js)

### Install and run

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd task-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open the link shown in the terminal (usually http://localhost:5173).

### Other commands

```bash
npm run build     # type-check and create a production build
npm run preview   # preview the production build locally
```

## Project Structure

```
task-dashboard/
├── src/
│   ├── components/
│   │   ├── TaskList/
│   │   │   ├── TaskList.tsx     # Renders the list and handles drag and drop
│   │   │   └── TaskItem.tsx     # One task card
│   │   ├── TaskForm/
│   │   │   └── TaskForm.tsx     # Add/edit form with validation
│   │   ├── TaskFilter/
│   │   │   └── TaskFilter.tsx   # Search, filters, sorting, filter chips
│   │   └── Dashboard/
│   │       └── Dashboard.tsx    # Combines everything, shows statistics
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces and types
│   ├── utils/
│   │   └── taskUtils.ts         # Filtering, sorting, validation, dates, storage
│   ├── App.tsx                  # Owns the app state (tasks and theme)
│   ├── index.css                # Styles, including light/dark themes
│   └── main.tsx                 # App entry point
├── index.html
└── package.json
```

## How It Works

**State management:** `App.tsx` holds the single list of tasks and the theme. It passes data down to child components as props. Child components send requests back up through callback props (such as `onDelete` and `onAdd`), and only `App` changes the list. Whenever the tasks change, they are saved to `localStorage`.

**Data flow:**

```
App  →  Dashboard  →  TaskList  →  TaskItem
 ↑          ↓
 └─ callbacks (add, edit, delete, status change, reorder)
```

## Component Props

| Component | Props | Purpose |
|---|---|---|
| `Dashboard` | `tasks`, `theme`, `onToggleTheme`, `onAdd`, `onUpdate`, `onDelete`, `onStatusChange`, `onReorder`, `onImport` | Lays out the page and holds filter and edit state |
| `TaskForm` | `editingTask`, `onSubmit`, `onCancel` | Controlled form for adding and editing tasks |
| `TaskFilter` | `filters`, `onChange`, `onClear` | Search box, status/priority filters, sort menu |
| `TaskList` | `tasks`, `canReorder`, `onStatusChange`, `onDelete`, `onEdit`, `onReorder` | Renders the list of tasks |
| `TaskItem` | `task`, `draggable`, `onStatusChange`, `onDelete`, `onEdit`, `onDragStart`, `onDrop` | Renders a single task card |

## Usage Tips

- **Add a task:** fill in the form on the left. A title of at least 3 characters is required.
- **Edit a task:** click **Edit** on a card, change the form, then click **Save changes**.
- **Reorder tasks:** set "Sort by" to "My order (drag)", clear any filters, then drag cards.
- **Back up your tasks:** click **Export** to download `tasks.json`, and **Import** to load it again.

## Tech Stack

- React 18
- TypeScript
- Vite
- Plain CSS with CSS variables for theming