import Link from "next/link";

const features = [
  { title: "Student Portal", desc: "Students can register, fill in their academic details, view assigned drives, and submit placement results without any paperwork." },
  { title: "Company Management", desc: "Admins can add companies, set eligibility criteria like minimum CGPA and required skills, and manage all listings from one place." },
  { title: "Drive Scheduling", desc: "Create placement drives linked to companies, assign eligible students, set venues and dates, and track the entire process." },
  { title: "Match Score Engine", desc: "Students are scored against each company based on CGPA, backlogs, skills, and certifications to find the best fit." },
  { title: "Analytics Dashboard", desc: "Placement officers get a clear view of placement percentages, average packages, and department-wise performance at a glance." },
  { title: "Notifications", desc: "Students receive updates when they are assigned to a drive or when their placement result is reviewed by the admin." },
];

const workflow = [
  "Student registers and fills in academic profile",
  "Admin reviews and verifies the student profile",
  "Admin adds a company and creates a placement drive",
  "Eligible students are assigned to the drive",
  "Student attends the drive and submits the result",
  "Admin approves or rejects the placement result",
  "Dashboard analytics reflect the updated data",
];

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)" }}>

      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <span className="text-white font-bold text-xl tracking-wide">CPMS</span>
        <div className="flex gap-3">
          <Link href="/auth/login" className="px-4 py-2 text-white/80 hover:text-white text-sm transition-colors">Login</Link>
          <Link href="/auth/register" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm rounded-lg transition-colors">Register</Link>
        </div>
      </nav>

      <section className="text-center px-6 py-24">
        <p className="text-indigo-300 text-sm uppercase tracking-widest mb-4">Campus Placement Management</p>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          One Platform for the<br />
          <span style={{ color: "#a5b4fc" }}>Entire Placement Process</span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
          CPMS brings students, placement officers, and companies onto a single platform — cutting down manual work and making the placement process faster and more transparent.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/auth/register" className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-colors">
            Student Register
          </Link>
          <Link href="/auth/login" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors">
            Admin Login
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">What the System Does</h2>
        <p className="text-white/50 text-center text-sm mb-12 max-w-xl mx-auto">Built to handle every step of the placement cycle, from student onboarding to final result verification.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm mb-4">{i + 1}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">How It Works</h2>
        <p className="text-white/50 text-center text-sm mb-12">The placement workflow from start to finish.</p>
        <div className="flex flex-col">
          {workflow.map((step, i) => (
            <div key={step} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">{i + 1}</div>
                {i < workflow.length - 1 && <div className="w-px h-8 bg-indigo-400/30" />}
              </div>
              <p className="text-white/70 text-sm pt-2 pb-6">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Built With</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {["Next.js 16", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma ORM", "JWT", "Neon DB", "Vercel"].map((tech) => (
            <span key={tech} className="px-4 py-2 bg-white/10 border border-white/20 text-white/70 rounded-full text-sm">{tech}</span>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">K</div>
          <h3 className="text-white font-bold text-xl mb-1">Kathirvel</h3>
          <p className="text-indigo-300 text-sm mb-4">Full Stack Developer</p>
          <p className="text-white/55 text-sm leading-relaxed mb-6">
            I built this during my Summer Internship in 2025. The idea came from seeing how placement processes in colleges are still handled manually through spreadsheets and emails. CPMS is my attempt to fix that.
          </p>
          <a
            href="https://github.com/kathirvel962"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors inline-block"
          >
            View on GitHub
          </a>
          
          <a
            href="https://www.linkedin.com/in/kathirvel-s-a25a69333"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 ml-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors inline-block"
          >
            View on LinkedIn
          </a>
        </div>
      </section>

      <footer className="text-center py-8 border-t border-white/10 text-white/30 text-sm">
       Copyrights @2026 Campus Placement Management System. Built by Kathirvel.
      </footer>

    </main>
  );
}
