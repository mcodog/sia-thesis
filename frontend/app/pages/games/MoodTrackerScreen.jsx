import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

const moods = [
  { animation: require("../../../assets/images/animations/happy.json"), mood: "Happy" },
  { animation: require("../../../assets/images/animations/sad.json"), mood: "Sad" },
  { animation: require("../../../assets/images/animations/angry.json"), mood: "Angry" },
  { animation: require("../../../assets/images/animations/anxious.json"), mood: "Anxious" },
  { animation: require("../../../assets/images/animations/tired.json"), mood: "Tired" },
  { animation: require("../../../assets/images/animations/relax.json"), mood: "Relaxed" }
];

const MoodTrackerScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [reason, setReason] = useState("");
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const saveMood = async () => {
    if (!selectedMood) return;

    const newEntry = {
      mood: selectedMood,
      reason,
      date: new Date().toISOString(),
      time: new Date().toLocaleTimeString(),
    };

    const updatedHistory = [newEntry, ...moodHistory];

    setMoodHistory(updatedHistory);
    await AsyncStorage.setItem("moodHistory", JSON.stringify(updatedHistory));

    setSelectedMood(null);
    setReason("");
  };

  const loadMoodHistory = async () => {
    const savedHistory = await AsyncStorage.getItem("moodHistory");
    if (savedHistory) {
      setMoodHistory(JSON.parse(savedHistory));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>

      {!selectedMood ? (
        <View style={styles.moodSelector}>
          {moods.map((mood) => (
            <TouchableOpacity key={mood.mood} onPress={() => setSelectedMood(mood)} style={styles.moodButton}>
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
      <FlatList
        data={moodHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.moodItem}>
            <LottieView source={item.mood.animation} autoPlay loop style={styles.smallMoodAnimation} />
            <Text style={styles.moodText}>{item.mood.mood}</Text>
            <Text>🕒 {item.time} 📅 {new Date(item.date).toLocaleDateString()}</Text>
            {item.reason ? <Text>📝 {item.reason}</Text> : null}
          </View>
        )}
      />

      <TouchableOpacity style={styles.clearButton} onPress={async () => {
        await AsyncStorage.removeItem("moodHistory");
        setMoodHistory([]);
      }}>
        <Text style={styles.clearButtonText}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#D4EDDA" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#388E3C" },
  moodSelector: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 20 },
  moodButton: { alignItems: "center", margin: 10, padding: 20, backgroundColor: "#A5D6A7", borderRadius: 50, elevation: 5 },
  smallMoodAnimation: { width: 30, height: 30 },
  moodText: { fontSize: 14, fontWeight: "bold", marginTop: 5, color: "#2E7D32" },
  reasonContainer: { alignItems: "center", marginTop: 20 },
  selectedMoodText: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#2E7D32" },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 10, backgroundColor: "#E8F5E9", width: "100%" },
  saveButton: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 10, marginTop: 10 },
  saveButtonText: { color: "white", fontSize: 16, textAlign: "center", fontWeight: "bold" },
  historyTitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, color: "#1B5E20" },
  moodItem: { alignItems: "center", padding: 15, backgroundColor: "#C8E6C9", marginVertical: 5, borderRadius: 10 },
  clearButton: { backgroundColor: "#D32F2F", padding: 12, borderRadius: 10, marginTop: 10 },
  clearButtonText: { color: "white", fontSize: 16, textAlign: "center", fontWeight: "bold" },
});

export default MoodTrackerScreen;