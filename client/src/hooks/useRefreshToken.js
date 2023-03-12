import api from "../api/connection.js";
import useAuth from "./useAuth.js";
const { API } = require("../config");

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await api.get(API.v1.refresh, {
      withCredentials: true,
    });
    setAuth((prev) => {
      return {
        ...prev,
        accessToken: response.data.accessToken,
        userInfo: response.data.userInfo,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
