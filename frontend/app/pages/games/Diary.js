import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const Diary = () => {
  const navigation = useNavigation();
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);

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
      const newEntries = [{ text: entry, date: new Date().toLocaleString() }, ...entries];
      setEntries(newEntries);
      saveEntries(newEntries);
      setEntry("");
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginLeft: 10 }}>📖 My Diary</Text>
      </View>
      <TextInput
        style={{ height: 100, borderColor: "gray", borderWidth: 1, padding: 8, marginBottom: 10 }}
        placeholder="Write your thoughts here..."
        multiline
        value={entry}
        onChangeText={setEntry}
      />
      <Button title="Save Entry" onPress={handleSave} color="#007BFF" />
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>📜 Previous Entries</Text>
        {entries.length === 0 ? (
          <Text style={{ color: "gray" }}>No entries yet.</Text>
        ) : (
          entries.map((entry, index) => (
            <View key={index} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
              <Text style={{ color: "black" }}>{entry.text}</Text>
              <Text style={{ color: "gray", fontSize: 12 }}>{entry.date}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default Diary;
