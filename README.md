🚀 Full-Stack shop App

A full-stack web application featuring secure signup/login with CSRF + JWT authentication, role-based access control, and dynamic dashboard routing for USER and ADMIN.

🛠️ Tech Stack

⚙️ Backend
🟢 Node.js + Express
🐘 PostgreSQL – Database for users, orders, and application data
🧩 Prisma ORM
🔐 JWT Authentication – Secure login system
🛡️ CSRF Protection

🎨 Frontend
⚛️ React(vite) – UI framework
🎨 Tailwind CSS – Styling
🔁 Axios – API requests
🧭 React Router DOM – Navigation & protected routes

⚙️ Setup Instructions

🔧 Backend Setup
Create a .env file in the backend folder:
DATABASE_URL=your_local_database_url
JWT_SECRET=your_jwt_secret
Install dependencies and setup database:

cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm src/index.js

🎨 Frontend Setup
cd frontend
npm install
npm run dev

🔐 Authentication Flow
User signs up / logs in securely
JWT is generated on the backend
Token is stored securely (HTTP-only cookie)
CSRF token protects all sensitive requests
Role (USER / ADMIN) controls dashboard access
🧭 Role-Based Routing
👤 USER → User Dashboard
🛠️ ADMIN → Admin Dashboard
Unauthorized users are blocked automatically

📌 Highlights

✅ Secure authentication with CSRF + JWT
✅ Role-based access control
✅ Clean API architecture
✅ Scalable database layer with Prisma
✅ Modern UI with Tailwind CSS
