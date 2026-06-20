interface StudentData {
  cgpa: number;
  backlogs: number;
  skills: string;
  certifications?: string | null;
}

interface CompanyData {
  id: string;
  name: string;
  minCgpa: number;
  allowedBacklogs: number;
  requiredSkills: string;
}

export function computeMatchScore(
  student: StudentData,
  company: CompanyData
): number {
  // Hard disqualifiers
  if (student.cgpa < company.minCgpa) return 0;
  if (student.backlogs > company.allowedBacklogs) return 0;

  let score = 0;

  // CGPA score: 40 points (proportional above minimum)
  const cgpaRange = 10 - company.minCgpa;
  score += cgpaRange > 0
    ? ((student.cgpa - company.minCgpa) / cgpaRange) * 40
    : 40;

  // Backlog score: 20 points
  score += student.backlogs === 0 ? 20 : (1 - student.backlogs / (company.allowedBacklogs + 1)) * 20;

  // Skills match: 30 points
  const requiredSkills = company.requiredSkills.toLowerCase().split(",").map(s => s.trim());
  const studentSkills = student.skills.toLowerCase().split(",").map(s => s.trim());
  const matched = requiredSkills.filter(s => studentSkills.some(ss => ss.includes(s) || s.includes(ss)));
  score += requiredSkills.length > 0
    ? (matched.length / requiredSkills.length) * 30
    : 30;

  // Certifications bonus: 10 points
  if (student.certifications && student.certifications.trim().length > 0) {
    score += 10;
  }

  return Math.min(Math.round(score), 100);
}

export function recommendCompanies(
  student: StudentData,
  companies: CompanyData[]
): Array<{ company: CompanyData; score: number }> {
  return companies
    .map(c => ({ company: c, score: computeMatchScore(student, c) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
