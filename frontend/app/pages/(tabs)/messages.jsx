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

const Messages = ({ navigation }) => {
  const { user, axiosInstanceWithBearer } = useAuth();
  const [chatData, setChatData] = useState([]);
  const [pressOutside, setPressOutside] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      retrieveChats();
    }
  }, []);

  const retrieveChats = async () => {
    try {
      const res = await axiosInstanceWithBearer.get("/Chat/");
      setChatData(res.data);
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
  return (
    <PaperProvider theme={theme}>
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
          <View style={{ position: "absolute", bottom: 20, right: 20 }}>
            <FAB
              icon="plus"
              label="Create New"
              onPress={() =>
                navigation.navigate("Chat", { isNew: true, chatId: null })
              }
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </PaperProvider>
  );
};

export default Messages;
