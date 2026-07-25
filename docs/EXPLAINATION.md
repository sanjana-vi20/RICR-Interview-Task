# RICR Interview Task - Project Explanation

## Project Overview

**RICR Interview Task** is a full-stack **Form Builder & Response Management System** designed for teachers and admins to create custom forms, distribute them via QR codes, and collect/analyze responses with rich visualizations and filtering capabilities.

## Key Features

- **User Authentication:** Secure JWT-based login/signup with password hashing (bcrypt)
- **Form Builder:** Create custom forms with various question types (text, multiple choice, etc.)
- **QR Code Generation:** Share forms with unique QR codes for easy distribution
- **Response Collection:** Students/respondents fill forms accessible via QR codes
- **Analytics Dashboard:** View form responses with Recharts visualizations
- **Advanced Filtering:** Filter and analyze responses by various criteria
- **File Upload:** Support for image uploads via Cloudinary integration
- **Responsive UI:** Modern, responsive interface using Tailwind CSS 4

## Technology Stack

### Frontend
- **React 19** - UI library with modern hooks and features
- **Vite** - Lightning-fast build tool with HMR (Hot Module Replacement)
- **React Router v7** - Client-side routing and navigation
- **Tailwind CSS 4** - Utility-first CSS framework
- **Recharts** - React charting library for data visualization
- **Axios** - HTTP client for API requests
- **QRCode.react** - QR code generation
- **html2canvas** - Screenshot/export functionality
- **React Hot Toast** - Notifications system
- **Lucide React & React Icons** - Icon libraries
- **AOS (Animate On Scroll)** - Scroll animations

### Backend
- **Node.js & Express.js 5** - Server framework
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - MongoDB object modeling
- **JWT (JSON Web Tokens)** - Authentication tokens
- **bcrypt** - Password hashing and security
- **Cloudinary** - Cloud storage for images and media
- **Multer** - File upload middleware
- **Nodemon** - Development auto-reload

## Project Structure

```
RICR-Interview-Task/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Login.jsx           # Authentication page
│   │   │   ├── Home.jsx            # Dashboard landing
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── FormBuilder.jsx     # Form creation interface
│   │   │   ├── FormResponse.jsx    # Form filling page
│   │   │   └── Analytics.jsx       # Response analytics
│   │   ├── components/             # Reusable React components
│   │   │   ├── Header.jsx
│   │   │   ├── FormCard.jsx
│   │   │   ├── ChartComponent.jsx
│   │   │   └── ...
│   │   ├── context/                # React Context state management
│   │   │   └── AuthContext.jsx     # Authentication state
│   │   ├── config/                 # API configuration
│   │   │   └── axiosConfig.js
│   │   ├── constants/              # App constants
│   │   └── assets/                 # Static assets (images, etc.)
│   ├── index.html                  # Entry HTML file
│   ├── vite.config.js              # Vite build configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   └── package.json
│
├── server/                          # Express backend API
│   ├── src/
│   │   ├── config/                 # Configuration files
│   │   │   ├── database.js         # MongoDB connection
│   │   │   └── cloudinary.js       # Cloudinary setup
│   │   ├── controllers/            # Business logic
│   │   │   ├── authController.js   # Login, signup, logout
│   │   │   ├── userController.js   # User endpoints
│   │   │   ├── formController.js   # Form CRUD operations
│   │   │   ├── responseController.js # Response handling
│   │   │   └── adminController.js  # Admin operations
│   │   ├── routers/                # API route definitions
│   │   │   ├── authRoutes.js       # /auth routes
│   │   │   ├── userRoutes.js       # /user routes
│   │   │   ├── adminRoutes.js      # /admin routes
│   │   │   └── formRoutes.js       # /form routes
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── User.js             # User schema
│   │   │   ├── Form.js             # Form schema
│   │   │   ├── Response.js         # Form responses schema
│   │   │   └── ...
│   │   ├── middleware/             # Express middleware
│   │   │   ├── authMiddleware.js   # JWT verification
│   │   │   ├── upload.js           # Multer configuration
│   │   │   └── errorHandler.js
│   │   ├── util/                   # Utility functions
│   │   │   ├── validators.js
│   │   │   ├── helpers.js
│   │   │   └── ...
│   │   ├── seeders/                # Database seed scripts
│   │   │   └── seedUser.js         # Sample data
│   │   └── index.js                # Server entry point
│   ├── .env                        # Environment variables
│   └── package.json
│
└── docs/                            # Documentation
    ├── EXPLAINATION.md             # This file
    └── README.md                   # Project README
```

## How It Works

### User Authentication Flow
1. User signs up/logs in via the **Login** page
2. Credentials are validated against MongoDB via `/auth` endpoints
3. Password is hashed using bcrypt for security
4. JWT token is issued and stored in client-side state (React Context)
5. Token is included in subsequent API requests via Authorization header

