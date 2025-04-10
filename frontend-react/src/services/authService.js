import axios from "axios";

const API_URL = process.env.REACT_APP_STRAPI_API_URL || "http://localhost:1337";

export const socialLogin = async (provider) => {
  window.location.href = `${API_URL}/api/auth/${provider}`;
};
