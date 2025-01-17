import { View, Text, ScrollView } from "react-native";
import React from "react";
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
import { FAB } from "react-native-paper";

const messages = () => {
  const router = useRouter();
  return (
    <View className="flex-1 p-2">
      <ElevatedButton text="Chat History" />
      <ScrollView>
        <View className="px-2 gap-4 w-full mb-4 mt-4">
          <ChatLogBar chatLogNum="429242242" date="Mon, July 3rd" />
          <ChatLogBar chatLogNum="439252742" date="Thurs, August 24th" />
          <ChatLogBar chatLogNum="419243202" date="Mon, September 1st" />
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
  );
};

export default messages;
