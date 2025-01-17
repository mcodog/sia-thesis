import { View, Text, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { rem, em } from "../../../components/stylings/responsiveSize";

import { Button, Checkbox } from "react-native-paper";
import { useRouter } from "expo-router";

import AntDesign from "@expo/vector-icons/AntDesign";

const conditions = () => {
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);
  return (
    <View className="flex-1 justify-center items-center ">
      <View style={{ position: "absolute", top: 20, left: 20 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableWithoutFeedback>
      </View>

      <Text className="text-center font-bold" style={{ fontSize: rem(20) }}>
        Conditions
      </Text>
      <View className="justify-center items-center">
        <View className="flex-row items-center my-2">
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(!checked);
            }}
          />
          <Text>I agree to the terms of service</Text>
        </View>

        <Button mode="contained" onPress={() => router.push("pages/quiz/quiz")}>
          Get Started
        </Button>
      </View>
    </View>
  );
};

export default conditions;
