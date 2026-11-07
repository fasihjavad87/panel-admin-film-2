import axios from "axios";
// import { Alert } from "../utils/alerts";
import config from "./config.json";
import { toast } from "@/components/Toast/ToastContainer";
import { openAlertModal } from "@/components/Modal/modal";
import { store } from "@/redux/store";
import { logoutUser } from "@/redux/user/userSlice";

export const apiPath = config.offlinePath;

axios.interceptors.response.use(
  (res) => {
    if (res.status != 200 && res.status != 201) {
      if (typeof res.data == "object") {
        let message = "";
        for (const key in res.data) {
          message = message + `${res.data[key]}`;
        }
        res.data.message = message;
      }
      //   Alert("مشکل...!", res.data.message, "warning");
      openAlertModal({
        title: `مشکلی پیش آمد`,
        message: res.data.message,
        // message: `فایل ${filesArray.lenght} با موفقیت آپلود شد`,
        confirmText: "باشه",
        variant: "warning",
      });
    }
    return res;
  },
  (error) => {
    console.log(error);

    if (error.response) {
      const status = error.response.status;

      // ✅ اگه 401 بود → کاربر رو logout کن
      if (status === 401) {
        localStorage.removeItem("loginToken");
        store.dispatch(logoutUser()); // ✅ isLogin = false میشه

        if (!window.__authRedirecting) {
          window.__authRedirecting = true;
          toast.warning("نشست شما منقضی شده است. لطفا دوباره وارد شوید.", {
            duration: 4000,
          });
          setTimeout(() => (window.__authRedirecting = false), 3000);
        }

        return Promise.reject(error);
      }

      toast.warning(error.response.data?.message, {
        title: error.response.status,
        duration: 5000,
        // stacked: true,
      });
    } else {
      console.log("No response from server");
      console.log(error.message);
    }

    return Promise.reject(error);
  },
);

const httpService = (url, method, data = null) => {
  const tokenInfo = JSON.parse(localStorage.getItem("loginToken"));

  const isFormData = data instanceof FormData;
  // console.log("httpService Loaded");
  // console.log(axios);
  return axios({
    url: apiPath + "/api/v1" + url,
    method,
    data,
    withCredentials: true,
    headers: {
      Authorization: tokenInfo ? `Bearer ${tokenInfo}` : null,
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),
    },
  });
};
export default httpService;
