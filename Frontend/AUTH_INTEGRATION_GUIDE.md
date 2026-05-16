# Auth Integration Guide

## Overview
The MediConnect frontend now includes a complete authentication system with:
- User login/register
- Password reset functionality
- Protected routes
- Auth context for state management
- Modular service-based architecture

## Frontend Structure

### 📁 New Files Created:

#### Types
- `src/types/auth.ts` - TypeScript interfaces for auth-related data

#### Services
- `src/services/authService.ts` - API communication for authentication
  - Handles login, register, forgot password, reset password
  - Manages JWT tokens in localStorage
  - Sets Authorization headers automatically

#### Context
- `src/context/AuthContext.tsx` - React Context for managing auth state
  - Provides `useAuth()` hook for accessing auth state anywhere
  - Initializes auth from localStorage on app load

#### Components
- `src/components/ProtectedRoute.tsx` - Route guard component
  - Redirects to login if not authenticated
  - Optional role-based access control

#### Pages
- `src/pages/SignIn.tsx` - User login page
- `src/pages/SignUp.tsx` - User registration page
- `src/pages/ForgotPassword.tsx` - Password recovery page

### 🔌 Updated Files:

#### App.tsx
- Wrapped with `AuthProvider`
- Added auth routes (login, register, forgot-password)
- Protected main routes with `ProtectedRoute` component

#### Navbar.tsx
- Shows user info when authenticated
- User dropdown menu with logout
- Mobile responsive menu

## Backend Integration Requirements

Your .NET backend must implement the following API endpoints:

### POST /api/auth/login
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "John Doe",
    "profilePictureUrl": "https://...",
    "isActive": true,
    "createdAt": "2026-05-15T00:00:00Z",
    "userType": "patient"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /api/auth/register
```json
Request:
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "userType": "patient" // or "doctor"
}

Response:
{
  "success": true,
  "message": "Account created successfully",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /api/auth/forgot-password
```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Reset link sent to email"
}
```

### POST /api/auth/reset-password
```json
Request:
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}

Response:
{
  "success": true,
  "message": "Password reset successfully"
}
```

### POST /api/auth/refresh-token
```json
Response:
{
  "success": true,
  "message": "Token refreshed",
  "token": "new-jwt-token"
}
```

## Backend Setup Steps

### 1. Install Required NuGet Packages
```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt
```

### 2. Update appsettings.json
```json
{
  "JwtSettings": {
    "Secret": "your-super-secret-key-min-32-characters",
    "Issuer": "MediConnect",
    "Audience": "MediConnectUsers",
    "ExpirationMinutes": 60
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173", "https://yourdomain.com"]
  }
}
```

### 3. Create AuthController
A basic controller template:

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Tabibi.DTOs;
using Tabibi.Models;

namespace Tabibi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<AppUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return Unauthorized(new { success = false, message = "Invalid credentials" });
            }

            var token = GenerateJwtToken(user);
            return Ok(new {
                success = true,
                message = "Login successful",
                user = MapUserToResponse(user),
                token = token
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] SignupRequest request)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return BadRequest(new { success = false, message = "Email already registered" });
            }

            var user = new AppUser
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { success = false, message = string.Join(", ", result.Errors.Select(e => e.Description)) });
            }

            var token = GenerateJwtToken(user);
            return Ok(new {
                success = true,
                message = "Account created successfully",
                user = MapUserToResponse(user),
                token = token
            });
        }

        private string GenerateJwtToken(AppUser user)
        {
            var secret = _configuration["JwtSettings:Secret"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("sub", user.Id),
                new Claim("email", user.Email),
                new Claim("name", user.FullName)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(_configuration["JwtSettings:ExpirationMinutes"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private object MapUserToResponse(AppUser user)
        {
            return new
            {
                id = user.Id,
                email = user.Email,
                fullName = user.FullName,
                profilePictureUrl = user.ProfilePictureUrl,
                isActive = user.IsActive,
                createdAt = user.CreatedAt,
                userType = user.DoctorProfile != null ? "doctor" : "patient"
            };
        }
    }
}
```

### 4. Configure JWT in Program.cs
```csharp
// Add Authentication
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"])),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"].Split(",");
        policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Use Authentication and CORS
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowFrontend");
```

## Frontend Usage

### Using the Auth Hook
```typescript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, error } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.fullName}</p>}
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### Protecting Routes
Routes are already protected in App.tsx using `ProtectedRoute` component.

## Installation & Setup

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Create .env file
```bash
cp .env.example .env
# Update VITE_API_BASE_URL to match your backend URL
```

### 3. Run Development Server
```bash
npm run dev
```

## Testing Auth Flow

1. **Signup**: Navigate to `/register` and create an account
2. **Login**: Navigate to `/login` and log in
3. **Protected Routes**: After login, you can access `/ai-chat` and `/find-doctor`
4. **Logout**: Click the user menu in navbar and select logout

## Token Refresh Strategy

The auth service automatically sets JWT tokens in the Authorization header. For token expiration handling:

1. Backend should return 401 when token is expired
2. Frontend intercepts 401 and calls `/api/auth/refresh-token`
3. If refresh succeeds, retry the original request
4. If refresh fails, redirect to login

You can implement this in `authService.ts` using axios interceptors:

```typescript
// Add to authService.ts
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post('/auth/refresh-token');
        const newToken = response.data.token;
        localStorage.setItem(TOKEN_KEY, newToken);
        setAuthorizationHeader(newToken);
        return axios(originalRequest);
      } catch {
        // Refresh failed, redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

## Notes

- Tokens are stored in localStorage for persistence across sessions
- All API requests automatically include the Authorization header
- Auth state is initialized from localStorage on app load
- Errors are captured and displayed to users
- The system maintains separation of concerns (service, context, components)
