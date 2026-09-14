# MoodBuds Frontend ↔ API Integration Analysis

**Date:** September 13, 2026  
**Status:** Analysis Complete - Ready for Step-by-Step Integration

---

## 📊 Executive Summary

The frontend is a React app with mock data services that can be swapped with real API calls. The backend is a Spring Boot API with fully implemented endpoints. Integration involves replacing mock services with HTTP API calls.

---

## 🏗️ FRONTEND ARCHITECTURE

### Tech Stack
- **React 19.2.8** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **React Router 7** - Navigation
- **Context API** - State management

### Current Data Flow
```
Components → Providers (Context) → Services → Mock API / Data
```

### Current Service Structure
```
frontend/src/
├── services/
│   ├── api/
│   │   └── apiClient.ts          ← Base HTTP client (ready)
│   └── storage/
│       └── storageService.ts      ← LocalStorage
├── features/
│   ├── products/
│   │   └── services/
│   │       ├── productApi.ts      ← Interface definition
│   │       ├── mockProductApi.ts  ← Mock implementation ✓
│   │       └── httpProductApi.ts  ← Real API (PARTIAL) ⚠️
│   ├── cart/
│   │   └── services/
│   │       ├── cartApi.ts         ← Interface definition
│   │       ├── mockCartApi.ts     ← Mock implementation
│   │       └── (NO HTTP VERSION)  ← NEEDS CREATION
│   ├── wishlist/services/
│   ├── moods/services/
│   ├── quiz/services/
│   └── (others)
└── app/providers/
    ├── CartProvider.tsx           ← Uses cartService
    ├── WishlistProvider.tsx
    ├── QuizProvider.tsx
    └── ToastProvider.tsx
```

### Providers (State Management)
1. **CartProvider** - Manages shopping cart state
2. **WishlistProvider** - Manages wishlist
3. **QuizProvider** - Manages quiz state
4. **ToastProvider** - Toast notifications

---

## 🔧 BACKEND API STRUCTURE

### Base URL
```
http://localhost:8080/api/v1
```

### Public Endpoints (No Auth Required)

#### 1. Catalog Endpoints
```
GET  /home                              → Homepage collections
GET  /categories                        → List all categories
GET  /categories/{slug}                 → Category detail
GET  /moods                             → List all moods
GET  /moods/{slug}                      → Mood detail
GET  /moods/{slug}/products             → Products by mood
GET  /products                          → Search/filter products
GET  /products/{slug}                   → Product detail
GET  /products/{slug}/availability      → Product availability
GET  /products/{slug}/size-chart        → Size chart
```

#### 2. Quiz Endpoints
```
GET  /quiz/config                       → Quiz configuration
POST /quiz/sessions                     → Create quiz session
GET  /quiz/sessions/{sessionId}         → Get progress
GET  /quiz/sessions/{sessionId}/question → Get next question
POST /quiz/sessions/{sessionId}/answers → Submit answer
POST /quiz/sessions/{sessionId}/complete → Complete quiz
GET  /quiz/sessions/{sessionId}/result  → Get result
```

### Protected Endpoints (JWT Auth Required)

#### 3. Customer Authentication
```
POST /customer/auth/register            → Register customer
POST /customer/auth/login               → Login customer
POST /customer/auth/refresh             → Refresh token
POST /customer/auth/logout              → Logout
POST /customer/auth/logout-all          → Logout all sessions
```

#### 4. Customer Profile
```
GET  /customer/profile                  → Get profile
PATCH /customer/profile                 → Update profile
PUT  /customer/profile/password         → Change password
DELETE /customer/profile                → Deactivate account
GET  /customer/addresses                → List addresses
POST /customer/addresses                → Create address
GET  /customer/addresses/{id}           → Get address
PUT  /customer/addresses/{id}           → Update address
DELETE /customer/addresses/{id}         → Delete address
```

#### 5. Cart Management
```
GET  /customer/cart                     → Get cart
GET  /customer/cart/summary             → Cart summary
GET  /customer/cart/count               → Item count
POST /customer/cart/items               → Add to cart
PATCH /customer/cart/items/{itemId}     → Update cart item
DELETE /customer/cart/items/{itemId}    → Remove from cart
DELETE /customer/cart                   → Clear cart
POST /customer/cart/validate            → Validate cart
```

#### 6. Wishlist Management
```
GET  /customer/wishlist                 → Get wishlist
GET  /customer/wishlist/status          → Check if wishlisted
POST /customer/wishlist/items           → Add to wishlist
DELETE /customer/wishlist/items/{id}    → Remove from wishlist
DELETE /customer/wishlist               → Clear wishlist
POST /customer/wishlist/items/{id}/move-to-cart → Move to cart
```

#### 7. Orders
```
POST /customer/orders                   → Place order
GET  /customer/orders                   → List orders
GET  /customer/orders/{orderNumber}     → Get order detail
GET  /customer/orders/{orderNumber}/cancellation-eligibility
POST /customer/orders/{orderNumber}/cancel → Cancel order
```

---

## 🔄 CURRENT STATE vs. TARGET STATE

### Current State
| Feature | Status | Data Source |
|---------|--------|-------------|
| Products Listing | ✓ Works | `products.ts` (mock) |
| Product Details | ✓ Works | `products.ts` (mock) |
| Moods | ✓ Works | `moods.ts` (mock) |
| Cart | ✓ Works | LocalStorage |
| Wishlist | ✓ Works | LocalStorage |
| Quiz | ✓ Works | `quiz.ts` (mock) |
| Authentication | ✗ None | - |
| Orders | ✗ None | - |
| Profile | ✗ None | - |

