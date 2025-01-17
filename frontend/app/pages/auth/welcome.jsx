import { View, Text } from "react-native";
import React from "react";

import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

const welcome = () => {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center p-16">
      <View className="w-full p-2">
        <Button
          onPress={() => {
            router.push("pages/auth/login");
          }}
          mode="contained"
        >
          Login
        </Button>
      </View>
      <View className="w-full p-2">
        <Button
          onPress={() => {
            router.push("pages/auth/register");
          }}
          mode="contained"
        >
          Register
        </Button>
      </View>
      <View className="w-full p-2">
        <Button
          onPress={() => {
            router.push("pages/(tabs)");
          }}
          mode="contained"
        >
          Continue as Guest
        </Button>
      </View>
    </View>
  );
};

export default welcome;
