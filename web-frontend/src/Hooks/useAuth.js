import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import axiosInstance from "../Utils/axiosInstance";
import {
  setEmail,
  setFirstName,
  setLastName,
  setName,
  toggleAdmin,
  toggleLogin,
  triggerLogout,
} from "../Redux/Slice/AuthSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (formstate) => {
    const toastId = toast.loading("Logging in...");
    try {
      const result = await axiosInstance.post("/api/token/", formstate);
      Cookies.set("token", result.data.access, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });
      toast.update(toastId, {
        render: "Logged in Successfully",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
      await fetchUserProfile(result.data.access);
    } catch (e) {
      toast.dismiss(toastId);
      if (e.response.status === 401) {
        Swal.fire({
          title: "Login Error",
          text: "Please check your Username and Password",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Login Error",
          text: "Something went wrong. Please try again later.",
          icon: "error",
        });
      }
    }
  };

  const handleRegister = async (formstate, phoneNum) => {
    try {
      const formData = {
        ...formstate,
        phone: phoneNum,
      };
      const result = await axiosInstance.post("/User/", formData);
      console.log(result);
      await handleLogin(formstate);
      // toast.success("Registered Successfully", {
      //   position: "top-right",
      //   autoClose: 1000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      return true;
    } catch (e) {
      console.log(e);

      toast.error("Registration Failed", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return false;
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

      if (response.data.isAdmin) {
        dispatch(toggleAdmin());
      }

      navigate("/");
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      Cookies.remove("token");
      dispatch(triggerLogout());
      navigate("/");
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  return {
    handleLogin,
    handleLogout,
    handleRegister,
  };
};
