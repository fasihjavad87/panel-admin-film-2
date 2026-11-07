import {
  sendUserRequest,
  receiveUserResponse,
  receiveUserError,
  logoutUser,
} from "./userSlice";

import { getUserService, logoutService } from "@/services/auth";

export const fetchCurrentUser = () => {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("loginToken"));

      if (!token) {
        dispatch(receiveUserError(null));
        return;
      }

      dispatch(sendUserRequest());

      const res = await getUserService();
      // const token = JSON.parse(localStorage.getItem("loginToken"));

      dispatch(
        receiveUserResponse({
          user: res.data.user,
          token: token,
        }),
      );

      return res.data.user;
    } catch (error) {
      // ✅ فقط اگه 401 باشه توکن رو پاک کن
      if (error.response?.status === 401) {
        localStorage.removeItem("loginToken");
        // dispatch(receiveUserError("نشست شما منقضی شده است"));
        dispatch(logoutUser({error: "نشست شما منقضی شده است"}));
      } else {
        // ❌ برای خطاهای دیگه (404, 500, ...) توکن رو پاک نکن
        dispatch(
          receiveUserError(
            error?.response?.data?.message || "خطا در دریافت اطلاعات کاربر",
          ),
        );
      }
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    try {
      await logoutService();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      localStorage.removeItem("loginToken");

      dispatch(logoutUser());
    }
  };
};
