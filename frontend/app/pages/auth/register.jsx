import { View } from "react-native";
import React, { useEffect, useState } from "react";
import "../../../global.css";
import { default as Text } from "../../../components/CustomText";

import { rem } from "../../../components/stylings/responsiveSize";

// Paper
import { PaperProvider, TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import { FAB } from "react-native-paper";
import { useRouter } from "expo-router";
import theme from "../../../components/CustomTheme";

import axiosInstance from "../../../context/axiosInstance";
import { useAuth } from "../../../context/AuthContext";
import LoadingScreen from "../../../components/LoadingScreen";
import ErrorScreen from "../../../components/ErrorScreen";
import { Keyboard } from "react-native";

const Register = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const router = useRouter();
  const { register } = useAuth();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({
    passwordMatched: false,
    passwordLength: false,
    missingUsername: false,
    missingFirstName: false,
    missingLastName: false,
    userAlreadyExists: false,
  });
  const [user, setUser] = useState({
    name: "markcodog",
    password: "secret12",
    first_name: "mark",
    last_name: "codog",
    phone: "",
    countryCode: "+63",
    initialPhone: "9934532573",
  });
  const [confirmPassword, setConfirmPassword] = useState("secret12");

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      userAlreadyExists: false,
      passwordMatched: false,
    }));
  }, [user]);

  const handleRegister = async () => {
    // console.log("🔵 Registering User:", user);
    Keyboard.dismiss();
    setIsLoading(true);
    // Trigger validation manually
    setErrors((prev) => ({
      ...prev,
      passwordLength: user.password.length < 8,
      passwordMatched: user.password !== confirmPassword.password,
      missingUsername: user.name === "",
      missingFirstName: user.first_name === "",
      missingLastName: user.last_name === "",
    }));

    // Check if any errors exist before proceeding
    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      setIsLoading(false);
      setShowError(true);
      // console.log("🔴 Validation Errors:", errors);
      return; // Stop registration if there are validation errors
    }

    let isLoggedIn = await register(user, setErrors);
    console.log("isLoggedIn:", isLoggedIn);
    setIsLoading(false);
    if (isLoggedIn) {
      navigation.navigate("Profile");
    }
  };

  const sendOTP = async () => {
    try {
      const response = await axiosInstance.post(
        "/send-otp/",
        { phone: user.phone }, // Ensure this is an object, not { "user.phone" }
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setOtpSent(true);
      console.log("✅ OTP Sent:", response.data);
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside of 2xx
        console.error("🔴 Server Error:", error.response.status);
        console.error("🔴 Error Data:", error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error("🔴 No Response from Server:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("🔴 Request Setup Error:", error.message);
      }
    }
  };

  const verifyOTP = async () => {
    try {
      console.log(
        "✅ Attempting to verify OTP:",
        otp,
        "for phone:",
        user.phone
      );

      const response = await axiosInstance.post("/verify-otp/", {
        phone: String(user.phone),
        otp: String(otp),
      });

      console.log("✅ OTP Verification Response:", response.data);

      if (response.data.success === true) {
        console.log("✅ OTP verified successfully!");
        setOtpVerified(true);
        handleRegister();
      } else {
        console.log(
          "⚠️ OTP verification returned unsuccessful response:",
          response.data
        );
        alert("OTP verification failed.");
      }

      // Check if verification was successful
      if (response.data.success) {
        console.log("✅ OTP verified successfully!");
        // Return true for success
        return { success: true, data: response.data };
      } else {
        console.log(
          "⚠️ OTP verification returned unsuccessful response:",
          response.data
        );
        return {
          success: false,
          error: response.data.error || "Verification failed",
        };
      }
    } catch (error) {
      if (error.response) {
        alert("OTP verification failed.");
        // Server responded with a status code outside of 2xx
        console.error("🔴 Server Error:", error.response.status);
        console.error("🔴 Error Data:", error.response.data);
        return {
          success: false,
          error: error.response.data.error || "Server error",
        };
      } else if (error.request) {
        // Request was made but no response received
        console.error("🔴 No Response from Server:", error.request);
        return { success: false, error: "No response from server" };
      } else {
        // Something happened in setting up the request
        console.error("🔴 Request Setup Error:", error.message);
        return { success: false, error: error.message };
      }
    }
  };
  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      phone: `${prev.countryCode}${prev.initialPhone}`,
    }));
    console.log("🔵 Phone Number:", user.phone);
  }, [user.countryCode, user.initialPhone]);

  const [isMounted, setIsMounted] = useState(false); // Track first load

  return (
    <PaperProvider theme={theme}>
      {showError && (
        <ErrorScreen isVisible={showError} setIsLoading={setShowError} />
      )}
      {isLoading && <LoadingScreen isVisible={isLoading} />}
      <View
        className="flex-1 justify-center items-center p-16 bg-white"
        style={{ backgroundColor: "white" }}
      >
        <View style={{ position: "absolute", top: rem(20), left: rem(20) }}>
          <FAB icon="arrow-left" onPress={() => router.back()} />
        </View>
        <Text className="m-2" style={{ fontSize: rem(22) }}>
          Create an Account
        </Text>
        <View className="w-full flex-row">
          <View className="w-1/2 p-1">
            <TextInput
              label="First Name"
              style={{ height: rem(40) }}
              mode="outlined"
              value={user.first_name}
              onChangeText={(text) =>
                setUser((prev) => ({ ...prev, first_name: text }))
              }
            />
            {errors.missingFirstName && (
              <Text
                style={{ fontSize: 8, textAlign: "left", width: "100%" }}
                className="text-red-500"
              >
                This is a required field.
              </Text>
            )}
          </View>
          <View className="w-1/2 p-1">
            <TextInput
              label="Last Name"
              style={{ height: rem(40) }}
              mode="outlined"
              value={user.last_name}
              onChangeText={(text) =>
                setUser((prev) => ({ ...prev, last_name: text }))
              }
            />
            {errors.missingLastName && (
              <Text
                style={{ fontSize: 8, textAlign: "left", width: "100%" }}
                className="text-red-500"
              >
                This is a required field.
              </Text>
            )}
          </View>
        </View>

        <View className="w-full p-1">
          <TextInput
            label="Username"
            style={{ height: rem(40) }}
            mode="outlined"
            value={user.name}
            onChangeText={(text) =>
              setUser((prev) => ({ ...prev, name: text }))
            }
          />
        </View>
        {errors.missingUsername && (
          <Text
            style={{ fontSize: 8, textAlign: "left", width: "100%" }}
            className="text-red-500"
          >
            This is a required field.
          </Text>
        )}
        {errors.userAlreadyExists && (
          <Text
            style={{ fontSize: 8, textAlign: "left", width: "100%" }}
            className="text-red-500"
          >
            User with the same username already exists.
          </Text>
        )}
        <View className="w-full p-1 flex-row ">
          <View className="w-1/2 p-1 pl-0 pt-0">
            <TextInput
              label="Password"
              style={{ height: rem(40) }}
              mode="outlined"
              value={user.password}
              onChangeText={(text) =>
                setUser((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry={true}
            />
          </View>
          <View className="w-1/2 p-1 pt-0 pr-0">
            <TextInput
              secureTextEntry={true}
              label="Confirm Password"
              style={{ height: rem(40) }}
              mode="outlined"
              value={user.confirmPassword}
              onChangeText={(text) =>
                setConfirmPassword((prev) => ({ ...prev, password: text }))
              }
            />
          </View>
        </View>
        {errors.passwordLength && (
          <Text
            style={{ fontSize: 8, textAlign: "left", width: "100%" }}
            className="text-red-500"
          >
            Password must be at least 8 characters long
          </Text>
        )}
        {errors.passwordMatched && (
          <Text
            style={{ fontSize: 8, textAlign: "left", width: "100%" }}
            className="text-red-500"
          >
            Passwords do not match
          </Text>
        )}
        {/* <View className="w-full p-1 flex-row ">
          <View className="w-1/2 p-1 pt-0 pl-0">
            <TextInput
              label="Phone"
              style={{ height: rem(40) }}
              mode="outlined"
              value={user.phone}
              onChangeText={(text) =>
                setUser((prev) => ({ ...prev, phone: text }))
              }
            />
          </View>
          <View className="w-1/2 p-1 pt-0 pr-0 justify-center">
            <Button onPress={sendOTP} mode="contained">
              Send
            </Button>
          </View>
        </View>
        <View className="w-full p-1 flex-row ">
          <View className="w-full p-1 pl-0 pt-0">
            <TextInput
              label="OTP"
              style={{ height: rem(40) }}
              mode="outlined"
              value={otp}
              onChangeText={(text) => setOtp(text)}
            />
          </View>
        </View> */}
        <View className="w-full flex-row p-2">
          <View className="w-1/2 p-2 ">
            <Button mode="contained" onPress={() => setShowModal(true)}>
              Register
            </Button>
          </View>
          <View className="w-1/2 p-2">
            <Button mode="outlined" onPress={() => navigation.goBack()}>
              Go Back
            </Button>
          </View>
        </View>
      </View>
      {showModal && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!otpSent && (
            <View
              style={{
                backgroundColor: "white",
                padding: 40,
                borderRadius: 10,
              }}
            >
              <Text style={{ textAlign: "center", marginBottom: 20 }}>
                OTP Verification
              </Text>
              <View
                className="w-full p-1 pl-0 pt-0"
                style={{ width: rem(200) }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  {/* Country Code Input */}
                  <TextInput
                    label="+63"
                    mode="outlined"
                    value={user.countryCode}
                    keyboardType="phone-pad"
                    style={{ width: 50, height: 40 }}
                    onChangeText={(text) =>
                      setUser((prev) => ({ ...prev, countryCode: text }))
                    }
                  />

                  {/* Phone Number Input (Local Part) */}
                  <TextInput
                    label="Phone"
                    mode="outlined"
                    value={user.initialPhone}
                    keyboardType="phone-pad"
                    style={{ flex: 1, height: 40 }}
                    onChangeText={(text) =>
                      setUser((prev) => ({ ...prev, initialPhone: text }))
                    }
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <Button
                  style={{ marginTop: 10 }}
                  onPress={sendOTP}
                  mode="contained"
                >
                  Send OTP
                </Button>
                <Button
                  style={{ marginTop: 10 }}
                  onPress={() => setShowModal(false)}
                  mode="outlined"
                >
                  Back
                </Button>
              </View>
            </View>
          )}

          {otpSent && (
            <View
              style={{
                backgroundColor: "white",
                padding: 40,
                borderRadius: 10,
              }}
            >
              <Text style={{ textAlign: "center", marginBottom: 20 }}>
                OTP Verification
              </Text>
              <View
                className="w-full p-1 pl-0 pt-0"
                style={{ width: rem(200) }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <TextInput
                    label="OTP Code"
                    mode="outlined"
                    value={otp}
                    keyboardType="phone-pad"
                    style={{ flex: 1, height: 40 }}
                    onChangeText={(text) => setOtp(text)}
                  />
                </View>
              </View>
              <Button
                style={{ marginTop: 10 }}
                onPress={verifyOTP}
                mode="contained"
              >
                Verify OTP
              </Button>
              <Button
                style={{ marginTop: 10 }}
                onPress={() => sendOTP()}
                mode="outlined"
              >
                Resend OTP
              </Button>
            </View>
          )}
        </View>
      )}
    </PaperProvider>
  );
};

export default Register;
