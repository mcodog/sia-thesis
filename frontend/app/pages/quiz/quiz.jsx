import {
  View,
  Text,
  TouchableWithoutFeedback,
  Pressable,
  Image,
} from "react-native";
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
import logo from "../../../assets/images/logo.png";
import { useAuth } from "../../../context/AuthContext";

import { useSelector, useDispatch } from "react-redux";
import { setQuizResult } from "../../../redux/counterSlice";
import useAudioPlayer from "../../../hooks/useAudioPlayer";

import inthepastAudio from "../../../assets/audio/voice/inthepast.mp3";
import youroverallselfAudio from "../../../assets/audio/voice/youroverallself.mp3";
import everbeendiagnosedAudio from "../../../assets/audio/voice/everbeendiagnosed.mp3";
import downhopelesslostAudio from "../../../assets/audio/voice/downhopelesslost.mp3";
import headachesAudio from "../../../assets/audio/voice/headaches.mp3";
import bloodpressureAudio from "../../../assets/audio/voice/bloodpressure.mp3";
import sleepqualityAudio from "../../../assets/audio/voice/sleepquality.mp3";
import breathingAudio from "../../../assets/audio/voice/breathing.mp3";
import noiselevelAudio from "../../../assets/audio/voice/noiselevel.mp3";
import livingsituationAudio from "../../../assets/audio/voice/livingsituation.mp3";
import workenvironmentAudio from "../../../assets/audio/voice/workenvironment.mp3";
import adequatelymetAudio from "../../../assets/audio/voice/adequatelymet.mp3";
import academicperformanceAudio from "../../../assets/audio/voice/academicperformance.mp3";
import academicpressureAudio from "../../../assets/audio/voice/academicpressure.mp3";
import relationshipwithteachersAudio from "../../../assets/audio/voice/relationshipwithteachers.mp3";
import futurecareerAudio from "../../../assets/audio/voice/futurecareer.mp3";
import supportsystemAudio from "../../../assets/audio/voice/supportsystem.mp3";
import peerpressureAudio from "../../../assets/audio/voice/peerpressure.mp3";
import extracurricularAudio from "../../../assets/audio/voice/extracurricular.mp3";
import bullyingAudio from "../../../assets/audio/voice/bullying.mp3";
import overallstressAudio from "../../../assets/audio/voice/overallstress.mp3";
import finishedAudio from "../../../assets/audio/voice/finished.mp3";
import ding from "../../../assets/audio/ding.mp3";
import wind from "../../../assets/audio/wind.mp3";
import tap from "../../../assets/audio/tap2.mp3";

const questionAudioMap = {
  "In the past two weeks, how often have you felt excessively worried or anxious?":
    {
      file: inthepastAudio,
      delay: 3000,
    },
  "How would you rate your overall self-esteem?": {
    file: youroverallselfAudio,
    delay: 500,
  },
  "Have you ever been diagnosed with a mental health condition?": {
    file: everbeendiagnosedAudio,
    delay: 500,
  },
  "In the past two weeks, how often have you felt down, hopeless, or lost interest in things you enjoy?":
    {
      file: downhopelesslostAudio,
      delay: 2000,
    },
  "How often do you experience headaches?": {
    file: headachesAudio,
    delay: 500,
  },
  "How would you describe your blood pressure?": {
    file: bloodpressureAudio,
    delay: 500,
  },
  "How would you rate your overall sleep quality?": {
    file: sleepqualityAudio,
    delay: 500,
  },
  "How often do you experience shortness of breath or breathing difficulties?":
    {
      file: breathingAudio,
      delay: 500,
    },
  "How would you rate the noise level in your living/study environment?": {
    file: noiselevelAudio,
    delay: 500,
  },
  "How comfortable is your living situation?": {
    file: livingsituationAudio,
    delay: 500,
  },
  "How safe do you feel in your living or working environment?": {
    file: workenvironmentAudio,
    delay: 500,
  },
  "Are all your basic needs (food, shelter, healthcare) adequately met?": {
    file: adequatelymetAudio,
    delay: 500,
  },
  "How would you rate your academic performance?": {
    file: academicperformanceAudio,
    delay: 500,
  },
  "How much academic pressure do you experience?": {
    file: academicpressureAudio,
    delay: 500,
  },
  "How would you describe your relationship with your teachers/professors?": {
    file: relationshipwithteachersAudio,
    delay: 500,
  },
  "How worried are you about your future career?": {
    file: futurecareerAudio,
    delay: 500,
  },
  "How strong is your social support system (friends, family, community)?": {
    file: supportsystemAudio,
    delay: 500,
  },
  "How often do you feel pressured by your peers to do things you wouldn’t normally do?":
    {
      file: peerpressureAudio,
      delay: 500,
    },
  "How actively do you participate in extracurricular activities?": {
    file: extracurricularAudio,
    delay: 500,
  },
  "How often have you experienced bullying?": {
    file: bullyingAudio,
    delay: 500,
  },
  "How would you rate your overall stress level?": {
    file: overallstressAudio,
    delay: 500,
  },
};

