import React, { createContext, useContext, useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import axiosInstance from "./axiosInstance";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  // const [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [test, setTest] = useState("Test");

  const [user, setUser] = useState({
    username: "",
    id: "",
  });

  const axiosInstanceWithBearer = axios.create({
    baseURL: "http://172.34.99.53:8000",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  useEffect(() => {
    console.log(accessToken);
  }, [accessToken]);

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
        user,
        setUser,
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
