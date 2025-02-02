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
// import { brown100 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const sampledata = [
  {
    title: "Family Counseling",
    percentage: 0.789,
    image_uri:
      "https://res.cloudinary.com/dvsla5ril/image/upload/v1738013742/family1_xhlx6s.png",
    content:
      "Based on your responses, family counseling is recommended as the most suitable option. Your answers indicate a need for improved communication, conflict resolution, or emotional support within your family. Family counseling can help strengthen relationships, address underlying issues, and create a healthier, more supportive home environment.",
  },
  {
    title: "School Counseling",
    percentage: 0.652,
    image_uri:
      "https://res.cloudinary.com/dvsla5ril/image/upload/v1738013741/cognitive1_j5lxaj.png",
    content:
      "Your responses suggest that school counseling would be beneficial. This option can help address academic challenges, personal development, and social concerns related to educational settings.",
  },
  {
    title: "Career Counseling",
    percentage: 0.712,
    image_uri:
      "https://res.cloudinary.com/dvsla5ril/image/upload/v1738013742/career1_dxtjse.png",
    content:
      "Career counseling is recommended based on your answers. This service can help you identify your strengths, interests, and career aspirations, paving the way for fulfilling professional growth.",
  },
  // {
  //   title: "Marriage Counseling",
  //   percentage: 0.823,
  //   image_uri:
  //     "https://res.cloudinary.com/dvsla5ril/image/upload/v1738013742/couples1_bazwv1.png",
  //   content:
  //     "Your answers indicate that marriage counseling would be highly beneficial. This type of counseling focuses on strengthening your relationship, resolving conflicts, and enhancing communication with your partner.",
  // },
  // {
  //   title: "Grief Counseling",
  //   percentage: 0.687,
  //   image_uri:
  //     "https://res.cloudinary.com/dvsla5ril/image/upload/v1738013742/family1_xhlx6s.png",
  //   content:
  //     "Based on your responses, grief counseling is recommended to help process your emotions and navigate through the challenges of loss. This can provide support and strategies to cope effectively.",
  // },
];

const Result = ({ navigation }) => {
  const router = useRouter();
  const [isRenderingResults, setIsRenderingResults] = useState(false);
  const [viewCard, setViewCard] = useState("Not Set");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsRenderingResults(true);
    }, 1000);
  }, []);

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
                      height: rem(120),
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
                  colors={["#FF686B", "#FFA69E"]}
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
                height: rem(350),
                width: rem(250),
                elevation: 10,
                borderRadius: 24,
                padding: rem(10),
                paddingTop: rem(30),
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
