# Auth Feature

This feature handles authentication functionality in the application using NextAuth with credentials-based authentication.

## Components

- **LoginForm**: Email and password login form
- **RegisterForm**: User registration form with email and password

## Features

- Credentials-based authentication (email + password)
- Password hashing with bcryptjs
- User registration with automatic sign-in
- Form validation
  - Email format validation
  - Password strength (minimum 8 characters)
  - Password confirmation matching
- Error handling and user feedback
- Automatic redirect to profile after successful login/registration
- Navigation between login and registration pages
- Loading state handling
- Responsive design with custom styling

## API Routes

- `POST /api/auth/register` - Register a new user

## Security

- Passwords are hashed using bcryptjs with salt rounds of 12
- Passwords are never stored in plain text
- Email addresses are normalized to lowercase
- JWT-based session management
