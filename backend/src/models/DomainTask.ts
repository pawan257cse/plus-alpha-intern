import mongoose, { Document, Schema } from "mongoose";

export interface IDomainTask extends Document {
  domainId: string;
  weekNumber: string;
  title: string;
  description: string;
  dueDate?: Date;
  feeAmount?: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const domainTaskSchema = new Schema<IDomainTask>(
  {
    domainId: { type: String, required: true, trim: true, index: true },
    weekNumber: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dueDate: Date,
    feeAmount: { type: Number, min: 0 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

domainTaskSchema.index({ domainId: 1, sortOrder: 1 });

export const DomainTask = mongoose.model<IDomainTask>("DomainTask", domainTaskSchema);
