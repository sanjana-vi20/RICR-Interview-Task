# RICR Interview Task - Form Builder & Response Management System

A full-stack web application that enables teachers and admins to create custom forms, share them with respondents via QR codes, and collect/analyze responses with rich visualizations and filtering capabilities.

## Stack

- **Language(s):** JavaScript (React frontend, Node.js backend)
- **Frontend Framework:** React 19 + Vite + React Router v7
- **Backend Framework:** Express.js 5
- **Database:** MongoDB + Mongoose ODM
- **Styling:** Tailwind CSS 4 + Tailwind Vite plugin
- **Notable Libraries:** 
  - Authentication: JWT, bcrypt
  - File Upload: Multer, Cloudinary
  - UI Components: Lucide React, React Icons
  - Notifications: React Hot Toast
  - Charts: Recharts
  - QR Codes: qrcode.react
  - Screen Capture: html2canvas
  - Animations: AOS (Animate On Scroll)

## How it's organized

```
client/                     React frontend application
  src/
    pages/                  Page components (Login, Home, dashboards)
    components/             Reusable React components
    context/                React Context for state management (Auth)
    config/                 API configuration
    constants/              App constants
    assets/                 Static assets
  index.html                Entry HTML file
  vite.config.js            Vite build configuration

server/                     Express backend API
  src/
    config/                 Database and service configs (MongoDB, Cloudinary)
    controllers/            Business logic (auth, user, admin)
    routers/                API route definitions
    models/                 Mongoose schemas (User, Form, Response)
    middleware/             Express middleware
    util/                   Utility functions
    seeders/                Database seed scripts
  index.js                  Server entry point
```

### How it fits together

The application follows a typical MERN architecture:

1. **Client Request Flow:** Users authenticate via login page → JWT token stored → React Router protects dashboards (Admin/Teacher) → Users create/edit forms or fill shared forms via QR code links
2. **Backend API:** Express server exposes three main route groups:
   - `/auth` — login/signup/logout with JWT authentication
   - `/user` — user-facing endpoints (fill forms, view responses)
   - `/admin` — admin operations (create, edit, delete forms; manage users)
3. **Data Persistence:** Mongoose connects to MongoDB to store users, form schemas, and form responses
4. **File Handling:** Multer processes file uploads; Cloudinary stores images/media
5. **Real-time Updates:** Form responses are immediately available in dashboards with Recharts visualizations

## How to run it

### Prerequisites

- Node.js 16+
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### Environment Setup

Create `.env` files in both `server/` and `client/` directories:

**server/.env:**
```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**client/.env:**
```
VITE_API_URL=http://localhost:3000
```

### Installation & Running

**Backend:**
```bash
cd server
npm install
npm run dev          # Start server with nodemon on port 3000
# Optional: seed database
npm run seed
```

**Frontend:**
```bash
cd client
npm install
npm run dev          # Start Vite dev server (typically on :5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run Oxlint code checks
```

Both services will start on separate ports and communicate via the configured API URL.

## Try asking

- How do I create a new form in the teacher dashboard and generate a shareable QR code?
- What form field types are supported, and how are responses validated and stored?
- How do I filter and export form responses, and what analytics are available in the response viewer?
- Can users with different roles (admin/teacher/respondent) access different features, and how is authorization enforced?

---

**Created:** July 2026  
**Repository:** [sanjana-vi20/RICR-Interview-Task](https://github.com/sanjana-vi20/RICR-Interview-Task)
