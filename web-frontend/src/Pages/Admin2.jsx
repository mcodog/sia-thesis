import React, { useState, useEffect } from "react";
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
  LineChart,
  Line,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

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

const IndividualUserView = () => {
  const [userId, setUserId] = useState("user123"); // Mock user ID
  const [userData, setUserData] = useState(null);
  const [userTimeline, setUserTimeline] = useState([]);
  const [questionTimeData, setQuestionTimeData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data generation function
  const generateMockData = () => {
    // Generate a list of mock users
    const mockUsers = Array.from({ length: 15 }, (_, i) => ({
      id: `user${i + 100}`,
      name: `User ${i + 1}`,
    }));
    setUserList(mockUsers);

    // Generate mock submissions for the current user
    const submissionCount = Math.floor(Math.random() * 5) + 1; // 1-5 submissions
    const mockSubmissions = [];

    // Counseling types
    const counselingTypes = [
      "Career Counseling",
      "Mental Health Support",
      "Academic Guidance",
      "Relationship Advice",
      "Financial Planning",
    ];

    // Generate submissions with timestamps spread over the last 6 months
    const now = new Date();
    for (let i = 0; i < submissionCount; i++) {
      const submissionDate = new Date(now);
      submissionDate.setMonth(now.getMonth() - i * 2 - Math.random());

      const mockAnalysisResult = {};
      const mockQuestionTimes = {};

      counselingTypes.forEach((type) => {
        // Random score between 0.1 and 0.9
        mockAnalysisResult[type] = Math.random() * 0.8 + 0.1;

        // Random time to answer questions (5-60 seconds)
        mockQuestionTimes[type] = Math.floor(Math.random() * 55) + 5;
      });

      mockSubmissions.push({
        id: `submission_${i}`,
        user: userId,
        created_at: submissionDate.toISOString(),
        analysis_result: mockAnalysisResult,
        question_times: mockQuestionTimes,
        age: 25 + Math.floor(Math.random() * 3), // Age might change slightly over time
        gender: "Female", // Keeping static for this mock
        totalScore: Object.values(mockAnalysisResult).reduce(
          (sum, value) => sum + value,
          0
        ),
      });
    }

    // Sort submissions by date
    mockSubmissions.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Set the latest submission as the current user data
    setUserData(mockSubmissions[0]);

    // Prepare timeline data (showing how scores changed over time)
    const timelineData = mockSubmissions.map((submission) => {
      const result = {
        date: new Date(submission.created_at).toLocaleDateString(),
        timestamp: new Date(submission.created_at).getTime(),
      };

      Object.entries(submission.analysis_result).forEach(([type, score]) => {
        result[type] = score * 100; // Convert to percentage
      });

      return result;
    });

    // Sort timeline data chronologically
    timelineData.sort((a, b) => a.timestamp - b.timestamp);
    setUserTimeline(timelineData);

    // Prepare question time data from the latest submission
    const latestQuestionTimes = mockSubmissions[0].question_times;
    const formattedQuestionTimes = Object.entries(latestQuestionTimes).map(
      ([type, time]) => ({
        name: type,
        value: time,
      })
    );
    setQuestionTimeData(formattedQuestionTimes);

    // Generate mock average data for comparison
    const mockAverageData = counselingTypes.map((type) => {
      const userScore = mockSubmissions[0].analysis_result[type] * 100;
      const avgScore = userScore * (0.8 + Math.random() * 0.4); // Random average score

      return {
        name: type,
        user: userScore,
        average: avgScore,
      };
    });
    setComparisonData(mockAverageData);

    setIsLoading(false);
  };

  // Load mock data on component mount or user change
  useEffect(() => {
    setIsLoading(true);
    // In a real app, this would be an API call with the userId
    // For now, we'll use mock data
    setTimeout(generateMockData, 500); // Simulate loading delay
  }, [userId]);

  // Change user handler
  const handleUserChange = (e) => {
    setUserId(e.target.value);
  };

  // Format the date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <div className="p-4">Loading user data...</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Individual User Analysis</h2>

        {/* User selector */}
        <div className="flex items-center space-x-2">
          <label htmlFor="user-select" className="font-medium">
            Select User:
          </label>
          <select
            id="user-select"
            value={userId}
            onChange={handleUserChange}
            className="border rounded p-2"
          >
            {userList.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* User info card */}
      {userData && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-2">User Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p>
                <strong>User ID:</strong> {userData.user}
              </p>
              <p>
                <strong>Age:</strong> {userData.age}
              </p>
              <p>
                <strong>Gender:</strong> {userData.gender}
              </p>
            </div>
            <div>
              <p>
                <strong>Last Assessment:</strong>{" "}
                {formatDate(userData.created_at)}
              </p>
              <p>
                <strong>Total Assessments:</strong> {userTimeline.length}
              </p>
            </div>
            <div>
              <p>
                <strong>Overall Score:</strong>{" "}
                {((userData.totalScore * 100) / 5).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Latest Assessment Results - Radar Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">
          Latest Assessment Results
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart outerRadius={150} data={comparisonData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar
              name="User Score"
              dataKey="user"
              stroke="#4F46E5"
              fill="#4F46E5"
              fillOpacity={0.6}
            />
            <Radar
              name="Average Score"
              dataKey="average"
              stroke="#FF6B6B"
              fill="#FF6B6B"
              fillOpacity={0.6}
            />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Question Response Times */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">
          Question Response Times (seconds)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={questionTimeData} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip />
            <Bar dataKey="value" fill="#6BCB77">
              {questionTimeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Score Comparison */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">User vs. Average Scores</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="user" name="User Score" fill="#4F46E5" />
            <Bar dataKey="average" name="Average Score" fill="#FF6B6B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Over Time */}
      {userTimeline.length > 1 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={userTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {Object.keys(userTimeline[0])
                .filter((key) => key !== "date" && key !== "timestamp")
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[index % COLORS.length]}
                    activeDot={{ r: 8 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Detailed Assessment Breakdown */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">
          Assessment Score Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Counseling Type</th>
                <th className="py-2 px-4 border-b">Score</th>
                <th className="py-2 px-4 border-b">Response Time</th>
                <th className="py-2 px-4 border-b">Compared to Average</th>
              </tr>
            </thead>
            <tbody>
              {userData &&
                Object.entries(userData.analysis_result).map(
                  ([type, score], index) => {
                    const avgScore =
                      comparisonData.find((item) => item.name === type)
                        ?.average || 0;
                    const timeTaken = userData.question_times[type] || 0;
                    const diff = (score * 100 - avgScore).toFixed(1);
                    return (
                      <tr
                        key={type}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="py-2 px-4 border-b">{type}</td>
                        <td className="py-2 px-4 border-b">
                          {(score * 100).toFixed(1)}%
                        </td>
                        <td className="py-2 px-4 border-b">
                          {timeTaken} seconds
                        </td>
                        <td className="py-2 px-4 border-b">
                          <span
                            className={
                              diff >= 0 ? "text-green-600" : "text-red-600"
                            }
                          >
                            {diff >= 0 ? "+" : ""}
                            {diff}%
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assessment History */}
      {userTimeline.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Assessment History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>
                  {Object.keys(userTimeline[0])
                    .filter((key) => key !== "date" && key !== "timestamp")
                    .map((type) => (
                      <th key={type} className="py-2 px-4 border-b">
                        {type}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {userTimeline.map((entry, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-2 px-4 border-b">{entry.date}</td>
                    {Object.keys(entry)
                      .filter((key) => key !== "date" && key !== "timestamp")
                      .map((type) => (
                        <td key={type} className="py-2 px-4 border-b">
                          {entry[type].toFixed(1)}%
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualUserView;
