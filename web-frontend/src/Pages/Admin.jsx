import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,  // Added this
  Line        // Added this
} from "recharts";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";

const COLORS = ["#2E8B57", "#20B2AA", "#3CB371", "#228B22", "#9ACD32", "#6B8E23", "#32CD32", "#8FBC8F"];
const GENDER_COLORS = { Male: "#2E8B57", Female: "#9ACD32", "Non-binary": "#3CB371", Other: "#6B8E23" };

const Admin = () => {
  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [repeatedSubmissions, setRepeatedSubmissions] = useState(0);
  const [sleepData, setSleepData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [breathingData, setBreathingData] = useState([]);

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const response = await axiosInstance.get("/sleep-data/");
        console.log("Sleep Data Response:", response.data); // Debugging log
        setSleepData(response.data);
      } catch (error) {
        console.error("Error fetching sleep data:", error);
      }
    };
  
    fetchSleepData();
  }, []);
  
  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await axiosInstance.get("/mood-tracker/");
        console.log("Mood Data Response:", response.data); // Debugging log
        setMoodData(response.data);
      } catch (error) {
        console.error("Error fetching mood data:", error);
      }
    };
  
    fetchMoodData();
  }, []);
  
  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const response = await axiosInstance.get("/sleep-data/");
        setSleepData(response.data);
      } catch (error) {
        console.error("Error fetching sleep data:", error);
      }
    };

    fetchSleepData();
  }, []);

  useEffect(() => {
    const fetchBreathingData = async () => {
      try {
        const response = await axiosInstance.get("/breathing-session/");
        setBreathingData(response.data);
      } catch (error) {
        console.error("Error fetching breathing data:", error);
      }
    };

    fetchBreathingData();
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await axiosInstance.get("/analysis/");
        if (res.status === 200) {
          const analyses = res.data;

          const aggregatedData = {};
          const genderCounts = {};

          // Count unique users
          const uniqueUserIds = new Set(analyses.map((entry) => entry.user));
          setUniqueUsers(uniqueUserIds.size);

          // Calculate repeated submissions
          setRepeatedSubmissions(analyses.length - uniqueUserIds.size);

          analyses.forEach((entry) => {
            // Aggregate counseling type data
            Object.entries(entry.analysis_result).forEach(([name, value]) => {
              aggregatedData[name] = (aggregatedData[name] || 0) + value;
            });

            // Count gender distribution
            if (entry.gender) {
              genderCounts[entry.gender] = (genderCounts[entry.gender] || 0) + 1;
            }
          });

          setTotalSubmissions(analyses.length);

          setData(Object.entries(aggregatedData).map(([name, value]) => ({ name, value: (value / analyses.length) * 100 })));
          setPieData(Object.entries(aggregatedData).map(([name, value]) => ({ name, value })));
          setGenderData(Object.entries(genderCounts).map(([gender, count]) => ({ name: gender, value: count })));
        }
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      }
    };
    fetchAnalysis();
  }, []);

  const userStatsData = [
    { name: "Unique Users", value: uniqueUsers },
    { name: "Repeated Submissions", value: repeatedSubmissions },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-green-700 to-green-500 text-white">
      <motion.h2 className="text-3xl font-bold mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        📊 User Analysis Overview
      </motion.h2>

      {/* Statistics Section */}
      <motion.div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <p className="text-lg">
          📊 <strong>Total Submissions:</strong> {totalSubmissions}
        </p>
        <p className="text-lg">
          👤 <strong>Unique Users:</strong> {uniqueUsers}
        </p>
        <p className="text-lg">
          🔁 <strong>Repeated Submissions:</strong> {repeatedSubmissions}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div className="bg-white p-6 rounded-xl shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={genderData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                {genderData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={GENDER_COLORS[entry.name] || "#228B22"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="bg-white p-6 rounded-xl shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sleep Hours Tracking</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sleepData}>
              <XAxis dataKey="date" />
              <YAxis dataKey="hours" />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#FFA07A" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="bg-white p-6 rounded-xl shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Tracking</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moodData}>
              <XAxis dataKey="mood" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#FFA07A" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart for Counseling Type Distribution */}
        <motion.div className="bg-white p-6 rounded-xl shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Counseling Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={200} />
              <Tooltip />
              <Bar dataKey="value" fill="#32CD32" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="bg-white p-6 rounded-xl shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Breathing Session Data</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={breathingData}>
            <XAxis dataKey="date" />
            <YAxis dataKey="duration" />
            <Tooltip />
            <Line type="monotone" dataKey="duration" stroke="#FF4500" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
        
        {/* Bar Chart for Unique Users & Repeated Submissions */}
        <motion.div className="bg-white p-6 rounded-xl shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Unique Users vs Repeated Submissions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userStatsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1E90FF" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Overall Analysis Below */}
      <motion.div className="bg-white p-6 rounded-xl shadow-lg mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Admin;
