import React, { useState } from "react";

const Messaging = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey, how are you?", sender: "other" },
    { id: 2, text: "I'm good, thanks! How about you?", sender: "me" },
    { id: 3, text: "Are you coming to the meeting tomorrow?", sender: "other" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: inputValue, sender: "me" }]);
      setInputValue("");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg mt-5">
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="p-4 h-60 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${message.sender === "me" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block rounded-lg px-4 py-2 ${
                message.sender === "me" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex p-4 border-t border-gray-300">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Messaging;
