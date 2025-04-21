export const isAuthenticated = (): boolean => {
  // Safety check for SSR
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("token");
  console.log("Checking auth token:", token);
  return !!token;
};

export const setAuthToken = (token: string): void => {
  console.log("Setting auth token:", token);
  localStorage.setItem("token", token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const clearAuthToken = (): void => {
  console.log("Clearing auth token");
  localStorage.removeItem("token");
};

export const logout = (): void => {
  clearAuthToken();
  // Using window.location instead of router to ensure complete reset
  window.location.href = "/signin";
};