import React, { useContext } from "react";
import Form from "./Components/Form";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import Nav from "./Components/Nav";
import Home from "./pages/Home";
import UserPosts from "./pages/UserPosts";
import JobList from "./Components/Jobs";
import Messaging from "./Components/Messaging";
import ProfileSetUp from "./pages/ProfileSetUp";
import { UserContext } from "./Context/context";
import MyJobs from "./pages/MyJobs";
import Activity from "./pages/Activity";

const App = () => {
  const { user, darkMode } = useContext(UserContext);

  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
      <Toaster />
      <Nav />
      <Routes>
        {!user ? <Route path="/" element={<Form />} /> : ""}
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfileSetUp />} />
        <Route path="/posts" element={<UserPosts />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/myjobs" element={<MyJobs />} />
        <Route path="/messages" element={<Messaging />} />
      </Routes>
    </div>
  );
};

export default App;
