# CLAUDE.md

This is a living document. Update it when new conventions are established, patterns emerge, or the user asks. Keep it brief.

## Project

TTRPG note-taking app built with Tauri, React, Typescript, PandaCSS, and Ark UI.

## Important

- `src/components/ui/*` are library components (Park UI). Reference them for usage but don't edit unless specifically asked. Don't use them as coding convention examples.
- Always read files before writing/editing, even if you just touched them — the user may have made changes in between.
- **Never overwrite entire files.** Use targeted edits (Edit tool) instead of rewriting files (Write tool). Write is only for creating new files. This prevents silently discarding the user's changes.

## Conventions

- Never use `any` in TypeScript. Use proper types, `unknown`, or generics instead.
- One component per file.
- File name should match the component/main function name in PascalCase (e.g., `AccentColorPicker` → `AccentColorPicker.tsx`). For files with multiple exports, use a generic name with a suffix like `.lib.ts`, `.types.ts`, etc.
- Always use function components. Don't destructure props in the arguments:
  ```tsx
  function Button(props: ButtonProps) {
    const { onClick } = props;
    // ...
  }
  ```
