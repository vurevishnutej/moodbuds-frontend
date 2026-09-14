# MoodBuds Frontend + API Integration Guide

## Project Structure
```
MoodBuds-Project/
├── backend/     (Spring Boot REST API)
├── frontend/    (React + Vite)
└── INTEGRATION_GUIDE.md
```

---

## 📋 Prerequisites

### Backend Requirements
- **Java 21** - [Download](https://www.oracle.com/java/technologies/downloads/#java21)
- **Maven 3.8+** - Should come with Java
- **MySQL 8.0+** - [Download](https://www.mysql.com/downloads/)

### Frontend Requirements
- **Node.js 20+** - [Download](https://nodejs.org/)
- **npm** or **yarn** - Usually comes with Node.js

---

## 🔧 Setup Instructions

### 1️⃣ Backend Setup (Spring Boot API)

#### Step 1: Database Setup
```bash
cd backend

# Import the database dump
mysql -u root -p < Dump20260913/moodbuds_latest.sql

# Or manually create the database
mysql -u root -p
CREATE DATABASE moodbuds;
USE moodbuds;
SOURCE Dump20260913/moodbuds_latest.sql;
```

#### Step 2: Configure Database Connection
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/moodbuds
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# CORS Configuration (for frontend integration)
spring.mvc.cors.allowed-origins=http://localhost:5173
spring.mvc.cors.allowed-methods=*
spring.mvc.cors.allowed-headers=*
spring.mvc.cors.allow-credentials=true
```

#### Step 3: Build Backend
```bash
mvn clean install
```

#### Step 4: Run Backend
```bash
mvn spring-boot:run
# Or run the JAR directly
java -jar target/moodbuds-api-0.0.1-SNAPSHOT.jar
```

✅ Backend running on: **http://localhost:8080/api**

---

### 2️⃣ Frontend Setup (React + Vite)

#### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

#### Step 2: Configure API Endpoint
Create `.env.local` file in `frontend/` folder:
```env
VITE_API_URL=http://localhost:8080/api
```

Then in your React components, use:
```javascript
const API_URL = import.meta.env.VITE_API_URL;

// Example API call
const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  const data = await response.json();
  return data;
};
```

#### Step 3: Run Frontend Development Server
```bash
npm run dev
```

✅ Frontend running on: **http://localhost:5173**

---

## 🚀 Running Both Services

### Terminal 1: Backend
```bash
cd /Users/vurevishnutej/MoodBuds-Project/backend
mvn spring-boot:run
```

### Terminal 2: Frontend
```bash
cd /Users/vurevishnutej/MoodBuds-Project/frontend
npm run dev
```

Open your browser: **http://localhost:5173**

---

## 🔗 API Integration Points

### Authentication Endpoints
- **POST** `/api/auth/login` - Customer login
- **POST** `/api/auth/admin/login` - Admin login
- **POST** `/api/auth/logout` - Logout

### Customer Endpoints
- **GET** `/api/customers/profile` - Get customer profile
- **POST** `/api/customers/register` - Register customer
- **GET** `/api/customers/{id}/addresses` - Get addresses

### Product Catalog
- **GET** `/api/products` - List all products
- **GET** `/api/products/{id}` - Get product details
- **GET** `/api/categories` - Get categories
- **GET** `/api/products/search` - Search products

### Cart & Orders
- **POST** `/api/cart/add` - Add to cart
- **GET** `/api/cart` - Get cart items
- **POST** `/api/orders` - Create order
- **GET** `/api/orders/{id}` - Get order details

### Quiz API
- **GET** `/api/quiz/start` - Start mood quiz
- **POST** `/api/quiz/submit` - Submit quiz answers

---

## 🛠️ Common Issues & Solutions

### Issue 1: CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Make sure CORS is enabled in `application.properties`:
```properties
spring.mvc.cors.allowed-origins=http://localhost:5173
spring.mvc.cors.allowed-methods=*
spring.mvc.cors.allowed-headers=*
```

### Issue 2: Database Connection Failed
**Error:** `com.mysql.cj.jdbc.exceptions.CommunicationsException`

**Solution:** 
- Ensure MySQL is running: `mysql -u root -p`
- Check database URL and credentials in `application.properties`
- Verify database exists: `SHOW DATABASES;`

### Issue 3: Vite Port Already in Use
**Error:** `Port 5173 is already in use`

**Solution:**
```bash
npm run dev -- --port 3000  # Use different port
```

### Issue 4: Node modules not found
**Error:** `MODULE_NOT_FOUND`

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Build for Production

### Frontend Build
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Backend Build
```bash
cd backend
mvn clean package -DskipTests
# Output: backend/target/moodbuds-api-0.0.1-SNAPSHOT.jar
```

---

## 🧪 Testing the Integration

### Test 1: Check API is Running
```bash
curl http://localhost:8080/api/products
```

### Test 2: Check Frontend Connectivity
Open browser DevTools → Network tab → Make API call from frontend

### Test 3: Login Flow
1. Go to http://localhost:5173
2. Enter credentials
3. Check Network tab for login API response

---

## 📚 Additional Resources

- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **MySQL Docs:** https://dev.mysql.com/doc/

---

## ✅ Integration Checklist

- [ ] Database imported successfully
- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] API calls working in browser
- [ ] Login/Authentication flow tested
- [ ] Product listing displaying
- [ ] Cart functionality working
- [ ] Order creation tested

---

**Happy coding! 🚀**
