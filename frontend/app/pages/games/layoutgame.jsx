import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { rem } from "../../../components/stylings/responsiveSize";
import logo from "../../../assets/images/logo.png";
import NotificationBell from "../(tabs)/NotificationBell";
import Octicons from "@expo/vector-icons/Octicons";

const LayoutGame = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
       <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.headerIcons}>
            <NotificationBell />
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
              <Octicons name="gear" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      
        <Image 
          source={{ uri: "https://mindfulnessexercises.com/wp-content/uploads/2019/11/Visualizing-Your-Peaceful-and-Beautiful-Place-BG.jpg" }} 
          style={styles.headerImage} 
        />

        <Text style={styles.quote}>
          “I know this won’t be easy, but I also know you’ve got what it takes to get through it.”
        </Text>

        <View style={styles.supportContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('TakeABreath')} style={styles.buttonContainer}>
            <Image source={{ uri: "https://i.pinimg.com/736x/1c/dd/2f/1cdd2fe0d9e09d886acb186e0facfc20.jpg" }} style={styles.avatar} />
            <Text style={styles.buttonText}>1 min Breathing</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('SleepTracker')} style={styles.buttonContainer}>
            <Image source={{ uri: "https://i.pinimg.com/736x/ee/57/55/ee5755c69e71f88d3007605b8659ff50.jpg" }} style={styles.avatar} />
            <Text style={styles.buttonText}>Sleep Quality</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('MoodTrackerScreen')} style={styles.buttonContainer}>
            <Image source={{ uri: "https://img.freepik.com/free-vector/cute-girl-thinking-pose-logo-banner-hand-drawn-cartoon-art-illustration_56104-1360.jpg" }} style={styles.avatar} />
            <Text style={styles.buttonText}>Mood Track</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ClipCardGame')} style={styles.buttonContainer}>
            <Image source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb7qpZ0aWG6FuhoJaqeugsic3J8a4noUM0Hw&s" }} style={styles.avatar} />
            <Text style={styles.buttonText}>ClipCardGame</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Diary')} style={styles.buttonContainer}>
            <Image source={{ uri: "https://i.pinimg.com/474x/60/68/68/6068681ca5aacacf8010e41bf87e9ec2.jpg" }} style={styles.avatar} />
            <Text style={styles.buttonText}>Diary</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('WeeklyWellnessReport')} style={styles.buttonContainer}>
            <Image source={{ uri: "https://cdn.prod.website-files.com/59e16042ec229e00016d3a66/613158262dde4943a51937aa_data%20visualization%20tips_blog%20hero.webp" }} style={styles.reports} />
            <Text style={styles.buttonText}>Report</Text>
          </TouchableOpacity>
        </View>
     

      
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>😊 Calm down tips</Text>
          <Text>- Tense and relax muscles from toes to head.</Text>
          <Text>- Rub an ice cube on your skin.</Text>
          <Text>- Carry essential oil, a stress ball, or mint gum.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8e8",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: -20,
  },
  logo: {
    marginTop: -30,
    width: rem(160),
    height: rem(100),
    resizeMode: "contain",
  },
  headerIcons: {
    marginTop: -30,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 15,
  },
  headerImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  quote: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  supportContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  reports: {
    width: 250,
    height: 90,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    marginTop: 10,
  },
  tipsContainer: {
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default LayoutGame;