### Form Creation Flow (Teacher/Admin)
1. Teacher/Admin navigates to **Form Builder**
2. Creates form with custom questions (text, MCQ, etc.)
3. Configures form settings (title, description, etc.)
4. Form is stored in MongoDB via `/admin/form` endpoint
5. System generates a **unique QR code** linking to the form
6. Teacher shares the QR code with students

### Form Submission Flow (Student/Respondent)
1. Student scans QR code with their device
2. Redirected to the **Form Response** page
3. Fills out all form questions
4. Submits response via `/user/response` endpoint
5. Response is stored in MongoDB with timestamp and metadata

### Analytics & Dashboard
1. Teacher/Admin views **Analytics Dashboard**
2. Dashboard displays:
   - Form response counts
   - Charts and visualizations (Recharts)
   - Response data filtered by criteria
   - Export options (html2canvas)
3. Data is fetched from `/admin/responses` endpoint
4. Real-time updates when new responses arrive

## API Endpoints

### Authentication Routes (`/auth`)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/logout` - Logout

### User Routes (`/user`)
- `GET /user/forms/:id` - Get form details
- `POST /user/response` - Submit form response
- `GET /user/responses/:formId` - Get user's responses

### Admin Routes (`/admin`)
- `POST /admin/form` - Create new form
- `GET /admin/forms` - Get all forms
- `PUT /admin/form/:id` - Update form
- `DELETE /admin/form/:id` - Delete form
- `GET /admin/responses/:formId` - Get all responses for a form
- `GET /admin/users` - Manage users (admin only)

## Environment Setup

### Backend (.env)
```bash
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000
```

## Installation & Running

### Backend Setup
```bash
cd server
npm install
npm run dev          # Start with nodemon on port 3000
npm run seed         # Optional: populate with sample data
```

### Frontend Setup
```bash
cd client
npm install
npm run dev          # Start Vite dev server (typically :5173)
npm run build        # Create production build
npm run preview      # Preview production build
npm run lint         # Run code quality checks
```

### Verify Services
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

Both services communicate through the configured `VITE_API_URL`.

## Troubleshooting

### MongoDB Connection Issues
- Verify `MONGO_URI` format is correct
- Ensure MongoDB instance is running (local) or accessible (MongoDB Atlas)
- Check IP whitelist settings in MongoDB Atlas
- Test connection with MongoDB Compass

### Cloudinary Setup Issues
- Generate credentials from [Cloudinary Dashboard](https://cloudinary.com/console)
- Ensure all three credentials (NAME, API_KEY, API_SECRET) are in `server/.env`
- Test upload functionality with a sample image

### Port Already in Use
- **Backend:** Change `PORT` value in `server/.env`
- **Frontend:** Vite automatically uses next available port if 5173 is taken

### Dependencies Installation Fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### CORS or Connection Errors
- Verify `VITE_API_URL` matches backend URL in `client/.env`
- Check browser console for specific error messages
- Ensure backend CORS middleware is properly configured
- Verify JWT token is being sent in request headers

### Hot Module Replacement (HMR) Not Working
- Ensure Vite is running with `--host` flag
- Check that `VITE_API_URL` is correctly set
- Clear browser cache
- Restart dev server

## Key Concepts

### JWT Authentication
- Stateless authentication using JSON Web Tokens
- Token stored in client state, not cookies
- Token included in Authorization header: `Bearer <token>`
- Expires after set duration (configured in backend)

### MongoDB Collections
- **Users:** Store user account information, roles
- **Forms:** Store form templates and configurations
- **Responses:** Store individual form submissions with responses

### File Upload & Cloudinary
- Multer processes file uploads from client
- Files are uploaded to Cloudinary cloud storage
- Returns URL for storing in database
- Enables scalable media handling

### React Context (State Management)
- AuthContext manages global authentication state
- No Redux/external state management needed
- Token and user data available throughout app

## Development Best Practices

1. **Environment Variables:** Always use `.env` files, never hardcode credentials
2. **Error Handling:** Handle API errors gracefully with toast notifications
3. **Loading States:** Show loaders during API calls
4. **Validation:** Validate form inputs on both client and server
5. **Security:** Hash passwords, verify JWTs, use HTTPS in production
6. **Code Quality:** Run linter regularly (`npm run lint`)

## Next Steps

1. Set up environment variables for both backend and frontend
2. Start MongoDB instance (local or Atlas)
3. Set up Cloudinary account and credentials
4. Install dependencies and run both services
5. Seed sample data with `npm run seed` (optional)
6. Log in with test credentials
7. Create forms and share QR codes
8. Collect and analyze responses

## Project Info

- **Created:** July 2026
- **Author:** sanjana-vi20
- **Repository:** [sanjana-vi20/RICR-Interview-Task](https://github.com/sanjana-vi20/RICR-Interview-Task)
- **License:** ISC
