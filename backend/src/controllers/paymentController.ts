import { Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { AuthRequest } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";
import { getSiteSettings, calcFees, resolveTaskFee } from "../models/SiteSettings.js";

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

export const getPublicFeeSettings = async (
  _req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const settings = await getSiteSettings();
    const fees = calcFees(settings);
    return sendSuccess(res, {
      companyName: settings.companyName,
      totalFee: fees.total,
      registrationFee: fees.registrationFee,
      taskFee: fees.taskFee,
      registrationPercent: fees.regPercent,
      taskPercent: fees.taskPercent,
      currency: settings.currency,
      razorpayEnabled: settings.razorpayEnabled && !!process.env.RAZORPAY_KEY_ID,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || null,
      supportEmail: settings.supportEmail,
      address: settings.address,
      payAtTaskOnly: fees.payAtTaskOnly,
      upi: {
        id: settings.upiId || null,
        payeeName: settings.upiPayeeName || settings.companyName,
        instructions: settings.paymentInstructions,
      },
    });
  } catch {
    return sendError(res, "Failed to load settings", 500);
  }
};

const buildUserFees = async (user: { customTaskFee?: number | null }) => {
  const settings = await getSiteSettings();
  const base = calcFees(settings);
  const taskFee = resolveTaskFee(settings, user.customTaskFee);
  return {
    ...base,
    taskFee,
    customFeeApplied: user.customTaskFee != null && user.customTaskFee > 0,
  };
};

export const getMyPaymentStatus = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const settings = await getSiteSettings();
    const fees = await buildUserFees(req.user);
    return sendSuccess(res, {
      registrationPaymentStatus: req.user.registrationPaymentStatus,
      taskPaymentStatus: req.user.taskPaymentStatus,
      paymentDueDate: req.user.paymentDueDate || null,
      fees: {
        ...fees,
        razorpayEnabled: settings.razorpayEnabled && !!process.env.RAZORPAY_KEY_ID,
      },
      payAtTaskOnly: fees.payAtTaskOnly,
      upi: {
        id: settings.upiId || null,
        payeeName: settings.upiPayeeName || settings.companyName,
        instructions: settings.paymentInstructions,
      },
    });
  } catch {
    return sendError(res, "Failed", 500);
  }
};

export const createPaymentOrder = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const phase = req.body.phase as "registration" | "task";
    if (!["registration", "task"].includes(phase)) {
      return sendError(res, "Invalid payment phase", 400);
    }

    const settings = await getSiteSettings();
    const fees = calcFees(settings);

    if (phase === "registration") {
      if (fees.registrationFee <= 0) {
        return sendError(
          res,
          "Registration is free. Pay the full fee when you submit your internship task.",
          400
        );
      }
      if (req.user.registrationPaymentStatus !== "unpaid") {
        return sendError(res, "Registration payment already completed", 400);
      }
    } else {
      if (
        !fees.payAtTaskOnly &&
        fees.registrationFee > 0 &&
        req.user.registrationPaymentStatus === "unpaid"
      ) {
        return sendError(res, "Complete registration payment first", 400);
      }
      if (req.user.taskPaymentStatus !== "unpaid") {
        return sendError(res, "Task payment already completed", 400);
      }
    }

    const userFees = await buildUserFees(req.user);
    const amount =
      phase === "registration" ? fees.registrationFee : userFees.taskFee;
    if (amount <= 0) {
      return sendError(res, "Invalid fee amount. Contact admin.", 400);
    }
    const amountPaise = amount * 100;

    const razorpay = getRazorpay();
    let orderId: string;

    if (razorpay && settings.razorpayEnabled) {
      const order = await razorpay.orders.create({
        amount: amountPaise,
        currency: settings.currency,
        receipt: `pai_${phase}_${req.user._id}_${Date.now()}`,
        notes: { userId: req.user._id.toString(), phase },
      });
      orderId = order.id;
    } else {
      orderId = `manual_${phase}_${Date.now()}`;
    }

    const payment = await Payment.create({
      user: req.user._id,
      amount,
      currency: settings.currency,
      phase,
      razorpayOrderId: orderId,
      status: "created",
      verificationStatus: "pending",
    });

    return sendSuccess(res, {
      orderId,
      amount,
      currency: settings.currency,
      phase,
      paymentId: payment._id,
      keyId: process.env.RAZORPAY_KEY_ID,
      manualMode: !razorpay || !settings.razorpayEnabled,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not create payment order", 500);
  }
};

