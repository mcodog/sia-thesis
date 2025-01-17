import { View, Text } from "react-native";
import React from "react";
import { rem } from "./stylings/responsiveSize";

const MessageBox = ({ text = "This is a sample message.", user = true }) => {
  return (
    <View
      className="my-2"
      style={{
        backgroundColor: user ? "#dedede" : "#6851a4",
        borderRadius: 32,
        padding: 16,
        alignSelf: user ? "flex-end" : "flex-start",
      }}
    >
      <Text
        style={{
          fontSize: rem(10),
          maxWidth: rem(250),
          color: user ? "black" : "white",
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export default MessageBox;
