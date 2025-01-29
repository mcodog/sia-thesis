import { View, Text, TouchableWithoutFeedback, ScrollView } from "react-native";
import React from "react";
import { rem, em } from "../../../components/stylings/responsiveSize";
import theme from "../../../components/CustomTheme";

import { Button, Checkbox, PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";

const conditions = () => {
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);
  return (
    <PaperProvider theme={theme}>
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutUp}
        className="flex-1 p-2"
      >
        <View style={{ position: "absolute", top: 20, left: 20 }}>
          <TouchableWithoutFeedback
            onPress={() => {
              router.back();
            }}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableWithoutFeedback>
        </View>

        <View className="flex-1 mt-16">
          <Text className="p-3 font-bold" style={{ fontSize: rem(20) }}>
            Terms and Condition
          </Text>
          <ScrollView>
            <View>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
                malesuada. Nullam tristique turpis id lectus tincidunt, in
                laoreet orci suscipit. Vestibulum accumsan, justo nec feugiat
                suscipit, augue tortor tristique nisl, ut tincidunt nunc ligula
                nec ligula. Ut quis magna a libero vehicula vestibulum nec id
                nunc. Proin aliquam turpis sit amet nunc vestibulum, ut
                pellentesque risus elementum. Mauris ac sapien in ex ultricies
                gravida id id ipsum. Curabitur vel orci viverra, lacinia odio
                ac, dictum nunc. Phasellus vehicula {"\n\n"}
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
                malesuada. Nullam tristique turpis id lectus tincidunt, in
                laoreet orci suscipit. Vestibulum accumsan, justo nec feugiat
                suscipit, augue tortor tristique nisl, ut tincidunt nunc ligula
                nec ligula. Ut quis magna a libero vehicula vestibulum nec id
                nunc. Proin aliquam turpis sit amet nunc vestibulum, ut
                pellentesque risus elementum. Mauris ac sapien in ex ultricies
                gravida id id ipsum. Curabitur vel orci viverra, lacinia odio
                ac, dictum nunc. Phasellus vehicula
                {"\n\n"}
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
                malesuada. Nullam tristique turpis id lectus tincidunt, in
                laoreet orci suscipit. Vestibulum accumsan, justo nec feugiat
                suscipit, augue tortor tristique nisl, ut tincidunt nunc ligula
                nec ligula. Ut quis magna a libero vehicula vestibulum nec id
                nunc. Proin aliquam turpis sit amet nunc vestibulum, ut
                pellentesque risus elementum. Mauris ac sapien in ex ultricies
                gravida id id ipsum. Curabitur vel orci viverra, lacinia odio
                ac, dictum nunc. Phasellus vehicula
                {"\n\n"}
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
                malesuada. Nullam tristique turpis id lectus tincidunt, in
                laoreet orci suscipit. Vestibulum accumsan, justo nec feugiat
                suscipit, augue tortor tristique nisl, ut tincidunt nunc ligula
                nec ligula. Ut quis magna a libero vehicula vestibulum nec id
                nunc. Proin aliquam turpis sit amet nunc vestibulum, ut
                pellentesque risus elementum. Mauris ac sapien in ex ultricies
                gravida id id ipsum. Curabitur vel orci viverra, lacinia odio
                ac, dictum nunc. Phasellus vehicula
                {"\n\n"}
              </Text>
            </View>
          </ScrollView>
        </View>

        <View
          className="flex-row justify-around w-full p-5"
          style={{
            position: "absolute",
            bottom: 0,
            borderWidth: 1,
            borderColor: "gray",
            backgroundColor: "white",
            width: "105%",
          }}
        >
          <Button mode="outlined" onPress={() => router.back()}>
            <Feather name="x" size={16} color="#FFA69E" /> Decline
          </Button>
          <Button
            mode="contained"
            onPress={() => router.push("pages/quiz/quiz")}
          >
            <AntDesign name="check" size={16} color="white" /> Agree and
            Continue
          </Button>
        </View>
      </Animated.View>
    </PaperProvider>
  );
};

export default conditions;
