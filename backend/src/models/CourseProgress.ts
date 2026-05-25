import mongoose, { Document, Schema } from "mongoose";

export interface ICourseProgress extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  completedLessons: number[];
  quizScore?: number;
  progress: number;
  completedAt?: Date;
}

const courseProgressSchema = new Schema<ICourseProgress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [Number],
    quizScore: Number,
    progress: { type: Number, default: 0 },
    completedAt: Date,
  },
  { timestamps: true }
);

courseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

export const CourseProgress = mongoose.model<ICourseProgress>(
  "CourseProgress",
  courseProgressSchema
);
