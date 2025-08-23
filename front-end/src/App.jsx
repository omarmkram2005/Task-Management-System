import { useEffect, useState } from "react";
import { Route, Router, Routes } from "react-router-dom";
import GoCheckEmail from "./Auth/GoCheckEmail";
import Login from "./Auth/Login";
import ProtectedRoute from "./Auth/ProtectedRoutes";
import Signup from "./Auth/SignUp";
import "./Css/App.css";
import setTheme from "./Css/theme";
import Home from "./pages/Home";
import WebSite from "./pages/WebSite";
import { supabase } from "./supabase";
import SingleBoard from "./pages/SingleBoard";
import Error404 from "./Errors/Error404.jsx";
import Redirect from "./Errors/Redirect.jsx";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./Componants/EditProfile.jsx";
import AddTeam from "./Componants/AddTeam.jsx";
import ShowBoards from "./Componants/ShowBoards.jsx";
function App() {
  if (!window.localStorage.getItem("lang")) {
    window.localStorage.setItem("lang", "eng");
  }

  setTheme(window.localStorage.getItem("theme"));

  return (
    <div>
      <Routes>
        <Route path="123" element={<Error404 />}></Route>
        <Route element={<Redirect />} path="boards"></Route>
        <Route path="/" element={<WebSite />}>
          <Route element={<ProtectedRoute />}>
            <Route element={<Home />} path=""></Route>
            <Route element={<ShowBoards />} path="boards/personal"></Route>
            <Route element={<ShowBoards />} path="boards/team"></Route>
            <Route element={<SingleBoard />} path="boards/:id"></Route>
            <Route element={<Profile />} path="profile"></Route>
            <Route
              element={<EditProfile />}
              path="profile/edit/profile"
            ></Route>
            <Route element={<AddTeam />} path="profile/edit/team"></Route>
          </Route>

          <Route element={<Signup />} path="/signup"></Route>
          <Route element={<GoCheckEmail />} path="/signup/confermation"></Route>
          <Route element={<Login />} path="/login"></Route>
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  );
}

export default App;
