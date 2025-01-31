import { View, Text, ScrollView } from "react-native";
import React from "react";

import { useRouter } from "expo-router";

//Sizing
import { rem, em } from "../../../components/stylings/responsiveSize";

//Customs
import ElevatedButton from "../../../components/customs/ElevatedButton";

//Paper
import { Button } from "react-native-paper";

//Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

const home = () => {
  const router = useRouter();
  return (
    <View className="flex-1 p-2">
      <ScrollView>
        <View
          className="justify-center p-2 flex-row mb-2"
          style={{ height: rem(50) }}
        >
          <View className="w-1/2">

          
            <Text className="font-bold" style={{ fontSize: rem(20) }}>
              Hi, Mark!
            </Text>
            <Text style={{ fontSize: rem(10) }}>
              Let's make this day productive.
            </Text>
          </View>
          <View className="w-1/2 justify-end flex-row items-center p-1 gap-5">
            <AntDesign name="bells" size={32} color="black" />
            <Feather name="info" size={32} color="black" />
          </View>
        </View>
        {/* <View className="p-2">
        <ElevatedButton text="Hi, Mark!" />
      </View> */}
        <View className="p-2">
          <View
            className="elevation-md w-full h-4 justify-center items-center"
            style={{
              backgroundColor: "white",
              height: rem(200),
              borderRadius: 32,
            }}
          >
            <Text className="mb-2 text-center" style={{ fontSize: rem(14) }}>
              Give our quiz a try!
            </Text>
            <Button
              className="w-1/3"
              mode="contained"
              onPress={() => {
                router.push("pages/quiz/conditions");
              }}
            >
              Start
            </Button>
          </View>
        </View>
        {/* <View className="w-full my-2 p-2" style={{ height: rem(200) }}>
        <View className="w-full h-1/2 flex-row">
          <View className="flex-1 w-1/2 p-2">
            <View
              className="flex-1 elevation-md"
              style={{ borderRadius: 32, backgroundColor: "white" }}
            ></View>
          </View>
          <View className="flex-1 w-1/2 p-2">
            <View
              className="flex-1 elevation-md"
              style={{ borderRadius: 32, backgroundColor: "white" }}
            ></View>
          </View>
        </View>
        <View className="w-full h-1/2 flex-row">
          <View className="flex-1 w-1/2 p-2">
            <View
              className="flex-1 elevation-md"
              style={{ borderRadius: 32, backgroundColor: "white" }}
            ></View>
          </View>
          <View className="flex-1 w-1/2 p-2">
            <View
              className="flex-1 elevation-md"
              style={{ borderRadius: 32, backgroundColor: "white" }}
            ></View>
          </View>
        </View>
      </View> */}
        <View className="items-center flex-row px-2">
          <Text className="font-bold w-3/4" style={{ fontSize: rem(14) }}>
            Things to check out!
          </Text>
          <View className="w-1/4 align-end">
            <Button className="w-/14" mode="text">
              See more
            </Button>
          </View>
        </View>
        <View style={{ height: rem(220) }}>
          <ScrollView horizontal={true}>
            <View className="gap-2 flex-row p-2 pb-4">
              <View
                className="h-full elevation-md"
                style={{
                  borderRadius: 32,
                  width: rem(170),
                  backgroundColor: "white",
                }}
              ></View>
              <View
                className="h-full elevation-md"
                style={{
                  borderRadius: 32,
                  width: rem(170),
                  backgroundColor: "white",
                }}
              ></View>
              <View
                className="h-full elevation-md"
                style={{
                  borderRadius: 32,
                  width: rem(170),
                  backgroundColor: "white",
                }}
              ></View>
            </View>
          </ScrollView>
        </View>
        <View className="items-center flex-row px-2">
          <Text className="font-bold w-3/4" style={{ fontSize: rem(14) }}>
            Community Forum
          </Text>
          <View className="w-1/4 align-end">
            <Button className="w-/14" mode="text">
              See more
            </Button>
          </View>
        </View>
        <View className="px-2 gap-4 w-full mb-4">
          <View
            className="elevation-md w-full"
            style={{
              borderRadius: 32,
              height: rem(100),
              backgroundColor: "white",
            }}
          ></View>
          <View
            className="elevation-md w-full"
            style={{
              borderRadius: 32,
              height: rem(100),
              backgroundColor: "white",
            }}
          ></View>
          <View
            className="elevation-md w-full"
            style={{
              borderRadius: 32,
              height: rem(100),
              backgroundColor: "white",
            }}
          ></View>
        </View>
      </ScrollView>
    </View>
  );
};

export default home;
