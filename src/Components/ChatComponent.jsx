import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../Context/context";
import { db } from "../../firebase";
import { collection, doc, addDoc, updateDoc, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
import Users from "./Users";
import EmojiPicker from 'emoji-picker-react';
import { FiSend } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ChatComponent = () => {
  const { user } = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [unreadUsers, setUnreadUsers] = useState({});
  
  // Create a reference to the messages container
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

  // Fetch and update messages when a user is selected
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

  // Scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const chatId = [user.email, selectedUser.email].sort().join("_");
    const messagesRef = collection(db, "messages", chatId, "chat");

    await addDoc(messagesRef, {
      text: newMessage,
      senderEmail: user.email,
      receiverEmail: selectedUser.email,
      timestamp: serverTimestamp(),
      read: false
    });

    setNewMessage("");
    setShowEmojiPicker(false);
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r p-4 bg-gray-100 dark:bg-gray-800">
        <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Users</h2>
        <Users onSelectUser={setSelectedUser} selectedUser={selectedUser} unreadUsers={unreadUsers} />
      </div>

      <div className="w-3/4 flex flex-col bg-gray-50 dark:bg-gray-900">
        {selectedUser ? (
          <>
            <div className="flex items-center justify-between p-4 border-b bg-gray-200 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{selectedUser.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderEmail === user.email ? "justify-end" : "justify-start"} mb-2`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-xs ${
                      msg.senderEmail === user.email
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {/* Scroll reference element */}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-gray-200 dark:bg-gray-800 flex items-center">
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-2xl mr-2">
                😊
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-16 left-1/4 z-10">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button onClick={handleSendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                <FiSend className="text-xl" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500 dark:text-gray-300">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
