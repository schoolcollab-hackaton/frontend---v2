import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register.tsx";
import Login from "./components/Login.tsx";
import CompleteProfile from "./components/CompleteProfile.tsx";
import Home from "./components/Home.tsx";
import SkillSwap from "./components/SkillSwap.tsx";
import AiChatbot from "./components/AiChatbot.tsx";
import StudyGroups from "./components/StudyGroups.tsx";
import Mentorship from "./components/Mentorship.tsx";
import AcademicSupport from "./components/AcademicSupport.tsx";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate
                  to={user?.profile_completed ? "/" : "/complete-profile"}
                />
              ) : (
                <Register />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={user?.profile_completed ? "/" : "/complete-profile"}
                />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/complete-profile"
            element={
              isAuthenticated ? (
                user && !user.profile_completed ? (
                  <CompleteProfile />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                user?.profile_completed ? (
                  <Home />
                ) : (
                  <Navigate to="/complete-profile" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/skill-swap"
            element={
              isAuthenticated ? (
                user?.profile_completed ? (
                  <SkillSwap />
                ) : (
                  <Navigate to="/complete-profile" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/ai-chatbot"
            element={
              isAuthenticated ? (
                user?.profile_completed ? (
                  <AiChatbot />
                ) : (
                  <Navigate to="/complete-profile" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/study-groups"
            element={
              isAuthenticated ? (
                user?.profile_completed ? (
                  <StudyGroups />
                ) : (
                  <Navigate to="/complete-profile" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/mentorship"
            element={
              isAuthenticated ? (
                user?.profile_completed ? (
                  <Mentorship />
                ) : (
                  <Navigate to="/complete-profile" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/academic-support"
            element={
              isAuthenticated ? (
                user?.profile_completed ? (
                  <AcademicSupport />
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
