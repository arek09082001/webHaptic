# SocialSportMedia

A social platform for sports enthusiasts with NextAuth.js authentication.

## Features

- ✅ NextAuth.js (Auth.js) integration
- ✅ Google OAuth Provider
- ✅ Session handling (JWT)
- ✅ Protected routes (middleware)
- ✅ User profile page
- ✅ Supabase database integration
- ✅ Multi-tenant clubs/organizations
- ✅ Club creation with logo upload
- ✅ Role-based access control (admin, trainer, social_manager)
- ✅ Club selection for multi-club users
- ✅ Team management within clubs
- ✅ Sponsor management with tier system
- ✅ Sponsor assignments to clubs and teams
- ✅ Asset library for media management
- ✅ Template system for content creation
- ✅ Content calendar with month/week views
- ✅ Post scheduling and rescheduling

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth.js v4
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run the schema from `supabase/schema.sql`
3. Get your project URL and keys from Project Settings > API
4. Create a storage bucket named `club-assets` (see `SUPABASE_STORAGE_SETUP.md` for details)

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to Credentials and create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Update the following variables:
- `NEXTAUTH_SECRET`: Generate a secret with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth API routes
│   │   ├── assets/
│   │   │   ├── route.ts              # Asset upload & listing API
│   │   │   └── [id]/
│   │   │       └── route.ts          # Asset deletion API
│   │   ├── clubs/
│   │   │   ├── route.ts              # Club creation & listing API
│   │   │   └── user/
│   │   │       └── route.ts          # User clubs API
│   │   └── teams/
│   │       ├── route.ts              # Team creation & listing API
│   │       └── [id]/
│   │           └── route.ts          # Team update & deletion API
│   │   └── sponsors/
│   │       ├── route.ts              # Sponsor creation & listing API
│   │       └── [id]/
│   │           ├── route.ts          # Sponsor update & deletion API
│   │           └── assignments/
│   │               └── route.ts      # Sponsor assignment API
│   │   └── templates/
│   │       ├── route.ts              # Template creation & listing API
│   │       ├── [id]/
│   │       │   └── route.ts          # Template update & deletion API
│   │       └── community/
│   │           └── route.ts          # Community templates API
│   ├── assets/
│   │   └── page.tsx                  # Asset library page (protected)
│   ├── calendar/
│   │   └── page.tsx                  # Content calendar page (protected)
│   ├── clubs/
│   │   └── page.tsx                  # Clubs page (protected)
│   ├── teams/
│   │   └── page.tsx                  # Teams page (protected)
│   ├── sponsors/
│   │   └── page.tsx                  # Sponsors page (protected)
│   ├── templates/
│   │   ├── page.tsx                  # Templates page (protected)
│   │   └── community/
│   │       └── page.tsx              # Community templates page (protected)
│   ├── login/
│   │   └── page.tsx                  # Login page
│   ├── profile/
│   │   └── page.tsx                  # User profile page (protected)
│   ├── providers/
│   │   └── AuthProvider.tsx          # Session provider wrapper
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
├── features/
│   ├── assets/
│   │   ├── components/
│   │   │   ├── AssetUploadForm.tsx   # Asset upload form
│   │   │   └── AssetGallery.tsx      # Asset gallery with filtering
│   │   ├── hooks/
│   │   │   ├── useAssets.ts          # Assets fetching hook
│   │   │   └── useUploadAsset.ts     # Asset upload/delete hook
│   │   └── README.md                 # Assets feature docs
│   ├── calendar/
│   │   ├── components/
│   │   │   ├── CalendarView.tsx      # Calendar grid component
│   │   │   ├── ListView.tsx          # Table view component
│   │   │   └── RescheduleModal.tsx   # Post rescheduling modal
│   │   ├── hooks/
│   │   │   └── useReschedulePost.ts  # Reschedule hook
│   │   └── README.md                 # Calendar feature docs
│   ├── clubs/
│   │   ├── components/
│   │   │   ├── CreateClubForm.tsx    # Club creation form
│   │   │   └── ClubSelector.tsx      # Club selection component
│   │   ├── hooks/
│   │   │   ├── useCreateClub.ts      # Club creation hook
│   │   │   └── useUserClubs.ts       # User clubs hook
│   │   ├── context/
│   │   │   └── ClubContext.tsx       # Active club context
│   │   └── README.md                 # Clubs feature docs
│   └── teams/
│       ├── components/
│       │   ├── CreateTeamForm.tsx    # Team creation form
│       │   └── TeamsList.tsx         # Teams list component
│       ├── hooks/
│       │   ├── useTeams.ts           # Teams fetching hook
│       │   ├── useCreateTeam.ts      # Team creation hook
│       │   └── useUpdateTeam.ts      # Team update/delete hook
│       └── README.md                 # Teams feature docs
│   └── sponsors/
│       ├── components/
│       │   ├── CreateSponsorForm.tsx # Sponsor creation form
│       │   ├── SponsorsList.tsx      # Sponsors list component
│       │   ├── SponsorCard.tsx       # Sponsor card component
│       │   └── AssignSponsorModal.tsx # Sponsor assignment modal
│       ├── hooks/
│       │   ├── useSponsors.ts        # Sponsors fetching hook
│       │   ├── useCreateSponsor.ts   # Sponsor creation hook
│       │   ├── useUpdateSponsor.ts   # Sponsor update/delete hook
│       │   └── useSponsorAssignments.ts # Sponsor assignments hook
│       └── README.md                 # Sponsors feature docs
│   └── templates/
│       ├── components/
│       │   ├── CreateTemplateForm.tsx # Template creation form
│       │   ├── TemplateCard.tsx      # Template card component
│       │   └── TemplateGallery.tsx   # Template gallery component
│       ├── hooks/
│       │   ├── useTemplates.ts       # Templates fetching hook
│       │   ├── useCreateTemplate.ts  # Template creation hook
│       │   ├── useUpdateTemplate.ts  # Template update/delete hook
│       │   └── useCommunityTemplates.ts # Community templates hook
│       └── README.md                 # Templates feature docs
├── lib/
│   ├── auth.ts                       # NextAuth configuration
│   └── supabase.ts                   # Supabase client
├── middleware.ts                     # Route protection middleware
├── supabase/
│   └── schema.sql                    # Database schema
├── types/
│   ├── assets.ts                     # Asset type definitions
│   ├── clubs.ts                      # Club type definitions
│   ├── teams.ts                      # Team type definitions
│   ├── sponsors.ts                   # Sponsor type definitions
│   ├── templates.ts                  # Template type definitions
│   └── next-auth.d.ts                # NextAuth type extensions
└── .env.example                      # Environment variables template
```

## Features

### Authentication

- **Google OAuth**: Users can sign in with their Google account
- **JWT Sessions**: Sessions are stored as JWT tokens for better performance
- **Persistent Sessions**: Sessions persist after page refresh
- **Protected Routes**: Middleware automatically redirects unauthenticated users to login

### Database

The application uses Supabase with the following tables:

**users**
- `id` (TEXT, PRIMARY KEY) - Matches NextAuth user ID
- `email` (TEXT, UNIQUE, NOT NULL) - User email
- `name` (TEXT) - User display name
- `image_url` (TEXT) - Profile image URL
- `created_at` (TIMESTAMP) - Account creation timestamp

**clubs**
- `id` (UUID, PRIMARY KEY) - Club ID
- `name` (TEXT, NOT NULL) - Club name
- `logo_url` (TEXT) - URL to club logo in Supabase Storage
- `primary_color` (TEXT, NOT NULL) - Primary brand color
- `secondary_color` (TEXT, NOT NULL) - Secondary brand color
- `created_at` (TIMESTAMP) - Club creation timestamp

**club_members**
- `id` (UUID, PRIMARY KEY) - Membership ID
- `club_id` (UUID, FOREIGN KEY) - References clubs.id
- `user_id` (TEXT, FOREIGN KEY) - References users.id
- `role` (TEXT, NOT NULL) - One of: 'admin', 'trainer', 'social_manager'
- `created_at` (TIMESTAMP) - Membership creation timestamp

**teams**
- `id` (UUID, PRIMARY KEY) - Team ID
- `club_id` (UUID, FOREIGN KEY) - References clubs.id
- `name` (TEXT, NOT NULL) - Team name
- `logo_url` (TEXT) - URL to team logo in Supabase Storage
- `created_at` (TIMESTAMP) - Team creation timestamp

**assets**
- `id` (UUID, PRIMARY KEY) - Asset ID
- `club_id` (UUID, FOREIGN KEY) - References clubs.id
- `type` (TEXT, NOT NULL) - Asset type: 'club_logo', 'team_logo', 'opponent_logo', 'player_photo', 'sponsor_logo', 'miscellaneous'
- `name` (TEXT, NOT NULL) - Asset name/description
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
