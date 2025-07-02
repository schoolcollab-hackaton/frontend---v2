import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Register from "./components/Register.tsx";
import Login from "./components/Login.tsx";
import CompleteProfile from "./components/CompleteProfile.tsx";
import Home from "./components/Home.tsx";
import "./App.css";

function App() {
  const [user, setUser] = useState<{ isProfileComplete: boolean } | null>(null);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/complete-profile"
            element={
              user && !user.isProfileComplete ? (
                <CompleteProfile setUser={setUser} />
              ) : (
                <Navigate to={user ? "/" : "/login"} />
              )
            }
          />
          <Route
            path="/"
            element={
              user ? (
                user.isProfileComplete ? (
                  <Home user={user} setUser={setUser} />
                ) : (
                  <Navigate to="/complete-profile" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
