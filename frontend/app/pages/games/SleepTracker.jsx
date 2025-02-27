import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { format, differenceInSeconds } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { DataTable } from "react-native-paper";

const SleepTracker = () => {
  const navigation = useNavigation();
  const [sleepStart, setSleepStart] = useState(null);
  const [sleepDuration, setSleepDuration] = useState({ hours: 0, minutes: 0 });
  const [wakeUpTime, setWakeUpTime] = useState(null);
  const [isSleeping, setIsSleeping] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [sleepHistory, setSleepHistory] = useState([]);

  useEffect(() => {
    const loadSleepData = async () => {
      const savedSleepStart = await AsyncStorage.getItem("sleepStart");
      const savedDuration = await AsyncStorage.getItem("sleepDuration");
      const savedHistory = await AsyncStorage.getItem("sleepHistory");

      if (savedHistory) {
        setSleepHistory(JSON.parse(savedHistory));
      }

      if (savedSleepStart && savedDuration) {
        const parsedStart = new Date(savedSleepStart);
        const parsedDuration = JSON.parse(savedDuration);
        const calculatedWakeUp = new Date(parsedStart);
        calculatedWakeUp.setHours(parsedStart.getHours() + parsedDuration.hours);
        calculatedWakeUp.setMinutes(parsedStart.getMinutes() + parsedDuration.minutes);

        setSleepStart(parsedStart.toISOString());
        setSleepDuration(parsedDuration);
        setWakeUpTime(calculatedWakeUp);
        setIsSleeping(true);
      }
    };
    loadSleepData();
  }, []);

  useEffect(() => {
    if (wakeUpTime && isSleeping) {
      const updateRemainingTime = () => {
        const remaining = differenceInSeconds(wakeUpTime, new Date());
        setRemainingTime(remaining > 0 ? remaining : 0);
        if (remaining <= 0) stopSleep();
      };
      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 1000);
      return () => clearInterval(interval);
    }
  }, [wakeUpTime, isSleeping]);

  const startSleep = async () => {
    if (isSleeping) {
      Alert.alert("Sleep in Progress", "You are already tracking sleep.");
      return;
    }
    if (sleepDuration.hours === 0 && sleepDuration.minutes === 0) {
      Alert.alert("Error", "Please set a sleep duration before starting.");
      return;
    }

    const startTime = new Date();
    const wakeUp = new Date(startTime);
    wakeUp.setHours(startTime.getHours() + sleepDuration.hours);
    wakeUp.setMinutes(startTime.getMinutes() + sleepDuration.minutes);

    setSleepStart(startTime.toISOString());
    setWakeUpTime(wakeUp);
    setIsSleeping(true);

    await AsyncStorage.setItem("sleepStart", startTime.toISOString());
    await AsyncStorage.setItem("sleepDuration", JSON.stringify(sleepDuration));
    await AsyncStorage.setItem("notification", "Sleep tracking started! ⏳");

    Alert.alert("Sleep Tracking Started", `You will wake up at ${format(wakeUp, "p")}`);
  };

  const stopSleep = async () => {
    if (!sleepStart || !wakeUpTime) return;

    const newEntry = {
      date: format(new Date(sleepStart), "yyyy-MM-dd"),
      startTime: format(new Date(sleepStart), "p"),
      wakeUpTime: format(new Date(wakeUpTime), "p"),
      duration: `${sleepDuration.hours}h ${sleepDuration.minutes}m`,
    };

    const updatedHistory = [newEntry, ...sleepHistory];
    setSleepHistory(updatedHistory);
    await AsyncStorage.setItem("sleepHistory", JSON.stringify(updatedHistory));

    setSleepStart(null);
    setWakeUpTime(null);
    setIsSleeping(false);

    await AsyncStorage.removeItem("sleepStart");
    await AsyncStorage.removeItem("sleepDuration");
    await AsyncStorage.setItem("notification", "Sleep duration is finished! Click to stop the alarm.");

    Alert.alert("Sleep Tracking Stopped", "Time to wake up! ☀️");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Sleep Tracker</Text>

      {isSleeping ? (
        <Text style={styles.timerText}>Remaining Time: {remainingTime}s</Text>
      ) : (
        <>
          <Text style={styles.label}>Set Sleep Duration:</Text>
          <View style={styles.pickerContainer}>
          <Text>Hours</Text>
            <Picker
              selectedValue={sleepDuration.hours}
              style={styles.picker}
              onValueChange={(value) => setSleepDuration({ ...sleepDuration, hours: value })}
            >
              {[...Array(12).keys()].map((hour) => (
                <Picker.Item key={hour} label={`${hour} hr`} value={hour} />
              ))}
            </Picker>
            <Text>Minutes</Text>
            <Picker
              selectedValue={sleepDuration.minutes}
              style={styles.picker}
              onValueChange={(value) => setSleepDuration({ ...sleepDuration, minutes: value })}
            >
              {[0, 5, 10, 15, 30, 45].map((minute) => (
                <Picker.Item key={minute} label={`${minute} min`} value={minute} />
              ))}
            </Picker>
          </View>
          <Button title="Start Sleep" onPress={startSleep} disabled={isSleeping} color="#4CAF50" />
        </>
      )}

<Text style={styles.historyTitle}>Sleep History</Text>
      <ScrollView horizontal>
        <DataTable style={styles.dataTable}>
          <DataTable.Header style={styles.dataTableHeader}>
            <DataTable.Title textStyle={styles.headerText}>Full Date</DataTable.Title>
            <DataTable.Title textStyle={styles.headerText}>                             Start</DataTable.Title>
            <DataTable.Title textStyle={styles.headerText}>             Wake Up</DataTable.Title>
            <DataTable.Title textStyle={styles.headerText}>     Duration</DataTable.Title>
          </DataTable.Header>
          {sleepHistory.map((entry, index) => (
            <DataTable.Row key={index} style={[styles.dataTableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
              <DataTable.Cell textStyle={styles.cellText}> {format(new Date(entry.date), "PPP")} </DataTable.Cell>
              <DataTable.Cell textStyle={styles.cellText}> {entry.startTime} </DataTable.Cell>
              <DataTable.Cell textStyle={styles.cellText}> {entry.wakeUpTime} </DataTable.Cell>
              <DataTable.Cell textStyle={styles.cellText}> {entry.duration} </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#E8F5E9" },
  backButton: { position: "absolute", top: 10, left: 10 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#2E7D32" },
  pickerContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginBottom: 10, 
    backgroundColor: "#C8E6C9", // Softer green background
    padding: 5, 
    borderRadius: 10,
    
  },
  picker: { 
    width: 120, 
    color: "#1B5E20" // Deep green text
  },
  timerText: { 
    fontSize: 18, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginVertical: 10, 
    color: "#388E3C" // Medium green text
  },
  button: { 
    backgroundColor: "#66BB6A", // Lighter green button
    padding: 10, 
    borderRadius: 8, 
    alignItems: "center", 
    marginVertical: 10
  },
  historyTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, color: "#388E3C" },
  dataTable: { backgroundColor: "#C8E6C9", borderRadius: 10, padding: 10 },
  dataTableHeader: { backgroundColor: "#A5D6A7", borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  dataTableRow: { borderBottomWidth: 1, borderBottomColor: "#C8E6C9" },
  evenRow: { backgroundColor: "#E8F5E9" },
  oddRow: { backgroundColor: "#C8E6C9" },
  headerText: { fontWeight: "bold", color: "#1B5E20" },
  cellText: { fontSize: 14, color: "#2E7D32" }
});

export default SleepTracker;
