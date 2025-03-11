import React, { createContext, useContext, useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import axiosInstance from "./axiosInstance";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toggleLogin } from "../redux/authSlice";
import {
  setName,
  setEmail,
  setFirstName,
  setLastName,
  setId,
} from "../redux/userSlice";
import { useRouter } from "expo-router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [test, setTest] = useState("Test");

  const [user, setUser] = useState({
    username: "",
    id: "",
  });

  const axiosInstanceWithBearer = axios.create({
    baseURL: "http://192.168.1.5:8000",
    // baseURL: "http://192.168.1.47:8000",
    // baseURL: "http://192.168.28.101:8000",
    // baseURL: "http://192.168.1.47:8000",
    timeout: 20000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  const login = async (username, password) => {
    console.log("Attempting to login with:", username, password);
    try {
      const result = await axiosInstance.post(`/api/token/`, {
        username,
        password,
      });
      // console.log("Login successful:", result.data);
      setAccessToken(result.data.access);
      await fetchUserProfile(result.data.access);

      return true;
    } catch (error) {
      if (error.response) {
        console.log("Response Error:", error.response.data);
        console.log("Status Code:", error.response.status);
      } else if (error.request) {
        console.log(
          "Request Error: No response received from server",
          error.request
        );
      } else {
        console.log("Error Message:", error.message);
      }
    }

    return false;
  };

  const register = async (user) => {
    try {
      const result = await axiosInstance.post(`/User/`, {
        username: user.name,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name,
      });

      const isLoggedIn = login(user.name, user.password);

      return isLoggedIn;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile(token);
    }
  });

  const fetchUserProfile = async (token) => {
    try {
      const response = await axiosInstance.get("api/user/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      dispatch(setId(response.data.id));
      dispatch(setName(response.data.username));
      dispatch(setEmail(response.data.email));
      dispatch(setFirstName(response.data.first_name));
      dispatch(setLastName(response.data.last_name));
      dispatch(toggleLogin());
      setUser((prev) => ({
        ...prev,
        username: response.data.username,
        id: response.data.id,
      }));
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const onLogout = () => {
    dispatch(setName(""));
    dispatch(setEmail(""));
    dispatch(toggleLogin());
    setUser({
      username: "",
      id: "",
    });
    setAccessToken("");
    // router.push("pages/auth/Welcome");
  };

  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     try {
  //       const res = await axiosInstance.get("auth");
  //       setUser(res.data.user);
  //       if (res.data.user.role === "Admin") {
  //         setIsAdmin(true);
  //       }
  //       setIsAuthenticated(true);
  //     } catch (error) {
  //       console.error("Authentication error", error);
  //       setIsAuthenticated(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   checkAuthStatus();
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        test,
        setTest,
        isAuthenticated,
        loading,
        isAdmin,
        login,
        register,
        user,
        setUser,
        onLogout,
        axiosInstanceWithBearer,
      }}
    >
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
