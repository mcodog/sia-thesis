import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet, Image, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const Diary = () => {
  const navigation = useNavigation();
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const savedEntries = await AsyncStorage.getItem("diaryEntries");
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    } catch (error) {
      console.error("Failed to load entries", error);
    }
  };

  const saveEntries = async (updatedEntries) => {
    try {
      await AsyncStorage.setItem("diaryEntries", JSON.stringify(updatedEntries));
    } catch (error) {
      console.error("Failed to save entries", error);
    }
  };

  const handleSave = () => {
    if (entry.trim() !== "") {
      const newEntries = [{ text: entry, date: new Date().toLocaleString(), type: getRandomEntryType() }, ...entries];
      setEntries(newEntries);
      saveEntries(newEntries);
      setEntry("");
    }
  };

  const getRandomEntryType = () => {
    const types = ["heart", "leaf", "fish"];
    return types[Math.floor(Math.random() * types.length)];
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
        <Text style={styles.title}>🫙 Dairy Jar</Text>
      </View>
      <Text style={styles.subtitle}>Take a moment to reflect on every day.</Text>
      <View style={styles.jarContainer}>
        <Image source={require("../../../assets/images/jar.png")} style={styles.jarImage} />
        <View style={styles.entriesOverlay}>
          {entries.map((entry, index) => (
            <TouchableOpacity key={index} onPress={() => handleEntryPress(entry)}>
              <Text style={styles.entryIcon}>
                {entry.type === "heart" ? "❤️" : entry.type === "leaf" ? "🍃" : "🐟"}
              </Text>
            </TouchableOpacity>
          ))}
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

      {/* Modal to show entry details */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Entry</Text>
            {selectedEntry && (
              <>
                <Text style={styles.modalDate}>{selectedEntry.date}</Text>
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
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fef3e6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 55,
  },
  jarContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 250,
    marginBottom: 20,
  },
  jarImage: {
    width: 600,
    height: 300,
    resizeMode: "contain",
  },
  entriesOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    padding: 10,
  },
  entryIcon: {
    fontSize: 15,
    margin: 5,
    marginLeft: 25,
  },
  input: {
    height: 100,
    width: "90%",
    borderColor: "#ff914d",
    borderWidth: 2,
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff8f2",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDate: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Diary;