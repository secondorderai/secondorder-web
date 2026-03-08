# UI Patterns

## Shared Components

- Reusable primitives live in [`components/ui/`](/Users/henry/workspace/secondorder-web/components/ui).
- The button component in [`components/ui/button.tsx`](/Users/henry/workspace/secondorder-web/components/ui/button.tsx) uses `class-variance-authority`.
- Existing button variants:
  - `default`
  - `outline`
- Existing button sizes:
  - `default`
  - `sm`
  - `lg`

## Conventions

- Follow the existing CVA-based variant pattern when extending shared UI primitives.
- Keep shared primitives generic; product-specific behavior belongs in route-level components.
- Accept `className` on reusable components and merge it with `cn()`.
