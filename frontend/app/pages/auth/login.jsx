import { View, Text , StyleSheet , TouchableOpacity } from "react-native";
import React from "react";
import "../../../global.css";
import Header from "../../../components/Header";
import Logo from "../../../components/Logo";
import { rem } from "../../../components/stylings/responsiveSize";
import TextInput from "../../../components/TextInput";
// Paper
//import { TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import { FAB } from "react-native-paper";
import { useRouter } from "expo-router";

const login = () => {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center p-16">
      <View style={{ position: "absolute", top: rem(20), left: rem(20) }}>
        <FAB icon="arrow-left" onPress={() => router.back()} />
      </View>
      <Logo />
      <Header>Log In</Header>
      <View className="w-full p-2">
        <TextInput label="Email" style={{ height: rem(40) }} mode="outlined" />
      </View>
      <View className="w-full p-2">
        <TextInput
          label="Password"
          style={{ height: rem(40) }}
          mode="outlined"
        />
      </View>
      <View className="w-full ">
          <Button mode="contained" onPress={() => console.log("Pressed")}>
            LOGIN
          </Button>
      </View>
      <View style={styles.row}>
         
          <Text >Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("pages/auth/register")}>
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  link: {
    fontWeight: 'bold',
    color: '#560CCE',
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
})

export default login;
