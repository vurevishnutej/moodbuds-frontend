# MoodBuds Project - Startup & Running Guide

## ✅ Status: Both Services Running

- **Backend**: http://localhost:8080 (Spring Boot + H2 Database)
- **Frontend**: http://localhost:5175 (React + Vite)
- **Database**: H2 In-Memory (development/testing)

---

## Quick Navigation

| URL | Purpose |
|-----|---------|
| http://localhost:5175 | Frontend application (main UI) |
| http://localhost:8080/swagger-ui.html | Backend API documentation |
| http://localhost:8080/h2-console | H2 database console |
| http://localhost:8080/api/v1/moods | API endpoint example |

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                     MoodBuds E-Commerce Platform                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────────┐  │
│  │   Frontend (React)   │         │  Backend (Spring Boot)   │  │
│  │  Port: 5175          │         │  Port: 8080              │  │
│  │  - Components        │◄────────►  - Controllers           │  │
│  │  - Pages             │  HTTP   │  - Services              │  │
│  │  - Hooks             │◄────────►  - Repositories          │  │
│  │  - State Mgmt        │   REST  │  - Database Layer        │  │
│  │  - Styling           │         │                          │  │
│  └──────────────────────┘         └──────────────────────────┘  │
│                                            │                     │
│                                            ▼                     │
│                                   ┌──────────────────┐           │
│                                   │  H2 Database     │           │
│                                   │  (In-Memory)     │           │
│                                   │                  │           │
│                                   │  - Products      │           │
│                                   │  - Moods         │           │
│                                   │  - Media Assets  │           │
│                                   │  - Users         │           │
│                                   │  - Orders        │           │
│                                   └──────────────────┘           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Complete Data Flow

### 1. Customer Views Product Page

```
User visits:  http://localhost:5175/mood/professional
                    ↓
            React Router loads page
                    ↓
            Component calls: useProducts('professional')
                    ↓
            Hook calls: httpProductApi.getProductsByMood()
                    ↓
            Makes HTTP request:
            GET http://localhost:8080/api/v1/moods/professional/products
                    ↓
            Backend ProcessesRequest:
            ├─ Find mood by slug
            ├─ Query products for mood
            ├─ Build ProductCard objects
            └─ Return PageResponse<ProductCard>
                    ↓
            Frontend receives JSON:
            {
              "content": [{
                "id": 1,
                "name": "jeans sf",
                "price": 8999,
                "primaryImageUrl": "/api/v1/media/1/content"
              }],
              "totalElements": 1
            }
                    ↓
            Frontend transforms data:
            ├─ Convert relative URL to absolute
                "http://localhost:8080/api/v1/media/1/content"
            └─ Map to Product interface
                    ↓
            Render ProductCard component:
            ├─ <img src="http://localhost:8080/api/v1/media/1/content" />
            ├─ onLoad={() => setImageLoaded(true)}
            └─ className={`product-media ${imageLoaded ? 'img-loaded' : ''}`}
                    ↓
            Browser requests image:
            GET http://localhost:8080/api/v1/media/1/content
                    ↓
            Backend MediaController:
            ├─ Load media_assets row from H2
            ├─ Read file from disk (C:/moodbuds/products/{uuid}.jpg)
            └─ Return with content-type: image/jpeg
                    ↓
            Image displays with CSS fade-in animation
                    ↓
            User sees complete product card with image ✅
```

### 2. Admin Creates Product

```
Admin visits:  http://localhost:5175/profile/admin/create-product
                    ↓
            Login screen (JWT authentication)
            Username: owner  (or your admin user)
                    ↓
            Fill form:
            ├─ Name, Price, Description
            ├─ Select Category & Subcategory
            ├─ Choose Moods
            ├─ Add Sizes & Stock per size
            └─ Upload Images
                    ↓
            Click "Upload Image" → POST /api/v1/admin/media/images
            ├─ Backend saves to: C:/moodbuds/temp/products/{uuid}.jpg
            ├─ Creates media_assets record
            └─ Returns mediaId
                    ↓
            Click "Publish" → PUT /api/v1/admin/products/complete
            ├─ Backend finalizes temp files
            │  (moves from temp/ to products/)
            ├─ Updates database:
            │  ├─ products table
            │  ├─ product_moods
            │  ├─ product_images
            │  └─ product_sizes
            └─ Returns published product ✅
                    ↓
            Frontend shows success message
            Redirects to product detail page
```

