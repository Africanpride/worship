# Hero Headline Conditional Register / Book a Watch Button

## Problem Statement
In `components/hero-headline.tsx`, the hero banner displays a static "Register" button linking to `/login`. Users who are already registered and authenticated should instead see an action to "Book a Watch" linking to `/schedule`.

## Proposed Solution
In `components/hero-headline.tsx`:
1. Use `useCurrentSession()` from `@/lib/use-current-session` to retrieve `isAuthenticated` and `isPending`.
2. When the user is not authenticated (`!isAuthenticated`), render the `Register` button linking to `/login`.
3. When the user is authenticated (`isAuthenticated`), render the `Book a Watch` button linking to `/schedule`.
4. While session state is loading (`isPending`), render nothing or maintain placeholder space to avoid UI flicker.
5. Adhere to project conventions:
   - Ensure all interactive elements have `cursor-pointer`.
   - Pass Biome check and build tests.

## Changes Required
- **File**: `components/hero-headline.tsx`
  - Import `useCurrentSession` from `@/lib/use-current-session`.
  - Call `const { isAuthenticated, isPending } = useCurrentSession();`.
  - Conditionally render `<Link href="/login">...Register...</Link>` or `<Link href="/schedule">...Book a Watch...</Link>` based on `isAuthenticated`.
