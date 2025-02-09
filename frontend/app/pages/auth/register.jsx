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
  const [user, setUser] = useState({
    name: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const handleRegister = async () => {
    let isLoggedIn = register(user);
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
        <View className="w-full p-2">
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
