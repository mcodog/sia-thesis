import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Welcome from "./pages/auth/welcome";
import Home from "./pages/(tabs)/home";
import Settings from "./pages/(tabs)/Settings";
import _layout from "./pages/(tabs)/_layout";
import Chat from "./pages/messages/chat";
import games from "./pages/games/layoutgame";
import TakeABreath from "./pages/games/TakeABreath";
import Quiz from "./pages/quiz/Quiz";
import Result from "./pages/quiz/Result";
import Conditions from "./pages/quiz/Conditions";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider } from "../context/AuthContext";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const index = () => {
  const [fontsLoaded] = useFonts({
    Primary: require("../assets/fonts/GlacialIndifference-Regular.otf"),
    Seco: require("../assets/fonts/OpenSans-Regular.ttf"),
    SecoBold: require("../assets/fonts/OpenSans-Bold.ttf"),
    SecoXBold: require("../assets/fonts/OpenSans-ExtraBold.ttf"),
  });

  return (
    <Provider store={store}>
      <AuthProvider>
        <AuthStack />
      </AuthProvider>
    </Provider>
  );
};

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Main" component={_layout} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Game" component={games} />
      <Stack.Screen name="TakeABreath" component={TakeABreath} />
      <Stack.Screen name="Result" component={Result} />
      <Stack.Screen name="Conditions" component={Conditions} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen
        name="Quiz"
        component={Quiz}
        options={{ animation: "none" }}
      />
    </Stack.Navigator>
  );
};

export default index;

{
  /* <Stack>
        <Stack.Screen
          name="pages/auth/welcome"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pages/auth/login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pages/auth/register"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pages/messages/chat"
          options={{ headerShown: true }}
        />
        <Stack.Screen name="pages/quiz/quiz" options={{ headerShown: true }} />
      </Stack> */
}
{
  /* <Redirect href="pages/auth/Welcome" /> */
}
