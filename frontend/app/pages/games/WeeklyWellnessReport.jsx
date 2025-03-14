import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, PieChart, BarChart  } from 'react-native-chart-kit';
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from 'expo-router';
import { useAuth } from "../../../context/AuthContext";

const screenWidth = Dimensions.get("window").width;

const WeeklyWellnessReport = () => {
  const [moodCounts, setMoodCounts] = useState({});
  const [analysis, setAnalysis] = useState("");
  const navigation = useNavigation();
  const [sleepData, setSleepData] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [sleepAnalysis, setSleepAnalysis] = useState("");
  const [breathingData, setBreathingData] = useState({});
  const router = useRouter();
  const { user, axiosInstanceWithBearer } = useAuth();
  
  useEffect(() => {
    loadSleepData();
    loadBreathingHistory();
  }, []);

  useEffect(() => {
    loadMoodData();
  }, [user]);
  

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

console.log("Sleep Data:", sleepData);


const dataPoints = sleepData.map(entry => {
  if (!entry.duration) return 0; // Default to 0 if duration is missing
  const [hours, minutes] = entry.duration.split('h ').map(num => parseInt(num, 10) || 0);
  return hours + minutes / 60;
});

console.log("breath data:", breathingData);
console.log("mood data:", moodCounts);

const loadMoodData = async () => {
  try {
    const storedMoods = await AsyncStorage.getItem("moodEntries");
    if (storedMoods) {
      const parsedMoods = JSON.parse(storedMoods);
      if (Array.isArray(parsedMoods)) {
        const userMoods = parsedMoods.filter(entry => entry.userId === user?.id);
        processMoodData(userMoods);
      }
    }
  } catch (error) {
    console.error("Error loading mood data:", error);
  }
};



const processMoodData = (moods) => {
  const moodFrequency = {};
  moods.forEach(entry => {
    if (entry.mood) {
      moodFrequency[entry.mood] = (moodFrequency[entry.mood] || 0) + 1;
    }
  });
  setMoodCounts(moodFrequency);
  analyzeMoodData(moodFrequency);
};

const analyzeMoodData = (moodCounts) => {
  const totalMoods = Object.values(moodCounts).reduce((a, b) => a + b, 0);
  if (totalMoods === 0) {
    setAnalysis("No sufficient data for analysis.");
    return;
  }

  const moodThreshold = (mood) => (moodCounts[mood] || 0) / totalMoods;

  if (moodThreshold("Sad") > 0.4 || moodThreshold("Anxious") > 0.4 || moodThreshold("Angry") > 0.3) {
    setAnalysis("You may be experiencing stress or emotional distress. Consider relaxation techniques or seeking support.");
  } else if (moodThreshold("Happy") > 0.5 || moodThreshold("Calm") > 0.5 || moodThreshold("Relaxed") > 0.4) {
    setAnalysis("You're experiencing a positive emotional state. Keep up the good habits that contribute to your well-being.");
  } else if (moodThreshold("Tired") > 0.5) {
    setAnalysis("You might be feeling exhausted. Ensure you get enough rest and manage your workload.");
  } else {
    setAnalysis("Your mood appears balanced. Continue monitoring your emotions and maintaining self-care practices.");
  }
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

  if (!entry) {
      Alert.alert("Error", "Sleep entry not found.");
      return;
  }

  // Ensure correct keys
  const sleepTime = entry.sleepTime || entry.sleep_time || "Unknown";
  const wakeTime = entry.wakeTime || entry.wake_time || "Unknown";
  const duration = entry.duration || "Unknown";

  Alert.alert(
      "Sleep Details",
      `Date: ${entry.date || "Unknown"}\n` +
      `Sleep Time: ${sleepTime}\n` +
      `Wake Time: ${wakeTime}\n` +
      `Duration: ${duration}\n` +
      `${getSleepMessage(parseFloat(duration) || 0)}\n\n` +
      `"Rest is the best investment for a productive tomorrow!"`
  );
};


const chartData = Object.keys(moodCounts).map((mood, index) => ({
  name: mood,
  count: moodCounts[mood],
  color: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9F40"][index % 5],
  legendFontColor: "#7F7F7F",
  legendFontSize: 12,
}));

  const loadBreathingHistory = async () => {
    try {
      const response = await axiosInstanceWithBearer.get('/api/breathing-sessions/'); 
      if (response.status === 200) {
        const apiHistory = response.data.map((session) => ({
          date: new Date(session.timestamp).toISOString().split('T')[0], // Format date YYYY-MM-DD
        }));
  
        // Save to AsyncStorage for offline use
        await AsyncStorage.setItem('breathingHistory', JSON.stringify(apiHistory));
  
        // Process and update state
        const groupedData = groupByDay(apiHistory);
        setBreathingData(groupedData);
      }
    } catch (error) {
      console.error('Error fetching breathing history:', error);
    }
  };
  

  const groupByDay = (history) => {
    const grouped = {};
    history.forEach((entry) => {
      const date = entry.date;
      grouped[date] = (grouped[date] || 0) + 1; // Count occurrences per day
    });
    return grouped;
  };
  

  const chartDatas = {
    labels: Object.keys(breathingData),
    datasets: [{ data: Object.values(breathingData) }],
  };
  

  const interpretBreathingData = (count) => {
    if (count === 0) 
      return "Mababang relaxation activity. Maaring hindi mo pa nakasanayan o hindi mo pa kailangan mag-relax ngayon.";
    if (count >= 1 && count <= 4) 
      return "Moderate stress management. Ginagamit mo ito bilang paraan para kumalma sa ilang stressful moments.";
    if (count >= 5 && count <= 7) 
      return "High stress o intentional relaxation. Marahil ay mataas ang stress level mo o ginagawa mo ito bilang habit.";
    return "Possible anxiety o extreme relaxation practice. Kung sobra-sobra ito, baka kailangan mong tingnan ang iyong stress levels.";
  };

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
            {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: "#f5f5f5",
            backgroundGradientFrom: "#f5f5f5",
            backgroundGradientTo: "#f5f5f5",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      ) : (
        <Text style={styles.noDataText}>No mood data available.</Text>
      )}
            <Text style={styles.analysisText}>{analysis}</Text>
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

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Breathing Sessions Per </Text>
            <ScrollView horizontal>
                {Object.keys(breathingData).length > 0 ? (
                  <BarChart
                    data={chartDatas}
                    width={Dimensions.get('window').width - 40}
                    height={300}
                    yAxisLabel=""
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#e3f2fd',
                      backgroundGradientTo: '#90caf9',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(30, 136, 229, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    style={styles.chart}
                  />
                ) : (
                  <Text style={styles.noDataText}>No breathing data available.</Text>
                )}
            </ScrollView>
            <Text style={{ textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>
                {chartDatas.datasets[0].data.length > 0
                  ? interpretBreathingData(Math.max(...chartDatas.datasets[0].data))
                  : "Wala pang sapat na datos para sa analysis."}
            </Text>
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
  analysisText: { fontSize: 18, marginTop: 20, textAlign: "center", color: "#2E7D32", fontWeight: "bold" },
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