import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import background from "../../../assets/images/bg/abstract2.png";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import user1 from "../../../assets/images/user/user1.jpg";

//Sizing
import { rem, em } from "../../../components/stylings/responsiveSize";

//Customs
import ElevatedButton from "../../../components/customs/ElevatedButton";
import PortraitTile from "../../../components/tiles/PortraitTile";
import CustomTheme from "../../../components/CustomTheme";

//Paper
import { ActivityIndicator, Button, PaperProvider } from "react-native-paper";

//Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import PostTile from "../../../components/tiles/PostTile";
import { useAuth } from "../../../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  console.log("User is ", user.username);
  const router = useRouter();

  return (
    <PaperProvider theme={CustomTheme}>
      {!(user.username == "") ? (
        <View className="flex-1 p-2">
          <ScrollView>
            <View
              className="justify-center p-2 flex-row mb-2"
              style={{ height: rem(50) }}
            >
              <View className="w-1/2">
                <Text className="font-bold" style={{ fontSize: rem(20) }}>
                  Hi, {user.username}!
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
            <View className="relative first-line:p-2">
              <View>
                <View
                  className="elevation-md w-full h-4 justify-center items-center"
                  style={{
                    backgroundColor: "white",
                    height: rem(200),
                    borderRadius: 32,
                  }}
                >
                  <Image
                    source={background}
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      borderRadius: 32,
                      zIndex: 20,
                    }}
                  />
                  {/* <LinearGradient
                  colors={["rgba(255,255,255, 0)", "rgba(255,255,255, 1)"]}
                /> */}
                  {/* <GradientBackground /> */}
                  <View
                    className="justify-center items-center p-5 px-10 elevation-lg rounded-lg"
                    style={{
                      backgroundColor: "rgba(255,255,255,.8)",
                      zIndex: 20,
                    }}
                  >
                    <Text
                      className="mb-5 text-center"
                      style={{
                        fontSize: rem(14),
                        color: "black",
                        fontWeight: 700,
                      }}
                    >
                      Discover your Counseling Path!
                    </Text>
                    <Button
                      // buttonColor="white"
                      // textColor="black"
                      className="w-full"
                      mode="contained"
                      onPress={() => {
                        router.push("pages/quiz/conditions");
                      }}
                    >
                      Start
                    </Button>
                  </View>
                </View>
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
                  {/* <View
                  className="h-full elevation-md"
                  style={{
                    borderRadius: 32,
                    width: rem(170),
                    backgroundColor: "white",
                  }}
                >
                  <Image
                    className="absolute h-full w-full rounded-custom"
                    source={require("../../../assets/images/bg/sunset1.png")}
                  />
                </View> */}
                  <PortraitTile
                    imageKey="sunset1"
                    title="Browse our selection of Mindful Games"
                    chips={[{ text: "Predictive Analytics" }]}
                  />
                  <PortraitTile
                    imageKey="sunset2"
                    title="Try out our AI-Powered Chatbot"
                    chips={[{ text: "NLP" }, { text: "AI" }]}
                  />
                  <PortraitTile
                    imageKey="sunset3"
                    title="See Community Insights"
                  />
                  <PortraitTile imageKey="sunset4" />
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
              <PostTile
                imageKey="user1"
                title="Trying out PathFinder!"
                userName="Chris Hemsworth"
                content="It is a long established fact that a reader will be distracted
          by the readable content of a page when looking at its layout."
              />
              <PostTile
                imageKey="user3"
                title="Trying out PathFinder!"
                userName="Mila Kunis"
                content="It is a long established fact that a reader will be distracted
          by the readable content of a page when looking at its layout."
              />
              <PostTile
                imageKey="user2"
                title="Trying out PathFinder!"
                userName="Sebastian Stan"
                content="It is a long established fact that a reader will be distracted
          by the readable content of a page when looking at its layout."
              />
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </PaperProvider>
  );
};

export default Home;
