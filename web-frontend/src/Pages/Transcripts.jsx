import React, { useState } from "react";
import { AlertTriangle, MessageSquare, Phone, List, Grid } from "lucide-react";
import { FaSmile, FaMeh, FaFrown, FaSadTear } from "react-icons/fa";
import { motion } from "framer-motion";

const Transcripts = () => {
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'

  // Mock data - in a real app, this would come from an API
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      picture: "/api/placeholder/60/60",
      phone: "(555) 123-4567",
      wellbeingScore: 8,
      lastCall: "2025-04-01T14:30:00",
      lastMessage: "2025-04-03T09:15:00",
      mentalState: "Mild anxiety, managing well",
    },
    {
      id: 2,
      name: "Michael Chen",
      picture: "/api/placeholder/60/60",
      phone: "(555) 234-5678",
      wellbeingScore: 3,
      lastCall: "2025-04-02T16:45:00",
      lastMessage: "2025-04-03T08:22:00",
      mentalState: "Severe depression symptoms, expressing hopelessness",
    },
    {
      id: 3,
      name: "Ella Rodriguez",
      picture: "/api/placeholder/60/60",
      phone: "(555) 345-6789",
      wellbeingScore: 6,
      lastCall: "2025-03-28T10:15:00",
      lastMessage: "2025-04-02T17:30:00",
      mentalState: "Moderate stress, work related concerns",
    },
    {
      id: 4,
      name: "James Wilson",
      picture: "/api/placeholder/60/60",
      phone: "(555) 456-7890",
      wellbeingScore: 2,
      lastCall: "2025-04-03T11:20:00",
      lastMessage: "2025-04-03T12:05:00",
      mentalState: "Crisis indicators, mentioned self-harm",
    },
    {
      id: 5,
      name: "Aisha Patel",
      picture: "/api/placeholder/60/60",
      phone: "(555) 567-8901",
      wellbeingScore: 7,
      lastCall: "2025-03-25T09:30:00",
      lastMessage: "2025-04-01T14:12:00",
      mentalState: "Improving, using coping strategies effectively",
    },
  ];

  // Function to format dates in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  // Function to get user initials for avatar
  const getInitials = (user) => {
    return user.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  // Function to render the wellbeing indicator with face icon and score
  const renderWellbeingIndicator = (score) => {
    let Icon;
    let iconSize = 24;
    let bgColor;

    if (score >= 7) {
      Icon = FaSmile;
      //   bgColor = "bg-green-100";
    } else if (score >= 5) {
      Icon = FaMeh;
      //   bgColor = "bg-yellow-100";
    } else if (score >= 3) {
      Icon = FaFrown;
      //   bgColor = "bg-orange-100";
    } else {
      Icon = FaSadTear;
      //   bgColor = "bg-red-100";
    }

    return (
      <div className="flex items-center">
        <div className={`${bgColor} p-1 rounded-full mr-2`}>
          <Icon size={iconSize} className="text-gray-700" />
        </div>
        <span className="font-bold">{score}/10</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Client Wellbeing Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("card")}
            className={`p-2 rounded ${
              viewMode === "card" ? "bg-[#0cdfc6] text-white" : "bg-gray-200"
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded ${
              viewMode === "table" ? "bg-[#0cdfc6] text-white" : "bg-gray-200"
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              className="bg-white rounded-lg shadow-md overflow-hidden relative min-h-[350px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-500 text-xl">
                      {getInitials(user)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-1" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">
                      Wellbeing Assessment:
                    </span>
                    {renderWellbeingIndicator(user.wellbeingScore)}
                  </div>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Status: </span>
                    {user.mentalState}
                  </p>
                  {user.wellbeingScore <= 3 && (
                    <div className="mt-3 mb-3 flex items-center p-2 bg-red-100 text-red-700 rounded">
                      <AlertTriangle size={16} className="mr-2" />
                      <span className="text-sm font-medium">
                        Requires immediate attention
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 bg-gray-50 p-3 border-t">
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Phone size={14} className="mr-1" />
                    <span>Last call: {formatDate(user.lastCall)}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare size={14} className="mr-1" />
                    <span>Last msg: {formatDate(user.lastMessage)}</span>
                  </div>
                </div>
                <button className="w-full text-[#0cdfc6] hover:text-[#0cdfc6] text-sm font-medium py-1 border border-blue-200 rounded">
                  View Conversations
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Client</th>
                <th className="py-3 px-4 text-left">Phone Number</th>
                <th className="py-3 px-4 text-left">Wellbeing</th>
                <th className="py-3 px-4 text-left">Current Status</th>
                <th className="py-3 px-4 text-left">Last Contact</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  className="border-t hover:bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                        <span className="text-gray-500 text-xl">
                          {getInitials(user)}
                        </span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">
                    {renderWellbeingIndicator(user.wellbeingScore)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-w-xs truncate">{user.mentalState}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="flex items-center text-sm">
                        <Phone size={14} className="mr-1" />
                        <span>{formatDate(user.lastCall)}</span>
                      </div>
                      <div className="flex items-center text-sm mt-1">
                        <MessageSquare size={14} className="mr-1" />
                        <span>{formatDate(user.lastMessage)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 mr-2 text-sm">
                      View
                    </button>
                    {user.wellbeingScore <= 3 && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm inline-flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        Alert
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transcripts;
