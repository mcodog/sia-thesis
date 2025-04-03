import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";
import CounselingCharts from "../../../components/CounselingCharts"; // Import the new component

const Profile = ({ navigation }) => {
  const authState = useSelector((state) => state.auth.auth);
  const { onLogout, axiosInstanceWithBearer } = useAuth();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const [profile, setProfile] = useState({});
  const [analysisData, setAnalysisData] = useState(null); // Add state for analysis data

  const fetchProfile = async () => {
    try {
      const response = await axiosInstanceWithBearer.get("/api/user/profile");
      // console.log("Profile response:", response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchLatest = async () => {
    try {
      const response = await axiosInstanceWithBearer.get(
        `/get-analysis/${user.id}`
      );
      console.log("Latest analysis response:", response.data);
      setAnalysisData(response.data); // Store the fetched data
    } catch (error) {
      console.error("Error fetching latest analysis:", error);
    }
  };

  console.log(user);

  useEffect(() => {
    if (!authState.isLoggedIn) {
      navigation.navigate("Login");
    }
    fetchProfile();
    fetchLatest();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {authState.isLoggedIn ? (
          <View>
            {/* Header Section */}
            <View style={styles.header}>
              {/* Back Icon */}
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => router.back()}
              >
                <MaterialIcons name="arrow-back" size={30} color="white" />
              </TouchableOpacity>

              {/* Settings Icon */}
              <TouchableOpacity
                style={styles.iconContainerRight}
                onPress={() => console.log("Go to Settings")}
              >
                <MaterialIcons name="settings" size={30} color="white" />
              </TouchableOpacity>

              {/* Avatar with Edit Icon */}
              <View style={styles.avatarContainer}>
                <AntDesign name="user" size={50} color="#6cbab0" />
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => console.log("Edit Profile Picture")}
                >
                  <MaterialIcons name="camera-alt" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {/* Username  */}
              <View
                style={[styles.usernameWrapper, { flexDirection: "column" }]}
              >
                <BoldText style={styles.username}>
                  {user.firstName + " " + user.lastName} &nbsp;
                </BoldText>
                <Text style={{ color: "#fefefe" }}>(@{user.name})</Text>
              </View>
              <View style={{ color: "#dedede" }}></View>

              {/* Bio Section */}
              <Text style={styles.bio}>
                {profile.location ? profile.location : "Location not set"}
              </Text>
            </View>

            {/* Action Buttons */}
            {/* <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="event" size={24} color="white" />
              <Text style={styles.actionText}>Check-in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="group" size={24} color="white" />
              <Text style={styles.actionText}>Accounts</Text>
            </TouchableOpacity>
          </View> */}

            {/* Latest Analysis Section - Updated with Charts */}
            <View>
              <Text style={styles.sectionTitle}>Latest Analysis</Text>
              {analysisData ? (
                <CounselingCharts analysisData={analysisData} />
              ) : (
                <View style={styles.loadingContainer}>
                  <Text>Loading analysis data...</Text>
                </View>
              )}
            </View>

            {/* Settings List */}
            {/* <TouchableOpacity style={styles.otherSetting}>
              <MaterialIcons name="email" size={24} color="#6cbab0" />
              <Text style={styles.settingText}>Results</Text>
              <Text style={styles.emailText}>{user.email}</Text>
            </TouchableOpacity> */}

            {/* Other Settings */}
            <TouchableOpacity
              style={styles.otherSetting}
              onPress={() => navigation.navigate("Settings")}
            >
              <MaterialIcons name="settings" size={24} color="#6cbab0" />
              <Text style={styles.settingText}>Settings</Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.otherSetting}
              onPress={() => {
                onLogout();
                navigation.navigate("Welcome");
              }}
            >
              <MaterialIcons name="logout" size={24} color="#6cbab0" />
              <Text style={styles.settingText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>You need to be logged in to view this page.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Styles - add the new section title and loading styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  header: {
    backgroundColor: "#6cbab0",
    alignItems: "center",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 1,
  },
  iconContainerRight: {
    position: "absolute",
    top: 20,
    right: 10,
    zIndex: 1,
  },
  avatarContainer: {
    backgroundColor: "white",
    borderRadius: 100,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6cbab0",
    borderRadius: 20,
    padding: 3,
  },
  usernameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  username: {
    fontSize: 18,
    color: "#fff",
  },
  bio: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: "#6cbab0",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
    color: "#6cbab0",
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    margin: 10,
  },
  settingsList: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  registerText: {
    color: "#4CAF50",
    fontSize: 14,
  },
  emailText: {
    color: "#757575",
    fontSize: 14,
  },
  otherSetting: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginTop: 10,
  },
  logoutButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default Profile;
