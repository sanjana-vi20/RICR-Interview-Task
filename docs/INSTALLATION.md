# Installation Guide

## Prerequisites

Before installing RICR Interview Task, ensure you have the following:

- **Node.js** 16 or higher
- **npm** or **yarn** package manager
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud)
- **Cloudinary** account (for image/file uploads) - [Sign up here](https://cloudinary.com/users/register/free)

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sanjana-vi20/RICR-Interview-Task.git
cd RICR-Interview-Task
```

### 2. Create Environment Variables

Create `.env` files in both `server/` and `client/` directories:

#### Server Configuration (`server/.env`)

```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Environment Variables Explained:**
- `PORT` - Server port (default: 3000)
- `MONGO_URI` - MongoDB connection string (Atlas or local)
- `JWT_SECRET` - Secret key for JWT token generation
- `CLOUDINARY_NAME` - Cloudinary account name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

#### Client Configuration (`client/.env`)

```env
VITE_API_URL=http://localhost:3000
```

## Installation Steps

### Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

**Key Backend Dependencies:**
- **Express.js 5** - Web framework
- **Mongoose 9.8** - MongoDB ODM
- **JWT & bcrypt** - Authentication & security
- **Multer 2.2** - File uploads
- **Cloudinary 2.10** - Cloud storage
- **CORS 2.8** - Cross-origin support
- **Nodemon 3.1** (dev) - Auto-reload during development

### Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

**Key Frontend Dependencies:**
- **React 19** - UI framework
- **Vite 8.1** - Build tool & dev server
- **React Router v7** - Routing
- **Tailwind CSS 4** - Styling
- **Axios 1.18** - HTTP client
- **Recharts 3.10** - Data visualization
- **React Hot Toast 2.6** - Notifications
- **QRCode.react 4.2** - QR code generation
- **html2canvas 1.4** - Screenshot functionality
- **Lucide React 1.26** - Icon library

## Running the Application

### Start the Backend Server

From the `server/` directory:

```bash
npm run dev
```

This starts the Express server with nodemon on `http://localhost:3000`

**Available Backend Commands:**
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed the database with sample data

### Start the Frontend Development Server

From the `client/` directory in a new terminal:

```bash
npm run dev
```

This starts the Vite dev server (typically on `http://localhost:5173`)

**Available Frontend Commands:**
- `npm run dev` - Start development server with HMR
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run Oxlint code quality checks

### Verify Both Services Are Running

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

Both services communicate through the `VITE_API_URL` configuration.

## Optional: Seed Sample Data

To populate the database with sample users and forms:

```bash
cd server
npm run seed
```

## Troubleshooting

### MongoDB Connection Issues
- Verify your `MONGO_URI` is correct
- Ensure your MongoDB instance is running (if local)
- Check MongoDB Atlas IP whitelist settings (if cloud)

### Cloudinary Setup Issues
- Generate API credentials from [Cloudinary Dashboard](https://cloudinary.com/console)
- Ensure all three credentials are set in `server/.env`

### Port Already in Use
- Backend: Change `PORT` in `server/.env`
- Frontend: Vite will automatically use the next available port

### Dependencies Installation Fails
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Hot Module Replacement (HMR) Not Working
- Ensure `VITE_API_URL` matches your backend URL
- Check browser console for CORS errors
- Verify backend CORS settings

## Project Structure

```
RICR-Interview-Task/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context (Auth)
│   │   └── config/         # API configuration
│   └── package.json
├── server/                  # Express backend
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routers/        # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── seeders/        # Database seeders
│   └── package.json
└── docs/                    # Documentation
```

## Next Steps

1. Log in to the application with test credentials (if seeded)
2. Create forms as a teacher/admin
3. Generate QR codes and share with respondents
4. View analytics and responses in real-time

For more information, see the [main README](../README.md).
