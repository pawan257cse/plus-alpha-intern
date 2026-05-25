const brandColor = "#6366f1";
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
const supportEmail = process.env.SUPPORT_EMAIL || "plusalphaintern@gmail.com";

const baseLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0f0f14;font-family:'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f0f14 0%,#1a1a2e 100%);padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(99,102,241,0.3);border-radius:16px;overflow:hidden;backdrop-filter:blur(10px);">
        <tr><td style="background:linear-gradient(135deg,${brandColor},#a855f7);padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Plus Alpha Intern</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">Your gateway to real-world internships</p>
        </td></tr>
        <tr><td style="padding:32px;color:#e4e4e7;font-size:15px;line-height:1.6;">
          ${content}
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
          <p style="margin:0;color:#71717a;font-size:12px;">© ${new Date().getFullYear()} Plus Alpha Intern · <a href="mailto:${supportEmail}" style="color:${brandColor};">${supportEmail}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const welcomeEmailHtml = (params: {
  name: string;
  email: string;
  password: string;
  internshipDomain?: string;
}) =>
  baseLayout(`
    <h2 style="color:#fff;margin:0 0 16px;">Welcome aboard, ${params.name}! 🚀</h2>
    <p>Your account on <strong style="color:${brandColor};">Plus Alpha Intern</strong> is ready. Here are your login details — keep this email safe.</p>
    <table width="100%" style="margin:20px 0;background:rgba(99,102,241,0.12);border-radius:12px;border:1px solid rgba(99,102,241,0.25);">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 8px;color:#a1a1aa;font-size:12px;text-transform:uppercase;">Login Email</p>
        <p style="margin:0 0 16px;color:#fff;font-weight:600;">${params.email}</p>
        <p style="margin:0 0 8px;color:#a1a1aa;font-size:12px;text-transform:uppercase;">Password</p>
        <p style="margin:0 0 16px;color:#fff;font-weight:600;font-family:monospace;">${params.password}</p>
        ${params.internshipDomain ? `<p style="margin:0 0 8px;color:#a1a1aa;font-size:12px;text-transform:uppercase;">Internship Domain</p><p style="margin:0;color:#fff;font-weight:600;">${params.internshipDomain}</p>` : ""}
      </td></tr>
    </table>
    <p style="text-align:center;margin:28px 0;">
      <a href="${clientUrl}/dashboard" style="display:inline-block;background:linear-gradient(135deg,${brandColor},#a855f7);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;">Go to Dashboard →</a>
    </p>
    <p style="color:#a1a1aa;font-size:13px;">Need help? Reply to this email or contact ${supportEmail}</p>
  `);

export const approvalEmailHtml = (params: {
  name: string;
  internshipDomain?: string;
  startDate?: string;
}) =>
  baseLayout(`
    <h2 style="color:#fff;margin:0 0 16px;">Congratulations, ${params.name}! 🎉</h2>
    <p>Your internship application has been <strong style="color:#22c55e;">approved</strong> by our team.</p>
    <table width="100%" style="margin:20px 0;background:rgba(34,197,94,0.1);border-radius:12px;border:1px solid rgba(34,197,94,0.3);">
      <tr><td style="padding:16px 20px;">
        ${params.internshipDomain ? `<p style="margin:0 0 12px;"><span style="color:#a1a1aa;">Program:</span> <strong style="color:#fff;">${params.internshipDomain}</strong></p>` : ""}
        ${params.startDate ? `<p style="margin:0 0 12px;"><span style="color:#a1a1aa;">Start date:</span> <strong style="color:#fff;">${params.startDate}</strong></p>` : ""}
        <p style="margin:0;color:#86efac;">✓ Certificate eligible upon successful completion</p>
      </td></tr>
    </table>
    <p>Log in to access tasks, track progress, earn XP, and unlock your certificate.</p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${clientUrl}/dashboard" style="display:inline-block;background:linear-gradient(135deg,${brandColor},#a855f7);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;">Open Dashboard →</a>
    </p>
  `);

export const resetPasswordEmailHtml = (params: { name: string; resetUrl: string }) =>
  baseLayout(`
    <h2 style="color:#fff;margin:0 0 16px;">Reset your password</h2>
    <p>Hi ${params.name}, we received a request to reset your password. Click the button below — this link expires in 1 hour.</p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${params.resetUrl}" style="display:inline-block;background:linear-gradient(135deg,${brandColor},#a855f7);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;">Reset Password</a>
    </p>
    <p style="color:#a1a1aa;font-size:13px;">If you didn't request this, ignore this email. Your password won't change.</p>
    <p style="color:#71717a;font-size:11px;word-break:break-all;">${params.resetUrl}</p>
  `);

export const otpEmailHtml = (otp: string) =>
  baseLayout(`
    <h2 style="color:#fff;margin:0 0 16px;">Verify your email</h2>
    <p>Your verification code is:</p>
    <p style="font-size:36px;font-weight:700;letter-spacing:10px;color:#fff;text-align:center;margin:24px 0;">${otp}</p>
    <p style="color:#a1a1aa;font-size:13px;text-align:center;">Expires in 10 minutes</p>
  `);
