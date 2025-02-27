import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationBell = () => {
  const navigation = useNavigation();
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    const checkNotification = async () => {
      const notification = await AsyncStorage.getItem("notification");
      setHasNotification(notification && notification !== "No new notifications");
    };

    checkNotification();
    const interval = setInterval(checkNotification, 5000); // Check every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
      <AntDesign 
        name="bells"
        size={20}
        color={hasNotification ? "red" : "black"} // Red if there's a notification
        style={{ marginRight: 15 }}
      />
    </TouchableOpacity>
  );
};

export default NotificationBell;
