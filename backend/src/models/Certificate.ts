import mongoose, { Document, Schema } from "mongoose";
import crypto from "crypto";

export interface ICertificate extends Document {
  user: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  internship?: mongoose.Types.ObjectId;
  title: string;
  verificationId: string;
  issuedAt: Date;
}

const certificateSchema = new Schema<ICertificate>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  internship: { type: Schema.Types.ObjectId, ref: "Internship" },
  title: { type: String, required: true },
  verificationId: {
    type: String,
    unique: true,
    default: () => `PAI-${crypto.randomBytes(6).toString("hex").toUpperCase()}`,
  },
  issuedAt: { type: Date, default: Date.now },
});

export const Certificate = mongoose.model<ICertificate>("Certificate", certificateSchema);
