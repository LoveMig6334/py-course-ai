# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Turbopack) at localhost:3000
npm run build    # Production build + TypeScript check
npm run lint     # ESLint
```

There is no test suite. Use `npm run build` to verify TypeScript correctness before finishing a task.

## Architecture

**mixPie DEV** is a Thai-language Python learning platform. It uses Next.js 16 App Router with three main sections:

### Routing
- `/` — Landing page (server component)
- `/course` — Course listing (server + `CourseList.tsx` client for tabs)
- `/course/[slug]` — Lesson detail, slug format is `{category}_{filename}` e.g. `basic_01-intro`
- `/challenge` — Challenge listing (server component)
- `/challenge/[slug]` — Challenge detail with full IDE (server + IDE client component)

### Content System
All content is MDX files read at build time via Node `fs`:

- **Courses**: `content/basic/*.mdx` and `content/application/*.mdx`
- **Challenges**: `challenges/*.mdx`
- **`lib/mdx.ts`**: `getAllLessonSlugs()` / `getLessonBySlug(slug)` / `getAllLessons(category?)`
  - Slug encoding: `encodeSlug(category, filename)` → `"basic_01-intro"`, `decodeSlug(slug)` → `{ category, lesson }`
- **`lib/challenges.ts`**: `getAllChallenges()` / `getChallengeBySlug(slug)` / `getAllChallengeSlugs()`

### MDX Frontmatter Shapes
**Courses** (`content/{category}/*.mdx`):
```yaml
title: string
description?: string
category: "basic" | "application"
order?: number
tags?: string[]
```

**Challenges** (`challenges/*.mdx`):
```yaml
title: string
description?: string
difficulty: "easy" | "medium" | "hard"
order?: number
tags?: string[]
starterCode?: string   # pre-filled code shown in the IDE
```

Inside course MDX files, use `<CodeRunner code={`...`} />` for inline runnable snippets and `<Mermaid>` for diagrams. These are registered as MDX components in the course detail page.

### Python Runtime (Pyodide)
`hooks/usePyodide.ts` is a singleton hook — `window._pyodideInstance` is reused across all components so Pyodide loads only once.

Exports: `runPython(code)`, `runFile(path)`, `installPackage(name)` (uses micropip), `writeFileToFS(path, content)`.

The `installPackage` call loads the `micropip` package and runs `await micropip.install(name)` inside Pyodide's async runtime.

### In-Browser IDE (`components/ide/IDE.tsx`)
Client component used on challenge detail pages. State is entirely in-memory (JS `Record<string, FileNode>`); files are synced to Pyodide's Emscripten FS via `writeFileToFS` just before running.

Terminal supports: `python [file]`, `pip install <pkg>`, `ls`, `mkdir`, `touch`, `cat`, `rm`, `cd`, `clear`, `help`. Command history navigable with arrow keys.

### Design System
All styles live in `app/globals.css` — no Tailwind utility classes in JSX beyond occasional layout helpers. Use the defined CSS custom properties and class names:

- **Colors**: `--blue` (#2563eb), `--yellow` (#facc15), `--gray-*`, `--code-bg` (#0d1117)
- **Buttons**: `.btn-primary`, `.btn-secondary`, `.btn-yellow`
- **Cards**: `.course-card`, `.challenge-card`
- **IDE**: `.ide-root`, `.ide-toolbar`, `.ide-filetree`, `.ide-editor`, `.ide-terminal`
- **Layout**: `.challenge-layout` (CSS grid: 380px description + 1fr IDE), `.lesson-page`, `.course-page`
- **MDX typography**: `.mdx-h1`, `.mdx-h2`, `.mdx-p`, `.mdx-code`, `.mdx-pre`

Font is **Kodchasan** (Thai/Latin) loaded via `next/font/google` in `app/layout.tsx` and exposed as `--font-kodchasan`.

### Client / Server boundary
- Page files (`app/**/page.tsx`) are server components by default and fetch content via `lib/mdx.ts` or `lib/challenges.ts`.
- Tab UI on the course page is extracted to `app/course/CourseList.tsx` (`"use client"`) receiving pre-fetched data as props.
- IDE and CodeRunner are `"use client"` components imported into server-rendered pages.
- Do **not** call `lib/mdx.ts` or `lib/challenges.ts` (Node `fs` APIs) from client components.
