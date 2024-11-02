import React, { useContext, useState } from "react";
import Form from "./Components/Form";
import { Toaster } from "react-hot-toast";
import { Routes, Route, useNavigate } from "react-router-dom";
import Nav from "./Components/Nav";
import Home from "./pages/Home";
import UserPosts from "./pages/UserPosts";
import JobList from "./Components/Jobs";
import Messaging from "./Components/Messaging";
import ProfileSetUp from "./pages/ProfileSetUp";
import { UserContext } from "./Context/context";
import MyJobs from "./pages/MyJobs";
import Activity from "./pages/Activity";
import Users from "./Components/Users";
import ChatComponent from "./Components/ChatComponent";
import EditProfile from "./Components/EditProfile";

const App = () => {
  const { user, darkMode } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(true); 
  const navigate=useNavigate()

  const handleOpenEditProfile = () => {
    setIsEditing(true);
  };

  const handleCloseEditProfile = () => {
    setIsEditing(false);
    navigate("/home")
  };

  return (
    <div className={darkMode ? 'bg-gray-900 text-gray-300 min-h-screen' : 'bg-white text-gray-900 min-h-screen'}>
      <Toaster />
      <Nav />
      <Routes>
        {!user ? <Route path="/" element={<Form />} /> : ""}
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={
          <>
            {<EditProfile user={user} onClose={handleCloseEditProfile} />}
          </>
        } />
        <Route path="/posts" element={<UserPosts />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/myjobs" element={<MyJobs />} />
        <Route path="/messages" element={<ChatComponent />} />
      </Routes>
    </div>
  );
};

export default App;
