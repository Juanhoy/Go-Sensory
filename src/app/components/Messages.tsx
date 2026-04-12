import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, Send } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BottomNav } from "./BottomNav";

interface MessagesProps {
  userType?: "therapist" | "caregiver";
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1756699197173-5ef672a423fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    lastMessage: "The new exercises are working well!",
    timestamp: "2m ago",
    unread: 2,
  },
  {
    id: "2",
    name: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1685575002714-f5808258e06d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    lastMessage: "Thanks for the update on Alex",
    timestamp: "1h ago",
    unread: 0,
  },
  {
    id: "3",
    name: "Support Team",
    avatar: "https://images.unsplash.com/photo-1756699197173-5ef672a423fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    lastMessage: "How can we help you today?",
    timestamp: "2d ago",
    unread: 0,
  },
];

export function Messages({ userType }: MessagesProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How are the exercises going?",
      sender: "them",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      text: "They're going great! We completed the morning routine.",
      sender: "me",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      text: "The new exercises are working well!",
      sender: "them",
      timestamp: "10:35 AM",
    },
  ]);

  const filteredConversations = conversations.filter((convo) =>
    convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  if (selectedConvo) {
    const conversation = conversations.find((c) => c.id === selectedConvo);
    
    return (
      <div className="min-h-screen bg-[#F5F2ED] pb-24 flex flex-col">
        {/* Chat Header */}
        <div className="bg-[#F5F2ED] sticky top-0 z-10 border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedConvo(null)} className="p-2">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <ImageWithFallback
              src={conversation?.avatar || ""}
              alt={conversation?.name || ""}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="font-medium">{conversation?.name}</h2>
              <p className="text-xs text-gray-500">Active now</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.sender === "me"
                    ? "bg-[#9BC9BB] text-gray-900"
                    : "bg-white text-gray-900"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs text-gray-600 mt-1">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-[#F5F2ED] border-t border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9BC9BB]"
            />
            <button
              onClick={handleSendMessage}
              className="p-3 bg-[#9BC9BB] rounded-full hover:bg-[#8AB8AA] transition-colors"
            >
              <Send className="w-5 h-5 text-gray-900" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED] pb-24">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">Messages</h1>
          <div className="w-10" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9BC9BB]"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="px-4 pt-4 space-y-2">
        {filteredConversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => setSelectedConvo(conversation.id)}
            className="w-full bg-white rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <ImageWithFallback
              src={conversation.avatar}
              alt={conversation.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium truncate">{conversation.name}</h3>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {conversation.timestamp}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
            </div>
            {conversation.unread > 0 && (
              <div className="w-6 h-6 bg-[#9BC9BB] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-gray-900">
                  {conversation.unread}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {filteredConversations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-gray-500 text-center">No conversations found</p>
        </div>
      )}

      <BottomNav userType={userType} />
    </div>
  );
}