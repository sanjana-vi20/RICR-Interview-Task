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
