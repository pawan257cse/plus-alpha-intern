import mongoose, { Document, Schema } from "mongoose";

export type TaskSubmissionStatus = "pending" | "approved" | "rejected";

export interface ITaskSubmission extends Document {
  user: mongoose.Types.ObjectId;
  weekNumber: string;
  title: string;
  submissionUrl: string;
  notes?: string;
  domain?: string;
  status: TaskSubmissionStatus;
  adminNote?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSubmissionSchema = new Schema<ITaskSubmission>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    weekNumber: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    submissionUrl: { type: String, required: true, trim: true },
    notes: String,
    domain: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: String,
    reviewedAt: Date,
  },
  { timestamps: true }
);

taskSubmissionSchema.index({ status: 1, createdAt: -1 });

export const TaskSubmission = mongoose.model<ITaskSubmission>(
  "TaskSubmission",
  taskSubmissionSchema
);
