import api from "../api/connection.js";
import useAuth from "./useAuth";
const { API } = require("../config");

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      await api(API.v1.logout, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
