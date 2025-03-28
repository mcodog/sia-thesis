import { View } from "react-native";
import { default as Text } from "../../../components/CustomText";
import React, { useEffect, useState } from "react";
import "../../../global.css";
import Header from "../../../components/Header";
import Logo from "../../../components/Logo";
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
import LoadingScreen from "../../../components/LoadingScreen";
import ErrorScreen from "../../../components/ErrorScreen";
import { Keyboard } from "react-native";

const Login = ({ navigation }) => {
  const router = useRouter();
  const [email, setEmail] = useState("markcodog");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [password, setPassword] = useState("secret");
  const { login } = useAuth();

  const handleLogin = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    setError(null);
    isLoggedIn = await login(email, password, setError);
    console.log("isLoggedIn:", isLoggedIn);
    setIsLoading(false);
    if (isLoggedIn) {
      navigation.navigate("Main");
    }
  };

  useEffect(() => {
    if (!error) return;
    setShowError(true);
  }, [error]);

  return (
    <PaperProvider theme={theme}>
      {showError && (
        <ErrorScreen isVisible={showError} setIsLoading={setShowError} />
      )}
      {isLoading && <LoadingScreen isVisible={isLoading} />}
      <View className="flex-1 justify-center items-center p-16 bg-white">
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
            contentStyle={{ color: "black", fontFamily: "Primary" }}
            mode="outlined"
          />
          {error && (
            <Text style={{ color: "red", fontSize: 12 }}>Invalid Username</Text>
          )}
        </View>
        <View className="w-full p-2">
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ height: rem(40) }}
            mode="outlined"
            contentStyle={{ color: "black", fontFamily: "Primary" }}
          />
          {error && (
            <Text style={{ color: "red", fontSize: 12 }}>Invalid Password</Text>
          )}
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
              onPress={() => navigation.navigate("Register")}
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
