import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import TakeABreath from "./TakeABreath";

const layoutgame = ({navigation}) => {

  ; 

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8f8e8", padding: 20 }}>

      <Image source={{ uri: "https://mindfulnessexercises.com/wp-content/uploads/2019/11/Visualizing-Your-Peaceful-and-Beautiful-Place-BG.jpg" }} style={styles.headerImage} />

      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
      “I know this won’t be easy, but I also know you’ve got what it takes to get through it.”
      </Text>

      <View style={styles.supportContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('TakeABreath')}>
          <Image 
            source={{ uri: "https://i.pinimg.com/736x/1c/dd/2f/1cdd2fe0d9e09d886acb186e0facfc20.jpg" }}
            style={styles.avatar}
          />
          <Text style={{ textAlign: "center", marginTop: 10 }}>1 min Breathing</Text>
        </TouchableOpacity>
        
        <View>
          <TouchableOpacity style={styles.safePlace} onPress={() => alert('SafePlace')}>
            <Text>Safe Quiet Place</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.safePlace} onPress={() => alert('54321 Action')}>
            <Text>54321</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>😊 Calm down tips</Text>
        <Text>- Tense and relax muscles from toes to head.</Text>
        <Text>- Rub an ice cube on your skin.</Text>
        <Text>- Carry essential oil, a stress ball, or mint gum.</Text>
      </View>

      {/* <TouchableOpacity style={styles.kitContainer}>
        <Text>😊 Calm-down kit</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

const styles = {
  headerImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  supportContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  safePlace: {
    backgroundColor: "#e6f7ff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  tipsContainer: {
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  kitContainer: {
    backgroundColor: "#ddd",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    textAlign: "center",
  },
};

export default layoutgame;
