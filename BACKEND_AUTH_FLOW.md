# 🔐 Backend Authentication Flow - Complete Analysis

**Date:** September 13, 2026

---

## 📋 API Endpoints & Contracts

### 1️⃣ REGISTER - Create New Account

**Endpoint:** `POST /api/v1/customer/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "mobile": "+91-9999999999"
}
```

**Validation Rules:**
- `email`: Required, valid email format, max 255 chars
- `password`: Required, 10-72 characters
- `firstName`: Required, max 100 chars
- `lastName`: Required, max 100 chars
- `mobile`: Optional, 10-15 digits (can include + prefix)

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "accessTokenExpiresAt": "2026-09-14T00:15:00Z",
  "refreshTokenExpiresAt": "2026-09-20T23:15:00Z",
  "customer": {
    "id": 1,
    "email": "user@example.com",
    "emailVerified": false,
    "mobile": "+91-9999999999",
    "mobileVerified": false,
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": null,
    "gender": "UNSPECIFIED",
    "active": true,
    "createdAt": "2026-09-13T23:15:00Z",
    "updatedAt": "2026-09-13T23:15:00Z"
  }
}
```

**Error Response (400/409):**
```json
{
  "error": "Email already registered"
}
```

---

### 2️⃣ LOGIN - Authenticate User

**Endpoint:** `POST /api/v1/customer/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Validation Rules:**
- `email`: Required, valid email, max 255 chars
- `password`: Required, max 72 chars

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "accessTokenExpiresAt": "2026-09-14T00:30:00Z",
  "refreshTokenExpiresAt": "2026-09-20T23:30:00Z",
  "customer": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    // ... full customer profile
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

---

### 3️⃣ REFRESH - Get New Access Token

**Endpoint:** `POST /api/v1/customer/auth/refresh`

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "NEW_ACCESS_TOKEN_HERE",
  "refreshToken": "NEW_REFRESH_TOKEN_HERE",
  "tokenType": "Bearer",
  "accessTokenExpiresAt": "2026-09-14T01:00:00Z",
  "refreshTokenExpiresAt": "2026-09-21T00:00:00Z",
  "customer": { /* ... */ }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid or expired refresh token"
}
```

---

### 4️⃣ LOGOUT - End Current Session

**Endpoint:** `POST /api/v1/customer/auth/logout`

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (204 No Content):**
```
(Empty response body)
```

**What it does:**
- Revokes the current refresh session
- Access token becomes invalid
- User must login again to get new tokens

---

### 5️⃣ LOGOUT ALL - End All Sessions

**Endpoint:** `POST /api/v1/customer/auth/logout-all`

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```
(Empty body)
```

**Response (204 No Content):**
```
(Empty response body)
```

**What it does:**
- Revokes ALL refresh sessions for user
- All logged-in devices are logged out
- User must login again

---

## 🔄 Complete Authentication Flow

### Step 1: User Registers
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ POST /register
       │ { email, password, firstName, lastName, mobile }
       │
       ▼
┌──────────────────┐
│  Backend Auth    │
│  Service         │
│  ├─ Hash pwd     │
│  ├─ Save user    │
│  ├─ Gen tokens   │
│  └─ Save session │
└──────┬───────────┘
       │ AuthResponse
       │ { accessToken, refreshToken, customer }
       │
       ▼
┌─────────────────┐
│ LocalStorage    │
│ ├─ accessToken  │ (15 min expiry)
│ ├─ refreshToken │ (7 day expiry)
│ └─ customer     │
└─────────────────┘
```

### Step 2: User Logged In - Making Requests
```
┌──────────────┐
│  Component   │
│  (useCart)   │
└──────┬───────┘
       │ Needs data from API
       │
       ▼
┌──────────────────────┐
│  apiClient.get()     │
│  ├─ Read accessToken │
│  │  from localStorage│
│  ├─ Add header:      │
│  │  Authorization:   │
│  │  Bearer {token}   │
│  └─ Send request     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Backend             │
│  ├─ Validate JWT     │
│  ├─ Check expiry     │
│  ├─ Load customer    │
│  └─ Return data      │
└──────┬───────────────┘
       │
       ▼
┌──────────────┐
│  Component   │
│  Shows data  │
└──────────────┘
```

### Step 3: Access Token Expires
```
┌──────────────────────┐
│  apiClient           │
│  Send request with   │
│  old accessToken     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Backend             │
│  ├─ Validate JWT     │
│  ├─ EXPIRED! ❌      │
│  └─ Return 401       │
└──────┬───────────────┘
       │ 401 Unauthorized
       │
       ▼
┌──────────────────────┐
│  apiClient           │
│  ├─ Detect 401       │
│  ├─ Call refresh()   │
│  ├─ Send refreshToken│
│  └─ Get new tokens   │
└──────┬───────────────┘
       │ New Tokens
       │
       ▼
┌──────────────────────┐
│  LocalStorage        │
│  Update tokens       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Retry original      │
│  request with new    │
│  accessToken ✅      │
└──────────────────────┘
```

