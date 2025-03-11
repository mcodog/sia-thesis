import React from "react";
import { Route, Routes } from "react-router-dom";
import ClientLayout from "./Layouts/ClientLayout";
import "./App.css";

import Welcome from "./Pages/Welcome";
import Quiz from "./Pages/Quiz";
import Profile from "./Pages/Profile";
import About from "./Pages/About";
import Admin from "./Pages/Admin";
import Print from "./Pages/Print";

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

import { Provider } from "react-redux";
import { store, persistor } from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" theme="light" />
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Welcome />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/print" element={<Print />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </PersistGate>
    </Provider>
  );
};

export default App;
