import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Phone,
  Calendar,
  Play,
  Pause,
  AlertTriangle,
  Info,
  Clock,
  ArrowLeft,
} from "lucide-react";
import {
  FaSmile,
  FaMeh,
  FaFrown,
  FaSadTear,
  FaFileAlt,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

const ConversationDetail = ({ userId, onBack }) => {
  // State for selected conversation
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedCall, setSelectedCall] = useState(null);
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' or 'calls'
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Mock data - in a real app, this would come from an API
  const user = {
    id: 2,
    name: "Michael Chen",
    phoneNumber: "(555) 234-5678",
  };

  const chatHistory = [
    {
      id: 1,
      date: "2025-04-03",
      summary: "Discussed recent anxiety about job interview",
      messages: [
        {
          id: 1,
          sender: "user",
          time: "08:22:00",
          text: "Ive been feeling really anxious about my job interview tomorrow.",
        },
        {
          id: 2,
          sender: "ai",
          time: "08:22:15",
          text: "Thats understandable. Job interviews can be stressful. Would you like to talk about what specifically is making you anxious?",
        },
        {
          id: 3,
          sender: "user",
          time: "08:23:42",
          text: "I keep thinking Ill forget everything during the technical part of the interview.",
        },
        {
          id: 4,
          sender: "ai",
          time: "08:24:10",
          text: "Thats a common worry. Have you tried any preparation techniques that have helped with previous interviews?",
        },
        {
          id: 5,
          sender: "user",
          time: "08:26:30",
          text: "Ive been reviewing materials, but I still feel underprepared.",
        },
        {
          id: 6,
          sender: "ai",
          time: "08:27:05",
          text: "It sounds like youre putting in the effort to prepare. Sometimes, our perception of readiness doesnt match reality. What specific topics are you most concerned about?",
        },
      ],
      analysis: {
        sentiment: "anxious",
        topics: ["work stress", "anxiety", "self-doubt"],
        followUpNeeded: false,
      },
    },
    {
      id: 2,
      date: "2025-04-01",
      summary: "Discussed sleep issues and stress management",
      messages: [
        {
          id: 1,
          sender: "user",
          time: "21:15:00",
          text: "I cant sleep again. My mind keeps racing.",
        },
        {
          id: 2,
          sender: "ai",
          time: "21:15:20",
          text: "Im sorry to hear youre having trouble sleeping. What kind of thoughts are keeping you awake?",
        },
        // More messages would be here
      ],
      analysis: {
        sentiment: "distressed",
        topics: ["insomnia", "racing thoughts", "stress"],
        followUpNeeded: true,
      },
    },
    {
      id: 3,
      date: "2025-03-28",
      summary: "Progress update on new relaxation techniques",
      messages: [
        {
          id: 1,
          sender: "user",
          time: "15:42:00",
          text: "I tried that breathing exercise you suggested. It actually helped a bit.",
        },
        {
          id: 2,
          sender: "ai",
          time: "15:42:30",
          text: "Thats great to hear! How did it make you feel when you were doing it?",
        },
        // More messages would be here
      ],
      analysis: {
        sentiment: "improving",
        topics: ["coping strategies", "relaxation techniques", "progress"],
        followUpNeeded: false,
      },
    },
  ];

  const callHistory = [
    {
      id: 1,
      date: "2025-04-02",
      time: "16:45:00",
      duration: "00:18:32",
      recordingUrl: "/recordings/call-1.mp3",
      summary:
        "Michael shared feelings of hopelessness about future career prospects after a project setback",
      analysis: {
        sentiment: "severe",
        mood: ["depressed", "defeated", "pessimistic"],
        keyPhrases: ["no point trying", "always fail", "never good enough"],
        riskLevel: "high",
        followUpNeeded: true,
      },
    },
    {
      id: 2,
      date: "2025-03-28",
      time: "10:15:00",
      duration: "00:12:05",
      recordingUrl: "/recordings/call-2.mp3",
      summary:
        "Discussion about family conflict and strategies for boundary-setting",
      analysis: {
        sentiment: "moderate",
        mood: ["frustrated", "conflicted", "overwhelmed"],
        keyPhrases: ["family expectations", "setting boundaries", "guilt"],
        riskLevel: "medium",
        followUpNeeded: false,
      },
    },
    {
      id: 3,
      date: "2025-03-25",
      time: "14:30:00",
      duration: "00:09:18",
      recordingUrl: "/recordings/call-3.mp3",
      summary:
        "Check-in call discussing progress with daily mindfulness practice",
      analysis: {
        sentiment: "neutral",
        mood: ["thoughtful", "engaged", "reflective"],
        keyPhrases: ["daily practice", "mindfulness", "small improvements"],
        riskLevel: "low",
        followUpNeeded: false,
      },
    },
  ];

  // Set initial selected conversation
  useEffect(() => {
    if (chatHistory.length > 0 && !selectedChat) {
      setSelectedChat(chatHistory[0]);
    }
    if (callHistory.length > 0 && !selectedCall) {
      setSelectedCall(callHistory[0]);
    }
  }, []);

  // Function to format time
  const formatTime = (timeString) => {
    const date = new Date(`2000-01-01T${timeString}`);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Function to get sentiment icon and color
  const getSentimentIndicator = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case "severe":
      case "distressed":
        return {
          icon: <FaSadTear size={18} />,
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          label: "Concerning",
        };
      case "anxious":
      case "moderate":
        return {
          icon: <FaFrown size={18} />,
          bgColor: "bg-orange-100",
          textColor: "text-orange-700",
          label: "Moderate",
        };
      case "neutral":
        return {
          icon: <FaMeh size={18} />,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          label: "Neutral",
        };
      case "improving":
        return {
          icon: <FaSmile size={18} />,
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          label: "Positive",
        };
      default:
        return {
          icon: <FaMeh size={18} />,
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          label: "Neutral",
        };
    }
  };

  // Simulate audio progress
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          const newProgress = prev + 0.5;
          if (newProgress >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return newProgress;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Toggle audio playback
  const togglePlayback = () => {
    if (audioProgress >= 100) {
      setAudioProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{user.name}'s Conversations</h1>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button
          className={`py-2 px-4 font-medium flex items-center ${
            activeTab === "chat"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          <MessageSquare size={18} className="mr-2" />
          Chat History
        </button>
        <button
          className={`py-2 px-4 font-medium flex items-center ${
            activeTab === "calls"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("calls")}
        >
          <Phone size={18} className="mr-2" />
          Call Recordings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="md:col-span-1 h-[calc(100vh-200px)] overflow-y-auto border rounded-lg">
          {activeTab === "chat" ? (
            // Chat history list
            <div>
              <div className="p-3 bg-gray-50 font-medium border-b">
                Recent Chat Conversations
              </div>
              {chatHistory.map((chat) => (
                <motion.div
                  key={chat.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedChat?.id === chat.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedChat(chat)}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium">{formatDate(chat.date)}</div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full flex items-center ${
                        getSentimentIndicator(chat.analysis.sentiment).bgColor
                      } ${
                        getSentimentIndicator(chat.analysis.sentiment).textColor
                      }`}
                    >
                      {getSentimentIndicator(chat.analysis.sentiment).icon}
                      <span className="ml-1">
                        {getSentimentIndicator(chat.analysis.sentiment).label}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {chat.summary}
                  </p>
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <MessageSquare size={12} className="mr-1" />
                    {chat.messages.length} messages
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Call history list
            <div>
              <div className="p-3 bg-gray-50 font-medium border-b">
                Call Recordings
              </div>
              {callHistory.map((call) => (
                <motion.div
                  key={call.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedCall?.id === call.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedCall(call)}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium">{formatDate(call.date)}</div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full flex items-center ${
                        getSentimentIndicator(call.analysis.sentiment).bgColor
                      } ${
                        getSentimentIndicator(call.analysis.sentiment).textColor
                      }`}
                    >
                      {getSentimentIndicator(call.analysis.sentiment).icon}
                      <span className="ml-1">
                        {getSentimentIndicator(call.analysis.sentiment).label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Clock size={14} className="mr-1" />
                    <span>
                      {call.time.substring(0, 5)} &middot; {call.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {call.summary}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right content area */}
        <div className="md:col-span-2 h-[calc(100vh-200px)] overflow-y-auto border rounded-lg">
          {activeTab === "chat" && selectedChat ? (
            <div>
              {/* Chat header */}
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <div>
                  <h2 className="font-medium">
                    Chat on {formatDate(selectedChat.date)}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {selectedChat.messages.length} messages
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full flex items-center ${
                    getSentimentIndicator(selectedChat.analysis.sentiment)
                      .bgColor
                  } ${
                    getSentimentIndicator(selectedChat.analysis.sentiment)
                      .textColor
                  }`}
                >
                  {getSentimentIndicator(selectedChat.analysis.sentiment).icon}
                  <span className="ml-1 font-medium">
                    {
                      getSentimentIndicator(selectedChat.analysis.sentiment)
                        .label
                    }
                  </span>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-4">
                {selectedChat.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`mb-4 flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <div className="text-sm">{message.text}</div>
                      <div
                        className={`text-xs mt-1 text-right ${
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.time)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat analysis */}
              <div className="border-t p-4 bg-gray-50">
                <h3 className="font-medium mb-2 flex items-center">
                  <FaFileAlt className="mr-2" />
                  Conversation Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm font-medium mb-1">
                      Topics Discussed
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedChat.analysis.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm font-medium mb-1">
                      Additional Notes
                    </div>
                    <p className="text-sm">
                      {selectedChat.analysis.followUpNeeded
                        ? "Follow-up recommended based on conversation content and sentiment analysis."
                        : "No immediate follow-up required. Regular check-in schedule can be maintained."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "calls" && selectedCall ? (
            <div>
              {/* Call header */}
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-medium">
                    Call on {formatDate(selectedCall.date)}
                  </h2>
                  <div
                    className={`px-3 py-1 rounded-full flex items-center ${
                      getSentimentIndicator(selectedCall.analysis.sentiment)
                        .bgColor
                    } ${
                      getSentimentIndicator(selectedCall.analysis.sentiment)
                        .textColor
                    }`}
                  >
                    {
                      getSentimentIndicator(selectedCall.analysis.sentiment)
                        .icon
                    }
                    <span className="ml-1 font-medium">
                      {
                        getSentimentIndicator(selectedCall.analysis.sentiment)
                          .label
                      }
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-1" />
                  <span>
                    {selectedCall.time.substring(0, 5)} &middot; Duration:{" "}
                    {selectedCall.duration}
                  </span>
                </div>
              </div>

              {/* Audio player */}
              <div className="p-4 border-b">
                <div className="bg-gray-100 p-3 rounded">
                  <div className="flex items-center mb-3">
                    <button
                      onClick={togglePlayback}
                      className="p-2 rounded-full bg-blue-500 text-white mr-3"
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <div className="flex-1">
                      <div className="relative h-2 bg-gray-300 rounded overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-blue-500"
                          style={{ width: `${audioProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-3 text-sm text-gray-600">
                      {isPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 italic">
                    Recording URL: {selectedCall.recordingUrl}
                  </div>
                </div>
              </div>

              {/* Call summary */}
              <div className="p-4 border-b">
                <h3 className="font-medium mb-2">Call Summary</h3>
                <p className="text-sm">{selectedCall.summary}</p>
              </div>

              {/* Call analysis */}
              <div className="p-4 bg-gray-50">
                <h3 className="font-medium mb-3 flex items-center">
                  <FaFileAlt className="mr-2" />
                  Call Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm font-medium mb-1">
                      Mood Indicators
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedCall.analysis.mood.map((mood, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {mood}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm font-medium mb-1">Key Phrases</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedCall.analysis.keyPhrases.map((phrase, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          "{phrase}"
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white p-3 rounded border">
                  <div className="text-sm font-medium mb-1">
                    Risk Assessment
                  </div>
                  <div className="flex items-center">
                    {selectedCall.analysis.riskLevel === "high" && (
                      <div className="flex items-center text-red-600">
                        <AlertTriangle size={16} className="mr-1" />
                        <span className="font-medium">
                          High Risk - Immediate follow-up recommended
                        </span>
                      </div>
                    )}
                    {selectedCall.analysis.riskLevel === "medium" && (
                      <div className="flex items-center text-orange-600">
                        <Info size={16} className="mr-1" />
                        <span className="font-medium">
                          Medium Risk - Monitor closely
                        </span>
                      </div>
                    )}
                    {selectedCall.analysis.riskLevel === "low" && (
                      <div className="flex items-center text-green-600">
                        <Info size={16} className="mr-1" />
                        <span className="font-medium">
                          Low Risk - Standard care plan
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;
