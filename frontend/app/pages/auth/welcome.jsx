import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import React from "react";
import Logo from "../../../components/Logo";
import Header from "../../../components/Header";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: "https://images.pexels.com/photos/2531237/pexels-photo-2531237.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" }} // Replace with your image URL or local file
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      blurRadius={3} // Adjust the blur intensity
    >
      <View style={{width: "100%", flex: 10, justifyContent: "center", alignItems: "center", padding: 16 }}>
        <Logo />
        <Header>Mind Haven</Header>
        <Text style={{ textAlign: "center", fontSize: 15, lineHeight: 21, marginBottom: 12 }}>
          The easiest way to start with your amazing application.
        </Text>

        {/* Login Button */}
        <View style={{ width: "100%", paddingVertical: 8 }}>
          <Button
            onPress={() => {
              router.push("pages/auth/login");
            }}
            mode="contained"
          >
            Login
          </Button>
        </View>

        {/* Register Button */}
        <View style={{ width: "100%", paddingVertical: 8 }}>
        <Button
          onPress={() => {
            router.push("pages/auth/register");
          }}
          mode="outlined"
          contentStyle={{
            backgroundColor: "#FFFFFF", 
          }}
          labelStyle={{
            color: "#6200EE", 
          }}
        >
          Register
        </Button>

        </View>

        {/* Continue as Guest Link */}
        <View style={{ width: "100%", paddingVertical: 8, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              router.push("pages/(tabs)");
            }}
          >
            <Text style={{ fontSize: 16, color: "#ffff", textDecorationLine: "underline" }}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Welcome;
