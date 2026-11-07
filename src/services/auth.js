import httpService from "./httpService";

export const loginService = (values) => {
  return httpService("/admin/login", "post", values);
};

export const getUserService = () => {
  return httpService("/me", "get");
};
export const logoutService = () => {
  return httpService("/logout", "get");
};
