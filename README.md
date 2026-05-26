# Intro Internship - Student Registration Portal

A modern, production-ready student registration and course enrollment web application built with React + Vite + TypeScript (frontend) and Node.js + Express + MongoDB (backend).

## Tech Stack

### Frontend
- **React 19** + **Vite 8** + **TypeScript**
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations & transitions
- **React Hook Form** + **Zod** - Form validation
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting
- **Express Mongo Sanitize** - NoSQL injection prevention
- **Nodemailer** - Email OTP (configurable)
- **Twilio** - SMS OTP (configurable)

## Features

### Student Registration
- Multi-step animated registration form (5 steps)
- Mobile OTP verification with 60s resend cooldown
- Email OTP verification
- File upload (resume/portfolio - PDF, DOC, DOCX up to 5MB)
- Zod validation on all form fields
- Real-time form progress indicator
- Glassmorphism UI with premium design

### Admin Dashboard
- Secure JWT-based authentication
- Dashboard analytics (total registrations, verified users, pending)
- Search & filter students
- Paginated student table
- Export to CSV
- Delete student records
- Responsive design

### Security
- Helmet middleware for HTTP headers
- Rate limiting on all API routes
- MongoDB injection prevention
- Input validation & sanitization
- JWT authentication with 24h expiry
- bcrypt password hashing (12 rounds)
- CORS configuration
- File type & size restrictions

## Project Structure

```
intro-internship/
├── src/                        # Frontend source
│   ├── components/
│   │   ├── forms/              # Step form components
│   │   │   ├── PersonalInfo.tsx
│   │   │   ├── EducationDetails.tsx
│   │   │   ├── CoursePreferences.tsx
│   │   │   ├── SkillsExperience.tsx
│   │   │   └── FinalSubmission.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── FormLayout.tsx
│   │   └── ui/                 # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Card.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── StepIndicator.tsx
│   │       ├── FileUpload.tsx
│   │       └── OtpInput.tsx
│   ├── pages/                  # Page components
│   │   ├── Home.tsx
│   │   ├── Registration.tsx
│   │   ├── Success.tsx
│   │   └── admin/
│   │       ├── Login.tsx
│   │       └── Dashboard.tsx
│   ├── context/
│   │   ├── FormContext.tsx
│   │   └── AuthContext.tsx
│   ├── services/
│   │   └── api.ts              # API client
│   ├── utils/
│   │   ├── validation.ts       # Zod schemas
│   │   └── cn.ts               # Classname utility
│   └── types/
│       └── index.ts            # TypeScript types
├── server/                     # Backend source
│   ├── controllers/
│   │   ├── studentController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── Student.js
│   │   ├── Admin.js
│   │   └── Otp.js
│   ├── routes/
│   │   ├── studentRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── utils/
│   │   └── emailTemplates.js
│   ├── index.js
│   └── .env.example
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd intro-internship
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment setup**
   ```bash
   cp server/.env.example server/.env
   ```
   Edit `server/.env` with your configuration:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Change `JWT_SECRET` to a secure random string
   - Update `ADMIN_EMAIL` and `ADMIN_PASSWORD` for admin login
   - Configure Twilio/SMTP for OTP delivery (OTP is logged to console in dev)

5. **Start the backend**
   ```bash
   cd server
   npm run dev
   ```

6. **Start the frontend** (in a new terminal)
   ```bash
   cd intro-internship
   npm run dev
   ```

7. **Open the app**
   - Frontend: http://localhost:5173
   - Backend health: http://localhost:5000/api/health

### Default Admin Credentials
- Email: `admin@introinternship.com`
- Password: `admin123`

## API Endpoints

### Student Routes (`/api/students`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/send-otp` | Send OTP to mobile |
| POST | `/verify-otp` | Verify mobile OTP |
| POST | `/send-email-otp` | Send OTP to email |
| POST | `/verify-email-otp` | Verify email OTP |
| POST | `/register` | Submit registration |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Admin login |
| GET | `/dashboard` | Dashboard stats |
| GET | `/students` | List students (paginated) |
| GET | `/students/export` | Export CSV |
| DELETE | `/students/:id` | Delete student |

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Render)
1. Push to GitHub
2. Create new Web Service on Render
3. Set root directory to `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `.env`

## Design
Built on top of Stitch design system with Material Design 3 principles:
- **Primary**: #005bbf
- **Secondary**: #005ac1
- **Typography**: Inter
- **Glassmorphism**: backdrop-blur, semi-transparent backgrounds
- **Animations**: Framer Motion for smooth transitions

## License
MIT
