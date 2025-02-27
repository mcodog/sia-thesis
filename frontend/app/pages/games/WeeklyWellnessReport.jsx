import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { format, parseISO } from 'date-fns';
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const WeeklyWellnessReport = () => {
  const [moodCounts, setMoodCounts] = useState({});
  const navigation = useNavigation();
  const [sleepHistory, setSleepHistory] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], data: [] });

  useEffect(() => {
    const loadSleepHistory = async () => {
      const savedHistory = await AsyncStorage.getItem("sleepHistory");
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setSleepHistory(parsedHistory);
        prepareChartData(parsedHistory);
      }
    };
    loadSleepHistory();
    loadMoodData();
  }, []);

  const prepareChartData = (history) => {
    const labels = history.map((entry) => entry.date).reverse();
    const data = history.map((entry) => {
      const durationParts = entry.duration.split("h ");
      const hours = parseInt(durationParts[0], 10);
      const minutes = durationParts[1] ? parseInt(durationParts[1].replace("m", ""), 10) : 0;
      return hours + minutes / 60;
    }).reverse();
  
    const formattedData = history.map((entry) => {
      const durationParts = entry.duration.split("h ");
      const hours = parseInt(durationParts[0], 10);
      const minutes = durationParts[1] ? parseInt(durationParts[1].replace("m", ""), 10) : 0;
      return `${hours}h ${minutes}m`;
    }).reverse();
  
    setChartData({ labels, data, formattedData });
  };
  

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

  const pieData = Object.keys(moodCounts).map((key, index) => ({
    name: key,
    count: moodCounts[key],
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index % 5],
    legendFontColor: '#000',
    legendFontSize: 14,
  }));

  return (
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
          <Text style={styles.sectionTitle}>Sleep History Graph</Text>
          <ScrollView horizontal>
            {chartData.data.length > 0 ? (
              <LineChart
                data={{
                  labels: chartData.labels,
                  datasets: [{ data: chartData.data }],
                }}
                width={screenWidth * 1.5}
                height={220}
                yAxisSuffix=""
                yLabelsOffset={5}
                fromZero={true}
                chartConfig={{
                  backgroundColor: "#E8F5E9",
                  backgroundGradientFrom: "#E8F5E9",
                  backgroundGradientTo: "#C8E6C9",
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "5", strokeWidth: "2", stroke: "green" },
                }}
                bezier
                style={styles.chart}
                formatYLabel={(value) => {
                  const totalMinutes = parseFloat(value) * 50;
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = Math.round(totalMinutes % 60);
                  return `${hours}h ${minutes}m`;
                }}
              />
            ) : (
              <Text style={styles.noDataText}>No sleep history available.</Text>
            )}
          </ScrollView>

        </View>
      </ScrollView>
    </View>  
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E8F5E9' },
  headerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { marginRight: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  card: { backgroundColor: '#ffffff', padding: 15, borderRadius: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  chart: { marginVertical: 10, borderRadius: 16 },
  noDataText: { textAlign: 'center', color: 'gray', fontSize: 14, marginVertical: 10 },
});

export default WeeklyWellnessReport;
