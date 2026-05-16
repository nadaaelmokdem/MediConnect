# Auth System - Quick Reference

## Using Authentication in Components

### 1. Access Auth State
```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading, error } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Hello, {user?.fullName}</p>}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

### 2. Perform Login
```typescript
const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login('user@example.com', 'password123');
    // User is now logged in
  } catch (err) {
    // Error is caught and displayed
  }
};
```

### 3. Perform Logout
```typescript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate('/signin'); // Redirect to signin
};
```

### 4. Check if User is Authenticated
```typescript
const { isAuthenticated } = useAuth();

if (isAuthenticated) {
  // Show protected content
}
```

### 5. Get Current User Data
```typescript
const { user } = useAuth();

console.log(user?.email);      // User email
console.log(user?.fullName);   // User full name
console.log(user?.userType);   // 'patient' or 'doctor'
```

### 6. Get Auth Token
```typescript
import authService from '../services/authService';

const token = authService.getToken();
```

### 7. Protect Routes
```typescript
import { ProtectedRoute } from '../components/ProtectedRoute';

<Routes>
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    }
  />
</Routes>
```

### 8. Protect Routes by User Type
```typescript
<Route
  path="/doctor-settings"
  element={
    <ProtectedRoute allowedUserTypes={['doctor']}>
      <DoctorSettingsPage />
    </ProtectedRoute>
  }
/>
```

---

## Common Auth Patterns

### Pattern 1: Protected Page with Loading State
```typescript
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user?.fullName}</p>
      <p>Email: {user?.email}</p>
      <p>Type: {user?.userType}</p>
    </div>
  );
}
```

### Pattern 2: Conditional UI Based on Auth
```typescript
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <>
          <span>{user?.fullName}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/signin">Sign In</Link>
      )}
    </header>
  );
}
```

### Pattern 3: Form with Auth Error Display
```typescript
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function LoginForm() {
  const { login, error, isLoading, clearError } = useAuth();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
    } catch (err) {
      // Error is handled by context
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
    </form>
  );
}
```

### Pattern 4: Redirect Authenticated Users
```typescript
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <SignInForm />;
}
```

---

## API Endpoints

### POST /api/auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "John Doe",
    "userType": "patient",
    "isActive": true,
    "createdAt": "2026-05-15T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /api/auth/register
**Request:**
```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "userType": "patient"
}
```

### POST /api/auth/forgot-password
**Request:**
```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/reset-password
**Request:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

### POST /api/auth/refresh-token
**Response:**
```json
{
  "success": true,
  "message": "Token refreshed",
  "token": "new-jwt-token"
}
```

---

## Error Handling

### Display Errors
```typescript
const { error, clearError } = useAuth();

useEffect(() => {
  if (error) {
    // Show error notification
    setTimeout(clearError, 5000); // Clear after 5 seconds
  }
}, [error, clearError]);
```

### Common Error Messages
- `"Invalid credentials"` - Wrong email/password
- `"Email already registered"` - Email exists
- `"Invalid email format"` - Bad email
- `"Password must be at least 6 characters"` - Weak password
- `"Passwords do not match"` - Confirmation doesn't match

---

## Token Management

### Token Lifecycle
1. **Generated** - On login/signup
2. **Stored** - In localStorage as 'mediconnect_token'
3. **Sent** - In Authorization header: `Bearer {token}`
4. **Expired** - After configured expiration time
5. **Refreshed** - Call POST /api/auth/refresh-token
6. **Cleared** - On logout

### Manual Token Operations
```typescript
import authService from '../services/authService';

// Get token
const token = authService.getToken();

// Check if authenticated
const isAuth = authService.isAuthenticated();

// Get stored user
const user = authService.getUser();

// Clear all auth data
authService.logout();
```

---

## Environment Configuration

### .env File
```
# API Configuration
VITE_API_BASE_URL=https://localhost:7136/api
```

### Using Environment Variables in Components
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## Debugging Auth Issues

### Check Token in Browser
```javascript
// In browser console
localStorage.getItem('mediconnect_token')
localStorage.getItem('mediconnect_user')
```

### Check Request Headers
```javascript
// In network tab, check that requests include:
// Authorization: Bearer {token}
```

### Verify Auth Context
```typescript
// In component
const auth = useAuth();
console.log(auth);
```

### Check Backend Logs
```bash
# When running backend
dotnet run
# Look for token generation and validation logs
```

---

## Security Tips

✅ **Do:**
- Store tokens securely (localStorage for SPA, HttpOnly cookies for production)
- Always validate on backend
- Clear tokens on logout
- Use HTTPS in production
- Validate email format
- Require strong passwords
- Use protected routes

❌ **Don't:**
- Log tokens to console in production
- Send credentials in URL parameters
- Store passwords in localStorage
- Trust client-side validation only
- Expose sensitive data in token
- Share user tokens

---

## Testing Credentials

### For Development
```
Email: test@example.com
Password: Test123456
User Type: patient
```

```
Email: doctor@example.com
Password: Doctor123456
User Type: doctor
```

---

## Useful Commands

### Development Server
```bash
cd Frontend
npm run dev
```

### Build Production
```bash
npm run build
```

### Run Linter
```bash
npm run lint
```

### Backend Server
```bash
cd Backend
dotnet run
```

---

## File Structure Reference

```
Frontend/src/
├── types/auth.ts                 # Auth types
├── services/authService.ts       # API calls
├── context/AuthContext.tsx       # State management
├── components/ProtectedRoute.tsx # Route guard
└── pages/
    ├── SignIn.tsx               # Login page
    ├── SignUp.tsx               # Signup page
    └── ForgotPassword.tsx       # Password reset
```

---

## See Also

- `AUTH_INTEGRATION_GUIDE.md` - Complete setup guide
- `IMPLEMENTATION_CHECKLIST.md` - Implementation checklist
- `Backend/Controllers/AuthController.cs` - Backend implementation
