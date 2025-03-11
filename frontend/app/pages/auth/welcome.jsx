import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";

import { Button, PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";

import background from "../../../assets/images/bg/welcome.png";
import theme from "../../../components/CustomTheme";
import { rem } from "../../../components/stylings/responsiveSize";
import { useAuth } from "../../../context/AuthContext";
import SoundButton from "../../../components/SoundButton";

const Welcome = ({ navigation }) => {
  const { setUser } = useAuth();
  // const router = useRouter();

  const handleGuest = () => {
    setUser("Guest");
    navigation.navigate("Main", { animation: "none" });
  };

  return (
    <PaperProvider theme={theme}>
      <View className="flex-1 justify-center items-center p-16 bg-white">
        <Image
          source={background}
          style={{ position: "absolute", height: "30%" }}
          resizeMode="contain"
        />
        <View className="absolute top-52">
          <Text style={{ fontSize: rem(26), fontWeight: 700 }}>
            Welcome to PathFinder!
          </Text>
          <Text className="text-center">Find the Right Counseling for You</Text>
        </View>
        <View className="absolute bottom-52">
          <View className="flex-row w-full">
            <View className="w-1/2 p-2">
              <SoundButton
                className="w-full"
                onPress={() => {
                  navigation.navigate("Login");
                }}
                mode="contained"
              >
                Login
              </SoundButton>
            </View>
            <View className="w-1/2 p-2">
              <SoundButton
                className="w-full"
                onPress={() => {
                  // router.push("pages/auth/Register");
                  navigation.navigate("Register");
                }}
                mode="contained"
              >
                Register
              </SoundButton>
            </View>
          </View>
          <View className="w-full p-2">
            <SoundButton
              onPress={() => {
                handleGuest();
                // router.push("pages/(tabs)");
              }}
              mode="outlined"
            >
              Continue as Guest
            </SoundButton>
          </View>
        </View>
      </View>
    </PaperProvider>
  );
};

export default Welcome;
