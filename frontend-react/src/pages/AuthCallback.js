import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("access_token");

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        navigate("/dashboard");
      }
    };

    fetchToken();
  }, [navigate]);

  return <h2>Logging in...</h2>;
};

export default AuthCallback;
