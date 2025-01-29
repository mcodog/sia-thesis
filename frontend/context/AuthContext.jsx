import React, { createContext, useContext, useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import axiosInstance from "./axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [test, setTest] = useState("Test");

  useEffect(() => {
    console.log("test value:", test);
  }, [test]);

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
      value={{ test, setTest, isAuthenticated, loading, isAdmin }}
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
