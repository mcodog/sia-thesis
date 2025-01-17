import { View, Text } from "react-native";
import React from "react";
import { Stack, Redirect } from "expo-router";
import { PaperProvider } from "react-native-paper";

const index = () => {
  return (
    <PaperProvider>
      <Stack>
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
      </Stack>
      <Redirect href="pages/auth/welcome" />
    </PaperProvider>
  );
};

export default index;
