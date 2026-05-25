import mongoose, { Document, Schema } from "mongoose";

export interface IApplication extends Document {
  internship: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  resumeUrl?: string;
  coverLetter?: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  notes?: string;
  appliedAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    internship: { type: Schema.Types.ObjectId, ref: "Internship", required: true },
    applicant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: String,
    coverLetter: String,
    status: {
      type: String,
      enum: ["pending", "reviewing", "accepted", "rejected"],
      default: "pending",
    },
    notes: String,
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

applicationSchema.index({ internship: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>("Application", applicationSchema);
