import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import "../../../global.css";

import { rem } from "../../../components/stylings/responsiveSize";

// Paper
import { PaperProvider, TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import { FAB } from "react-native-paper";
import { useRouter } from "expo-router";
import theme from "../../../components/CustomTheme";

import axiosInstance from "../../../context/axiosInstance";
import { useAuth } from "../../../context/AuthContext";

const Register = ({ navigation }) => {
  const router = useRouter();
  const { register } = useAuth();
  const [otp, setOtp] = useState("");
  const [user, setUser] = useState({
    name: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  const handleRegister = async () => {
    let isLoggedIn = register(user);
    if (isLoggedIn) {
      navigation.navigate("Main");
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

  const verifyOTP = async (otp) => {
    try {
      const response = await axiosInstance.post("/verify-otp/", {
        phone: String(user.phone),
        otp: String(otp),
      });

      console.log("OTP Sent:", response.data);
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

  return (
    <PaperProvider theme={theme}>
      <View className="flex-1 justify-center items-center p-16">
        <View style={{ position: "absolute", top: rem(20), left: rem(20) }}>
          <FAB icon="arrow-left" onPress={() => router.back()} />
        </View>
        <Text className="m-2" style={{ fontSize: rem(22) }}>
          Create an Account
        </Text>
        <View className="w-full flex-row">
          <View className="w-1/2 p-2">
            <TextInput
              label="First Name"
              style={{ height: rem(40) }}
              mode="outlined"
              value={user.first_name}
              onChangeText={(text) =>
                setUser((prev) => ({ ...prev, first_name: text }))
              }
            />
          </View>
          <View className="w-1/2 p-2">
            <TextInput
              label="Last Name"
              style={{ height: rem(40) }}
              mode="outlined"
              value={user.last_name}
              onChangeText={(text) =>
                setUser((prev) => ({ ...prev, last_name: text }))
              }
            />
          </View>
        </View>
        <View className="w-full p-2">
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
        <View className="w-full p-2 flex-row ">
          <View className="w-1/2 p-2 pl-0 pt-0">
            <TextInput
              label="Password"
              style={{ height: rem(40) }}
              mode="outlined"
              value={user.password}
              onChangeText={(text) =>
                setUser((prev) => ({ ...prev, password: text }))
              }
            />
          </View>
          <View className="w-1/2 p-2 pt-0 pr-0">
            <TextInput
              label="Confirm Password"
              style={{ height: rem(40) }}
              mode="outlined"
              value={user.password}
              onChangeText={(text) =>
                setUser((prev) => ({ ...prev, password: text }))
              }
            />
          </View>
        </View>
        <View className="w-full p-2 flex-row ">
          <View className="w-1/2 p-2 pt-0 pl-0">
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
          <View className="w-1/2 p-2 pt-0 pr-0 justify-center">
            <Button onPress={sendOTP} mode="contained">
              Send
            </Button>
          </View>
        </View>
        <View className="w-full p-2 flex-row ">
          <View className="w-full p-2 pl-0 pt-0">
            <TextInput
              label="OTP"
              style={{ height: rem(40) }}
              mode="outlined"
              value={otp}
              onChangeText={(text) => setOtp(text)}
            />
          </View>
        </View>
        <View className="w-full flex-row p-2">
          <View className="w-1/2 p-2 ">
            <Button mode="contained" onPress={() => handleRegister()}>
              Register
            </Button>
          </View>
          <View className="w-1/2 p-2">
            <Button mode="outlined" onPress={() => navigation.back()}>
              Go Back
            </Button>
          </View>
        </View>
      </View>
    </PaperProvider>
  );
};

export default Register;
