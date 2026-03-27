# Web Haptics Demo

Minimal Next.js demo for testing two custom button haptic patterns with adjustable intensity.

## What it does

- Shows two buttons with different vibration patterns.
- Lets you tune intensity for each pattern with a slider.
- Includes a debug-audio toggle so the interaction is still testable on devices without vibration support.
- Uses `useWebHaptics` from `web-haptics/react`.

## Stack

- Next.js App Router
- React 19
- Tailwind CSS 4
- web-haptics

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Relevant files

- `app/page.tsx` for the demo UI and haptic triggers
- `app/layout.tsx` for the minimal app shell
- `app/globals.css` for styling

## Example pattern

```ts
trigger([
   { duration: 30 },
   { delay: 60, duration: 40, intensity: 1 },
], { intensity: 0.8 });
```
- `url` (TEXT, NOT NULL) - URL to asset in Supabase Storage
- `created_at` (TIMESTAMP) - Upload timestamp

**templates**
- `id` (UUID, PRIMARY KEY) - Template ID
- `club_id` (UUID, NULLABLE, FOREIGN KEY) - References clubs.id
- `user_id` (TEXT, NULLABLE, FOREIGN KEY) - References users.id
- `name` (TEXT, NOT NULL) - Template name
- `type` (TEXT, NOT NULL) - Template type: 'match_announcement', 'matchday', 'result', 'mvp', 'sponsor_thank_you'
- `config_json` (JSONB, NOT NULL) - Template configuration (layout, fields, colors)
- `is_public` (BOOLEAN, DEFAULT false) - Whether template is shared with community
- `is_system` (BOOLEAN, DEFAULT false) - Whether template is a system template
- `created_at` (TIMESTAMP) - Creation timestamp

**sponsors**
- `id` (UUID, PRIMARY KEY) - Sponsor ID
- `club_id` (UUID, FOREIGN KEY) - References clubs.id
- `name` (TEXT, NOT NULL) - Sponsor name
- `logo_url` (TEXT, NOT NULL) - URL to sponsor logo in Supabase Storage
- `tier` (TEXT, NOT NULL) - Sponsor tier: 'platinum', 'gold', 'silver', 'bronze'
- `created_at` (TIMESTAMP) - Sponsor creation timestamp

**sponsor_assignments**
- `id` (UUID, PRIMARY KEY) - Assignment ID
- `sponsor_id` (UUID, FOREIGN KEY) - References sponsors.id
- `team_id` (UUID, NULLABLE, FOREIGN KEY) - References teams.id (null for club-wide)
- `created_at` (TIMESTAMP) - Assignment creation timestamp

### Clubs Feature

- **Create Clubs**: Users can create sports clubs with custom branding
- **Logo Upload**: Upload club logos to Supabase Storage
- **Color Customization**: Set primary and secondary brand colors
- **Multi-Club Support**: Users can belong to multiple clubs
- **Club Selection**: Switch between clubs when user has multiple memberships
- **Role-Based Access**: Three roles with different permissions (admin, trainer, social_manager)
- **Automatic Admin**: User who creates a club automatically becomes an admin

For more details, see `features/clubs/README.md`

### Teams Feature

- **Create Teams**: Create multiple teams within a club
- **Team Logos**: Upload team logos to Supabase Storage
- **Team Management**: Edit and delete teams
- **Permission Control**: Only admins and trainers can manage teams
- **Team Listing**: View all teams for a club

For more details, see `features/teams/README.md`

### Sponsors Feature

- **Add Sponsors**: Create sponsors with name, logo, and tier (Platinum, Gold, Silver, Bronze)
- **Sponsor Tiers**: Four-tier system for organizing sponsors by importance
- **Assign to Teams**: Assign sponsors to specific teams or entire club
- **View Assignments**: See which teams each sponsor is assigned to
- **Permission Control**: Only admins and social managers can manage sponsors
- **Logo Management**: Upload and store sponsor logos in Supabase Storage
- **Integration Ready**: Sponsor data ready for automatic rotation in graphics templates

For more details, see `features/sponsors/README.md`

### Asset Library Feature

- **Categorized Upload**: Upload images categorized by type (club logos, team logos, player photos, etc.)
- **Asset Gallery**: Browse and filter assets by category
- **Reusable Assets**: Store and reuse images across different features
- **Asset Management**: Delete unused assets
- **Storage Organization**: Files organized in Supabase Storage by type

For more details, see `features/assets/README.md`

### Templates Feature

- **System Templates**: 6 pre-built templates for various content types
- **Custom Templates**: Create custom templates with personalized layouts, colors, and fields
- **Template Categories**: Match Announcement, Matchday, Result, MVP, Sponsor Thank You
- **Community Sharing**: Share templates publicly with other users
- **Template Management**: Create, edit, delete, and organize templates
- **Club Templates**: Create templates specific to a club or for personal use

For more details, see `features/templates/README.md`

### Content Calendar Feature

- **Calendar View**: Visual month/week calendar displaying scheduled posts
- **List View**: Comprehensive table view of all scheduled posts
- **Team Filtering**: Filter posts by specific team
- **Status Filtering**: Filter posts by status (draft, in review, approved, posted)
- **Post Rescheduling**: Easily reschedule posts to different dates/times
- **Statistics Dashboard**: View counts of scheduled, approved, and in-review posts
- **Visual Status Indicators**: Color-coded posts based on status
- **Today Navigation**: Quick jump to today's date

For more details, see `features/calendar/README.md`

### User Flow

1. User visits the home page and clicks "Login"
2. User is redirected to `/login` page
3. User clicks "Sign in with Google"
4. After successful authentication, user data is stored in Supabase
5. User is redirected to `/profile` page
6. User can view their profile information
7. User can create/join clubs, manage teams, and upload assets
8. User can sign out to end their session

### Protected Routes

The following routes are protected by middleware:
- `/profile/*` - User profile pages
- `/clubs/*` - Club management pages
- `/teams/*` - Team management pages
- `/sponsors/*` - Sponsor management pages
- `/assets/*` - Asset library pages
- `/templates/*` - Template management pages
- `/posts/*` - Post management pages
- `/calendar/*` - Content calendar pages
- `/dashboard/*` - Dashboard pages (extensible)

Unauthenticated users attempting to access these routes are redirected to `/login`.

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint Code

```bash
npm run lint
```

## Acceptance Criteria

✅ User can register/login with Google OAuth  
✅ Session persists after refresh (JWT-based)  
✅ Protected pages redirect to `/login`  
✅ User is stored in Supabase DB after first login  

## License

ISC
