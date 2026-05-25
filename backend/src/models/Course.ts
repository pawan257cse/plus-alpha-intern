import mongoose, { Document, Schema } from "mongoose";

export interface ILesson {
  title: string;
  videoUrl?: string;
  notes?: string;
  duration: number;
  order: number;
}

export interface IQuiz {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  lessons: ILesson[];
  quizzes: IQuiz[];
  enrolledCount: number;
  isPublished: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  videoUrl: String,
  notes: String,
  duration: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
});

const quizSchema = new Schema<IQuiz>({
  question: { type: String, required: true },
  options: [String],
  correctIndex: { type: Number, required: true },
});

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    instructor: { type: String, required: true },
    duration: { type: String, required: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    category: { type: String, required: true },
    lessons: [lessonSchema],
    quizzes: [quizSchema],
    enrolledCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>("Course", courseSchema);
