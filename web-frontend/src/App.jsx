import React from "react";
import { Route, Routes } from "react-router-dom";
import ClientLayout from "./Layouts/ClientLayout";
import "./App.css";

import Welcome from "./Pages/Welcome";
import Quiz from "./Pages/Quiz";
import About from "./Pages/About";

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

import { Provider } from "react-redux";
import store from "./Redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Welcome />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/about" element={<About />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Provider>
  );
};

export default App;