---

## API Endpoints Reference

### Public Endpoints (No Authentication)

#### Moods
- **GET** `/api/v1/moods` — List all moods
- **GET** `/api/v1/moods/{slug}` — Get mood details
- **GET** `/api/v1/moods/{slug}/products` — Products by mood

#### Products
- **GET** `/api/v1/products` — List all products
- **GET** `/api/v1/products/{slug}` — Product detail
- **GET** `/api/v1/products/search?q=keyword` — Search products

#### Categories
- **GET** `/api/v1/categories` — List categories
- **GET** `/api/v1/categories/{slug}` — Category detail

### Admin Endpoints (Requires Bearer Token)

#### Authentication
- **POST** `/api/v1/admin/auth/login` — Admin login
  ```json
  {
    "username": "owner",
    "password": "your-password"
  }
  ```

#### Products
- **POST** `/api/v1/admin/products/complete` — Create product
- **PUT** `/api/v1/admin/products/{id}/complete` — Update product
- **POST** `/api/v1/admin/products/{id}/publish` — Publish product

#### Media/Images
- **POST** `/api/v1/admin/media/images` — Upload images (multipart)
- **GET** `/api/v1/media/{id}/content` — Get image content

#### Categories
- **GET** `/api/v1/admin/categories` — List categories
- **POST** `/api/v1/admin/categories` — Create category
- **PUT** `/api/v1/admin/categories/{id}` — Update category

---

## Database Schema (H2)

### Key Tables

#### products
```sql
SELECT * FROM products;
-- Columns: id, name, slug, description, price, category_id, 
--          is_published, created_at, updated_at
```

#### moods
```sql
SELECT * FROM moods;
-- Columns: id, name, slug, color, tagline, created_at
```

#### product_moods (Association)
```sql
SELECT * FROM product_moods;
-- Links products to moods (many-to-many)
```

#### media_assets
```sql
SELECT * FROM media_assets;
-- Columns: id, storage_key, content_type, file_size, created_at
-- storage_key: path to file on disk
```

#### product_images
```sql
SELECT * FROM product_images;
-- Columns: product_id, media_id, display_order, is_primary
```

#### product_sizes
```sql
SELECT * FROM product_sizes;
-- Columns: id, product_id, size, stock_quantity, 
--          low_stock_threshold, is_available
```

#### admin_users
```sql
SELECT * FROM admin_users;
-- Columns: id, username, password_hash, role_id, email, 
--          full_name, is_active, created_at
```

---

## Environment Configuration

### Backend (H2 Profile)

The backend uses H2 database configuration from:
- **File**: `backend/src/main/resources/application-h2.yml`
- **Database URL**: `jdbc:h2:mem:testdb` (in-memory)
- **Username**: `sa` (default H2)
- **Password**: (empty)

**Required Environment Variables**:
```bash
export SPRING_PROFILES_ACTIVE=h2
export MOODBUDS_JWT_SECRET=dev-secret-key-12345678901234567890
```

**Optional Environment Variables**:
```bash
export MOODBUDS_MEDIA_ROOT=/path/to/media/storage  # Default: C:/moodbuds
export MOODBUDS_ALLOWED_ORIGINS=http://localhost:5175
```

### Frontend (.env.local)

