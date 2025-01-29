import { View, Text, TouchableWithoutFeedback, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Animated, {
  Keyframe,
  Easing,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withDelay,
  LinearTransition,
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
  SlideOutUp,
  FadeInLeft,
  BounceIn,
  BounceOut,
  FadeOutRight,
  StretchOutX,
  FlipOutEasyX,
  FlipInEasyX,
  SlideInUp,
  SlideInDown,
  FadeInUp,
  LightSpeedInLeft,
  LightSpeedOutRight,
} from "react-native-reanimated";

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
  ActivityIndicator,
} from "react-native-paper";
import theme from "../../../components/CustomTheme";

const quiz = () => {
  const [questions, setQuestions] = useState([
    {
      question: "How often do you feel stressed?",
      answers: ["Never", "Rarely", "Sometimes", "Always"],
      input: "",
    },
    {
      question: "Do you feel supported by your family?",
      answers: ["Not at all", "A little", "Somewhat", "Completely"],
      input: "",
    },
    // {
    //   question: "How satisfied are you with your current job?",
    //   answers: [
    //     "Very dissatisfied",
    //     "Dissatisfied",
    //     "Satisfied",
    //     "Very satisfied",
    //   ],
    //   input: "",
    // },
    // {
    //   question: "Do you often feel overwhelmed by your responsibilities?",
    //   answers: ["Never", "Occasionally", "Frequently", "Always"],
    //   input: "",
    // },
    // {
    //   question: "How would you rate your social interactions with friends?",
    //   answers: ["Very poor", "Average", "Good", "Excellent"],
    //   input: "",
    // },
    // {
    //   question: "Do you have any concerns about your mental health?",
    //   answers: [
    //     "No concerns",
    //     "Mild concerns",
    //     "Moderate concerns",
    //     "Severe concerns",
    //   ],
    //   input: "",
    // },
    // {
    //   question: "How often do you experience mood swings?",
    //   answers: ["Never", "Rarely", "Sometimes", "Often"],
    //   input: "",
    // },
    // {
    //   question: "How would you describe your relationship with your partner?",
    //   answers: ["Very unhealthy", "Unhealthy", "Healthy", "Very healthy"],
    //   input: "",
    // },
    // {
    //   question: "Do you feel you have a good work-life balance?",
    //   answers: ["Not at all", "A little", "Somewhat", "Completely"],
    //   input: "",
    // },
    // {
    //   question: "How confident are you in making important life decisions?",
    //   answers: [
    //     "Not confident",
    //     "Somewhat confident",
    //     "Confident",
    //     "Very confident",
    //   ],
    //   input: "",
    // },
  ]);

  const router = useRouter();
  const size = useSharedValue(0);
  const [quizProgress, setQuizProgress] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [visible, setVisible] = React.useState(false);
  const [start, setStart] = useState(false);
  const [renderQuestions, setRenderQuestions] = useState(false);
  const [renderTitle, setRenderTitle] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const staggerValue = 200;

  // useEffect(() => {
  //   setQuestionNum((prev) => prev + 1);
  //   if (quizProgress === 1) {
  //     showModal();
  //   }
  // }, [quizProgress]);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [isLoading]);

  useEffect(() => {
    if (start) {
      setRenderQuestions(true);

      setTimeout(() => {
        setRenderTitle(true);
      }, 1000);

      setTimeout(() => {
        setRenderTitle(false);
      }, 3000);

      setTimeout(() => {
        setIsAnswering(true);
      }, 3500);
    }
  }, [start]);

  const startBackgroundKeyframe = new Keyframe({
    0: {
      transform: [{ translateY: -1000 }],
    },
    100: {
      transform: [{ translateY: 0 }],
      easing: Easing.bezier(0.5, 1.5, 0.5, 1),
    },
  });

  const startTitleKeyframe = new Keyframe({
    0: {
      transform: [{ translateX: -1000 }, { rotate: "-30deg" }],
      opacity: 0,
    },
    100: {
      transform: [{ translateX: 0 }, { rotate: "0deg" }],
      opacity: 1,
      easing: Easing.bezier(0.5, 1.5, 0.5, 1),
    },
  })
    .duration(1000)
    .delay(1000);

  const exitTitleKeyframe = new Keyframe({
    0: {
      transform: [{ translateX: 0 }, { rotate: "0deg" }],
      opacity: 1,
    },
    100: {
      transform: [{ translateX: -1000 }, { rotate: "-30deg" }],
      opacity: 0,
      easing: Easing.bezier(0.5, 1.5, 0.5, 1),
    },
  }).duration(1000);

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      1800, // Delay in milliseconds
      withSpring(1, {
        damping: 10,
        stiffness: 100,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <PaperProvider theme={theme}>
      <Animated.View
        exiting={SlideOutUp}
        entering={startBackgroundKeyframe}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FF686B",
        }}
      >
        <Animated.View
          layout={LinearTransition.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
          style={{ marginVertical: rem(20), marginTop: rem(-100) }}
        >
          <Text
            style={{
              fontFamily: "CustomFont",
              fontSize: rem(18),
              color: "white",
            }}
          >
            PathFinder
          </Text>
        </Animated.View>
        {!start && (
          <Animated.View
            entering={startTitleKeyframe}
            exiting={exitTitleKeyframe}
            style={{
              backgroundColor: "white",
              padding: rem(50),
              paddingHorizontal: rem(60),
              borderRadius: 24,
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Text
              style={{
                fontSize: rem(26),
                // fontWeight: 00,

                fontFamily: "SecoBold",
              }}
            >
              Let's Begin!
            </Text>

            <TouchableWithoutFeedback
              onPress={() => {
                setStart(!start);
              }}
            >
              <Animated.View
                style={[
                  animatedStyle,
                  {
                    backgroundColor: "#FF686B",
                    borderRadius: 24,
                    padding: rem(5),
                    marginTop: rem(30),
                  },
                ]}
              >
                <AntDesign
                  style={{
                    padding: rem(5),
                    borderWidth: 4,
                    borderRadius: 24,
                    borderColor: "white",
                  }}
                  name="right"
                  size={30}
                  color="white"
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        )}

        {renderQuestions && renderTitle && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text
              style={{ fontFamily: "Seco", color: "white", fontSize: rem(22) }}
            >
              Question Set A
            </Text>
          </Animated.View>
        )}

        {renderQuestions && isAnswering && (
          <Animated.View
            entering={ZoomIn.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
            exiting={ZoomOut}
            style={{
              backgroundColor: "white",
              borderRadius: 24,
              height: rem(400),
              width: rem(300),
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {questions.map((item, i) => {
              return questionNum === i ? (
                <Animated.View
                  entering={SlideInDown.delay(500)}
                  exiting={SlideOutUp}
                  style={{
                    padding: rem(10),
                    paddingHorizontal: rem(20),
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  key={i}
                >
                  <Animated.Text
                    layout={LinearTransition.easing(
                      Easing.bezier(0.5, 1.5, 0.5, 1)
                    )}
                    style={{
                      color: "black",
                      textAlign: "center",
                      fontFamily: "Seco",
                      fontSize: rem(18),
                    }}
                  >
                    {item.question}
                  </Animated.Text>
                  <View
                    style={{
                      marginTop: rem(20),

                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-evenly",

                      gap: rem(10),
                    }}
                  >
                    {item.answers.map((answer, index) => {
                      const isSelected = item.input === answer;

                      return (
                        <Animated.View
                          layout={LinearTransition.easing(
                            Easing.bezier(0.5, 1.5, 0.5, 1)
                          )}
                          key={index}
                          entering={BounceIn.delay(1000 + staggerValue * index)}
                          exiting={BounceOut}
                          style={{
                            borderWidth: 1,
                            height: rem(40),
                            width: "48%",
                            borderRadius: 24,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: isSelected ? "#FF686B" : "white",
                          }}
                        >
                          <TouchableWithoutFeedback
                            onPress={() => {
                              const updatedQuestions = [...questions];
                              updatedQuestions[i] = {
                                ...updatedQuestions[i],
                                input: answer,
                              };
                              setQuestions(updatedQuestions);
                            }}
                          >
                            <View
                              style={{
                                height: "100%",
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: isSelected ? "white" : "black",
                                }}
                              >
                                {answer}
                              </Text>
                            </View>
                          </TouchableWithoutFeedback>
                        </Animated.View>
                      );
                    })}

                    {!(item.input == "") && !(i == questions.length - 1) && (
                      <Animated.View
                        entering={FadeInUp.easing(
                          Easing.bezier(0.5, 1.5, 0.5, 1)
                        )}
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          marginTop: rem(50),
                        }}
                      >
                        <View
                          style={{ width: "50%", paddingHorizontal: rem(5) }}
                        >
                          {/* <Button
                            mode="elevated"
                            onPress={() => {
                              setQuestionNum((prev) => prev - 1);
                            }}
                          >
                            Previous
                          </Button> */}
                          <TouchableWithoutFeedback
                            disabled={i === 0}
                            onPress={() => setQuestionNum((prev) => prev - 1)}
                          >
                            <Text
                              style={{
                                elevation: 5,
                                backgroundColor: "white",
                                borderRadius: 32,
                                padding: rem(10),
                                paddingVertical: rem(15),
                                textAlign: "center",
                                fontSize: rem(13),
                                fontWeight: 700,
                              }}
                            >
                              <AntDesign
                                name="left"
                                size={24}
                                color="#FF686B"
                              />
                            </Text>
                          </TouchableWithoutFeedback>
                        </View>
                        <View
                          style={{ width: "50%", paddingHorizontal: rem(5) }}
                        >
                          <TouchableWithoutFeedback
                            disabled={i == questions.length - 1}
                            onPress={() => setQuestionNum((prev) => prev + 1)}
                          >
                            <Text
                              style={{
                                elevation: 5,
                                backgroundColor: "white",
                                borderRadius: 32,
                                padding: rem(10),
                                paddingVertical: rem(15),
                                textAlign: "center",
                                fontSize: rem(13),
                                fontWeight: 700,
                              }}
                            >
                              <AntDesign
                                name="right"
                                size={24}
                                color="#FF686B"
                              />
                            </Text>
                          </TouchableWithoutFeedback>
                        </View>
                      </Animated.View>
                    )}

                    {!(item.input == "") && i == questions.length - 1 && (
                      <Animated.View
                        entering={FadeInUp.easing(
                          Easing.bezier(0.5, 1.5, 0.5, 1)
                        )}
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          marginTop: rem(50),
                        }}
                      >
                        <View
                          style={{ width: "100%", paddingHorizontal: rem(5) }}
                        >
                          <TouchableWithoutFeedback
                            disabled={i === 0}
                            onPress={() => {
                              setFinished(true);
                              setIsLoading(true);
                            }}
                          >
                            <Text
                              style={{
                                elevation: 5,
                                backgroundColor: "white",
                                borderRadius: 32,
                                padding: rem(10),
                                paddingVertical: rem(15),
                                textAlign: "center",
                                fontSize: rem(13),
                                fontWeight: 700,
                              }}
                            >
                              Finish
                            </Text>
                          </TouchableWithoutFeedback>
                        </View>
                      </Animated.View>
                    )}
                  </View>
                </Animated.View>
              ) : null;
            })}
          </Animated.View>
        )}
      </Animated.View>
      {finished && (
        <Animated.View
          entering={FadeIn.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
          exiting={FadeOut.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1000,
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View
            entering={LightSpeedInLeft.easing(
              Easing.bezier(0.5, 1.5, 0.5, 1)
            ).delay(500)}
            exiting={LightSpeedOutRight.easing(
              Easing.bezier(0.5, 1.5, 0.5, 1)
            ).delay(500)}
            style={{
              backgroundColor: "white",
              height: rem(200),
              width: rem(330),
              borderRadius: 24,
              justifyContent: "center",
              alignItems: "center",
              padding: rem(10),
            }}
          >
            {!isLoading ? (
              <AntDesign
                style={{ marginBottom: rem(20) }}
                name="checkcircle"
                size={24}
                color="green"
              />
            ) : (
              <ActivityIndicator
                style={{ marginBottom: rem(20) }}
                animating={isLoading}
                color={"#FF686B"}
              />
            )}
            <Text>
              Congratulations! You have completed the quiz. Please wait until
              your results are processed.
            </Text>
            {!isLoading && (
              <Button
                onPress={() => router.push("pages/quiz/result")}
                style={{ marginTop: rem(10) }}
              >
                Continue
              </Button>
            )}
          </Animated.View>
        </Animated.View>
      )}
    </PaperProvider>
  );
};

export default quiz;
