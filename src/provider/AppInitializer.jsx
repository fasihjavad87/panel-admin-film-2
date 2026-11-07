import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchCurrentUser } from "@/redux/user/userActions";
import { setTokenFromStorage, finishAuthCheck } from "@/redux/user/userSlice";

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // const token = JSON.parse(localStorage.getItem('loginToken'));
    let token = null;
    try {
      token = JSON.parse(localStorage.getItem("loginToken"));
    } catch {
      localStorage.removeItem("loginToken");
    }

    if (token) {
      // dispatch(setTokenFromStorage(token));
      dispatch(fetchCurrentUser());
    } else {
      dispatch(finishAuthCheck());
    }
  }, [dispatch]);

  return null;
};

export default AppInitializer;
