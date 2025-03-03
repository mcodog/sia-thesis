import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-modern-datepicker';
import { getToday } from 'react-native-modern-datepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const generateHourOptions = () => Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const generateMinuteOptions = () => ['00', '15', '30', '45'];

const SleepTracker = ({ onUpdateReport }) => {
    const today = getToday();
    const [selectedDate, setSelectedDate] = useState(today);
    const [sleepHour, setSleepHour] = useState('10');
    const [sleepMinute, setSleepMinute] = useState('00');
    const [sleepPeriod, setSleepPeriod] = useState('PM');
    const [wakeHour, setWakeHour] = useState('06');
    const [wakeMinute, setWakeMinute] = useState('00');
    const [wakePeriod, setWakePeriod] = useState('AM');
    const [sleepData, setsleepData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadsleepData().then(() => setLoading(false));
    }, []);

    const calculateDuration = () => {
        const parseTime = (hour, minute, period) => {
            let h = parseInt(hour, 10);
            let m = parseInt(minute, 10);
            if (period === 'PM' && h !== 12) h += 12;
            if (period === 'AM' && h === 12) h = 0;
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
        const newEntry = {
            id: Date.now(),
            date: selectedDate,
            sleepTime: `${sleepHour}:${sleepMinute} ${sleepPeriod}`,
            wakeTime: `${wakeHour}:${wakeMinute} ${wakePeriod}`,
            duration: calculateDuration(),
        };
    
        try {
            const existingEntryIndex = sleepData.findIndex(entry => entry.date === selectedDate);
            let updatedHistory = [...sleepData];
            if (existingEntryIndex !== -1) {
                updatedHistory[existingEntryIndex] = newEntry;
            } else {
                updatedHistory = [newEntry, ...sleepData]; 
            }
    
            // Sort by date in descending order (latest first)
           
    
            setsleepData(updatedHistory);
            await AsyncStorage.setItem('sleepData', JSON.stringify(updatedHistory));
            console.log("Saved Sleep Data:", JSON.stringify(updatedHistory, null, 2)); // Debug log
            if (onUpdateReport) onUpdateReport(updatedHistory);
        } catch (error) {
            console.error("Error saving sleep history:", error);
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
        const updatedHistory = sleepData.filter(entry => entry.id !== id);
        setsleepData(updatedHistory);
        await AsyncStorage.setItem('sleepData', JSON.stringify(updatedHistory));
        if (onUpdateReport) onUpdateReport(updatedHistory);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Sleep Tracker</Text>
            <DatePicker 
                mode="calendar" 
                current={selectedDate} 
                onDateChange={(date) => setSelectedDate(date)} 
                selected={today}  // Highlights today with a default circle
                options={{
                    selectedTextColor: "#fff",  // Text color inside the circle
                    selectedBackgroundColor: "#388E3C", // Green circle
                }}
/>

            
            <Text style={styles.text}>Sleep Time:</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={sleepHour} onValueChange={setSleepHour} style={styles.picker}>{generateHourOptions().map(hour => <Picker.Item key={hour} label={hour} value={hour} />)}</Picker>
                <Picker selectedValue={sleepMinute} onValueChange={setSleepMinute} style={styles.picker}>{generateMinuteOptions().map(minute => <Picker.Item key={minute} label={minute} value={minute} />)}</Picker>
                <Picker selectedValue={sleepPeriod} onValueChange={setSleepPeriod} style={styles.picker}><Picker.Item label="AM" value="AM" /><Picker.Item label="PM" value="PM" /></Picker>
            </View>

            <Text style={styles.text}>Wake Time:</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={wakeHour} onValueChange={setWakeHour} style={styles.picker}>{generateHourOptions().map(hour => <Picker.Item key={hour} label={hour} value={hour} />)}</Picker>
                <Picker selectedValue={wakeMinute} onValueChange={setWakeMinute} style={styles.picker}>{generateMinuteOptions().map(minute => <Picker.Item key={minute} label={minute} value={minute} />)}</Picker>
                <Picker selectedValue={wakePeriod} onValueChange={setWakePeriod} style={styles.picker}><Picker.Item label="AM" value="AM" /><Picker.Item label="PM" value="PM" /></Picker>
            </View>

            <Text style={styles.text}>Sleep Duration: {calculateDuration()}</Text>
            <Button title="Save Sleep Data" onPress={saveSleepData} color="#66BB6A" />
            
            <Text style={styles.historyTitle}>Sleep History</Text>
                
            {loading ? <Text>Loading...</Text> : (
                <ScrollView style={styles.table} nestedScrollEnabled>
                    {sleepData
                       .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort before rendering
                        .map((entry) => (
                            <View key={entry.id} style={styles.row}>
                                <Text style={styles.cell}>{entry.date}</Text>
                                <Text style={styles.cell}>{entry.sleepTime}</Text>
                                <Text style={styles.cell}>{entry.wakeTime}</Text>
                                <Text style={styles.cell}>{entry.duration}</Text>
                                <TouchableOpacity onPress={() => deleteEntry(entry.id)} style={styles.deleteButton}>
                                    <Text style={styles.deleteText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                </ScrollView>
)}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E0F7FA', padding: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#388E3C', textAlign: 'center', marginBottom: 20 },
    text: { fontSize: 18, fontWeight: '500', color: '#2E7D32', marginBottom: 5 },
    pickerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    picker: { flex: 1, backgroundColor: '#A5D6A7', borderRadius: 10, marginHorizontal: 1 },
    table: { marginTop: 10, borderWidth: 1, borderColor: '#66BB6A' },
    row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#A5D6A7', padding: 5 },
    cell: { flex: 1, textAlign: 'center', fontSize: 15, color: '#1B5E20' },
    deleteButton: { padding: 5 },
    deleteText: { color: 'red', fontWeight: 'bold' },
});

export default SleepTracker;
