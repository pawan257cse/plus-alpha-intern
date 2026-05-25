import mongoose, { Document, Schema } from "mongoose";

export interface IInternship extends Document {
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
  postedBy: mongoose.Types.ObjectId;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const internshipSchema = new Schema<IInternship>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    companyLogo: String,
    domain: { type: String, required: true },
    location: { type: String, required: true },
    stipend: { type: Number, default: 0 },
    duration: { type: String, required: true },
    isRemote: { type: Boolean, default: false },
    description: { type: String, required: true },
    requirements: [String],
    skills: [String],
    applicantsCount: { type: Number, default: 0 },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deadline: Date,
  },
  { timestamps: true }
);

internshipSchema.index({ domain: 1, status: 1 });
internshipSchema.index({ stipend: -1 });
internshipSchema.index({ title: "text", company: "text", description: "text" });

export const Internship = mongoose.model<IInternship>("Internship", internshipSchema);
