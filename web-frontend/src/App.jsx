import React from "react";
import { Route, Routes } from "react-router-dom";
import ClientLayout from "./Layouts/ClientLayout";
import AdminLayout from "./Layouts/AdminLayout";
import "./App.css";

import Welcome from "./Pages/Welcome";
import Quiz from "./Pages/Quiz";
import Profile from "./Pages/Profile";
import About from "./Pages/About";
import Admin from "./Pages/Admin";
import Admin2 from "./Pages/Admin2";
import Admin3 from "./Pages/Admin3";
import Print from "./Pages/Print";
import Transcripts from "./Pages/Transcripts";

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

import { Provider } from "react-redux";
import { store, persistor } from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";

import Dashboard from "./Pages/Admin/Dashboard";
import Users from "./Pages/Admin/Users";
import Settings from "./Pages/Admin/Settings";
import Conversation from "./Pages/Conversation";

const App = () => {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" theme="light" />
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Welcome />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/print" element={<Print />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/analytics/general" element={<Admin />} />
            <Route path="/admin/analytics/users" element={<Admin2 />} />
            <Route path="/admin/analytics/questions" element={<Admin3 />} />
            <Route path="/admin/wellness-dashboard" element={<Transcripts />} />
            <Route
              path="/admin/wellness-dashboard/user"
              element={<Conversation />}
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </PersistGate>
    </Provider>
  );
};

export default App;
