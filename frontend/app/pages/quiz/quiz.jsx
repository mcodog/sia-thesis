import { View, Text, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import AntDesign from "@expo/vector-icons/AntDesign";
import { rem } from "../../../components/stylings/responsiveSize";

import {
  Button,
  ProgressBar,
  MD3Colors,
  Modal,
  Portal,
  PaperProvider,
  MD3DarkTheme,
} from "react-native-paper";

const quiz = () => {
  const router = useRouter();
  const [quizProgress, setQuizProgress] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    setQuestionNum((prev) => prev + 1);
    if (quizProgress === 1) {
      showModal();
    }
  }, [quizProgress]);

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <View className="flex-1 justify-center items-center p-2">
        <View style={{ position: "absolute", top: 20, left: 20 }}>
          <TouchableWithoutFeedback
            onPress={() => {
              router.back();
            }}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableWithoutFeedback>
        </View>
        <View className="w-3/4" style={{ position: "absolute", top: rem(50) }}>
          <ProgressBar progress={quizProgress} />
        </View>
        <Text className="font-bold" style={{ fontSize: rem(16) }}>
          Question {questionNum}
        </Text>
        <Text>This is where the question will be displayed.</Text>

        <View className=" w-full gap-2 my-16 px-16">
          <Button
            mode="contained"
            onPress={() => {
              setQuizProgress((prev) => prev + 0.25);
            }}
          >
            Answer A
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              setQuizProgress((prev) => prev + 0.25);
            }}
          >
            Answer B
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              setQuizProgress((prev) => prev + 0.25);
            }}
          >
            Answer C
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              setQuizProgress((prev) => prev + 0.25);
            }}
          >
            Answer D
          </Button>
        </View>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{
              backgroundColor: "white",
              padding: 20,
              margin: 20,
            }}
          >
            <Text className="text-center">
              Congrats! You have finished the quiz. You can now view your
              result.
            </Text>
            <View className="justify-end p-2 mt-5">
              <Button
                onPress={() => {
                  router.push("pages/quiz/result");
                }}
                style={{ borderWidth: 1 }}
              >
                Continue
              </Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

export default quiz;
