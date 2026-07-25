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


3. Generate QR codes and share with respondents
4. View analytics and responses in real-time

For more information, see the [main README](../README.md).
