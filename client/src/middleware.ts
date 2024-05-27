import { clerkMiddleware } from "@clerk/nextjs/server";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response: AxiosResponse = await axios.post("/api/refresh", {
      refreshToken: Cookies.get("refreshToken"),
    });

    Cookies.set("accessToken", response.data.accessToken);
    Cookies.set("refreshToken", response.data.refreshToken);

    return response.data.accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

const isTokenExpired = (token: string | undefined): boolean => {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp < Date.now() / 1000;
};

const exampleFunction = async () => {
  const accessToken = Cookies.get("accessToken");
  if (isTokenExpired(accessToken)) {
    await refreshAccessToken();
  }
};

exampleFunction();