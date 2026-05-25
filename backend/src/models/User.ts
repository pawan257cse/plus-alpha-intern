import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "student" | "admin" | "company";
export type UserStatus = "pending" | "active" | "suspended";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  profilePhoto?: string;
  phone?: string;
  bio?: string;
  college?: string;
  university?: string;
  degree?: string;
  branch?: string;
  year?: string;
  passingYear?: number;
  graduationYear?: number;
  skills: string[];
  internshipDomain?: string;
  selectedDomain?: string;
  linkedin?: string;
  github?: string;
  resumeUrl?: string;
  isVerified: boolean;
  emailVerified: boolean;
  approvedByAdmin: boolean;
  otp?: string;
  otpExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  googleId?: string;
  profileCompletion: number;
  xp: number;
  coins: number;
  dailyXp: number;
  dailyCoins: number;
  dailyStatsDate?: Date;
  streak: number;
  lastLogin?: Date;
  badges: string[];
  savedInternships: mongoose.Types.ObjectId[];
  refreshToken?: string;
  companyName?: string;
  companyWebsite?: string;
  companyVerified: boolean;
  registrationPaymentStatus: "unpaid" | "paid" | "verified";
  taskPaymentStatus: "unpaid" | "paid" | "verified";
  /** Admin/HR sets individual internship fee (INR). Empty = use global fee. */
  customTaskFee?: number;
  /** When admin expects this student to pay */
  paymentDueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ["student", "admin", "company"],
      default: "student",
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "active",
    },
    avatar: String,
    profilePhoto: String,
    phone: String,
    bio: String,
    college: String,
    university: String,
    degree: String,
    branch: String,
    year: String,
    passingYear: Number,
    graduationYear: Number,
    skills: [{ type: String }],
    internshipDomain: String,
    selectedDomain: String,
    linkedin: String,
    github: String,
    resumeUrl: String,
    isVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    approvedByAdmin: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    googleId: String,
    profileCompletion: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    dailyXp: { type: Number, default: 0 },
    dailyCoins: { type: Number, default: 0 },
    dailyStatsDate: Date,
    streak: { type: Number, default: 0 },
    lastLogin: Date,
    badges: [{ type: String }],
    savedInternships: [{ type: Schema.Types.ObjectId, ref: "Internship" }],
    refreshToken: { type: String, select: false },
    companyName: String,
    companyWebsite: String,
    companyVerified: { type: Boolean, default: false },
    registrationPaymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "verified"],
      default: "unpaid",
    },
    taskPaymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "verified"],
      default: "unpaid",
    },
    customTaskFee: { type: Number, min: 0 },
    paymentDueDate: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, xp: -1 });
userSchema.index({ role: 1, dailyCoins: -1 });
userSchema.index({ role: 1, coins: -1 });

userSchema.pre("save", function syncVerification(next) {
  if (this.isVerified && !this.emailVerified) {
    this.emailVerified = true;
  }
  next();
});

export const User = mongoose.model<IUser>("User", userSchema);
