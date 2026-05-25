import mongoose, { Document, Schema } from "mongoose";

export interface ISiteSettings extends Document {
  internshipTotalFee: number;
  registrationFeePercent: number;
  taskFeePercent: number;
  currency: string;
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  razorpayEnabled: boolean;
  upiId: string;
  upiPayeeName: string;
  paymentInstructions: string;
  updatedAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    internshipTotalFee: { type: Number, default: 999 },
    registrationFeePercent: { type: Number, default: 0, min: 0, max: 100 },
    taskFeePercent: { type: Number, default: 100, min: 0, max: 100 },
    currency: { type: String, default: "INR" },
    companyName: { type: String, default: "Plus Alpha Intern" },
    supportEmail: { type: String, default: "plusalphaintern@gmail.com" },
    supportPhone: { type: String, default: "" },
    address: { type: String, default: "Jaipur, Rajasthan, India" },
    razorpayEnabled: { type: Boolean, default: false },
    upiId: { type: String, default: "" },
    upiPayeeName: { type: String, default: "Plus Alpha Intern" },
    paymentInstructions: {
      type: String,
      default: "Pay via UPI, then submit your transaction ID below for admin verification.",
    },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model<ISiteSettings>("SiteSettings", siteSettingsSchema);

export const getSiteSettings = async (): Promise<ISiteSettings> => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
};

export const calcFees = (settings: ISiteSettings) => {
  const total = settings.internshipTotalFee;
  const regPercent = settings.registrationFeePercent;
  const taskPercent = settings.taskFeePercent;
  const registrationFee = Math.round((total * regPercent) / 100);
  const taskFee = Math.round((total * taskPercent) / 100);
  return {
    total,
    registrationFee,
    taskFee,
    regPercent,
    taskPercent,
    payAtTaskOnly: regPercent === 0 && taskPercent === 100,
  };
};

/** Per-student override from admin/HR; falls back to global task fee. */
export const resolveTaskFee = (
  settings: ISiteSettings,
  customTaskFee?: number | null
): number => {
  if (customTaskFee != null && customTaskFee > 0) return customTaskFee;
  return calcFees(settings).taskFee;
};
