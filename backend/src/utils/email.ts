import nodemailer from "nodemailer";
import {
  welcomeEmailHtml,
  approvalEmailHtml,
  resetPasswordEmailHtml,
  otpEmailHtml,
} from "./emailTemplates.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const isSmtpConfigured = (): boolean =>
  Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  if (!isSmtpConfigured()) {
    console.warn(`[Email skipped — SMTP not configured] To: ${to} | ${subject}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "Plus Alpha Intern <noreply@plusalphaintern.com>",
    to,
    subject,
    html,
  });
};

export const sendOTPEmail = async (to: string, otp: string): Promise<void> => {
  await sendEmail(to, "Verify your email — Plus Alpha Intern", otpEmailHtml(otp));
};

export const sendWelcomeEmail = async (params: {
  to: string;
  name: string;
  email: string;
  password: string;
  internshipDomain?: string;
}): Promise<void> => {
  await sendEmail(
    params.to,
    "Welcome to Plus Alpha Intern 🚀",
    welcomeEmailHtml({
      name: params.name,
      email: params.email,
      password: params.password,
      internshipDomain: params.internshipDomain,
    })
  );
};

export const sendApprovalEmail = async (params: {
  to: string;
  name: string;
  internshipDomain?: string;
  startDate?: string;
}): Promise<void> => {
  await sendEmail(
    params.to,
    "Your internship has been approved! 🎉 — Plus Alpha Intern",
    approvalEmailHtml({
      name: params.name,
      internshipDomain: params.internshipDomain,
      startDate: params.startDate,
    })
  );
};

export const sendResetPasswordEmail = async (params: {
  to: string;
  name: string;
  resetUrl: string;
}): Promise<void> => {
  await sendEmail(
    params.to,
    "Reset your password — Plus Alpha Intern",
    resetPasswordEmailHtml({ name: params.name, resetUrl: params.resetUrl })
  );
};
