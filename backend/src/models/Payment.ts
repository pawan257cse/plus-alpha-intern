import mongoose, { Document, Schema } from "mongoose";

export type PaymentPhase = "registration" | "task";
export type PaymentStatus = "created" | "paid" | "failed";
export type VerificationStatus = "pending" | "approved" | "rejected";

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  phase: PaymentPhase;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: PaymentStatus;
  verificationStatus: VerificationStatus;
  adminNote?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    phase: {
      type: String,
      enum: ["registration", "task"],
      required: true,
    },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: String,
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    verifiedAt: Date,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, phase: 1 });
paymentSchema.index({ verificationStatus: 1, createdAt: -1 });

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
