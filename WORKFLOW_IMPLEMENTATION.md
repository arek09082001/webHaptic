# Workflow / Approval System

## Overview

The SocialSportMedia application now includes a comprehensive workflow and approval system for post management. This system enforces role-based permissions and status transitions to ensure proper content review before publication.

## Status Workflow

Posts progress through a 4-stage workflow:

```
draft → in_review → approved → posted
         ↓
       draft (back to draft)
```

### Status Descriptions

- **draft**: Initial state when a post is created. Post can be edited and is not yet submitted for review.
- **in_review**: Post has been submitted for review and is awaiting approval from an admin.
- **approved**: Post has been approved by an admin and is ready to be published.
- **posted**: Post has been marked as posted by a social manager and is considered published.

## Roles and Permissions

### Trainer
- ✅ Can create drafts
- ✅ Can request review (draft → in_review)
- ✅ Can send post back to draft from review (if owner)
- ✅ Can edit own posts in draft or in_review status
- ❌ Cannot approve posts

### Admin
- ✅ Can create drafts
- ✅ Can request review
- ✅ Can approve posts (in_review → approved)
- ✅ Can send any post back to draft
- ✅ Can mark posts as posted
- ✅ Can edit any post in draft or in_review status
- ✅ Can approve own posts (admin privilege)

### Social Manager
- ✅ Can create drafts
- ✅ Can request review
- ✅ Can mark approved posts as posted (approved → posted)
- ✅ Can edit own posts in draft or in_review status
- ❌ Cannot approve posts

## API Endpoints

### Update Post Status
```
POST /api/posts/[id]/status
```

Actions:
- `request_review`: Transitions from draft → in_review
- `approve`: Transitions from in_review → approved (admin only)
- `back_to_draft`: Transitions from in_review → draft
- `mark_posted`: Transitions from approved → posted (social_manager or admin)

### Update Post
```
PUT /api/posts/[id]
```

Allows updating post content, title, payload, and status (with validation).

### Get Club Member Role
```
GET /api/clubs/[clubId]/members/[userId]
```

Returns the role of a specific user in a club.

## UI Components

### PostDetail Component
Located at: `features/posts/components/PostDetail.tsx`

Displays:
- Post details and metadata
- Status badge
- Role-based action buttons
- Error handling and loading states

Buttons shown based on role and status:
- **Request Review**: Visible to post owner when status is draft
- **Approve**: Visible to admin when status is in_review
- **Back to Draft**: Visible to admin or post owner when status is in_review
- **Mark as Posted**: Visible to social_manager or admin when status is approved
- **Edit**: Visible when user can edit the post
- **Delete**: Visible to owner or admin for draft/in_review posts

## Implementation Details

### Workflow Validation
All workflow logic is centralized in `lib/workflow.ts`:

- `isValidStatusTransition()`: Validates status transitions
- `canApprovePost()`: Checks if user can approve
- `canRequestReview()`: Checks if user can request review
- `canMarkAsPosted()`: Checks if user can mark as posted
- `canEditPost()`: Checks if user can edit post
- `getAvailableActions()`: Returns available actions for a post based on user role and post status

### Security
- All status transitions are validated both client-side and server-side
- API endpoints verify user membership in the club
- Role-based permissions are enforced at the API level
- Admin-only actions (approve) return 403 Forbidden if attempted by non-admins

## Usage Example

1. **Trainer creates a draft post**
   - Creates new post with status "draft"
   - Can edit and refine the post

2. **Trainer requests review**
   - Clicks "Request Review" button
   - Post status changes to "in_review"

3. **Admin reviews and approves**
   - Views post in "in_review" status
   - Clicks "Approve" button (or "Back to Draft" if changes needed)
   - Post status changes to "approved"

4. **Social manager publishes**
   - Views post in "approved" status
   - Clicks "Mark as Posted" button
   - Post status changes to "posted"

## Error Handling

The system provides clear error messages for:
- Invalid status transitions
- Unauthorized actions
- Missing permissions
- Network errors

All errors are displayed in the UI with appropriate styling.
