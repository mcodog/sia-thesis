import React, { useState, useEffect } from "react";
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, 
  TextInput, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { useAuth } from "../../../context/AuthContext";

const moods = [
  { animation: require("../../../assets/images/animations/happy.json"), mood: "Happy" },
  { animation: require("../../../assets/images/animations/sad.json"), mood: "Sad" },
  { animation: require("../../../assets/images/animations/angry.json"), mood: "Angry" },
  { animation: require("../../../assets/images/animations/anxious.json"), mood: "Anxious" },
  { animation: require("../../../assets/images/animations/tired.json"), mood: "Tired" },
  { animation: require("../../../assets/images/animations/relax.json"), mood: "Relaxed" },
  { animation: require("../../../assets/images/animations/content.json"), mood: "Calm" }
];

const MoodTrackerScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [reason, setReason] = useState("");
  const [moodEntries, setMoodEntries] = useState([]);
  const { axiosInstanceWithBearer, user } = useAuth();

  useEffect(() => {
    fetchMoodEntries();
  }, [user]);

  const saveMood = async () => {
    if (!selectedMood || !user) return;

    const newEntry = {
      mood: selectedMood.mood,
      reason,
      timestamp: new Date().toISOString(),
      userId: user.id,
    };

    try {
      await axiosInstanceWithBearer.post("/mood-tracker/", newEntry);
      const existingMoods = await AsyncStorage.getItem("moodEntries");
      const parsedMoods = existingMoods ? JSON.parse(existingMoods) : [];
      
      const updatedEntries = Array.isArray(parsedMoods) 
        ? [newEntry, ...parsedMoods.filter(entry => entry.userId === user.id)]
        : [newEntry];
      
      await AsyncStorage.setItem("moodEntries", JSON.stringify(updatedEntries));
      setMoodEntries(updatedEntries);
      setSelectedMood(null);
      setReason("");
    } catch (error) {
      console.error("Error saving mood:", error.response ? error.response.data : error);
    }
  };

  const fetchMoodEntries = async () => {
    try {
      const storedMoods = await AsyncStorage.getItem("moodEntries");
      if (storedMoods) {
        const parsedMoods = JSON.parse(storedMoods);
        if (Array.isArray(parsedMoods)) {
          const filteredMoods = parsedMoods.filter(entry => entry.userId === user?.id);
          setMoodEntries(filteredMoods);
        } else {
          setMoodEntries([]);
        }
      }
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      {!selectedMood ? (
        <View style={styles.moodSelector}>
          {moods.map((mood) => (
            <TouchableOpacity 
              key={mood.mood} 
              onPress={() => setSelectedMood(mood)} 
              style={[styles.moodButton, selectedMood?.mood === mood.mood && styles.selectedMoodButton]}
            >
              <LottieView source={mood.animation} autoPlay loop style={styles.smallMoodAnimation} />
              <Text style={styles.moodText}>{mood.mood}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.reasonContainer}>
          <Text style={styles.selectedMoodText}>You selected:</Text>
          <LottieView source={selectedMood.animation} autoPlay loop style={styles.smallMoodAnimation} />
          <Text style={styles.moodText}>{selectedMood.mood}</Text>
          <TextInput
            style={styles.input}
            placeholder="Why do you feel this way?"
            value={reason}
            onChangeText={setReason}
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveMood}>
            <Text style={styles.saveButtonText}>Save Mood</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.historyTitle}>Mood History</Text>
      {moodEntries.length === 0 ? (
        <Text style={styles.noDataText}>No mood entries yet.</Text>
      ) : (
        <FlatList
          data={moodEntries}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.moodItem}>
              <Text style={styles.moodText}>Mood: {item.mood || "Unknown"}</Text>
              <Text style={styles.moodText}>Reason: {item.reason || "N/A"}</Text>
              <Text style={styles.moodText}>Date: {new Date(item.timestamp).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#D4EDDA" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#388E3C" },
  moodSelector: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 20 },
  moodButton: { alignItems: "center", margin: 10, padding: 20, backgroundColor: "#A5D6A7", borderRadius: 50 },
  selectedMoodButton: { borderColor: "#2E7D32", borderWidth: 3, backgroundColor: "#81C784" },
  smallMoodAnimation: { width: 30, height: 30 },
  moodText: { fontSize: 14, fontWeight: "bold", marginTop: 5, color: "#2E7D32" },
  reasonContainer: { alignItems: "center", marginTop: 20 },
  selectedMoodText: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#2E7D32" },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 10, backgroundColor: "#E8F5E9", width: "100%" },
  saveButton: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 10, marginTop: 10 },
  saveButtonText: { color: "white", fontSize: 16, textAlign: "center", fontWeight: "bold" }
});

export default MoodTrackerScreen;
