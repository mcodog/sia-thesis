import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
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
import { FAB, PaperProvider } from "react-native-paper";
import theme from "../../../components/CustomTheme";

const Messages = () => {
  const [pressOutside, setPressOutside] = useState(1);
  const router = useRouter();
  return (
    <PaperProvider theme={theme}>
      <TouchableWithoutFeedback
        onPress={() => setPressOutside((prev) => prev + 1)}
      >
        <View className="flex-1 p-2">
          <ElevatedButton text="Chat History" />
          <ScrollView>
            <View className="px-2 gap-4 w-full mb-4 mt-4">
              <ChatLogBar
                chatLogNum="429242242"
                date="Mon, July 3rd"
                pressOutside={pressOutside}
              />
              <ChatLogBar
                chatLogNum="439252742"
                date="Thurs, August 24th"
                pressOutside={pressOutside}
              />
              <ChatLogBar
                chatLogNum="419243202"
                date="Mon, September 1st"
                pressOutside={pressOutside}
              />
            </View>
          </ScrollView>
          <View style={{ position: "absolute", bottom: 20, right: 20 }}>
            <FAB
              icon="plus"
              label="Create New"
              onPress={() => router.push("pages/messages/chat")}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </PaperProvider>
  );
};

export default Messages;