Located at `frontend/.env.local`:
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_USE_MOCK_API=false
```

---

## Running the Services

### Start Backend
```bash
cd backend
SPRING_PROFILES_ACTIVE=h2 \
MOODBUDS_JWT_SECRET=dev-secret-key-12345678901234567890 \
mvn spring-boot:run
```

The backend will:
1. Load H2 database configuration
2. Run Flyway migrations (creates schema)
3. Seed initial data (moods, categories, admin users)
4. Start Tomcat on port 8080
5. Enable H2 console at `/h2-console`

### Start Frontend
```bash
cd frontend
npm install  # First time only
npm run dev
```

The frontend will:
1. Start Vite dev server
2. Auto-reload on file changes
3. Available at http://localhost:5175

---

## Testing the Setup

### 1. Verify Backend is Running
```bash
curl http://localhost:8080/api/v1/moods
```
Expected: Returns JSON array of moods

### 2. Open Frontend in Browser
Visit: http://localhost:5175

### 3. Navigate to Mood Page
Click on a mood (e.g., "Professional") to see products

### 4. Check Network Tab
- Open DevTools (F12)
- Go to Network tab
- Reload page
- Verify requests go to `http://localhost:8080/api/v1/`

### 5. Test Admin Panel
Visit: http://localhost:5175/profile/admin

Login with:
- **Username**: `owner`
- **Password**: `owner123` (or your configured admin password)

Then access:
- Categories: http://localhost:5175/profile/admin/categories
- Create Product: http://localhost:5175/profile/admin/create-product

---

## Troubleshooting

### Backend won't start - Port 8080 in use
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Try starting backend again
```

### Frontend won't start - Port 5175 in use
```bash
# Find process using port 5175
lsof -i :5175

# Kill the process
kill -9 <PID>

# Try starting frontend again
```

### Images not loading
1. Check Network tab for image requests
2. Verify absolute URL: `http://localhost:8080/api/v1/media/{id}/content`
3. Check H2 database for media_assets records:
   ```sql
   SELECT * FROM media_assets;
   ```

### Database migration errors
The H2 profile automatically:
- Creates schema on startup
- Runs Flyway migrations
- Seeds initial data

If you need to reset, simply restart the backend (H2 is in-memory, resets automatically).

---

## Project Structure

```
moodbuds-project-final/
├── backend/
│   ├── src/main/java/com/moodbuds/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── entities/
│   │   └── config/
│   ├── src/main/resources/
│   │   ├── application.yml (MySQL config)
│   │   ├── application-h2.yml (H2 config)
│   │   └── db/migration/h2/ (Flyway scripts)
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── app/ (Routes, providers)
│   │   ├── components/ (UI components)
│   │   ├── features/ (Feature modules)
│   │   ├── services/ (API clients)
│   │   ├── types/ (TypeScript interfaces)
│   │   └── styles/ (CSS)
│   ├── .env.local
│   └── package.json
│
├── README.md (Project overview)
├── CHANGES.md (Recent modifications)
├── SESSION_NOTES_2026_09_17.md (Detailed architecture)
└── STARTUP_GUIDE.md (This file)
```

---

## Key Technologies

### Backend
- **Framework**: Spring Boot 3.5.5
- **Language**: Java 21
- **Database**: H2 (development)
- **Authentication**: JWT + BCrypt
- **ORM**: JPA/Hibernate
- **Migrations**: Flyway

### Frontend
- **Framework**: React 19.2.8
- **Language**: TypeScript
- **Build Tool**: Vite 8.2.2
- **Routing**: React Router 7.18.2
- **Testing**: Vitest

---

## Additional Resources

### API Documentation
- Swagger UI: http://localhost:8080/swagger-ui.html
- API Docs JSON: http://localhost:8080/v3/api-docs

### Database Management
- H2 Console: http://localhost:8080/h2-console
- Connection String: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave blank)

### Documentation Files
- `README.md` — Project overview
- `SESSION_NOTES_2026_09_17.md` — Detailed technical notes
- `CHANGES.md` — Recent changes and features
- Backend `README.md` — Backend-specific setup
- Frontend `README.md` — Frontend-specific setup

---

## Next Steps

1. **Explore the UI**: Visit http://localhost:5175 and browse products
2. **Test API**: Use Swagger UI at http://localhost:8080/swagger-ui.html
3. **Check Database**: Access H2 console at http://localhost:8080/h2-console
4. **Admin Panel**: Log in at http://localhost:5175/profile/admin
5. **Review Code**: Check `SESSION_NOTES_2026_09_17.md` for architecture details

---

**Document Version**: 1.0  
**Date**: September 19, 2026  
**Status**: ✅ All services running and ready to use
