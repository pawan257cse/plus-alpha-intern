import axios from "axios";

const API_BASE_URL =
  "https://plus-alpha-intern-backend.onrender.com/api";

export const getApiBaseUrl = () => {
  return API_BASE_URL;
};

export const getApiOrigin = () => {
  return "https://plus-alpha-intern-backend.onrender.com";
};

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${API_BASE_URL}${normalizedPath}`;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

let isRefreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !original._retry &&
      !original.url?.includes("/auth/login") &&
      !original.url?.includes("/auth/register")
    ) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken && !isRefreshing) {
        isRefreshing = true;
        original._retry = true;

        try {
          const { data } = await axios.post(
            buildApiUrl("/auth/refresh"),
            { refreshToken }
          );

          if (data.success && data.data.token) {
            localStorage.setItem("token", data.data.token);

            original.headers.Authorization =
              `Bearer ${data.data.token}`;

            isRefreshing = false;

            return api(original);
          }
        } catch {
          isRefreshing = false;
        }
      }

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      const path = window.location.pathname;

      if (path.startsWith("/admin")) {
        if (!path.startsWith("/admin/login")) {
          window.location.href =
            `/admin/login?redirect=${encodeURIComponent(path)}`;
        }
      } else if (
        !path.startsWith("/login") &&
        !path.startsWith("/signup")
      ) {
        window.location.href =
          `/login?redirect=${encodeURIComponent(path)}`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;