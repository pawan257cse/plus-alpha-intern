export type UserRole = "student" | "admin" | "company";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  profileCompletion: number;
  xp: number;
  streak: number;
  skills: string[];
  createdAt: string;
}

export interface IInternship {
  _id: string;
  title: string;
  company: string;
  companyLogo?: string;
  domain: string;
  location: string;
  stipend: number;
  duration: string;
  isRemote: boolean;
  description: string;
  requirements: string[];
  skills: string[];
  applicantsCount: number;
  status: "open" | "closed";
  postedBy: string;
  createdAt: string;
}

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  lessonsCount: number;
  enrolledCount: number;
  category: string;
}

export interface ICertificate {
  _id: string;
  userId: string;
  courseId?: string;
  internshipId?: string;
  title: string;
  verificationId: string;
  issuedAt: string;
}

export interface IApplication {
  _id: string;
  internshipId: string;
  userId: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  appliedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
