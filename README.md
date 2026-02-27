# mixPie DEV

แพลตฟอร์มสอน Python ภาษาไทย ตั้งแต่พื้นฐานไปจนถึงการประยุกต์ใช้งานจริง พร้อม IDE ในเบราว์เซอร์และโจทย์ฝึกหัด

## Features

- **คอร์สเรียน** — บทเรียน MDX แบ่งเป็นหมวด _พื้นฐาน_ และ _การประยุกต์ใช้_ พร้อม inline code runner
- **โจทย์ฝึกหัด** — โจทย์ระดับ Easy / Medium / Hard พร้อม IDE เต็มรูปแบบในหน้าเดียว
- **In-browser IDE** — เขียนและรัน Python ในเบราว์เซอร์โดยไม่ต้องติดตั้งอะไร รองรับระบบไฟล์, Terminal และ `pip install`

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Font | Kodchasan (Google Fonts) |
| Python runtime | Pyodide 0.25.1 (WebAssembly) |
| Content | MDX via next-mdx-remote + gray-matter |
| Icons | lucide-react |
| Diagrams | mermaid |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build + TypeScript check
npm run lint    # ESLint
```

## Adding Content

### บทเรียน

สร้างไฟล์ `.mdx` ใน `content/basic/` หรือ `content/application/`:

```mdx
---
title: "ชื่อบทเรียน"
description: "คำอธิบายสั้น"
category: "basic"        # หรือ "application"
order: 1
---

เนื้อหา...

<CodeRunner code={`print("Hello!")`} />
```

### โจทย์ฝึกหัด

สร้างไฟล์ `.mdx` ใน `challenges/`:

```mdx
---
title: "ชื่อโจทย์"
description: "คำอธิบายสั้น"
difficulty: "easy"       # easy | medium | hard
order: 1
starterCode: |
  # โค้ดเริ่มต้นที่แสดงใน IDE
---

เนื้อหาโจทย์...
```

## Project Structure

```
app/
  page.tsx                  # Landing page
  course/
    page.tsx                # Course listing (server)
    CourseList.tsx          # Tab UI (client)
    [slug]/page.tsx         # Lesson detail
  challenge/
    page.tsx                # Challenge listing
    [slug]/page.tsx         # Challenge + IDE
components/
  NavBar.tsx
  ide/IDE.tsx               # Full in-browser IDE
  mdx/CodeRunner.tsx        # Inline code runner for lessons
  mdx/Mermaid.tsx
content/
  basic/                    # Basic Python lessons
  application/              # Applied Python lessons
challenges/                 # Coding challenges
lib/
  mdx.ts                    # Course content loader
  challenges.ts             # Challenge content loader
hooks/
  usePyodide.ts             # Pyodide singleton hook
```