export const confirmRazorpayPayment = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
    } = req.body;

    const payment = await Payment.findOne({
      _id: paymentId,
      user: req.user._id,
    });
    if (!payment) return sendError(res, "Payment not found", 404);

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret && razorpay_signature) {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expected = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");
      if (expected !== razorpay_signature) {
        return sendError(res, "Invalid payment signature", 400);
      }
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    payment.verificationStatus = "pending";
    await payment.save();

    const user = await User.findById(req.user._id);
    if (user) {
      if (payment.phase === "registration") {
        user.registrationPaymentStatus = "paid";
      } else {
        user.taskPaymentStatus = "paid";
      }
      await user.save();
    }

    return sendSuccess(
      res,
      { payment, message: "Payment received. Admin will verify shortly." },
      "Payment successful — pending admin verification"
    );
  } catch {
    return sendError(res, "Payment confirmation failed", 500);
  }
};

export const submitManualPaymentProof = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const paymentId = req.body.paymentId as string;
    const transactionId = (req.body.transactionId as string)?.trim();
    const note = req.body.note as string | undefined;
    const file = req.file as { filename: string } | undefined;

    if (!paymentId || !transactionId) {
      return sendError(res, "Payment ID and transaction ID are required", 400);
    }

    const payment = await Payment.findOne({ _id: paymentId, user: req.user._id });
    if (!payment) return sendError(res, "Payment not found", 404);

    const proofPath = file ? `/uploads/payments/${file.filename}` : undefined;

    payment.metadata = {
      ...payment.metadata,
      manualTransactionId: transactionId,
      studentNote: note,
      proofUrl: proofPath,
      submittedAt: new Date(),
    };
    payment.status = "paid";
    payment.verificationStatus = "pending";
    await payment.save();

    const user = await User.findById(req.user._id);
    if (user) {
      if (payment.phase === "registration") user.registrationPaymentStatus = "paid";
      else user.taskPaymentStatus = "paid";
      await user.save();
    }

    return sendSuccess(res, null, "Proof submitted. Admin will verify your payment.");
  } catch {
    return sendError(res, "Failed to submit proof", 500);
  }
};

// Admin
export const updateSiteSettings = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const settings = await getSiteSettings();
    const allowed = [
      "internshipTotalFee",
      "registrationFeePercent",
      "taskFeePercent",
      "companyName",
      "supportEmail",
      "supportPhone",
      "address",
      "razorpayEnabled",
      "upiId",
      "upiPayeeName",
      "paymentInstructions",
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (settings as any)[key] = req.body[key];
      }
    }
    const reg = settings.registrationFeePercent;
    const task = settings.taskFeePercent;
    if (reg + task !== 100) {
      return sendError(res, "Registration % + Task % must equal 100", 400);
    }
    await settings.save();
    return sendSuccess(res, { settings: settings.toObject(), fees: calcFees(settings) });
  } catch {
    return sendError(res, "Update failed", 500);
  }
};

export const getAdminPayments = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { status, phase } = req.query;
    const filter: Record<string, unknown> = {};
    if (status) filter.verificationStatus = status;
    if (phase) filter.phase = phase;

    const payments = await Payment.find(filter)
      .populate("user", "name email phone selectedDomain")
      .populate("verifiedBy", "name")
      .sort({ createdAt: -1 })
      .limit(100);

    return sendSuccess(res, payments);
  } catch {
    return sendError(res, "Failed to fetch payments", 500);
  }
};

export const verifyPaymentAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { action, adminNote } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return sendError(res, "Payment not found", 404);

    if (action === "approve") {
      payment.verificationStatus = "approved";
      payment.verifiedAt = new Date();
      payment.verifiedBy = req.user?._id;
      payment.adminNote = adminNote;
      await payment.save();

      const user = await User.findById(payment.user);
      if (user) {
        if (payment.phase === "registration") {
          user.registrationPaymentStatus = "verified";
        } else {
          user.taskPaymentStatus = "verified";
        }
        await user.save();
      }
      return sendSuccess(res, payment, "Payment verified");
    }

    if (action === "reject") {
      payment.verificationStatus = "rejected";
      payment.adminNote = adminNote;
      payment.verifiedBy = req.user?._id;
      payment.verifiedAt = new Date();
      await payment.save();

      const user = await User.findById(payment.user);
      if (user) {
        if (payment.phase === "registration") {
          user.registrationPaymentStatus = "unpaid";
        } else {
          user.taskPaymentStatus = "unpaid";
        }
        await user.save();
      }
      return sendSuccess(res, payment, "Payment rejected");
    }

    return sendError(res, "Invalid action", 400);
  } catch {
    return sendError(res, "Verification failed", 500);
  }
};

