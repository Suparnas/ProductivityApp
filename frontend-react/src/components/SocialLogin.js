import React from "react";
import { socialLogin } from "../services/authService";
import googleIcon from '../assets/google-icon.svg';
import facebookIcon from '../assets/facebook-icon.svg';

const SocialLogin = () => {
  return (
    <div className="social-login">
      <button className="social-button">
        <img src={googleIcon} alt="Google" />
        Login with Google
      </button>
      <button className="social-button">
        <img src={facebookIcon} alt="Facebook" />
        Login with Facebook
      </button>
    </div>
  );
};

export default SocialLogin;
