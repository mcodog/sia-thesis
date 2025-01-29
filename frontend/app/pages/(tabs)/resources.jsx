import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Chip, Button, PaperProvider } from "react-native-paper";
import { rem, em } from "../../../components/stylings/responsiveSize";

//Customs
import ElevatedButton from "../../../components/customs/ElevatedButton";
import theme from "../../../components/CustomTheme";

const Resources = () => {
  return (
    <PaperProvider theme={theme}>
      <View className="flex-1 p-2">
        <ElevatedButton text="Looking for Something?" search={true} />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: rem(40) }}
        >
          <View
            className="my-4 flex-row gap-2 align-center items-center justify-center"
            style={{ height: rem(30) }}
          >
            <Chip icon="account-heart" onPress={() => console.log("Pressed")}>
              Health
            </Chip>
            <Chip icon="bag-personal" onPress={() => console.log("Pressed")}>
              Academic
            </Chip>
            <Chip
              icon="account-supervisor-circle-outline"
              onPress={() => console.log("Pressed")}
            >
              Family
            </Chip>
            <Chip
              icon="account-hard-hat"
              onPress={() => console.log("Pressed")}
            >
              Professional
            </Chip>
          </View>
        </ScrollView>
        {/* <View className="items-center flex-row px-2">
        <Text className="font-bold w-3/4" style={{ fontSize: rem(14) }}>
          Community Forum
        </Text>
        <View className="w-1/4 align-end">
          <Button className="w-/14" mode="text">
            See more
          </Button>
        </View>
      </View> */}
        <View className="px-2 gap-4 w-full mb-4 mt-4">
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
      </View>
    </PaperProvider>
  );
};

export default Resources;
