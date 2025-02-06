import { View, Text } from "react-native";
import React from "react";
import { rem } from "./stylings/responsiveSize";

const SettingRow = ({ children }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: rem(5),
      }}
    >
      {children}
    </View>
  );
};

export default SettingRow;
