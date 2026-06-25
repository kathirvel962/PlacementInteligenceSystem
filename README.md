# 🎓 Campus Placement Management System (CPMS)

A full-stack web application to digitize and automate the entire college campus placement process — from student registration to final result verification.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcryptjs |
| Edge Middleware | jose |

---

## ✨ Features

### 👨‍💼 Admin (Placement Officer)
- Dashboard with analytics (placement %, packages, dept-wise stats)
- Student management & profile verification
- Company management
- Placement drive creation & management
- Assign students to drives
- Verify / reject placement results
- Send notifications to students
- Full audit log of all actions

### 🎓 Student
- Register & create profile (CGPA, skills, department)
- View company recommendations with match scores
- View and accept drive assignments
- Mark attendance
- Submit placement results (offer letter, proof)
- View notifications

### 🤖 Recommendation Engine
Matches students to companies using a weighted score:
- CGPA → 40 points
- Backlogs → 20 points
- Skills match → 30 points
- Certifications → 10 points

---

## 📁 Project Structure

```
my-app/
├── app/
│   ├── api/              # API route handlers
│   │   ├── auth/         # login, register, logout
│   │   ├── student/      # profile, drives, results, notifications
│   │   └── admin/        # students, companies, drives, assignments, results, analytics
│   ├── admin/            # Admin pages
│   ├── student/          # Student pages
│   └── auth/             # Login & Register pages
├── components/
│   ├── layouts/          # AdminSidebar, StudentSidebar
│   └── ui/               # StatCard, Badge, Topbar
├── lib/
│   ├── auth.ts           # JWT & bcrypt helpers
│   ├── middleware.ts      # withAuth() HOF
│   ├── audit.ts          # Audit logging
│   ├── notifications.ts  # Notification helper
│   └── recommendation.ts # Match score engine
├── prisma/
│   └── schema.prisma     # Database schema
├── middleware.ts          # Next.js edge middleware
└── types/index.ts        # Shared TypeScript types
```

---

## 🗄️ Database Models

- `User` — Authentication (ADMIN / STUDENT)
- `StudentProfile` — Academic details, skills, resume
- `Company` — Company info, requirements
- `PlacementDrive` — Drive linked to company
- `DriveAssignment` — Student assigned to drive (ASSIGNED → SELECTED)
- `PlacementResult` — Result submitted by student (PENDING → APPROVED)
- `Notification` — Student notifications
- `AuditLog` — System-wide action tracking

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/kathirvel962/PlacementInteligenceSystem.git
cd PlacementInteligenceSystem/my-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in `my-app/`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/campus_placement_db?schema=public"
JWT_SECRET="your_super_secret_key"
```

### 4. Run database migrations
```bash
npx prisma migrate deploy
```

### 5. Seed the admin account
```bash
node seed.js
```

### 6. Start the development server
```bash
npm run dev
```

Visit **http://localhost:3000**

---

## 🔐 Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@cpms.com | admin123 |

Students can self-register at `/auth/register`

---

## 🔄 Placement Workflow

```
Student Registers
  → Admin Verifies Profile
    → Admin Creates Company
      → Admin Creates Drive
        → Admin Assigns Student (notification sent)
          → Student Accepts → Marks Attended
            → Student Submits Result
              → Admin Approves/Rejects (notification sent)
                → Analytics Updates
```

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (never stored as plain text)
- JWT in **httpOnly cookies** (XSS protected)
- **Edge middleware** protects all `/admin/*` and `/student/*` routes
- **Role-based access** — students cannot access admin routes
- **Ownership validation** — students can only update their own data

---

## 📊 Placement Drive Status Flow

```
ASSIGNED → ACCEPTED → ATTENDED → SHORTLISTED → SELECTED
                                             → REJECTED
```

---

## 📄 License

MIT
