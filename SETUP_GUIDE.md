# Quick Setup Guide

Follow these steps to get your MoodyMe admin dashboard up and running:

## 1. Configure Environment Variables

Edit the `.env` file with your actual values:

```env
# Database - Use your actual PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/moodemy"

# JWT Secret - Generate a secure random string
JWT_SECRET="generate-a-long-random-string-here"

# Email (Resend) - Get API key from https://resend.com
RESEND_API_KEY="re_your_actual_api_key"
FROM_EMAIL="noreply@yourdomain.com"
```

### Quick Tips:
- **Database**: You can use PostgreSQL, MySQL, or SQLite
  - PostgreSQL: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
  - MySQL: `mysql://USER:PASSWORD@HOST:PORT/DATABASE`
  - SQLite: `file:./dev.db`
  
- **JWT Secret**: Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

- **Email**: Sign up at [resend.com](https://resend.com) for free API key

## 2. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

## 3. Create Admin User

### Option A: Via Prisma Studio (Recommended)
```bash
npx prisma studio
```
1. Open http://localhost:5555
2. Click on "User" model
3. Click "Add record"
4. Fill in:
   - firstName: Admin
   - lastName: User  
   - email: admin@moodemy.com
   - password: (generate hash below)
   - role: ADMIN
   - isActive: true

To generate password hash:
```bash
node -e "const bcrypt=require('bcryptjs');console.log(bcrypt.hashSync('Admin@123',12))"
```

### Option B: Via API then Update
```bash
# 1. Sign up via API
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Admin","lastName":"User","email":"admin@moodemy.com","password":"Admin@123"}'

# 2. Then update role to ADMIN in Prisma Studio
npx prisma studio
```

## 4. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000/admin

## 5. Test Your Setup

### Test API Endpoints:

**Signup (Create User):**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"Test@1234"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Test@1234"}'
```

**Get Content (Public):**
```bash
curl http://localhost:3000/api/content
```

## 6. Customize Colors (Optional)

Edit `app/globals.css` to change the brand colors:

```css
/* Find this section in :root */
--primary: oklch(0.626 0.186 265.755); /* Change this for different color */
```

Use [oklch.com](https://oklch.com) to pick colors.

## Common Issues

### Database Connection Error
- Make sure PostgreSQL is running
- Check your DATABASE_URL is correct
- Test connection: `psql postgresql://...`

### Email Not Working
- Verify RESEND_API_KEY is correct
- Check FROM_EMAIL is verified in Resend dashboard
- Password reset will fail without proper email setup

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or run on different port
npm run dev -- -p 3001
```

## Next Steps

1. ✅ Login to admin dashboard at `/admin`
2. ✅ Create content pages (About, Help, Privacy)
3. ✅ Add banners for your mobile app
4. ✅ Test all API endpoints with your mobile app
5. ✅ Deploy to production (Vercel recommended)

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env`
5. Deploy!

Don't forget to:
- Change all secrets (JWT_SECRET, NEXTAUTH_SECRET)
- Use production database
- Configure Resend with your domain
- Update APP_URL to your production URL

## Need Help?

- 📖 Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- 📖 Read [README.md](./README.md)
- 🐛 Check error logs in terminal
- 🔍 Use Prisma Studio to inspect database

---

Happy coding! 🚀
