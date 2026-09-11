# C# Interactive Course Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a polished Russian-language, responsive, single-page interactive introduction to programming and C# for college students.

**Architecture:** A Vite + React + TypeScript client application with focused components for lesson navigation, code practice, ordering game, quiz, and progress. Structured content lives in data modules; a single reducer-backed course state is persisted through a guarded localStorage adapter. No backend and no arbitrary C# execution are used.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, CSS, Lucide React, Sites hosting

**Spec:** `docs/superpowers/specs/2026-09-11-csharp-interactive-course-design.md`

## Global Constraints

- All interface and educational copy is in Russian.
- The page works without registration or a backend.
- The laboratory only simulates approved edits; it never executes arbitrary C#.
- Theme, progress, quiz answers, and exercise state persist in `localStorage`, with an in-memory fallback.
- The page is responsive from 320px mobile width through desktop/projector layouts.
- Respect `prefers-reduced-motion`, visible keyboard focus, and readable contrast.
- Use Lucide icons; do not hand-draw SVG icons.

---

### Task 1: Application shell and visual system

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/test/setup.ts`
- Create: `src/App.test.tsx`

**Interfaces:**
- Produces: root `<App />`, global CSS tokens, Vitest environment.

- [ ] **Step 1: Write the failing smoke test**

```tsx
import { render, screen } from '@testing-library/react';
import { App } from './App';

