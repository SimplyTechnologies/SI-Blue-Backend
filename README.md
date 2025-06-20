# 📦 Vehicle Management System (Backend)

A robust backend system for managing vehicle-related data, built with **Node.js**, **Express**, **TypeScript**, and **Sequelize ORM**. This service handles users, customers, vehicles, and car makes/models, supporting authentication, data migrations, and more.

## 🌐 Live Demo

👉 [Visit the Application](https://si-blue-frontend.onrender.com/)

---

## 🚀 Features

- ✅ RESTful API with Express
- ✅ TypeScript support
- ✅ Sequelize ORM with migrations & seeders
- ✅ Authentication using Passport (Local & JWT)
- ✅ Secure password handling with Bcrypt
- ✅ Email service via SendGrid
- ✅ Cloudinary support for image uploads
- ✅ Environment-based configuration
- ✅ Structured and scalable folder architecture


## 🧱 Tech Stack

The **SI-Blue-Backend** is built on a modern and scalable backend stack designed for high performance, security, and maintainability.

### 🟦 Language  
**TypeScript** – A statically typed superset of JavaScript that improves code quality, scalability, and developer experience.

### 🧠 Runtime  
**Node.js** – A non-blocking, event-driven runtime optimized for building efficient and scalable network applications.

### 🚀 Framework  
**Express.js** – A minimalist and flexible framework ideal for building RESTful APIs with full control over the request/response lifecycle.

### 🗄️ Database  
**PostgreSQL** – A robust, open-source relational database known for ACID compliance, extensibility, and JSONB support.

### 🔗 ORM  
**Sequelize** – A promise-based ORM that provides a clean, model-driven approach to database access and migrations.

### 🔐 Authentication  
**Passport.js** – Powers a secure, JWT-based authentication system with support for HttpOnly cookies to protect against XSS attacks.

### ⚙️ Configuration  
**dotenv** – Manages environment-specific settings securely through `.env` files for different stages (development, testing, production).

---

## 🏗️ Architecture & Design Principles

### 🧱 Architecture Pattern: MVC (Model–View–Controller)

This project follows the **MVC pattern** to ensure a clean and maintainable codebase through separation of concerns:

- **Models** – Define database schemas and relationships using Sequelize.
- **Controllers** – Handle incoming HTTP requests and coordinate responses.
- **Services** – Encapsulate business logic and interact with models.

### 📁 Folder Structure Highlights

- `controllers/` – Route handlers and response logic
- `services/` – Business logic and database interaction
- `models/` – Sequelize models for PostgreSQL
- `routes/` – API endpoint definitions
- `middlewares/` – Auth, error handling, and validation layers
- `serializers/` – Format API responses for consistency
- `handlers/` – Centralized logic for errors and success responses

### 🧠 Design Patterns Used

- **MVC Pattern** – Ensures modular, scalable architecture
- **Singleton Pattern** – Maintains a single database connection instance
- **Service Layer Pattern** – Isolates and organizes business logic for reuse and testing
- **Middleware Pattern** – Manages cross-cutting concerns like authentication, logging, and validation

## 📁 Project Structure

```
src/
├── configs/           # App-wide configuration (e.g. DB, auth, email)
├── controllers/       # Request handlers
├── data/              # Static or seed data
├── handlers/          # Custom error/response handlers
├── helpers/           # Utility functions
├── middlewares/       # Express middlewares
├── migrations/        # Sequelize migrations
├── models/            # Sequelize models
├── routes/            # API route definitions
├── schemas/           # Zod schemas for validation
├── seeders/           # Sequelize seed files
├── serializer/        # Response transformers
├── services/          # Business logic (e.g., email, auth)
├── templates/         # Email templates (Handlebars)
├── types/             # Custom TypeScript types
└── index.ts           # App entry point
```

## 🛠 Getting Started

### ✅ Prerequisites

- Node.js `v18+`
- npm or Yarn

### 📥 Installation

```bash
git clone https://github.com/SimplyTechnologies/SI-Blue-Backend.git
cd SI-Blue-Backend
npm install  # or yarn install
```

## ⚙️ Environment Setup

Create an `.env` file in the root based on `.env.example` with the following variables:

```env
PORT=
HOST=
DEFAULT_DB=
JWT_SECRET=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
DIALECT=
NODE_ENV=
JWT_REFRESH_SECRET=
JWT_ACCESS_SECRET=
ACCESS_TOKEN_MAX_AGE=
REFRESH_TOKEN_MAX_AGE=
BASE_URL=
SENDGRID_API_KEY=
FRONTEND_URL=
EMAIL_FROM=
PRODUCT_NAME=
CLOUDINARY_API_SECRET=
CLOUDINARY_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_AVATARS_FOLDER_NAME=
```

---

## 🙌 Acknowledgements

Thanks to open source tools and libraries that power this project:  
Express.js, Sequelize, Passport, Zod, SendGrid, Cloudinary, Multer, JWT, and TypeScript, among others.

Special thanks to **Simply Technologies** for organizing the internship and providing the opportunity to build this project.