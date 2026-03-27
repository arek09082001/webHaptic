# Security Considerations

## Authentication & Authorization

### NextAuth.js
- **JWT Sessions**: Sessions are stored as JWT tokens, not in a database, providing better performance and scalability
- **Secure Callbacks**: Only allows sign-in through Google OAuth provider
- **Protected Routes**: Middleware checks JWT token before allowing access to protected pages

### OAuth Security
- Google OAuth is configured with proper redirect URIs
- Client secret is stored in environment variables, never exposed to client
- OAuth tokens are handled server-side only

## Database Security

### Supabase Row Level Security (RLS)
- RLS is enabled on the `users` table
- Service role key is used for all database operations (NextAuth callbacks)
- Service role key is only used server-side in `lib/auth.ts`
- Anonymous key in `lib/supabase.ts` is for future client-side operations (currently unused)

### Environment Variables
All sensitive credentials are stored in environment variables:
- `NEXTAUTH_SECRET`: Used to encrypt JWT tokens
- `GOOGLE_CLIENT_SECRET`: OAuth client secret
- `SUPABASE_SERVICE_ROLE_KEY`: Full database access (server-side only)

## Protected Routes

The following routes are protected by middleware:
- `/profile/*` - User profile pages
- `/dashboard/*` - Dashboard pages (extensible)

Unauthenticated users are automatically redirected to `/login`.

## Best Practices Implemented

1. **No Hardcoded Secrets**: All secrets are in environment variables
2. **JWT Encryption**: Sessions are encrypted using NEXTAUTH_SECRET
3. **Server-Side Operations**: Database writes only happen server-side
4. **Error Handling**: Errors are logged but don't expose sensitive information
5. **HTTPS Only (Production)**: OAuth requires HTTPS in production

## Security Recommendations

### For Production Deployment

1. **Generate Strong NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

2. **Use Environment-Specific OAuth Credentials**:
   - Development: localhost redirect URIs
   - Production: Your domain redirect URIs

3. **Enable HTTPS**: Required for OAuth in production

4. **Rotate Secrets Regularly**: Change NEXTAUTH_SECRET periodically

5. **Monitor Access Logs**: Review Supabase logs for suspicious activity

6. **Set Up CORS**: Configure Supabase CORS policies appropriately

7. **Rate Limiting**: Consider implementing rate limiting for login attempts

8. **Content Security Policy**: Add CSP headers in production

### Environment Variable Security

- Never commit `.env.local` to version control (already in .gitignore)
- Use separate credentials for development and production
- Store production secrets in your hosting platform's secure environment variable system
- Regularly audit who has access to production credentials

## Vulnerability Reporting

If you discover a security vulnerability, please email security@example.com (update with your email).

## Security Audit Log

- 2026-02-16: Initial security review completed
  - Fixed RLS policies to use service role for all operations
  - Removed redundant created_at field from user insert
  - Added documentation for client vs server-side Supabase usage
  - Verified middleware protection on routes
