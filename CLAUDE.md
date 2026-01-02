# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SecondOrder is a Next.js-based landing page for a meta-thinking AI system. The project presents concepts around LLM meta-cognition, self-improving workflows, and adaptive reasoning strategies.

## Development Commands

```bash
# Development server
npm run dev

# Type checking (recommended before commits)
npm run ts-check

# Linting
npm run lint

# Production build
npm run build

# Start production server
npm start
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.5.9 (App Router)
- **React**: 19.0.0
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS with custom design tokens
- **Fonts**: Manrope (sans) and Playfair Display (display) via next/font/google

### Project Structure

```
app/
  layout.tsx       # Root layout with font configuration
  page.tsx         # Landing page with all content sections
  globals.css      # Global styles and Tailwind directives

components/
  ui/              # Reusable UI components (button, etc.)

lib/
  utils.ts         # Utility functions (cn helper for className merging)

public/
  icon.svg         # App icon (light mode)
  icon-dark.svg    # App icon (dark mode)
```

### Design System

Custom color tokens defined in `tailwind.config.ts`:
- `ink`: #0B0B0B (primary dark)
- `bone`: #F7F7F5 (primary light background)
- `fog`: #E6E6E1 (secondary light)

Custom utilities:
- `bg-paper-grid`: Grid background pattern
- `shadow-soft-edge`: Soft shadow for cards
- Font variables: `--font-manrope`, `--font-playfair`

### Import Paths

The project uses `@/*` path alias for imports:
- `@/components/...` → `components/...`
- `@/lib/...` → `lib/...`
- `@/app/...` → `app/...`

### Component Patterns

**Button Component** (`components/ui/button.tsx`):
- Uses `class-variance-authority` for variant management
- Variants: `default`, `outline`
- Sizes: `default`, `sm`, `lg`
- Follows shadcn/ui patterns

**Styling Convention**:
- Use the `cn()` utility from `lib/utils.ts` to merge Tailwind classes
- Components accept `className` prop for customization

### ESLint Configuration

Rules enforced:
- Unused variables must be prefixed with `_`
- `any` type triggers warnings
- Next.js core-web-vitals rules enabled
- TypeScript-specific rules enabled

## Content Architecture

The landing page (`app/page.tsx`) contains these sections:
1. **Hero**: Main value proposition with capabilities card
2. **What is it**: Overview of meta-thinking concepts
3. **Iterative problem solving**: Explanation of the feedback loop
4. **Self-auditing**: Progress monitoring system
5. **Meta-thinking in AI**: Core concepts explanation
6. **Ready to build**: CTA section

Data is defined as constants at the top of `page.tsx`: `features`, `metaThinking`, `iterativeLoop`, `overview`.

## Development Notes

- The project uses Next.js strict mode
- All pages use the App Router (not Pages Router)
- Font loading is optimized with `display: "swap"`
- Images use Next.js Image component for optimization
- Responsive design uses Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- Navigation uses client-side hash routing for anchor links
