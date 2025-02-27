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
  ScatterChart,
  Scatter,
} from "recharts";
import axiosInstance from "../Utils/axiosInstance";

const COLORS = [
  "#4F46E5",
  "#FF6B6B",
  "#6BCB77",
  "#FFD93D",
  "#A29BFE",
  "#FF9F43",
  "#E84393",
  "#17A2B8",
];

const GENDER_COLORS = {
  Male: "#4F46E5",
  Female: "#E84393",
  "Non-binary": "#6BCB77",
  Other: "#FFD93D",
  "Prefer not to say": "#A29BFE",
};

const Admin = () => {
  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [ageScatterData, setAgeScatterData] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [repeatedSubmissions, setRepeatedSubmissions] = useState(0);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await axiosInstance.get("/analysis/"); // Fetch all saved analyses
        if (res.status === 200) {
          console.log(res);
          const analyses = res.data;
          setTotalSubmissions(analyses.length); // Total submissions

          // Count unique users
          const uniqueUserIds = new Set(analyses.map((entry) => entry.user));
          setUniqueUsers(uniqueUserIds.size);

          // Calculate repeated submissions
          setRepeatedSubmissions(analyses.length - uniqueUserIds.size);

          // Aggregate all analysis results
          const aggregatedData = {};
          const scatterPlotData = [];
          const genderCounts = {};
          const ageScatterPoints = [];

          analyses.forEach((entry) => {
            // Extract timestamp or create a totalScore for x-axis
            const timestamp = new Date(
              entry.created_at || entry.timestamp || Date.now()
            ).getTime();

            // Get total score
            const totalScore = Object.values(entry.analysis_result).reduce(
              (sum, val) => sum + val,
              0
            );

            // Collect gender data if available
            if (entry.gender) {
              genderCounts[entry.gender] =
                (genderCounts[entry.gender] || 0) + 1;
            }

            // Collect age data if available
            if (entry.age) {
              // For each counseling type, create a point relating age to score
              Object.entries(entry.analysis_result).forEach(([name, value]) => {
                ageScatterPoints.push({
                  x: entry.age,
                  y: value * 100,
                  name,
                  user: entry.user,
                });
              });
            }

            Object.entries(entry.analysis_result).forEach(([name, value]) => {
              aggregatedData[name] = (aggregatedData[name] || 0) + value;

              // Using timestamp for x-axis instead of index
              scatterPlotData.push({
                x: timestamp,
                y: value * 100,
                name,
                user: entry.user,
                age: entry.age,
                gender: entry.gender,
              });
            });
          });

          // Convert aggregated data to array for charts
          const formattedData = Object.entries(aggregatedData).map(
            ([name, value]) => ({
              name,
              value: (value / analyses.length) * 100, // Average and convert to percentage
            })
          );

          // Format gender data for pie chart
          const formattedGenderData = Object.entries(genderCounts).map(
            ([gender, count]) => ({
              name: gender,
              value: count,
            })
          );

          setData(formattedData);
          setPieData(formattedData);
          setScatterData(scatterPlotData);
          setGenderData(formattedGenderData);
          setAgeScatterData(ageScatterPoints);
        }
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      }
    };

    fetchAnalysis();
  }, []);

  // Format the timestamp for tooltip display
  const formatXAxis = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Custom tooltip to display more information
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-300 shadow-md rounded">
          <p className="font-semibold">{data.name}</p>
          <p>Score: {data.y.toFixed(1)}%</p>
          <p>Date: {formatXAxis(data.x)}</p>
          <p>User ID: {data.user}</p>
          {data.age && <p>Age: {data.age}</p>}
          {data.gender && <p>Gender: {data.gender}</p>}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for age scatter plot
  const AgeTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-300 shadow-md rounded">
          <p className="font-semibold">{data.name}</p>
          <p>Score: {data.y.toFixed(1)}%</p>
          <p>Age: {data.x}</p>
          <p>User ID: {data.user}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Analysis Overview</h2>

      {/* Statistics Section */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <p className="text-lg">
          📊 <strong>Total Submissions:</strong> {totalSubmissions}
        </p>
        <p className="text-lg">
          👤 <strong>Unique Users:</strong> {uniqueUsers}
        </p>
        <p className="text-lg">
          🔁 <strong>Repeated Submissions:</strong> {repeatedSubmissions}
        </p>
      </div>

      {/* Gender Distribution */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Gender Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={genderData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {genderData.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={GENDER_COLORS[entry.name] || "#A29BFE"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Age vs. Counseling Score Scatter Plot */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Age vs. Counseling Score</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <XAxis
              type="number"
              dataKey="x"
              name="Age"
              domain={[0, 100]}
              label={{
                value: "Age",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Counseling Score (%)"
              domain={[0, 100]}
              label={{ value: "Score (%)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<AgeTooltip />} />
            {ageScatterData.length > 0 &&
              pieData.map((entry, index) => (
                <Scatter
                  key={entry.name}
                  name={entry.name}
                  data={ageScatterData.filter((d) => d.name === entry.name)}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            <Legend />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">
          Counseling Type Distribution
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="name" width={200} />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">
          Proportions of Counseling Types
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Time-based Scatter Plot */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">
          Counseling Scores Over Time
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <XAxis
              type="number"
              dataKey="x"
              name="Submission Date"
              tickFormatter={formatXAxis}
              domain={["dataMin", "dataMax"]}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Counseling Score (%)"
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            {scatterData.length > 0 &&
              pieData.map((entry, index) => (
                <Scatter
                  key={entry.name}
                  name={entry.name}
                  data={scatterData.filter((d) => d.name === entry.name)}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            <Legend />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Admin;
