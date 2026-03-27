# Component Organization

This document outlines the component structure and organization rules for the project.

## Directory Structure

```
components/
├── ui/              # shadcn/ui components
│   └── button.tsx   # Base UI components from shadcn
└── custom-ui/       # Custom reusable components
    └── (empty)      # Components used across multiple features

features/
├── auth/
│   └── components/  # Auth-specific components
├── calendar/
│   └── components/  # Calendar-specific components
├── clubs/
│   └── components/  # Club-specific components
├── teams/
│   └── components/  # Team-specific components
├── posts/
│   └── components/  # Post-specific components
├── match-events/
│   └── components/  # Match event-specific components
├── templates/
│   └── components/  # Template-specific components
├── sponsors/
│   └── components/  # Sponsor-specific components
└── assets/
    └── components/  # Asset-specific components
```

## Organization Rules

### 1. **shadcn/ui Components** → `components/ui/`

All shadcn components and other third-party UI library components should be placed in `components/ui/`.

**Examples:**
- `components/ui/button.tsx` - Button component with variants
- `components/ui/input.tsx` - Input field component
- `components/ui/dialog.tsx` - Dialog/Modal component
- `components/ui/card.tsx` - Card component

**Import pattern:**
```tsx
import { Button } from '@/components/ui/button';
```

### 2. **Custom Reusable Components** → `components/custom-ui/`

Custom components that are used across multiple features should be placed in `components/custom-ui/`.

**Criteria for custom-ui:**
- Used in 2+ different features
- Generic enough to be reusable
- Not tied to a specific feature's domain logic

**Examples (potential):**
- `components/custom-ui/empty-state.tsx` - Empty state display
- `components/custom-ui/loading-spinner.tsx` - Loading indicator
- `components/custom-ui/confirm-dialog.tsx` - Generic confirmation dialog
- `components/custom-ui/page-header.tsx` - Page header layout

**Import pattern:**
```tsx
import { EmptyState } from '@/components/custom-ui/empty-state';
```

### 3. **Feature-Specific Components** → `features/[feature]/components/`

Components that are specific to a single feature should be placed in that feature's components folder.

**Criteria for feature components:**
- Only used within one feature
- Contains feature-specific business logic
- Tightly coupled to the feature's domain

**Current feature components:**

#### Auth Feature (`features/auth/components/`)
- `LoginForm.tsx` - Login form with email/password
- `RegisterForm.tsx` - Registration form

#### Calendar Feature (`features/calendar/components/`)
- `CalendarView.tsx` - Calendar grid view
- `ListView.tsx` - List view for posts
- `RescheduleModal.tsx` - Modal for rescheduling posts

#### Clubs Feature (`features/clubs/components/`)
- `CreateClubForm.tsx` - Club creation form
- `ClubSelector.tsx` - Club selection dropdown

#### Teams Feature (`features/teams/components/`)
- `CreateTeamForm.tsx` - Team creation form
- `TeamsList.tsx` - Display list of teams

#### Posts Feature (`features/posts/components/`)
- `CreatePostForm.tsx` - Post creation form
- `PostsList.tsx` - Display list of posts
- `PostDetail.tsx` - Post detail view

#### Match Events Feature (`features/match-events/components/`)
- `CreateMatchEventForm.tsx` - Match event creation form
- `MatchEventsList.tsx` - Display list of match events
- `MatchEventDetail.tsx` - Match event detail view

#### Templates Feature (`features/templates/components/`)
- `CreateTemplateForm.tsx` - Template creation form
- `TemplateGallery.tsx` - Display template gallery
- `TemplateCard.tsx` - Individual template card
- `GraphicGenerator.tsx` - Template graphic generator

#### Sponsors Feature (`features/sponsors/components/`)
- `CreateSponsorForm.tsx` - Sponsor creation form
- `SponsorsList.tsx` - Display list of sponsors
- `SponsorCard.tsx` - Individual sponsor card
- `AssignSponsorModal.tsx` - Modal for assigning sponsors

#### Assets Feature (`features/assets/components/`)
- `AssetUploadForm.tsx` - Asset upload form
- `AssetGallery.tsx` - Display asset gallery

**Import pattern:**
```tsx
import LoginForm from '@/features/auth/components/LoginForm';
import CalendarView from '@/features/calendar/components/CalendarView';
```

## When to Move Components

### From Feature to Custom-UI

Move a component from a feature folder to `custom-ui` when:
1. You find yourself duplicating the component in another feature
2. The component becomes generic enough for reuse
3. You remove all feature-specific logic from the component

### From Custom-UI to UI

Move a component from `custom-ui` to `ui` when:
1. You're replacing it with a shadcn/ui component
2. It becomes a standard UI pattern that should be treated as a primitive

## Best Practices

1. **Keep features isolated**: Features should be self-contained with their own components, hooks, and utilities
2. **Extract carefully**: Don't prematurely extract components to custom-ui. Wait until you actually need to reuse them
3. **Follow the import pattern**: Always use the `@/` alias for imports
4. **One component per file**: Each component should have its own file
5. **Co-locate related files**: Keep component-specific types, styles, and tests near the component

## Examples

### ✅ Good
```tsx
// Feature-specific component in its feature folder
features/posts/components/CreatePostForm.tsx

// Reusable UI component
components/ui/button.tsx

// Custom reusable component used in multiple features
components/custom-ui/confirm-dialog.tsx
```

### ❌ Bad
```tsx
// Don't put feature components in custom-ui
components/custom-ui/CreatePostForm.tsx

// Don't put UI primitives in feature folders
features/posts/components/button.tsx

// Don't put everything in lib
lib/all-components.tsx
```

## Migration Checklist

When reorganizing components:

- [ ] Identify the component type (ui / custom-ui / feature-specific)
- [ ] Move the component to the correct folder
- [ ] Update all import statements across the project
- [ ] Test that the component still works
- [ ] Update any related documentation
- [ ] Delete the old file
- [ ] Run linter and tests

## Summary

This organization pattern helps maintain:
- **Clear separation of concerns**
- **Easy discoverability** - You know exactly where to find components
- **Reusability** - Shared components are easily accessible
- **Feature isolation** - Features can be developed independently
- **Scalability** - The structure scales as the project grows
