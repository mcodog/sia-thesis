import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector } from "react-redux";

const Profile = () => {
  const { onLogout } = useAuth();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);

  console.log(user);

  return (
    <View style={styles.container}>
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
          <AntDesign name="user" size={50} color="#8ee8d0" />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => console.log("Edit Profile Picture")}
          >
            <MaterialIcons name="camera-alt" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Username  */}
        <View style={styles.usernameWrapper}>
          <Text style={styles.username}>{user.name}</Text>
        </View>

        {/* Bio Section */}
        <Text style={styles.bio}>
          This is the bio section. You can add a short description here.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="event" size={24} color="white" />
          <Text style={styles.actionText}>Check-in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="group" size={24} color="white" />
          <Text style={styles.actionText}>Accounts</Text>
        </TouchableOpacity>
      </View>

      {/* Settings List */}
      <TouchableOpacity style={styles.otherSetting}>
        <MaterialIcons name="email" size={24} color="#8ee8d0" />
        <Text style={styles.settingText}>Email</Text>
        <Text style={styles.emailText}>{user.email}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.otherSetting}>
        <MaterialIcons name="lock" size={24} color="#8ee8d0" />
        <Text style={styles.settingText}>Update Password</Text>
      </TouchableOpacity>

      {/* Other Settings */}
      <TouchableOpacity style={styles.otherSetting}>
        <MaterialIcons name="settings" size={24} color="#8ee8d0" />
        <Text style={styles.settingText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.otherSetting}>
        <MaterialIcons name="support-agent" size={24} color="#8ee8d0" />
        <Text style={styles.settingText}>Support</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.otherSetting} onPress={onLogout}>
        <MaterialIcons name="logout" size={24} color="#8ee8d0" />
        <Text style={styles.settingText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Light green background
    padding: 16,
  },
  header: {
    backgroundColor: "#8ee8d0",
    alignItems: "center",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: "relative", // Allow absolute positioning of icons
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
    position: "relative", // For absolute positioning of the edit icon
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8ee8d0", // Semi-transparent background
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
    fontWeight: "bold",
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
    backgroundColor: "#8ee8d0",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    marginTop: 5,
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
