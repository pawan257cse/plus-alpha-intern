import type { CookieOptions } from "express";

export const FRONTEND_URL =
  process.env.CLIENT_URL || "https://plusalphaintern.vercel.app";

export const ALLOWED_ORIGINS = [
  "https://plusalphaintern.vercel.app",
  "http://localhost:3000",
];

export const isProduction = process.env.NODE_ENV === "production";

const cookieBaseOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  path: "/",
};

const sameSite: CookieOptions["sameSite"] =
  isProduction ? "none" : "lax";

export const accessTokenCookieOptions = {
  ...cookieBaseOptions,
  sameSite,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const refreshTokenCookieOptions = {
  ...cookieBaseOptions,
  sameSite,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const clearAuthCookieOptions = {
  ...cookieBaseOptions,
  sameSite,
  maxAge: 0,
};

export const buildClientUrl = (path = ""): string => {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${FRONTEND_URL}${normalizedPath}`;
};