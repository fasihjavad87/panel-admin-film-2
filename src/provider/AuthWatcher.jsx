// src/components/AuthWatcher.jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthWatcher = () => {
  const { isLogin, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isLogin) {
      navigate("/auth/login", { replace: true });
    }
  }, [isLogin, loading, navigate]);

  return null;
};

export default AuthWatcher;