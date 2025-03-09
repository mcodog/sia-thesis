import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet, Image, Modal, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";

const Diary = () => {
  const navigation = useNavigation();
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { axiosInstanceWithBearer } = useAuth();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const cachedEntries = await AsyncStorage.getItem("diaryEntries");
      if (cachedEntries) {
        setEntries(JSON.parse(cachedEntries));
      }

      const response = await axiosInstanceWithBearer.get("diary/");
      if (Array.isArray(response.data)) {
        setEntries(response.data);
        await AsyncStorage.setItem("diaryEntries", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Failed to load entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (entry.trim() === "") return;

    const newEntry = { text: entry, type: "heart" };

    try {
      const response = await axiosInstanceWithBearer.post("diary/", newEntry);
      setEntries([response.data, ...entries]); 
      await AsyncStorage.setItem("diaryEntries", JSON.stringify([response.data, ...entries]));
      setEntry("");
    } catch (error) {
      console.error("Failed to save entry:", error);
    }
  };

  const handleEntryPress = (entry) => {
    setSelectedEntry(entry);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>🫙 Diary Jar</Text>
      </View>
      <Text style={styles.subtitle}>Take a moment to reflect on every day.</Text>

      <View style={styles.jarContainer}>
        <Image source={require("../../../assets/images/jar.png")} style={styles.jarImage} />
        <View style={styles.entriesOverlay}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff914d" />
          ) : entries.length > 0 ? (
            entries.map((entry, index) => (
              <TouchableOpacity key={index} onPress={() => handleEntryPress(entry)}>
                <Text style={styles.entryIcon}>❤️</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No entries available</Text>
          )}
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Write what you're feeling..."
        multiline
        value={entry}
        onChangeText={setEntry}
      />
      <Button title="Drop in Jar" onPress={handleSave} color="#ff914d" />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Entry</Text>
            {selectedEntry && (
              <>
                <Text style={styles.modalDate}>{new Date(selectedEntry.created_at).toLocaleDateString()}</Text>
                <Text style={styles.modalText}>{selectedEntry.text}</Text>
              </>
            )}
            <Button title="Close" onPress={() => setModalVisible(false)} color="#ff914d" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 16, backgroundColor: "#fef3e6" },
  header: { flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", marginLeft: 10 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 10, marginTop: 55 },
  jarContainer: { position: "relative", alignItems: "center", justifyContent: "center", width: 200, height: 250, marginBottom: 20 },
  jarImage: { width: 600, height: 300, resizeMode: "contain" },
  entriesOverlay: { position: "absolute", width: "100%", height: "100%", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap", padding: 10 },
  entryIcon: { fontSize: 20, margin: 5 },
  input: { height: 100, width: "90%", borderColor: "#ff914d", borderWidth: 2, padding: 8, borderRadius: 10, marginBottom: 10, backgroundColor: "#fff8f2" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: 300, backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalDate: { fontSize: 14, color: "gray", marginBottom: 10 },
  modalText: { fontSize: 16, textAlign: "center", marginBottom: 20 },
});

export default Diary;
