import { View, Text } from "react-native";
import React from "react";
// import { Tabs } from "expo-router";
import Home from "./Home";
import Messages from "./Messages";
import Profile from "./Profile";
import Resources from "./Resources";

//Icons
import { IconSymbol } from "@/components/ui/IconSymbol";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthProvider } from "../../../context/AuthContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tabs = createBottomTabNavigator();

const _layout = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF686B", // Set active tab color
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          title: "pages/(tabs)/Home",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Messages"
        component={Messages}
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <AntDesign name="message1" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Resources"
        component={Resources}
        options={{
          title: "Resources",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="file-tray-stacked-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default _layout;