it('renders the course title and start action', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /погружение в c#/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /начать урок/i })).toHaveAttribute('href', '#programming');
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL because `App` and test configuration do not exist.

- [ ] **Step 3: Create Vite configuration, scripts, dependencies, and the shell**

`package.json` scripts must be `dev`, `build`, `test`, and `preview`; dependencies are `react`, `react-dom`, and `lucide-react`; dev dependencies include TypeScript, Vite, Vitest, jsdom, and Testing Library. `App` renders the hero heading, start/program links, decorative C# code window, and placeholder section anchors matching the spec.

- [ ] **Step 4: Implement the responsive visual foundation**

Define light/dark CSS variables, typography, glass cards, gradients, focus rings, 320px responsive behavior, and reduced-motion overrides. Use CSS background gradients and grid texture rather than image assets.

- [ ] **Step 5: Run tests and production build**

Run: `npm test -- --run && npm run build`
Expected: PASS and Vite emits `dist/index.html`.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json index.html src
git commit -m "feat: scaffold C# course visual shell"
```

### Task 2: Course content, navigation, theme, and persistent progress

**Files:**
- Create: `src/content/course.ts`
- Create: `src/state/courseState.ts`
- Create: `src/state/storage.ts`
- Create: `src/state/courseState.test.ts`
- Create: `src/components/Header.tsx`
- Create: `src/components/ProgressRing.tsx`
- Create: `src/components/ProgrammingFlow.tsx`
- Create: `src/components/TopicExplorer.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: `CourseState`, `CourseAction`, `courseReducer(state, action)`, `loadCourseState()`, `saveCourseState(state)`, `courseTopics`, `<Header />`, `<TopicExplorer />`.
- `CourseState` contains `theme`, `visitedTopics`, `labComplete`, `gameComplete`, `quizAnswers`, and `quizComplete`.

- [ ] **Step 1: Write reducer and storage tests**

```ts
it('marks each topic once and calculates stable progress', () => {
  const once = courseReducer(initialCourseState, { type: 'VISIT_TOPIC', id: 'variables' });
  const twice = courseReducer(once, { type: 'VISIT_TOPIC', id: 'variables' });
  expect(twice.visitedTopics).toEqual(['variables']);
  expect(selectProgress(twice)).toBe(selectProgress(once));
});

it('falls back when persisted JSON is invalid', () => {
  localStorage.setItem('csharp-start-state', '{broken');
  expect(loadCourseState()).toEqual(initialCourseState);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- --run src/state/courseState.test.ts`
Expected: FAIL because state modules do not exist.

- [ ] **Step 3: Implement structured lesson data and course state**

Create five topic records (`variables`, `io`, `conditions`, `loops`, `methods`) with title, summary, explanation, code, and output. Implement reducer actions `SET_THEME`, `VISIT_TOPIC`, `COMPLETE_LAB`, `COMPLETE_GAME`, `ANSWER_QUIZ`, `COMPLETE_QUIZ`, and `RESET`.

- [ ] **Step 4: Implement guarded persistence and progress selection**

`loadCourseState` catches unavailable storage and malformed JSON. `selectProgress` assigns 40% to five topics, 20% to the lab, 15% to the game, and 25% to quiz completion, returning an integer from 0 to 100.

- [ ] **Step 5: Build navigation and educational sections**

Header includes desktop links, accessible mobile menu, progress ring, and theme button. `ProgrammingFlow` reveals the four stages in order. `TopicExplorer` uses keyboard-operable tabs and dispatches `VISIT_TOPIC` when a topic is opened.

- [ ] **Step 6: Run tests and build**

Run: `npm test -- --run && npm run build`
Expected: all tests pass and build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: add C# lessons and persistent course progress"
```

### Task 3: Safe code laboratory and code-quality exercises

**Files:**
- Create: `src/features/lab/labEngine.ts`
- Create: `src/features/lab/labEngine.test.ts`
- Create: `src/features/lab/CodeLab.tsx`
- Create: `src/features/rules/RulesGrid.tsx`
- Create: `src/features/rules/FindError.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: `runGreetingLab(source: string): { ok: boolean; output: string; hint?: string }`, `<CodeLab onComplete={() => void} />`, `<FindError />`.

- [ ] **Step 1: Write failing laboratory parser tests**

```ts
expect(runGreetingLab('string name = "Миша";\nConsole.WriteLine($"Привет, {name}!");'))
  .toEqual({ ok: true, output: 'Привет, Миша!' });
expect(runGreetingLab('Console.WriteLine("Привет")'))
  .toMatchObject({ ok: false, hint: expect.stringMatching(/точк.*запят/i) });
expect(runGreetingLab('System.IO.File.Delete("x")'))
  .toMatchObject({ ok: false });
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- --run src/features/lab/labEngine.test.ts`
Expected: FAIL because `runGreetingLab` is missing.

- [ ] **Step 3: Implement the constrained simulator**

Parse only the provided `string name = "...";` and interpolated greeting pattern. Reject unsupported statements, missing delimiters, an empty name, and input longer than 500 characters with friendly Russian hints.

- [ ] **Step 4: Build the laboratory and rule interactions**

Provide editable code, Reset and Run buttons, output console, status announcement with `aria-live`, and completion callback on success. Add rule cards for naming, indentation, comments, semicolons, and brackets. `FindError` offers three clickable lines and explains the selected error.

- [ ] **Step 5: Run tests and build**

Run: `npm test -- --run && npm run build`
Expected: all tests pass and build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: add safe C# code laboratory and rule exercises"
```

### Task 4: Ordering game, quiz, practice, and completion summary

**Files:**
- Create: `src/features/game/orderGame.ts`
- Create: `src/features/game/orderGame.test.ts`
- Create: `src/features/game/OrderGame.tsx`
- Create: `src/features/quiz/questions.ts`
- Create: `src/features/quiz/quizEngine.ts`
- Create: `src/features/quiz/quizEngine.test.ts`
- Create: `src/features/quiz/Quiz.tsx`
- Create: `src/components/PracticeCard.tsx`
- Create: `src/components/Completion.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: `moveLine(lines, index, direction)`, `isCorrectOrder(lines)`, `scoreQuiz(answers, questions)`, `<OrderGame onComplete={() => void} />`, `<Quiz answers onAnswer onComplete />`, `<Completion progress onReset />`.

- [ ] **Step 1: Write failing game and quiz tests**

```ts
it('moves a line up without mutating input', () => {
  const input = ['b', 'a'];
  expect(moveLine(input, 1, -1)).toEqual(['a', 'b']);
  expect(input).toEqual(['b', 'a']);
});

it('scores one answer per question', () => {
  expect(scoreQuiz({ q1: 'b', q2: 'a' }, sampleQuestions)).toEqual({ correct: 2, total: 2 });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- --run src/features/game/orderGame.test.ts src/features/quiz/quizEngine.test.ts`
Expected: FAIL because game and quiz engines are missing.

- [ ] **Step 3: Implement pure game and quiz engines**

The order game uses immutable moves and exact line IDs. The quiz contains five single-choice questions covering programming, variables, conditions, cycles, and methods; each record includes answer options, correct ID, and Russian explanation.

- [ ] **Step 4: Build accessible interactive components**

OrderGame provides move up/down buttons, check, hint, and reset. Quiz shows one question at a time, locks each answered question until Next, announces correctness, shows the final score, and supports restart. Wire completion events into the central reducer.

- [ ] **Step 5: Build practice and completion sections**

Practice includes the greeting-program brief, three explicit readiness criteria, and expected output. Completion displays live progress, distinct copy for partial/complete states, and a confirmation step before dispatching `RESET`.

- [ ] **Step 6: Run tests and build**

Run: `npm test -- --run && npm run build`
Expected: all tests pass and build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: add course game quiz and completion flow"
```

### Task 5: Integration, accessibility, visual QA, and Sites delivery

**Files:**
- Create: `src/integration/courseFlow.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/global.css`
- Create: `.openai/hosting.json` through the Sites creation flow
- Create: `README.md`

**Interfaces:**
- Consumes all prior components and state interfaces.
- Produces a production-ready static site and user-facing deployment.

- [ ] **Step 1: Write the integration test**

```tsx
it('updates progress after completing the laboratory', async () => {
  render(<App />);
  const before = screen.getByLabelText(/прогресс курса/i).getAttribute('aria-valuenow');
  await userEvent.click(screen.getByRole('button', { name: /запустить/i }));
  expect(screen.getByText(/привет,/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/прогресс курса/i)).not.toHaveAttribute('aria-valuenow', before);
});
```

- [ ] **Step 2: Run test and correct integration defects**

Run: `npm test -- --run src/integration/courseFlow.test.tsx`
Expected: PASS after correcting accessible names and reducer wiring.

- [ ] **Step 3: Complete responsive and accessibility review**

Verify 320px, 390px, 768px, 1280px, and 1920px layouts; remove horizontal overflow; ensure all controls are keyboard reachable; confirm visible focus, `aria-live` feedback, semantic headings, reduced motion, and both themes.

- [ ] **Step 4: Run full verification**

Run: `npm test -- --run && npm run build`
Expected: all tests pass, TypeScript has no errors, and `dist/index.html` exists.

- [ ] **Step 5: Perform browser QA**

Preview the production build and verify hero, mobile menu, topic tabs, theme persistence, laboratory success/error, find-error interaction, ordering game, quiz feedback/results, reset, and refresh persistence. Capture desktop and mobile screenshots for visual inspection.

- [ ] **Step 6: Add project documentation and commit**

README must document `npm install`, `npm run dev`, `npm test -- --run`, and `npm run build`.

```bash
git add src README.md .openai/hosting.json
git commit -m "chore: verify and prepare C# course for delivery"
```

- [ ] **Step 7: Save and privately publish with Sites**

Create or reuse exactly one Sites project, push the verified commit, package the validated build output, save the version using the exact HEAD SHA, publish privately, and inspect deployment status until it is terminal.

