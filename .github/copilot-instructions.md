## Repo snapshot

- Multiple small React projects live in the workspace root: `learn-api-calls/`, `learn-react1/` (both Vite templates), and `react-tutorial/` (Create React App/react-scripts).
- A lightweight component library lives in `react-libs/components/` containing small, default-exported function components (JSX + colocated CSS).
- Windows-first dev tooling: `Setup-ReactEnv.ps1` and `Create-ReactApp.ps1` document recommended Node/pnpm usage and project scaffolding.

## What to know before editing

- Preferred package manager: pnpm (activated via Corepack in `Setup-ReactEnv.ps1`). Fall back to npm if pnpm is not available.
- Vite projects use ESM (`"type": "module"` in package.json) and expose scripts: `dev`, `build`, `preview`. Default Vite dev port: 5173.
- `react-tutorial/` uses `react-scripts` (start/build/test) — treat it like a classic CRA app.

## Project-specific workflows (commands you can run)

- For a Vite project (example: `learn-api-calls` or `learn-react1`):
  - Install: `pnpm install` (or `npm install`)
  - Dev server: `pnpm dev` (or `npm run dev`) → opens http://localhost:5173
  - Build: `pnpm build` (or `npm run build`)

- For the CRA project (`react-tutorial`):
  - Install: `pnpm install` (or `npm install`)
  - Dev server: `pnpm start` (or `npm start`)
  - Tests: `pnpm test` (or `npm test`)

- Environment bootstrap (Windows): see `Setup-ReactEnv.ps1` (installs Node LTS, enables pnpm via Corepack). Create projects with `Create-ReactApp.ps1` which wraps `pnpm create vite`.

## Conventions & patterns to follow

- Component layout (react-libs): each component typically pairs `Component.jsx` + `Component.css` in a folder under `react-libs/components/` and the component file default-exports a function component. Example: `react-libs/components/Banner/Banner.jsx` imports `./Banner.css` and exports default.
- Many component folders include an `index.js` intended to re-export the component for simpler imports. Example intent (apply when creating or fixing these):

  ```js
  // react-libs/components/Banner/index.js
  export { default } from './Banner.jsx'
  ```

- Keep CSS colocated (imported with a relative path like `./Banner.css`) — don't convert to CSS modules unless you update the consuming apps.

## Lint & format

- ESLint config is present in Vite projects (e.g. `learn-api-calls/eslint.config.js`). Notable rule: `no-unused-vars` is configured with `varsIgnorePattern: '^[A-Z_]'`, so uppercase identifiers and underscore-prefixed names are intentionally ignored (useful for React components and intentionally-named global constants).

## Integration points and dependencies

- Minimal external deps: `react`, `react-dom`. Vite projects use `@vitejs/plugin-react` (see project `devDependencies`).
- No backend servers or networked services are present in the repo — changes here are frontend-only by default.

## Guidance for AI agents (concrete editing style)

- When adding a new component: create a folder under `react-libs/components/ComponentName/` with `ComponentName.jsx` (default export) and `ComponentName.css`. Add an `index.js` that re-exports the default export for simpler imports from other packages.
- When updating imports across projects, prefer the package-local relative layout used in examples (e.g., `import Banner from 'react-libs/components/Banner'` is expected if `index.js` exists; otherwise import the specific file path).
- Preserve existing export names and default-exports to avoid breaking consumers. If you rename a file, search the repo for usages before changing exports.

## Files to check before changing behavior

- `Setup-ReactEnv.ps1` and `Create-ReactApp.ps1` — environment and scaffolding assumptions
- `react-libs/components/*` — component patterns and index re-export intention
- `learn-*/package.json` — per-project scripts and dependency sets
- `learn-*/eslint.config.js` — linting expectations

If any area above is unclear or you want me to expand specific examples (exports, re-exports, or sample PR annotations), tell me which file or component to use and I will iterate.

---
Feedback: is there any specific pattern or file you want the agent to prefer or avoid? (e.g. prefer pnpm-only changes, or update `index.js` re-exports automatically)
