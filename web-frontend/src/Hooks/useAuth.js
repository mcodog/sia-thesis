import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import axiosInstance from "../Utils/axiosInstance";
import {
  setEmail,
  setFirstName,
  setLastName,
  setName,
  toggleLogin,
} from "../Redux/Slice/AuthSlice";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (formstate) => {
    try {
      const result = await axiosInstance.post("/api/token/", formstate);
      Cookies.set("token", result.data.access, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });
      await fetchUserProfile(result.data.access);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await axiosInstance.get("api/user/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setName(response.data.username));
      dispatch(setEmail(response.data.email));
      dispatch(setFirstName(response.data.first_name));
      dispatch(setLastName(response.data.last_name));
      dispatch(toggleLogin());

      navigate("/");
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return {
    handleLogin,
  };
};
