import React, { useState, useEffect, useContext } from 'react';
import { db, storage } from '../../firebase'; // Import Firebase config
import { collection, addDoc, onSnapshot, query, orderBy, where, doc, updateDoc } from 'firebase/firestore';
import { UserContext } from '../Context/context';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import EmojiPicker from 'emoji-picker-react';

const Messaging = ({ selectedUser }) => {
  const { user, darkMode } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const {userData}=useContext(UserContext)
  console.log("the user data is",userData)

  const chatId = [user.uid, selectedUser.id].sort().join('_'); // Create unique chat ID

  useEffect(() => {
    const fetchMessages = () => {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('timestamp'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(fetchedMessages);
      });

      return unsubscribe;
    };

    const fetchChatStatus = async () => {
      const userChatRef = doc(db, 'userChats', userData.id);
      const unsubscribe = onSnapshot(userChatRef, (docSnapshot) => {
        const chatData = docSnapshot.data()?.[chatId];
        setBlocked(chatData?.blocked || false);
      });
      
      return unsubscribe;
    };

    const unsubscribeMessages = fetchMessages();
    const unsubscribeStatus = fetchChatStatus();

    return () => {
      unsubscribeMessages && unsubscribeMessages();
      unsubscribeStatus && unsubscribeStatus();
    };
  }, [chatId, user, selectedUser]);

  const handleSendMessage = async () => {
    if (!message.trim() && !image) return;
  
    try {
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
        setImage(null);
      }
  
      // Assuming user.displayName holds the sender's name
      const senderName = user.name || "Anonymous"; 
  
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: user.uid,
        senderName: senderName,  // Add senderName to message
        receiverId: selectedUser.id,
        text: message,
        imageUrl,
        timestamp: new Date(),
      });
  
      await updateDoc(doc(db, 'userChats', user.uid), {
        [`${chatId}.lastMessage`]: message || 'Image',
        [`${chatId}.timestamp`]: new Date(),
        [`${chatId}.blocked`]: blocked,
      });
  
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.emoji);
  };

  return (
    <div className={`flex flex-col h-full p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`flex-grow overflow-y-auto p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`my-2 p-2 rounded-lg ${msg.senderId === user.uid ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            {msg.imageUrl && <img src={msg.imageUrl} alt="attachment" className="w-32 h-32 mb-2" />}
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {blocked ? (
        <p className="text-red-500 mt-4">You are blocked from sending messages to this user.</p>
      ) : (
        <>
          <div className="flex items-center mt-4">
            <input
              type="file"
              onChange={handleImageUpload}
              className="hidden"
              id="upload-image"
            />
            <label htmlFor="upload-image" className="cursor-pointer p-2">
              📷
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className={`flex-grow p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
            />
            <button onClick={handleSendMessage} className="ml-2 bg-blue-500 text-white p-2 rounded-lg">
              Send
            </button>
            <EmojiPicker onEmojiClick={handleEmojiSelect} />
          </div>
        </>
      )}
    </div>
  );
};

export default Messaging;