const Quiz = ({ navigation }) => {
  const quizResult = useSelector((state) => state.quizResult.quizResult);
  const dispatch = useDispatch();

  const [questions, setQuestions] = useState([
    {
      question:
        "In the past two weeks, how often have you felt excessively worried or anxious?",
      answers: ["Never", "Rarely", "Sometimes", "Often", "Almost Always"],
      input: "",
    },
    {
      question: "How would you rate your overall self-esteem?",
      answers: [
        "Very Low",
        "Low",
        "Moderate",
        "High",
        "Very High",
        "Extremely High",
      ],
      input: "",
    },
    {
      question: "Have you ever been diagnosed with a mental health condition?",
      answers: ["No", "Yes"],
      input: "",
    },
    {
      question:
        "In the past two weeks, how often have you felt down, hopeless, or lost interest in things you enjoy?",
      answers: ["Never", "Rarely", "Sometimes", "Often", "Almost Always"],
      input: "",
    },
    {
      question: "How often do you experience headaches?",
      answers: [
        "Never",
        "Rarely",
        "Occasionally",
        "Often",
        "Very Often",
        "Almost Daily",
      ],
      input: "",
    },
    {
      question: "How would you describe your blood pressure?",
      answers: ["Low", "Normal", "High"],
      input: "",
    },
    {
      question: "How would you rate your overall sleep quality?",
      answers: ["Very Poor", "Poor", "Fair", "Good", "Very Good", "Excellent"],
      input: "",
    },
    {
      question:
        "How often do you experience shortness of breath or breathing difficulties?",
      answers: [
        "Never",
        "Rarely",
        "Occasionally",
        "Often",
        "Very Often",
        "Almost Daily",
      ],
      input: "",
    },
    {
      question:
        "How would you rate the noise level in your living/study environment?",
      answers: [
        "Very Quiet",
        "Quiet",
        "Moderate",
        "Noisy",
        "Very Noisy",
        "Extremely Noisy",
      ],
      input: "",
    },
    {
      question: "How comfortable is your living situation?",
      answers: ["Very Poor", "Poor", "Fair", "Good", "Very Good", "Excellent"],
      input: "",
    },
    {
      question: "How safe do you feel in your living or working environment?",
      answers: [
        "Very Unsafe",
        "Unsafe",
        "Neutral",
        "Safe",
        "Very Safe",
        "Extremely Safe",
      ],
      input: "",
    },
    {
      question:
        "Are all your basic needs (food, shelter, healthcare) adequately met?",
      answers: [
        "Not at all",
        "Rarely",
        "Sometimes",
        "Most of the Time",
        "Almost Always",
        "Always",
      ],
      input: "",
    },
    {
      question: "How would you rate your academic performance?",
      answers: ["Very Poor", "Poor", "Fair", "Good", "Very Good", "Excellent"],
      input: "",
    },
    {
      question: "How much academic pressure do you experience?",
      answers: [
        "None",
        "Very Light",
        "Manageable",
        "Somewhat Heavy",
        "Heavy",
        "Overwhelming",
      ],
      input: "",
    },
    {
      question:
        "How would you describe your relationship with your teachers/professors?",
      answers: [
        "Very Poor",
        "Poor",
        "Neutral",
        "Good",
        "Very Good",
        "Excellent",
      ],
      input: "",
    },
    {
      question: "How worried are you about your future career?",
      answers: [
        "Not at all",
        "Slightly",
        "Somewhat",
        "Moderately",
        "Very",
        "Extremely",
      ],
      input: "",
    },
    {
      question:
        "How strong is your social support system (friends, family, community)?",
      answers: ["None", "Weak", "Moderate", "Strong"],
      input: "",
    },
    {
      question:
        "How often do you feel pressured by your peers to do things you wouldn’t normally do?",
      answers: [
        "Never",
        "Rarely",
        "Occasionally",
        "Often",
        "Very Often",
        "Almost Always",
      ],
      input: "",
    },
    {
      question:
        "How actively do you participate in extracurricular activities?",
      answers: [
        "Not at all",
        "Rarely",
        "Occasionally",
        "Regularly",
        "Very Actively",
        "Extremely Active",
      ],
      input: "",
    },
    {
      question: "How often have you experienced bullying?",
      answers: [
        "Never",
        "Rarely",
        "Occasionally",
        "Often",
        "Very Often",
        "Almost Always",
      ],
      input: "",
    },
    {
      question: "How would you rate your overall stress level?",
      answers: ["Low", "Moderate", "High"],
      input: "",
    },
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
  const { axiosInstanceWithBearer } = useAuth();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const staggerValue = 200;

  const { playSound, stopSound, isPlaying } = useAudioPlayer();

  // useEffect(() => {
  //   setQuestionNum((prev) => prev + 1);
  //   if (quizProgress === 1) {
  //     showModal();
  //   }
  // }, [quizProgress]);

  useEffect(() => {
    if (!start) return;

    const currentQuestion = questions[questionNum]?.question;
    const audioData = questionAudioMap[currentQuestion];

    if (audioData) {
      setTimeout(() => {
        playSound(audioData.file);
      }, audioData.delay);
    }
  }, [questionNum, start]);

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

  useEffect(() => {
    if (finished) {
      playSound(finishedAudio);
    }
  }, [finished]);

  const handleFinish = async () => {
    const quiz_result = questions.map((q) => q.input);
    console.log(quiz_result);

    try {
      const res = await axiosInstanceWithBearer.post("/api/analysis/", {
        quiz_result,
      });

      dispatch(setQuizResult(res.data.analysis_result));
      navigation.navigate("Result");
    } catch (e) {
      console.log(e);
    }
  };

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
          backgroundColor: "white",
        }}
      >
        <Animated.View
          layout={LinearTransition.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
          style={{
            marginTop: rem(-100),
            // borderWidth: 1,
          }}
        >
          {/* <Text
            style={{
              fontFamily: "CustomFont",
              fontSize: rem(18),
              color: "white",
            }}
          >
            PathFinder
          </Text> */}
          <Image
            source={logo}
            style={{
              width: rem(200),
              resizeMode: "contain",
              height: rem(100),
              // borderWidth: 1,
            }}
          />
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
              elevation: 5,
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
                playSound(tap);
                setStart(!start);
              }}
            >
              <Animated.View
                style={[
                  animatedStyle,
                  {
                    backgroundColor: "#0cdfc6",
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
              style={{ fontFamily: "Seco", color: "black", fontSize: rem(22) }}
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
              elevation: 5,
            }}
          >
            {questions.map((item, i) => {
              return questionNum === i ? (
                <Animated.View
                  entering={SlideInDown.delay(500).easing(
                    Easing.bezier(0.5, 1.5, 0.5, 1)
                  )}
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
                      const isSelected = item.input === index;

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
                            backgroundColor: isSelected ? "#0cdfc6" : "white",
                          }}
                        >
                          <TouchableWithoutFeedback
                            onPress={() => {
                              const updatedQuestions = [...questions];
                              updatedQuestions[i] = {
                                ...updatedQuestions[i],
                                input: index,
                              };
                              setQuestions(updatedQuestions);
                              playSound(ding);
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

                    {!(item.input === "") && !(i == questions.length - 1) && (
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
                                color="#0cdfc6"
                              />
                            </Text>
                          </TouchableWithoutFeedback>
                        </View>
                        <View
                          style={{ width: "50%", paddingHorizontal: rem(5) }}
                        >
                          <TouchableWithoutFeedback
                            disabled={i == questions.length - 1}
                            onPress={() => {
                              setQuestionNum((prev) => prev + 1);
                              setTimeout(() => {
                                playSound(wind);
                              }, 0);
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
                              <AntDesign
                                name="right"
                                size={24}
                                color="#0cdfc6"
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
                color={"#0cdfc6"}
              />
            )}
            <Text>
              Congratulations! You have completed the quiz. Please wait until
              your results are processed.
            </Text>
            {!isLoading && (
              <Button
                onPress={() => handleFinish()}
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

export default Quiz;