### Step 4: User Logs Out
```
┌──────────────┐
│  User clicks │
│  "Sign out"  │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────┐
│  authService.logout()       │
│  ├─ Send POST /logout       │
│  │  + Header: Bearer token  │
│  │  + Body: refreshToken    │
│  └─ Get 204 response        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  tokenManager.clearTokens() │
│  ├─ Delete accessToken      │
│  ├─ Delete refreshToken     │
│  ├─ Delete customer         │
│  └─ Clear localStorage      │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  navigate('/')              │
│  Redirect to home page      │
│  ├─ Shows login button      │
│  └─ Shows register button   │
└─────────────────────────────┘
```

---

## 🔐 Token Structure

### Access Token (JWT)
- **Purpose**: Prove you are authenticated
- **Lifespan**: 15 minutes (short-lived)
- **Contains**: User ID, permissions, expiry
- **Used in**: Every API request header
- **Expires**: Backend will return 401

### Refresh Token
- **Purpose**: Get new access token when expired
- **Lifespan**: 7 days (long-lived)
- **Contains**: Session ID, user ID
- **Stored**: Secure location (localStorage for now)
- **Used in**: Only for refresh endpoint

---

## 🧪 Frontend Requirements for Each Endpoint

### Register Page Must:
1. ✅ Collect: email, password, firstName, lastName, mobile (optional)
2. ✅ Validate: 
   - Email format
   - Password length (10-72)
   - Names not empty
3. ✅ Call: `authService.register(data)`
4. ✅ Handle: 
   - 201 Success → Save tokens → Redirect to home
   - 409 Conflict → Show "Email already registered"
   - 400 Validation → Show field errors
5. ✅ Show: Loading spinner while registering

### Login Page Must:
1. ✅ Collect: email, password
2. ✅ Validate:
   - Email format
   - Password not empty
3. ✅ Call: `authService.login(data)`
4. ✅ Handle:
   - 200 Success → Save tokens → Redirect to home
   - 401 Unauthorized → Show "Invalid email or password"
   - 400 Validation → Show field errors
5. ✅ Show: Loading spinner while logging in
6. ✅ Provide: "Forgot password?" link
7. ✅ Provide: Link to register page

### Protected Routes Must:
1. ✅ Check: `isAuthenticated` from useAuth()
2. ✅ Redirect: If not authenticated → /login
3. ✅ Show: Component if authenticated

### Logout Must:
1. ✅ Call: `authService.logout()`
2. ✅ Wait: API call completes (204)
3. ✅ Clear: Tokens from localStorage
4. ✅ Redirect: To home page
5. ✅ Show: Confirmation message

---

## 💡 Key Implementation Details

### Password Requirements
- Minimum: 10 characters
- Maximum: 72 characters
- No specific complexity rules (letters, numbers, special chars not required)
- Hashed with BCrypt before storing

### Email Handling
- Must be unique (duplicate = 409 error)
- Case-insensitive (user@example.com = USER@EXAMPLE.COM)
- Maximum 255 characters

### Token Expiry Handling
```typescript
// Frontend must:
1. Parse accessTokenExpiresAt from response
2. Calculate when token expires
3. On 401 response → call refresh()
4. OR proactively refresh before expiry

// OR simpler:
// Let apiClient handle 401 automatically
// It will call refresh() and retry
```

### Mobile Number (Optional)
- Format: +91-9999999999 or 9999999999
- Digits only: 10-15
- With + prefix: Still counts as valid
- Can be updated later in profile

---

## 🎯 Frontend Implementation Checklist

### Register Page
- [ ] Email input field
- [ ] Password input field (masked)
- [ ] First name input
- [ ] Last name input
- [ ] Mobile number input (optional)
- [ ] Terms & conditions checkbox (if needed)
- [ ] Register button
- [ ] Loading spinner while submitting
- [ ] Error messages below each field
- [ ] Link to login page
- [ ] Form validation before submit
- [ ] Success message (or auto-redirect)

### Login Page
- [ ] Email input field
- [ ] Password input field (masked)
- [ ] Remember me checkbox (optional)
- [ ] Login button
- [ ] Loading spinner while submitting
- [ ] Error message for invalid credentials
- [ ] Forgot password link (for future)
- [ ] Sign up link
- [ ] Form validation before submit

### Protected Routes
- [ ] Check isAuthenticated before rendering
- [ ] Show loading while checking auth
- [ ] Redirect to /login if not authenticated
- [ ] Preserve intended URL for post-login redirect

### Logout
- [ ] Logout button in profile dropdown ✅ (already done)
- [ ] Call authService.logout()
- [ ] Handle any errors
- [ ] Redirect to home
- [ ] Clear all user data

---

## 📝 Example API Calls

### Register
```bash
curl -X POST http://localhost:8080/api/v1/customer/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "MySecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "mobile": "+91-9999999999"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/v1/customer/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "MySecurePass123"
  }'
```

### Refresh Token
```bash
curl -X POST http://localhost:8080/api/v1/customer/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGc..."
  }'
```

### Logout
```bash
curl -X POST http://localhost:8080/api/v1/customer/auth/logout \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGc..."
  }'
```

---

**Now ready to build frontend pages matching this exact contract!** 🚀

