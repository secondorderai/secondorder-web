# Styling

## Design System

- Tailwind theme extensions live in [`tailwind.config.ts`](/Users/henry/workspace/secondorder-web/tailwind.config.ts).
- Color tokens:
  - `ink`: `#0B0B0B`
  - `bone`: `#F7F7F5`
  - `fog`: `#E6E6E1`
- Fonts are defined in [`app/layout.tsx`](/Users/henry/workspace/secondorder-web/app/layout.tsx):
  - `Manrope` for sans text
  - `Playfair Display` for display text
- Custom utilities:
  - `bg-paper-grid`
  - `shadow-soft-edge`

## Styling Conventions

- Use the `cn()` helper from [`lib/utils.ts`](/Users/henry/workspace/secondorder-web/lib/utils.ts) to merge classes.
- Preserve the established typography and token usage unless the task explicitly changes the design system.
- Reuse existing utility classes and theme tokens before adding one-off values.
