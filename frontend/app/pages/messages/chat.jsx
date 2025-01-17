import {
  View,
  Text,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { rem } from "../../../components/stylings/responsiveSize";

//Customs
import { TopShadowBox } from "../../../components/CustomShadow";
import MessageBox from "../../../components/MessageBox";

//Icons
import Ionicons from "@expo/vector-icons/Ionicons";

const sampleData = [
  {
    user: true,
    text: "This is a sample message.",
  },
  {
    user: false,
    text: "This is a sample message.",
  },
];

const index = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const chatRef = useRef(null);
  const [sampleData, setSampleData] = useState([
    {
      user: true,
      text: "This is a sample message.",
    },
    {
      user: false,
      text: "This is a sample message.",
    },
  ]);

  const scrollToBottom = () => {
    chatRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sampleData]);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content title="Chat" />
        {/* <Appbar.Action icon="gear" onPress={() => {}} /> */}
        {/* <Appbar.Action icon="magnify" onPress={() => {}} /> */}
      </Appbar.Header>
      <View
        className="flex-1 justify-end p-4 overflow-hidden"
        style={{ marginBottom: rem(60) }}
      >
        <ScrollView ref={chatRef} contentContainerStyle={{ flexGrow: 1 }}>
          <View className="min-h-full flex-1 justify-end flex-col">
            {sampleData.map((item, i) => (
              <MessageBox key={i} text={item.text} user={item.user} />
            ))}
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          // borderWidth: 1,
          paddingTop: rem(10),
          elevation: 4,
        }}
      >
        <View
          className="w-full p-2 flex-row"
          style={{
            elevation: 10,
            backgroundColor: "white",
            paddingVertical: rem(15),
            textAlign: "center",
            fontSize: rem(13),
          }}
        >
          <TextInput
            className="flex-1 pl-5"
            style={{ borderWidth: 1, borderColor: "gray", borderRadius: 32 }}
            placeholder="Send a message..."
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <View>
            {/* <Button title="Sample" /> */}
            <TouchableOpacity
              onPress={() => {
                setSampleData((prev) => [
                  ...prev,
                  { user: true, text: message },
                ]);
                setMessage("");
              }}
            >
              <View
                className="p-1 justify-center items-center text-center"
                // style={{ borderWidth: 1 }}
              >
                <Ionicons
                  className="p-2 ml-3"
                  name="paper-plane-outline"
                  size={24}
                  color="black"
                  style={{ borderWidth: 1, borderRadius: 100 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default index;
