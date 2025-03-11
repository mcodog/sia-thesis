import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import background from "../../../assets/images/bg/abstract2.png";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import user1 from "../../../assets/images/user/user1.jpg";
import logo from "../../../assets/images/logo.png";

//Sizing
import { rem, em } from "../../../components/stylings/responsiveSize";

//Customs
import ElevatedButton from "../../../components/customs/ElevatedButton";
import PortraitTile from "../../../components/tiles/PortraitTile";
import CustomTheme from "../../../components/CustomTheme";

//Paper
import {
  ActivityIndicator,
  Button,
  PaperProvider,
  Dialog,
  Portal,
} from "react-native-paper";

//Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import PostTile from "../../../components/tiles/PostTile";
import { useAuth } from "../../../context/AuthContext";
import SoundButton from "../../../components/SoundButton";
import Octicons from "@expo/vector-icons/Octicons";


import { useSelector } from "react-redux";

const Home = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const { user } = useAuth();
  const authState = useSelector((state) => state.auth.auth);
  // console.log(authState.isLoggedIn);
  return (
    <PaperProvider theme={CustomTheme}>
      {!(user.username == "") ? (
        <View className="flex-1 p-2">
          <ScrollView>
            <View
              className="justify-center p-2 flex-row mb-2"
              style={{ height: rem(60) }}
            >
              <View className="w-1/2" style={{ justifyContent: "flex-start" }}>
                {/* <Text className="font-bold" style={{ fontSize: rem(20) }}>
                  Hi, {user.username}!
                </Text>
                <Text style={{ fontSize: rem(12) }}>
                  Let's make this day productive.
                </Text> */}
                <Image
                  source={logo}
                  style={{
                    position: "relative",
                    top: rem(-5),
                    left: rem(-10),
                    width: "100%",
                    height: "130%",
                    resizeMode: "contain",
                  }}
                />
              </View>
              <View style={{ width: "50%", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", padding: 5, gap: 10 }}>
                
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                  <Octicons name="gear" size={20} color="black" />
                </TouchableOpacity>
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
                      className="text-center"
                      style={{
                        fontSize: rem(14),
                        color: "black",
                        fontWeight: 700,
                      }}
                    >
                      Discover your Counseling Path!
                    </Text>
                    <Text
                      className="mb-5"
                      style={{
                        maxWidth: rem(300),
                        fontSize: rem(8),
                        textAlign: "center",
                      }}
                    >
                      Try out our Counseling Recommendation Quiz with Predictive
                      Analytics!
                    </Text>
                    <SoundButton
                      className="w-full"
                      mode="contained"
                      onPress={() => {
                        if (authState.isLoggedIn) {
                          navigation.navigate("Conditions");
                        } else {
                          navigation.navigate("Login");
                        }
                      }}
                    >
                      Start
                    </SoundButton>
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

             {/* Mood Tracker Button */}
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate("MoodTrackerScreen")}
            >
              <LinearGradient 
                colors={["#AFE1AF", "#097969"]} // Soft pastel green & pink 🎀
                style={styles.gradientCard}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardText}>✨ Mood Check! ✨</Text>
                  <Text style={styles.subText}>How's your vibe? 😍😜</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
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

      <Portal>
        <Dialog
          style={{ backgroundColor: "white" }}
          visible={visible}
          onDismiss={hideDialog}
        >
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              You have to be logged in to access our quiz.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15, // Rounded corners for a cute look 🎀
    overflow: "hidden",
    marginVertical: 8,
    height: 80, // Smaller height 📐
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  gradientCard: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  cardContent: {
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000", // Cute deep purple 💜
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff", // Soft pink 🌸
    textAlign: "center",
    marginTop: 5,
  },
});


export default Home;
