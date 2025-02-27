import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { rem, em } from "../../../components/stylings/responsiveSize";
import { useRouter } from "expo-router";

//Customs
import ElevatedButton from "../../../components/customs/ElevatedButton";
import ChatLogBar from "../../../components/ChatLogBar";

//Icons
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";

//Paper
import { ActivityIndicator, FAB, PaperProvider } from "react-native-paper";
import theme from "../../../components/CustomTheme";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../context/axiosInstance";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { useSelector } from "react-redux";
import axios from "axios";

const Messages = ({ navigation }) => {
  const { user, axiosInstanceWithBearer } = useAuth();
  const [chatData, setChatData] = useState([]);
  const [pressOutside, setPressOutside] = useState(1);
  const router = useRouter();

  const authState = useSelector((state) => state.auth.auth);

  useEffect(() => {
    if (!authState.isLoggedIn) {
      navigation.navigate("Login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      retrieveChats();
    }
  }, []);

  useEffect(() => {
    console.log(user);
  }, []);

  const retrieveChats = async () => {
    try {
      const res = await axiosInstanceWithBearer.get("/Chat/");
      setChatData(res.data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstanceWithBearer.delete(`/Chat/${id}/`);
      alert("Chat Log Deleted Successfully.");
      retrieveChats();
    } catch (e) {
      console.log(e);
    }
  };

  const makeVapiCall = async () => {
    const url = "https://api.vapi.ai/call";
    const token = "1d9de362-7090-4849-8b13-5ac3f28c1810";
    // console.log("ti");
    const data = {
      assistantId: "7d9aa9b6-fa45-4b65-9762-ef88ec7f0627",
      phoneNumberId: "b673124e-0728-44ba-bd29-9092fe62f05a",
      customer: {
        number: "+639947088637",
        name: "Glyza",
      },
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error making API call:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <PaperProvider theme={theme}>
      {authState.isLoggedIn ? (
        <TouchableWithoutFeedback
          onPress={() => setPressOutside((prev) => prev + 1)}
        >
          <View className="flex-1 p-2">
            <ElevatedButton text="Chat History" />
            <ScrollView>
              <View className="px-2 gap-4 w-full mb-4 mt-4">
                {chatData ? (
                  chatData.map((item) => {
                    return (
                      <Animated.View entering={FadeInLeft} key={item.id}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            alert("clicked");
                          }}
                        >
                          <ChatLogBar
                            chatLogNum={item.id}
                            date={item.date_created}
                            pressOutside={pressOutside}
                            handleDelete={handleDelete}
                            handlePress={() => {
                              navigation.navigate("Chat", {
                                isNew: false,
                                chatId: item.id,
                              });
                            }}
                          />
                        </TouchableWithoutFeedback>
                      </Animated.View>
                    );
                  })
                ) : (
                  <ActivityIndicator size="large" />
                )}
              </View>
            </ScrollView>
            <View
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                flexDirection: "row",
                gap: 5,
              }}
            >
              <FAB
                icon="plus"
                label="Create New"
                onPress={() =>
                  navigation.navigate("Chat", { isNew: true, chatId: null })
                }
              />
              <FAB icon="phone" variant="tertiary" onPress={makeVapiCall} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>You need to be logged in to view this page.</Text>
        </View>
      )}
    </PaperProvider>
  );
};

export default Messages;
