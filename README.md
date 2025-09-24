🚀 Full-Stack food deleviery app
A full-stack web application featuring secure signup/login with JWT authentication, role-based access control, and dynamic dashboard routing for `USER` and `ADMIN`.

🛠 Tech Stack
Backend
Node.js + Express  
PostgreSQL – Database for users, messages, and chat history
Prisma ORM 
JWT Authentication – Secure login system

Frontend
React – UI framework
Tailwind CSS – Styling
Axios – API requests
React Router DOM – Navigation

⚙️ Setup Instructions

backend setup
DATABASE_URL= your local database_url
cd backend 
npm install 
npx prisma generate 
npx prisma migrate dev --name init

Frontend Setup
npm install 
npm run dev
