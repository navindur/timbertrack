import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home Page */}
        <Route path="/signup" element={<SignUpForm />} /> {/* Sign Up Page */}
        <Route path="/login" element={<LoginForm />} /> {/* Login Page */}
      </Routes>
    </Router>
  );
};

export default App;
