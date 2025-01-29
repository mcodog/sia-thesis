import { View, Text } from "react-native";
import React from "react";
import { rem } from "../../../components/stylings/responsiveSize";
import { useAuth } from "../../../context/AuthContext";
//Paper
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

import AntDesign from "@expo/vector-icons/AntDesign";

const Profile = () => {
  const { onLogout } = useAuth();
  const router = useRouter();
  return (
    <View className="flex-1 p-4 pt-16">
      <View className="items-center">
        <View
          className="p-2 justify-center items-center text-center align-center"
          style={{
            backgroundColor: "#FFA69E",
            borderRadius: 100,
            width: rem(100),
            height: rem(100),
          }}
        >
          <AntDesign
            className="text-center"
            name="user"
            size={50}
            color="white"
          />
        </View>
        <Text className="mt-4 font-bold" style={{ fontSize: rem(16) }}>
          User Name
        </Text>
      </View>

      <Button
        style={{ position: "absolute", bottom: 20, right: 20 }}
        mode="outlined"
        onPress={onLogout}
      >
        Logout
      </Button>
    </View>
  );
};

export default Profile;