### Target State
| Feature | Action | New Data Source |
|---------|--------|-----------------|
| Products Listing | Keep | Real API (already partial) |
| Product Details | Update | Real API endpoint |
| Moods | Create | Real API |
| Cart | Create | Real API + JWT |
| Wishlist | Create | Real API + JWT |
| Quiz | Create | Real API |
| Authentication | Create | Real API (JWT) |
| Orders | Create | Real API + JWT |
| Profile | Create | Real API + JWT |

---

## 🚀 INTEGRATION PRIORITY & PHASES

### Phase 1: Foundation (Must Do First)
1. **Setup API Configuration**
   - Set `.env.local` with `VITE_API_BASE_URL`
   - Update `apiClient.ts` to handle JWT tokens
   
2. **Authentication Service**
   - Create `authService.ts`
   - Implement login/register/logout
   - Store JWT tokens securely

### Phase 2: Basic Features
3. **Catalog/Products**
   - Fix `httpProductApi.ts` to match real endpoints
   - Create `moodService.ts` with real API
   - Update ProductListingPage to use real data

4. **Quiz**
   - Create `quizService.ts` with real API
   - Update QuizProvider to use real API

### Phase 3: User Features
5. **Cart**
   - Create `httpCartApi.ts`
   - Update CartProvider
   - Test add/remove/update operations

6. **Wishlist**
   - Create `wishlistService.ts`
   - Update WishlistProvider

### Phase 4: Advanced Features
7. **Orders**
   - Create `orderService.ts`
   - Implement order placement
   - Add order history

8. **Profile/Addresses**
   - Create `profileService.ts`
   - Implement account management

---

## 🔐 Authentication Flow

### Current
```
No authentication
```

### Target
```
1. User registers/logs in → Backend returns access + refresh token
2. Store tokens in localStorage (or sessionStorage)
3. Include access token in Authorization header: "Bearer {token}"
4. On token expiry → Use refresh token to get new access token
5. On refresh failure → Clear tokens & redirect to login
```

### Required Changes
1. **`apiClient.ts`** - Add JWT token to headers
2. **Auth Service** - Handle login/register/refresh logic
3. **Token Storage** - Secure token management
4. **Interceptor** - Automatically add token to requests

---

## 📋 INTEGRATION STEP-BY-STEP CHECKLIST

### Step 1: API Configuration ✓ Setup
- [ ] Create `.env.local` with API URL
- [ ] Test `apiClient` connectivity

### Step 2: Authentication 🔑
- [ ] Create authentication service
- [ ] Implement login/register/logout
- [ ] Add token management
- [ ] Create login page/modal

### Step 3: Products 📦
- [ ] Update `httpProductApi.ts`
- [ ] Create moods service
- [ ] Test product listing

### Step 4: Quiz 🎯
- [ ] Create quiz service
- [ ] Test quiz flow

### Step 5: Cart 🛒
- [ ] Create HTTP cart API
- [ ] Update CartProvider
- [ ] Test cart operations

### Step 6: Wishlist ❤️
- [ ] Create wishlist service
- [ ] Test wishlist operations

### Step 7: Orders 📦
- [ ] Create order service
- [ ] Test order placement

### Step 8: Profile 👤
- [ ] Create profile service
- [ ] Test profile management

---

## 📝 Required Files to Create/Update

### Files to Create
```
frontend/src/services/auth/
├── authService.ts
├── tokenManager.ts
└── types.ts

frontend/src/features/moods/services/
├── moodApi.ts
└── httpMoodApi.ts

frontend/src/features/cart/services/
└── httpCartApi.ts

frontend/src/features/wishlist/services/
└── (update existing)

frontend/src/features/orders/services/
├── orderApi.ts
└── httpOrderApi.ts

frontend/src/features/profile/services/
├── profileApi.ts
└── httpProfileApi.ts
```

### Files to Update
```
frontend/src/
├── .env.local (create)
├── services/api/apiClient.ts (add JWT support)
├── features/products/services/httpProductApi.ts (complete)
├── features/quiz/services/quizService.ts
├── app/providers/CartProvider.tsx
├── app/providers/WishlistProvider.tsx
├── (and others)
```

---

## 🎯 Expected Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| CORS errors | Ensure backend has CORS configured for localhost:5173 |
| JWT token expiration | Implement refresh token mechanism |
| Lost cart on logout | Save cart state to server, not localStorage |
| Mock data conflicts | Use env flag to toggle between mock/real API |
| API response format mismatch | Create DTOs/mappers to convert responses |
| Uninitialized state | Handle loading/error states properly |

---

## 📚 Key Types (Already Defined)

```typescript
// Main types in frontend/src/types/
interface Product { id, name, price, image, sizes, colors, ... }
interface Cart { items, subtotal, savings, delivery, discount, total, ... }
interface CartItem { id, productId, qty, size, price, ... }
interface AuthResponse { accessToken, refreshToken, customer, ... }
interface CustomerProfile { id, email, firstName, lastName, ... }
interface Order { orderNumber, status, items, total, ... }
```

---

## ✅ Success Criteria

Each phase is complete when:
1. Code compiles without errors
2. API calls succeed (verify in Network tab)
3. Data displays correctly on UI
4. Loading states work
5. Error handling works
6. Tests pass (if applicable)

---

## 🔗 Reference URLs

- Backend API Docs: http://localhost:8080/swagger-ui.html
- Frontend Types: `frontend/src/types/index.ts`
- Mock Data: `frontend/src/data/`

---

**Next Step:** Begin Phase 1 - Setup API Configuration

