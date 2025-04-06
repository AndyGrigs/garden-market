### Admin Panel and Tree Management

#### File Structure
- **src/types.ts**
- **src/store/api/treesApi.ts**
- **src/pages/AdminPanel.tsx**
- **src/components/AdminGuard.tsx**
- **ADMIN_IMPLEMENTATION.md**
- **public/locales/en/translation.json**
- **src/App.tsx**
- **src/components/Header.tsx**
- **src/components/MobileMenu.tsx**

#### Features Implemented
- **Admin-specific routes and guards**
- **Tree management (CRUD operations)**
- **Role-based access control**
- **Admin UI with table view and form modal**
- **Smooth animations and transitions**
- **Comprehensive error handling**
- **Detailed documentation**

#### Testing Admin Functionality
1. **Login**: Use admin credentials (email: `admin@example.com`, password: `admin`).
2. **Access**: Navigate to the admin panel via the header menu.
3. **Manage Trees**: Perform add, edit, and delete operations.

#### Documentation
Refer to **ADMIN_IMPLEMENTATION.md** for:
- **Authentication and authorization**
- **API endpoints**
- **Component structure**
- **Security considerations**
- **Testing guidelines**
- **Maintenance procedures**

The implementation ensures proper error handling, loading states, and user feedback for all operations.


# Authentication Implementation Details

## Overview
This document describes the implementation of authentication in the Garden Trees application using JWT (JSON Web Tokens) stored in HTTP-only cookies for secure session management.

## Technology Stack
- JWT for token-based authentication
- HTTP-only cookies for secure token storage
- Redux Toolkit for state management
- RTK Query for API calls
- TypeScript for type safety

## Implementation Details

### 1. JWT Storage
- Tokens are stored in HTTP-only cookies using `js-cookie`
- Cookies are configured with:
  - `httpOnly: true` - Prevents JavaScript access
  - `secure: true` - Only sent over HTTPS
  - `sameSite: 'strict'` - CSRF protection
  - `path: '/'` - Available across all routes

### 2. Authentication Flow

#### Login Process:
1. User submits credentials
2. Backend validates and returns JWT
3. Token is stored in HTTP-only cookie
4. User info is decoded from JWT and stored in Redux
5. User is redirected to previous page or dashboard

#### Registration Process:
1. User submits registration form
2. Backend creates account and returns JWT
3. Same token storage process as login
4. User is redirected to dashboard

#### Auto Login:
1. App checks for existing JWT cookie on load
2. If found, token is validated
3. User info is decoded and stored in Redux
4. Session is restored automatically

### 3. API Integration

#### Base URL Configuration:
- API URL is configured in environment variables
- All requests include credentials for cookie handling

#### Endpoints:
```typescript
/api/auth/login     - POST: Login
/api/auth/register  - POST: Registration
/api/auth/logout    - POST: Logout
/api/auth/refresh   - POST: Refresh token
```

### 4. Security Measures

#### CSRF Protection:
- SameSite cookie attribute
- Custom CSRF tokens for sensitive operations

#### XSS Protection:
- HTTP-only cookies
- Content Security Policy headers
- Input sanitization

#### Token Security:
- Short expiration time (1 hour)
- Refresh token rotation
- Secure cookie attributes

### 5. Error Handling

- Invalid credentials
- Network errors
- Token expiration
- Refresh token failures
- Registration conflicts

### 6. State Management

#### Redux Store:
- User information
- Authentication status
- Loading states
- Error messages

#### Persistence:
- Token in HTTP-only cookie
- User data in Redux
- Redux persistence disabled for security

### 7. Route Protection

- AuthGuard component for protected routes
- Redirect to login for unauthenticated access
- Return to original route after login

### 8. Logout Process

1. Clear HTTP-only cookie
2. Clear Redux state
3. Redirect to home page
4. Backend invalidates token

### 9. Testing Considerations

- Mock authentication in development
- Test token expiration handling
- Verify secure cookie settings
- Test auto-login functionality
- Validate protected route behavior

### 10. Development Setup

#### Environment Variables:
```env
VITE_API_URL=https://api.example.com
VITE_AUTH_COOKIE_NAME=auth_token
VITE_REFRESH_COOKIE_NAME=refresh_token
```

## Usage Examples

### Protected Route:
```typescript
<Route
  path="/dashboard"
  element={
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  }
/>
```

### API Call:
```typescript
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(credentials)
});
```

## Maintenance Notes

1. Regular security audits
2. Token refresh implementation
3. Error boundary updates
4. Session timeout handling
5. Rate limiting consideration