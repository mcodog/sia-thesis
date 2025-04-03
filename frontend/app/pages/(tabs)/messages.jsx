import { View, ScrollView, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { rem, em } from "../../../components/stylings/responsiveSize";
import { useRouter } from "expo-router";

import { default as Text } from "../../../components/CustomText";

//Customs
import ElevatedButton from "../../../components/customs/ElevatedButton";
import ChatLogBar from "../../../components/ChatLogBar";
import TermsOfUseModal from "../../../components/TermsOfUseModal";
import PhoneCallModal from "../../../components/PhoneCallModal"; // Import the new component

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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Messages = ({ navigation }) => {
  const { user, axiosInstanceWithBearer } = useAuth();
  const [chatData, setChatData] = useState([]);
  const [pressOutside, setPressOutside] = useState(1);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false); // Add state for phone modal
  const router = useRouter();
  console.log(user);

  const authState = useSelector((state) => state.auth.auth);

  useEffect(() => {
    if (!authState.isLoggedIn) {
      navigation.navigate("Login");
      return;
    }

    // Check if user has accepted terms before
    checkTermsAccepted();
  }, []);

  useEffect(() => {
    if (user) {
      retrieveChats();
    }
  }, [user]);

  const checkTermsAccepted = async () => {
    try {
      const termsAccepted = await AsyncStorage.getItem("termsAccepted");
      if (!termsAccepted) {
        setTermsModalVisible(true);
      }
    } catch (e) {
      console.log("Error checking terms acceptance status:", e);
      setTermsModalVisible(true); // Show modal on error to be safe
    }
  };

  const handleAcceptTerms = async () => {
    try {
      await AsyncStorage.setItem("termsAccepted", "true");
      setTermsModalVisible(false);
    } catch (e) {
      console.log("Error saving terms acceptance:", e);
    }
  };

  const handleDeclineTerms = () => {
    // You might want to navigate away or disable features
    setTermsModalVisible(false);
    navigation.goBack(); // Navigate back if user declines
  };

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

  const makeVapiCall = async (data) => {
    const url = "https://api.vapi.ai/call";
    const token = "7e9e423d-5e35-4f99-86fd-d94dd0f5a532";

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);
      alert("Call scheduled successfully!");
      return response.data;
    } catch (error) {
      console.error(
        "Error making API call:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to schedule call. Please try again.");
    } finally {
      setPhoneModalVisible(false);
    }
  };

  const handlePhoneModalSubmit = (data) => {
    makeVapiCall(data);
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
              <FAB
                icon="phone"
                variant="tertiary"
                onPress={() => setPhoneModalVisible(true)}
              />
            </View>

            {/* Terms of Use Modal */}
            <TermsOfUseModal
              visible={termsModalVisible}
              onAccept={handleAcceptTerms}
              onDecline={handleDeclineTerms}
            />

            {/* Phone Call Modal */}
            <PhoneCallModal
              visible={phoneModalVisible}
              onClose={() => setPhoneModalVisible(false)}
              onSubmit={handlePhoneModalSubmit}
              id={user.id}
            />
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