export const getAdminSettings = async (
  _req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const settings = await getSiteSettings();
    return sendSuccess(res, {
      settings,
      fees: calcFees(settings),
      razorpayConfigured: !!process.env.RAZORPAY_KEY_ID,
    });
  } catch {
    return sendError(res, "Failed", 500);
  }
};

export const getPaymentSchedule = async (
  _req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const settings = await getSiteSettings();
    const defaultFee = calcFees(settings).taskFee;
    const students = await User.find({ role: "student" })
      .select(
        "name email phone selectedDomain customTaskFee paymentDueDate taskPaymentStatus registrationPaymentStatus createdAt"
      )
      .sort({ paymentDueDate: 1, name: 1 })
      .limit(500);

    const schedule = students.map((s) => ({
      _id: s._id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      domain: s.selectedDomain,
      fee: resolveTaskFee(settings, s.customTaskFee),
      customTaskFee: s.customTaskFee ?? null,
      defaultFee,
      paymentDueDate: s.paymentDueDate,
      taskPaymentStatus: s.taskPaymentStatus,
      registrationPaymentStatus: s.registrationPaymentStatus,
      isOverdue:
        s.paymentDueDate &&
        s.taskPaymentStatus === "unpaid" &&
        new Date(s.paymentDueDate) < new Date(),
    }));

    return sendSuccess(res, { schedule, defaultFee, upiId: settings.upiId });
  } catch {
    return sendError(res, "Failed to load payment schedule", 500);
  }
};

export const setStudentPaymentPlan = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { customTaskFee, paymentDueDate, clearCustomFee, clearDueDate } = req.body;
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "student") {
      return sendError(res, "Student not found", 404);
    }

    if (clearCustomFee) user.customTaskFee = undefined;
    else if (customTaskFee !== undefined) {
      const fee = Number(customTaskFee);
      if (fee < 0) return sendError(res, "Fee must be 0 or greater", 400);
      user.customTaskFee = fee > 0 ? fee : undefined;
    }

    if (clearDueDate) user.paymentDueDate = undefined;
    else if (paymentDueDate !== undefined) {
      user.paymentDueDate = paymentDueDate ? new Date(paymentDueDate) : undefined;
    }

    await user.save();
    const settings = await getSiteSettings();
    return sendSuccess(res, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        customTaskFee: user.customTaskFee,
        paymentDueDate: user.paymentDueDate,
        fee: resolveTaskFee(settings, user.customTaskFee),
      },
    }, "Payment plan updated");
  } catch {
    return sendError(res, "Update failed", 500);
  }
};

export const bulkLoadPaymentPlans = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const csvText = (req.body.csv as string) || "";
    if (!csvText.trim()) return sendError(res, "CSV content is required", 400);

    const lines = csvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const results: { email: string; ok: boolean; message: string }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i === 0 && /^email/i.test(line)) continue;

      const parts = line.split(",").map((p) => p.trim());
      const [email, feeStr, dueStr] = parts;
      if (!email) {
        results.push({ email: line, ok: false, message: "Missing email" });
        continue;
      }

      const user = await User.findOne({ email: email.toLowerCase(), role: "student" });
      if (!user) {
        results.push({ email, ok: false, message: "Student not found" });
        continue;
      }

      if (feeStr) {
        const fee = Number(feeStr);
        if (Number.isNaN(fee) || fee < 0) {
          results.push({ email, ok: false, message: "Invalid fee" });
          continue;
        }
        user.customTaskFee = fee > 0 ? fee : undefined;
      }
      if (dueStr) {
        const d = new Date(dueStr);
        if (Number.isNaN(d.getTime())) {
          results.push({ email, ok: false, message: "Invalid date (use YYYY-MM-DD)" });
          continue;
        }
        user.paymentDueDate = d;
      }
      await user.save();
      results.push({ email, ok: true, message: "Updated" });
    }

    const updated = results.filter((r) => r.ok).length;
    return sendSuccess(res, { results, updated, total: results.length });
  } catch {
    return sendError(res, "Bulk load failed", 500);
  }
};
