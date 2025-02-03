import { View, Text, TouchableWithoutFeedback, Image } from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { rem } from "../../../components/stylings/responsiveSize";
import { Button, PaperProvider, ProgressBar } from "react-native-paper";
import IconBar from "../../../components/IconBar";
import GradientButton from "../../../components/GradientButton";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import theme from "../../../components/CustomTheme";
import Animated, {
  LinearTransition,
  SlideInUp,
  Easing,
  Keyframe,
  BounceIn,
  FadeIn,
  FadeOut,
  SlideOutDown,
  SlideOutUp,
} from "react-native-reanimated";
import CustomButton from "../../../components/CustomButton";

import { useSelector } from "react-redux";

const Result = ({ navigation }) => {
  const router = useRouter();
  const [isRenderingResults, setIsRenderingResults] = useState(false);
  const [viewCard, setViewCard] = useState("Not Set");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const quizResult = useSelector((state) => state.quizResult.quizResult);
  const [sampledata, setSampleData] = useState([]);

  useEffect(() => {
    if (quizResult) {
      const newData = Object.entries(quizResult).map(([title, percentage]) => ({
        title,
        percentage,
        image_uri:
          "https://res.cloudinary.com/dvsla5ril/image/upload/v1738013742/family1_xhlx6s.png",
        content: generateContent(title),
      }));

      setSampleData(newData);
    }

    setTimeout(() => {
      setIsRenderingResults(true);
    }, 1000);
  }, []);

  const generateContent = (title) => {
    switch (title) {
      case "Academic Achievement Counseling":
        return "This counseling helps enhance study habits, motivation, and academic strategies for better performance.";
      case "Bullying Intervention Counseling":
        return "This counseling focuses on strategies to address bullying, build resilience, and create a safer environment.";
      case "Career Counseling":
        return "This counseling provides guidance on career choices, professional development, and future planning.";
      case "Extracurricular Engagement Counseling":
        return "This counseling supports students in finding meaningful extracurricular activities to boost confidence and skills.";
      case "General Counseling":
        return "A broad counseling option that helps address various emotional, social, and personal concerns.";
      case "Health and Wellness Counseling":
        return "Focuses on mental and physical well-being, stress management, and developing a healthier lifestyle.";
      case "School Counseling":
        return "Provides support in academic, social, and emotional aspects of school life to ensure success.";
      case "Social Support Counseling":
        return "Helps individuals develop better relationships, improve social skills, and strengthen support networks.";
      default:
        return "A counseling approach tailored to your unique needs.";
    }
  };

  const handleNext = () => {
    if (currentIndex < sampledata.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsRenderingResults(false);
      setShowAll(true);
    }
  };

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
    .delay(0);

  const exitTitleKeyframe = new Keyframe({
    0: {
      transform: [{ translateX: 0 }, { rotate: "0deg" }],
      opacity: 1,
    },
    100: {
      transform: [{ translateX: 1000 }, { rotate: "30deg" }],
      opacity: 0,
      easing: Easing.bezier(0.5, 1.5, 0.5, 1),
    },
  }).duration(1000);

  return (
    <PaperProvider theme={theme}>
      <Animated.View
        entering={SlideInUp}
        exiting={SlideOutUp}
        style={{
          flex: 1,
          justifyContent: isRenderingResults ? "center" : "center",
          alignItems: "center",
        }}
      >
        <Animated.Text
          layout={LinearTransition.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
          style={{
            fontFamily: "Seco",
            fontSize: rem(14),
            marginVertical: rem(20),
          }}
        >
          Your Results
        </Animated.Text>
        {isRenderingResults &&
          sampledata.map((item, i) => {
            return currentIndex == i ? (
              <Animated.View
                key={i}
                entering={startTitleKeyframe}
                exiting={exitTitleKeyframe}
                style={{
                  backgroundColor: "white",
                  width: rem(250),
                  elevation: 10,
                  borderRadius: 24,
                  padding: rem(10),
                  paddingTop: rem(30),
                  paddingBottom: rem(30),
                }}
              >
                <Text
                  style={{
                    fontFamily: "SecoBold",
                    fontSize: rem(20),
                    textAlign: "center",
                  }}
                >
                  {item.title}
                </Text>
                <View style={{ marginTop: rem(10) }}>
                  <Image
                    style={{
                      width: "100%",
                      height: rem(150),
                      resizeMode: "contain",
                    }}
                    source={{
                      uri: item.image_uri,
                    }}
                  />
                </View>
                <ProgressBar
                  style={{ marginTop: rem(5) }}
                  progress={item.percentage}
                />
                <Text style={{ textAlign: "center" }}>
                  {item.percentage * 100}%
                </Text>
                <View style={{ marginTop: rem(10) }}>
                  <Text style={{ fontFamily: "Seco" }}>{item.content}</Text>
                </View>
              </Animated.View>
            ) : null;
          })}

        {isRenderingResults && (
          <View style={{ marginTop: rem(20) }}>
            <Button mode="elevated" onPress={handleNext}>
              {currentIndex == sampledata.length - 1 ? "Finish" : "Next"}
            </Button>
          </View>
        )}

        {showAll && (
          <Animated.View
            layout={LinearTransition.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
            style={{ width: "80%" }}
          >
            <Animated.View
              style={{
                // borderWidth: 1,
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "wrap",
                gap: rem(10),
                padding: rem(5),
              }}
            >
              {sampledata.map((item, i) => {
                return (
                  <Animated.View
                    key={i}
                    entering={BounceIn.delay(500 + 300 * i)}
                    style={{
                      borderWidth: 1,
                      width: "30%",
                      minheight: rem(120),
                      maxHeight: rem(170),
                      borderRadius: 24,
                      padding: rem(5),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableWithoutFeedback onPress={() => setViewCard(i)}>
                      <Animated.View
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 24,
                          padding: rem(5),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          style={{
                            width: "100%",
                            height: "50%",
                            resizeMode: "cover",
                          }}
                          source={{ uri: item.image_uri }}
                        />
                        <Text
                          style={{
                            marginTop: rem(5),
                            fontWeight: 500,
                            textAlign: "center",
                            fontSize: rem(8),
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text>{item.percentage * 100}%</Text>
                      </Animated.View>
                    </TouchableWithoutFeedback>
                  </Animated.View>
                );
              })}
            </Animated.View>
            <Animated.View
              layout={LinearTransition.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
              style={{
                // borderWidth: 1,
                marginTop: rem(10),
                flexDirection: "row",
              }}
            >
              <View style={{ width: "50%", padding: rem(5) }}>
                <CustomButton
                  text="Return to Home"
                  style={{}}
                  onPress={() => navigation.navigate("Main")}
                />
                {/* <Button>Return to Home</Button> */}
              </View>
              <View style={{ width: "50%", padding: rem(5) }}>
                <GradientButton
                  onPress={() => alert("Button Pressed")}
                  style={{
                    paddingVertical: 15,
                    borderRadius: 24,
                    flexDirection: "row",
                  }}
                  colors={["#0cdfc6", "#9af1e6"]}
                  text="Save Results"
                  textStyle={{ color: "white" }}
                  renderIcon={() => (
                    <Ionicons
                      name="bookmark"
                      size={16}
                      color="white"
                      style={{ marginRight: rem(5) }}
                    />
                  )}
                />
                {/* <Button mode="contained">Save Results</Button> */}
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>
      {!(viewCard == "Not Set") ? (
        <TouchableWithoutFeedback onPress={() => setViewCard("Not Set")}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              flex: 1,
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <Animated.View
              entering={startTitleKeyframe}
              exiting={exitTitleKeyframe}
              style={{
                backgroundColor: "white",
                // height: rem(350),
                width: rem(250),
                elevation: 10,
                borderRadius: 24,
                padding: rem(10),
                paddingTop: rem(30),
                paddingBottom: rem(30),
              }}
            >
              <Text
                style={{
                  fontFamily: "SecoBold",
                  fontSize: rem(20),
                  textAlign: "center",
                }}
              >
                {sampledata[viewCard].title}
              </Text>
              <View style={{ marginTop: rem(10) }}>
                <Image
                  style={{
                    width: "100%",
                    height: rem(150),
                    resizeMode: "contain",
                  }}
                  source={{
                    uri: sampledata[viewCard].image_uri,
                  }}
                />
              </View>
              <ProgressBar
                style={{ marginTop: rem(5) }}
                progress={sampledata[viewCard].percentage}
              />
              <Text style={{ textAlign: "center" }}>
                {sampledata[viewCard].percentage * 100}%
              </Text>
              <View style={{ marginTop: rem(10) }}>
                <Text style={{ fontFamily: "Seco" }}>
                  {sampledata[viewCard].content}
                </Text>
              </View>
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      ) : null}
    </PaperProvider>
  );
};

export default Result;
