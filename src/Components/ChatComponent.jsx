import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../Context/context";
import { db } from "../../firebase";
import { collection, doc, addDoc, query, onSnapshot, orderBy } from "firebase/firestore";
import Users from "./Users";

const ChatComponent = () => {
  const { user } = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages between the logged-in user and the selected user
  useEffect(() => {
    if (!user || !selectedUser) return;

    const chatId = [user.email, selectedUser.email].sort().join("_");
    const messagesRef = collection(db, "messages", chatId, "chat");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [user, selectedUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const chatId = [user.email, selectedUser.email].sort().join("_");
    const messagesRef = collection(db, "messages", chatId, "chat");

    await addDoc(messagesRef, {
      text: newMessage,
      senderEmail: user.email,
      receiverEmail: selectedUser.email,
      timestamp: new Date(),
    });

    setNewMessage("");
  };

  return (
    <div className="flex h-screen">
      {/* User List */}
      <div className="w-1/4 border-r p-4">
        <h2 className="font-semibold text-lg mb-4">Users</h2>
        <Users onSelectUser={setSelectedUser} selectedUser={selectedUser} />
      </div>

      {/* Chat Area */}
      <div className="w-3/4 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderEmail === user.email ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`${
                      msg.senderEmail === user.email ? "bg-blue-500 text-white" : "bg-gray-300"
                    } p-2 rounded-lg max-w-xs`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
