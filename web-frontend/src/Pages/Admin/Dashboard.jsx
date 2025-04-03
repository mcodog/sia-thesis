import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  TrendingUp,
  CalendarClock,
  Activity,
  MessageSquare,
  Phone,
  Clock,
  ChevronRight,
} from "lucide-react";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("week"); // 'week', 'month', 'quarter', 'year'

  // Mock data for new users over time
  const newUsersData = [
    { day: "Mon", users: 12, male: 7, female: 5, other: 0 },
    { day: "Tue", users: 19, male: 10, female: 8, other: 1 },
    { day: "Wed", users: 15, male: 6, female: 8, other: 1 },
    { day: "Thu", users: 22, male: 12, female: 9, other: 1 },
    { day: "Fri", users: 28, male: 15, female: 12, other: 1 },
    { day: "Sat", users: 20, male: 11, female: 8, other: 1 },
    { day: "Sun", users: 16, male: 8, female: 7, other: 1 },
  ];

  // Usage statistics
  const usageStats = [
    {
      name: "Total Users",
      value: 2456,
      increase: 12.8,
      icon: <Users size={20} />,
    },
    {
      name: "Active Today",
      value: 342,
      increase: 5.2,
      icon: <Activity size={20} />,
    },
    {
      name: "Avg. Session",
      value: "12m 42s",
      increase: 2.5,
      icon: <Clock size={20} />,
    },
    {
      name: "Total Sessions",
      value: 12547,
      increase: 18.2,
      icon: <CalendarClock size={20} />,
    },
  ];

  // Engagement metrics
  const engagementData = [
    { name: "Messages", count: 8642, icon: <MessageSquare size={20} /> },
    { name: "Calls", count: 1289, icon: <Phone size={20} /> },
  ];

  // Wellbeing distribution data
  const wellbeingData = [
    { name: "Critical", value: 42, color: "#F87171" },
    { name: "Concerning", value: 128, color: "#FCD34D" },
    { name: "Moderate", value: 256, color: "#93C5FD" },
    { name: "Good", value: 576, color: "#6EE7B7" },
  ];

  // Top conversation topics
  const topTopics = [
    { name: "Anxiety", count: 458, percentage: 24 },
    { name: "Sleep Issues", count: 356, percentage: 18 },
    { name: "Work Stress", count: 312, percentage: 16 },
    { name: "Relationships", count: 285, percentage: 15 },
    { name: "Depression", count: 214, percentage: 11 },
  ];

  // Total gender counts
  const totalGenderCounts = {
    male: newUsersData.reduce((sum, day) => sum + day.male, 0),
    female: newUsersData.reduce((sum, day) => sum + day.female, 0),
    other: newUsersData.reduce((sum, day) => sum + day.other, 0),
  };

  // Highest day
  const highestDay = newUsersData.reduce(
    (max, day) => (day.users > max.users ? day : max),
    newUsersData[0]
  );

  // Custom tooltip for the line chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-100">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-[#0cdfc6]">
            New Users: {payload[0].value}
          </p>
          <div className="text-xs text-gray-500 mt-1">
            <div>Male: {payload[0].payload.male}</div>
            <div>Female: {payload[0].payload.female}</div>
            <div>Other: {payload[0].payload.other}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-800">Dashboard</h1>
          <p className="text-gray-500">
            Mental health app analytics and overview
          </p>
        </div>

        {/* Time range selector */}
        <div className="mb-6 flex space-x-1 bg-white p-1 rounded-lg shadow-sm w-fit">
          {["week", "month", "quarter", "year"].map((range) => (
            <button
              key={range}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-blue-100 text-[#0cdfc6]"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Stats Cards */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            {usageStats.map((stat, index) => (
              <motion.div
                key={stat.name}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="p-3 rounded-full bg-blue-50 text-blue-500 mr-4">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-medium text-gray-800">
                      {stat.value}
                    </p>
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-600">
                      +{stat.increase}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Engagement Summary Card */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-5 lg:row-span-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              User Engagement
            </h2>

            {/* Engagement Bars */}
            <div className="space-y-4 mb-5">
              {engagementData.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#0cdfc6] h-2 rounded-full"
                      style={{
                        width: `${item.name === "Messages" ? 75 : 45}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Wellbeing Distribution */}
            <h3 className="text-md font-medium text-gray-700 mb-3">
              Wellbeing Distribution
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wellbeingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {wellbeingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {wellbeingData.map((item) => (
                <div key={item.name} className="flex items-center text-xs">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">{item.name}: </span>
                  <span className="ml-1 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* New Users Line Chart */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-5 lg:col-span-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">New Users</h2>
              <div className="flex items-center text-sm text-[#0cdfc6]">
                <TrendingUp size={16} className="mr-1" />
                <span>+18.2% from previous {timeRange}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={newUsersData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280" }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#4F46E5"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-1 flex flex-col justify-between">
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Gender Distribution
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Male</span>
                      <span className="font-medium">
                        {totalGenderCounts.male}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Female</span>
                      <span className="font-medium">
                        {totalGenderCounts.female}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Other</span>
                      <span className="font-medium">
                        {totalGenderCounts.other}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 text-[#0cdfc6]">
                  <div className="text-sm">Highest Day</div>
                  <div className="text-lg font-medium">{highestDay.day}</div>
                  <div className="flex items-center">
                    <span className="text-xl font-medium">
                      {highestDay.users}
                    </span>
                    <span className="text-sm ml-1">new users</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top Conversation Topics */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-5 col-span-1 lg:col-span-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Top Conversation Topics
              </h2>
              <button className="text-sm text-[#0cdfc6] flex items-center">
                View all
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topTopics} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f3f4f6"
                      horizontal={false}
                    />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      width={100}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      fill="#93C5FD"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <div className="space-y-4">
                  {topTopics.map((topic, index) => (
                    <div key={topic.name} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0cdfc6] flex items-center justify-center mr-3 font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{topic.name}</span>
                          <span className="text-gray-500">{topic.count}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-[#0cdfc6] h-1.5 rounded-full"
                            style={{ width: `${topic.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
