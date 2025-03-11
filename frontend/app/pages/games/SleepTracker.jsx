import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "react-native-modern-datepicker";
import { getToday } from "react-native-modern-datepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const generateHourOptions = () =>
  Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const generateMinuteOptions = () => ["00", "15", "30", "45"];

const SleepTracker = ({ onUpdateReport }) => {
  const today = getToday(); // Returns a string in "YYYY/MM/DD" format
  const [selectedDate, setSelectedDate] = useState(today);
  const [isOpen, setIsOpen] = useState(false);

  const [sleepHour, setSleepHour] = useState("10");
  const [sleepMinute, setSleepMinute] = useState("00");
  const [sleepPeriod, setSleepPeriod] = useState("PM");
  const [wakeHour, setWakeHour] = useState("06");
  const [wakeMinute, setWakeMinute] = useState("00");
  const [wakePeriod, setWakePeriod] = useState("AM");

  const [sleepData, setSleepData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axiosInstanceWithBearer } = useAuth();

  useEffect(() => {
    loadSleepData().then(() => setLoading(false));
  }, []);

  const calculateDuration = () => {
    const parseTime = (hour, minute, period) => {
      let h = parseInt(hour, 10);
      let m = parseInt(minute, 10);
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return h * 60 + m;
    };
    let sleepMinutes = parseTime(sleepHour, sleepMinute, sleepPeriod);
    let wakeMinutes = parseTime(wakeHour, wakeMinute, wakePeriod);
    if (wakeMinutes < sleepMinutes) wakeMinutes += 24 * 60;
    const durationMinutes = wakeMinutes - sleepMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const saveSleepData = async () => {
    try {
      const formattedDate = selectedDate.replace(/\//g, "-"); // Fixes date format to "YYYY-MM-DD"

      const response = await axiosInstanceWithBearer.post("/sleep-tracker/", {
        date: formattedDate, // ✅ Now correctly formatted
        sleep_time: `${sleepHour}:${sleepMinute} ${sleepPeriod}`,
        wake_time: `${wakeHour}:${wakeMinute} ${wakePeriod}`,
        duration: calculateDuration(),
      });

      console.log("Sleep data saved successfully:", response.data);
      loadSleepData();
    } catch (error) {
      console.error(
        "Error saving sleep history:",
        error.response?.data || error
      );
    }
  };

  const loadsleepData = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem("sleepData");
      console.log("Loaded Sleep Data:", storedHistory); // Debug log
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        // Sort by date in descending order (latest first)
        parsedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
        setsleepData(parsedHistory);
      }
    } catch (error) {
      console.error("Error loading sleep history:", error);
    }
  };

  const deleteEntry = async (id) => {
    const updatedHistory = sleepData.filter((entry) => entry.id !== id);
    setsleepData(updatedHistory);
    await AsyncStorage.setItem("sleepData", JSON.stringify(updatedHistory));
    if (onUpdateReport) onUpdateReport(updatedHistory);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sleep Tracker</Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Selected Date: {selectedDate}
      </Text>

      {/* Date Picker */}
      <DatePicker
        mode="calendar"
        selected={selectedDate}
        onDateChange={(date) => setSelectedDate(date)} // ✅ Updates selectedDate
        options={{
          backgroundColor: "#fff",
          textHeaderColor: "#66BB6A",
          textDefaultColor: "#000",
          selectedTextColor: "#fff",
          mainColor: "#66BB6A",
          textSecondaryColor: "#aaa",
        }}
      />

      <Text style={styles.text}>Sleep Time:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sleepHour}
          onValueChange={setSleepHour}
          style={styles.picker}
        >
          {generateHourOptions().map((hour) => (
            <Picker.Item key={hour} label={hour} value={hour} />
          ))}
        </Picker>
        <Picker
          selectedValue={sleepMinute}
          onValueChange={setSleepMinute}
          style={styles.picker}
        >
          {generateMinuteOptions().map((minute) => (
            <Picker.Item key={minute} label={minute} value={minute} />
          ))}
        </Picker>
        <Picker
          selectedValue={sleepPeriod}
          onValueChange={setSleepPeriod}
          style={styles.picker}
        >
          <Picker.Item label="AM" value="AM" />
          <Picker.Item label="PM" value="PM" />
        </Picker>
      </View>

      <Text style={styles.text}>Wake Time:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={wakeHour}
          onValueChange={setWakeHour}
          style={styles.picker}
        >
          {generateHourOptions().map((hour) => (
            <Picker.Item key={hour} label={hour} value={hour} />
          ))}
        </Picker>
        <Picker
          selectedValue={wakeMinute}
          onValueChange={setWakeMinute}
          style={styles.picker}
        >
          {generateMinuteOptions().map((minute) => (
            <Picker.Item key={minute} label={minute} value={minute} />
          ))}
        </Picker>
        <Picker
          selectedValue={wakePeriod}
          onValueChange={setWakePeriod}
          style={styles.picker}
        >
          <Picker.Item label="AM" value="AM" />
          <Picker.Item label="PM" value="PM" />
        </Picker>
      </View>

      <Text style={styles.text}>Sleep Duration: {calculateDuration()}</Text>
      <Button title="Save Sleep Data" onPress={saveSleepData} color="#66BB6A" />

      <Text style={styles.historyTitle}>Sleep History</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView style={styles.table} nestedScrollEnabled>
          <View style={styles.row}>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Sleep Time</Text>
            <Text style={styles.headerCell}>Wake Time</Text>
            <Text style={styles.headerCell}>Duration</Text>
          </View>
          {sleepData.length > 0 ? (
            sleepData.map((entry) => (
              <View key={entry.id} style={styles.row}>
                <Text style={styles.cell}>{entry.date}</Text>
                <Text style={styles.cell}>{entry.sleep_time}</Text>
                <Text style={styles.cell}>{entry.wake_time}</Text>
                <Text style={styles.cell}>{entry.duration}</Text>
              </View>
            ))
          ) : (
            <Text>No sleep history found.</Text>
          )}
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  pickerContainer: { flexDirection: "row" },
  picker: { flex: 1 },
  table: { marginTop: 10, borderWidth: 1, marginBottom: 20 },
  row: { flexDirection: "row", borderBottomWidth: 1, padding: 5 },
  cell: { flex: 1, textAlign: "center" },
  headerCell: { flex: 1, fontWeight: "bold", textAlign: "center" },
});

export default SleepTracker;
