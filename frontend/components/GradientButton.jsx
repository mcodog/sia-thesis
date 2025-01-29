import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableWithoutFeedback, Text } from "react-native";

const GradientButton = ({
  onPress,
  textStyle,
  style,
  colors,
  text,
  renderIcon,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <LinearGradient
        colors={colors}
        style={[
          style,
          {
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
            backgroundColor: "white",
          },
        ]}
      >
        {renderIcon()}
        <Text style={textStyle}>{text}</Text>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default GradientButton;
