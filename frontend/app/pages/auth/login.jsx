import { View, Text } from "react-native";
import React, { useState } from "react";
import "../../../global.css";

import { rem } from "../../../components/stylings/responsiveSize";

import { PaperProvider, TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import { FAB } from "react-native-paper";
import { useRouter } from "expo-router";
import theme from "../../../components/CustomTheme";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import axios from "axios";
import axiosInstance from "../../../context/axiosInstance";
import { useAuth } from "../../../context/AuthContext";

const Login = ({ navigation }) => {
  const router = useRouter();
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("secret");
  const { login } = useAuth();

  const handleLogin = async () => {
    isLoggedIn = login(email, password);
    if (isLoggedIn) {
      navigation.navigate("Main");
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View className="flex-1 justify-center items-center p-16">
        <View style={{ position: "absolute", top: rem(20), left: rem(20) }}>
          <FAB icon="arrow-left" onPress={() => router.back()} />
        </View>
        <Text className="m-2" style={{ fontSize: rem(22) }}>
          SIGN IN
        </Text>
        <View className="w-full p-2">
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={{ height: rem(40), color: "black" }}
            contentStyle={{ color: "black" }}
            mode="outlined"
          />
        </View>
        <View className="w-full p-2">
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ height: rem(40) }}
            mode="outlined"
            contentStyle={{ color: "black" }}
          />
        </View>
        <View className="w-full flex-row p-2 gap-2">
          <View className="w-1/2 ">
            <Button mode="contained" onPress={handleLogin}>
              Login
            </Button>
          </View>
          <View className="w-1/2">
            <Button
              mode="outlined"
              onPress={() => router.push("pages/auth/Register")}
            >
              Register
            </Button>
          </View>
        </View>
      </View>
    </PaperProvider>
  );
};

export default Login;
