import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { format, parseISO } from 'date-fns';
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const WeeklyWellnessReport = () => {
  const [moodCounts, setMoodCounts] = useState({});
  const navigation = useNavigation();
  const [sleepData, setSleepData] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [sleepAnalysis, setSleepAnalysis] = useState("");

  useEffect(() => {
    loadSleepData();
    loadMoodData();
  }, []);

  const loadSleepData = async () => {
    try {
        const storedData = await AsyncStorage.getItem('sleepData');
        if (storedData) {
            setSleepData(JSON.parse(storedData));
        }
    } catch (error) {
        console.error('Error loading sleep data:', error);
    }
};

const dataPoints = sleepData.map(entry => {
  const [hours, minutes] = entry.duration.split('h ').map(num => parseInt(num, 10) || 0);
  return hours + minutes / 60; // Convert duration to decimal hours
});

  const loadMoodData = async () => {
    const moodData = await AsyncStorage.getItem('moodHistory');
    if (moodData) {
      const parsedMoodLogs = JSON.parse(moodData);
      processMoodData(parsedMoodLogs);
    }
  };

  const processMoodData = (logs) => {
    const counts = logs.reduce((acc, log) => {
      acc[log.mood.mood] = (acc[log.mood.mood] || 0) + 1;
      return acc;
    }, {});
    setMoodCounts(counts);
  };

  const labels = sleepData.map(entry => entry.date.slice(5)); // Show MM/DD format

  const getSleepMessage = (duration) => {
      if (duration >= 8 && duration <= 10) {
          return "Good sleep: 8-10 hours is ideal. Keep it up!";
      } else if (duration > 10) {
          return "Oversleeping: More than 10 hours is not healthy. Try to maintain a balanced schedule!";
      } else {
          return "Lack of sleep: Less than 8 hours is insufficient. Prioritize your rest for better health!";
      }
  };

  const analyzeSleepTrend = () => {
    if (sleepData.length < 6) return "Not enough data to analyze trends.";

    let improving = 0;
    let declining = 0;

    for (let i = 1; i < sleepData.length; i++) {
        const prev = parseFloat(sleepData[i - 1].duration);
        const current = parseFloat(sleepData[i].duration);
        if (current > prev) improving++;
        else if (current < prev) declining++;
    }

    if (improving > declining) {
        return "Your sleep is improving! Keep up the good habits.";
    } else if (declining > improving) {
        return "Your sleep is decreasing. Try to get more consistent rest.";
    } else {
        return "Your sleep pattern is stable, but ensure it's within the recommended range.";
    }
};

  const handleDataPointClick = ({ index }) => {
    const entry = sleepData[index];
    setSelectedEntry(entry);
    Alert.alert("Sleep Details", `Date: ${entry.date}\nSleep Time: ${entry.sleepTime}\nWake Time: ${entry.wakeTime}\nDuration: ${entry.duration} \n${getSleepMessage(parseFloat(entry.duration))} \n"Rest is the best investment for a productive tomorrow!"`);
};

  const pieData = Object.keys(moodCounts).map((key, index) => ({
    name: key,
    count: moodCounts[key],
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index % 5],
    legendFontColor: '#000',
    legendFontSize: 14,
  }));

  return (
    <ScrollView>
      <View style={styles.container}>   
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Weekly Wellness Report</Text>
        </View>
        
        <ScrollView>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mood Distribution (Past 7 Days)</Text>
            {pieData.length > 0 ? (
              <PieChart
                data={pieData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: '#E8F5E9',
                  backgroundGradientFrom: '#E8F5E9',
                  backgroundGradientTo: '#C8E6C9',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                hasLegend
              />
            ) : (
              <Text style={styles.noDataText}>No mood data available for the past week.</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sleep Duration Report</Text>
            <ScrollView horizontal>
              {sleepData.length > 0 ? (
                  <LineChart
                      data={{
                          labels,
                          datasets: [{ data: dataPoints }],
                      }}
                      width={Dimensions.get('window').width - 20}
                      height={250}
                      yAxisSuffix="h"
                      chartConfig={{
                          backgroundGradientFrom: '#AFE1AF',
                          backgroundGradientTo: '#50C878',
                          color: (opacity = 1) => `rgba(2, 48, 32, ${opacity})`,
                          strokeWidth: 2,
                          decimalPlaces: 1,
                      }}
                      bezier
                      onDataPointClick={handleDataPointClick}
                  />
                  
              ) : (
                  <Text style={{ textAlign: 'center', marginTop: 20 }}>No data available</Text>
              )}
            </ScrollView>
            <Text style={{ textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>{analyzeSleepTrend()}</Text>
          </View>
        </ScrollView>
      </View>  
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F5E9', // Light green background
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32', // Dark green title
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Adds shadow for Android
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    marginVertical: 10,
  },
  analysisText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginVertical: 10,
    fontStyle: 'italic',
  },
});

export default WeeklyWellnessReport;