import { View, Text } from "react-native";
import React from "react";
import "../../../global.css";

import { rem } from "../../../components/stylings/responsiveSize";

// Paper
import { TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import { FAB } from "react-native-paper";
import { useRouter } from "expo-router";

const login = () => {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center p-16">
      <View style={{ position: "absolute", top: rem(20), left: rem(20) }}>
        <FAB icon="arrow-left" onPress={() => router.back()} />
      </View>
      <Text className="m-2" style={{ fontSize: rem(22) }}>
        SIGN IN
      </Text>
      <View className="w-full p-2">
        <TextInput label="Email" style={{ height: rem(40) }} mode="outlined" />
      </View>
      <View className="w-full p-2">
        <TextInput
          label="Password"
          style={{ height: rem(40) }}
          mode="outlined"
        />
      </View>
      <View className="w-full flex-row p-2 gap-2">
        <View className="w-1/2 ">
          <Button mode="contained" onPress={() => console.log("Pressed")}>
            Login
          </Button>
        </View>
        <View className="w-1/2">
          <Button
            mode="outlined"
            onPress={() => router.push("pages/auth/register")}
          >
            Register
          </Button>
        </View>
      </View>
    </View>
  );
};

export default login;
