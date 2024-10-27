import React from "react";
import Form from "./Components/Form";
import { Toaster } from "react-hot-toast";
import { Routes, Router, Route } from "react-router-dom";
import Nav from "./Components/Nav";
import Home from "./pages/Home";
import UserPosts from "./pages/UserPosts";
import JobList from "./Components/Jobs";
// import MediaUpload from "./Compoenents/Media";
import Messaging from "./Components/Messaging";
import ProfileSetUp from "./pages/ProfileSetUp";
const App = () => {
  return (
    <div>
      {/* <MediaUpload/> */}
      <Toaster />
      <Nav />
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/posts" element={<UserPosts/>}/>
        <Route path="/jobs" element={<JobList/>}/>
        <Route path="/messages" element={<Messaging/>}/>
        <Route path="/profile" element={<ProfileSetUp/>}/>
      </Routes>
    </div>
  );
};

export default App;
