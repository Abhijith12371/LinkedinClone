import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../Context/context";
import { db } from "../../firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import Users from "./Users";
import EmojiPicker from "emoji-picker-react";
import { FiSend } from "react-icons/fi";

const ChatComponent = () => {
  const { user, darkMode } = useContext(UserContext); // Get darkMode from context
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [unreadUsers, setUnreadUsers] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const usersCollection = collection(db, "Users");
    const unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
      const newUnreadUsers = {};
      snapshot.forEach((doc) => {
        const chatId = [user.email, doc.data().email].sort().join("_");
        const messagesRef = collection(db, "messages", chatId, "chat");

        onSnapshot(messagesRef, (msgSnapshot) => {
          let hasUnread = false;
          msgSnapshot.forEach((msg) => {
            if (msg.data().receiverEmail === user.email && !msg.data().read) {
              hasUnread = true;
            }
          });

          if (hasUnread) {
            newUnreadUsers[doc.data().email] = true;
          } else {
            delete newUnreadUsers[doc.data().email];
          }
        });
      });
      setUnreadUsers(newUnreadUsers);
    });

    return () => unsubscribeUsers();
  }, [user]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    const chatId = [user.email, selectedUser.email].sort().join("_");
    const messagesRef = collection(db, "messages", chatId, "chat");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(fetchedMessages);

      fetchedMessages.forEach(async (message) => {
        if (message.receiverEmail === user.email && !message.read) {
          const messageDoc = doc(db, "messages", chatId, "chat", message.id);
          await updateDoc(messageDoc, { read: true });
        }
      });
    });

    return () => unsubscribeMessages();
  }, [user, selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const chatId = [user.email, selectedUser.email].sort().join("_");
    const messagesRef = collection(db, "messages", chatId, "chat");

    await addDoc(messagesRef, {
      text: newMessage,
      senderEmail: user.email,
      receiverEmail: selectedUser.email,
      timestamp: serverTimestamp(),
      read: false,
    });

    setNewMessage("");
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className={`h-screen flex flex-col lg:flex-row ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Users List - Visible on large screens or when no user is selected on mobile */}
      <div
        className={`${
          selectedUser ? "hidden lg:block" : "block"
        } w-full lg:w-1/4 p-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"} overflow-y-auto`}
      >
        <h2 className={`font-semibold text-lg mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Users</h2>
        <Users onSelectUser={setSelectedUser} selectedUser={selectedUser} unreadUsers={unreadUsers} />
      </div>

      {/* Chat Section - Adjusts based on screen size and user selection */}
      <div className={`${selectedUser ? "block" : "hidden lg:block"} w-full lg:w-3/4 flex flex-col ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        {/* Back Button for Mobile */}
        <button
          className="md:hidden p-4 text-blue-500 font-semibold"
          onClick={() => setSelectedUser(null)}
        >
          &larr; Back
        </button>

        {/* Chat Header */}
        <div className={`p-4 border-b flex items-center justify-between ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
          {selectedUser ? (
            <h2 className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedUser.name}</h2>
          ) : (
            <p className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Select a user to start chatting</p>
          )}
        </div>

        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto p-4 lg:overflow-y-hidden lg:max-h-[calc(100vh-8rem)]">
          {selectedUser ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderEmail === user.email ? "justify-end" : "justify-start"} mb-2`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs ${
                    msg.senderEmail === user.email
                      ? "bg-blue-500 text-white"
                      : darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-300 text-gray-900"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          ) : (
            <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-500"}`}>Start chatting with a user</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {selectedUser && (
          <div
            className={`p-4 border-t flex items-center fixed bottom-0 w-full lg:relative lg:w-auto ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}
            style={{ zIndex: 10 }}
          >
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-2xl mr-2">
              😊
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 z-10">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "border-gray-300"} focus:ring-blue-500`}
            />
            <button onClick={handleSendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
              <FiSend className="text-xl" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
