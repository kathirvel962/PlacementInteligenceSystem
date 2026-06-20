export type UserRole = "STUDENT" | "ADMIN";

export type DriveAssignmentStatus =
  | "ASSIGNED"
  | "ACCEPTED"
  | "ATTENDED"
  | "SHORTLISTED"
  | "SELECTED"
  | "REJECTED";

export type ResultStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
