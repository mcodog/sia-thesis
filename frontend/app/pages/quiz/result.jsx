import { View, Text, TouchableWithoutFeedback } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { rem } from "../../../components/stylings/responsiveSize";
import { Button } from "react-native-paper";
import IconBar from "../../../components/IconBar";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const result = () => {
  const router = useRouter();
  return (
    <View className="flex-1 p-4">
      <View style={{ position: "absolute", top: 20, left: 20 }}>
        <TouchableWithoutFeedback onPress={() => router.push("pages/(tabs)")}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableWithoutFeedback>
      </View>
      <View className="mt-16 mb-4">
        <View
          className="elevation-lg w-full justify-center items-center p-4"
          style={{
            height: rem(250),
            backgroundColor: "white",
            borderRadius: 32,
          }}
        >
          <Text className="font-bold" style={{ fontSize: rem(16) }}>
            Family Counseling
          </Text>
          <View
            className="p-4 my-2"
            style={{ backgroundColor: "#6851a4", borderRadius: 100 }}
          >
            <MaterialIcons name="family-restroom" size={36} color="white" />
          </View>
          <Text className=" mb-4" style={{ fontSize: rem(8) }}>
            70.00%
          </Text>
          <Text>
            Your results show that Family Counseling is the best fit variation
            for you.
          </Text>
        </View>
      </View>
      <View className="items-center flex-row px-2">
        <Text className="font-bold w-3/4" style={{ fontSize: rem(14) }}>
          Other Results
        </Text>
        <View className="w-1/4 align-end">
          <Button className="w-/14" mode="text"></Button>
        </View>
      </View>
      <View className="px-2 gap-4 w-full mb-4 mt-4">
        <IconBar
          title="Relationship Counseling"
          sub="This is the another type of counseling we recommend."
          icon="person"
        />
        <IconBar
          title="Work Counseling"
          sub="This is the another type of counseling we recommend."
          icon="apartment"
        />
      </View>
    </View>
  );
};

export default result;
