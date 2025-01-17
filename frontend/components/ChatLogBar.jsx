import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { rem } from "./stylings/responsiveSize";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useStoreRootState } from "expo-router/build/global-state/router-store";

const ChatLogBar = ({ chatLogNum, date }) => {
  const [showTools, setShowTools] = useState(false);

  const handleOutsideClick = () => {
    if (showTools) {
      setShowTools(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      className="flex-1"
      style={{ position: "absolute", flex: 1 }}
      onPress={handleOutsideClick}
    >
      <View
        className="elevation-md w-full p-4 flex-row"
        style={{
          borderRadius: 32,
          height: rem(100),
          backgroundColor: "white",
        }}
      >
        <View className="flex-1 w-3/4">
          <View className="h-1/2">
            <View className="flex-row">
              <Text className="font-bold" style={{ fontSize: rem(12) }}>
                Chat Log #:
              </Text>
              <Text
                className="font-bold"
                style={{ fontSize: rem(12), color: "#6851a4" }}
              >
                {" "}
                {chatLogNum}
              </Text>
            </View>
            <Text>{date}</Text>
          </View>
          <View className="items-end">
            <Text>
              Preview: This is where the first message will be displayed.
            </Text>
          </View>
        </View>
        <View className="w-1/4">
          <TouchableWithoutFeedback
            onPress={(e) => {
              e.stopPropagation();
              if (showTools == true) {
                setShowTools(false);
              } else {
                setShowTools(true);
              }
            }}
          >
            <View>
              <Entypo
                className="text-right"
                name="dots-three-vertical"
                size={24}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        {showTools && (
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              className="elevation-lg flex-row justify-center items-center"
              style={{
                position: "absolute",
                right: 10,
                top: 50,
                backgroundColor: "white",
                padding: rem(10),
                paddingHorizontal: rem(20),
              }}
            >
              <Feather name="trash" size={24} color="black" />
              <Text>{"  "}Delete</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatLogBar;
