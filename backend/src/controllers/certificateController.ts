import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Certificate } from "../models/Certificate.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getMyCertificates = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const certs = await Certificate.find({ user: req.user._id })
      .populate("course", "title")
      .sort({ issuedAt: -1 });
    return sendSuccess(res, certs);
  } catch {
    return sendError(res, "Failed to fetch certificates", 500);
  }
};

export const verifyCertificate = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const cert = await Certificate.findOne({
      verificationId: req.params.id,
    }).populate("user", "name email");
    if (!cert) return sendError(res, "Certificate not found", 404);
    return sendSuccess(res, {
      valid: true,
      verificationId: cert.verificationId,
      title: cert.title,
      issuedAt: cert.issuedAt,
      holder: cert.user,
    });
  } catch {
    return sendError(res, "Verification failed", 500);
  }
};
