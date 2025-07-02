import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./components/Register.tsx";
import Login from "./components/Login.tsx";
import CompleteProfile from "./components/CompleteProfile.tsx";
import Home from "./components/Home.tsx";
import SkillSwap from "./components/SkillSwap.tsx";
import { apiService } from "./services/api";
import "./App.css";

function App() {
  const [user, setUser] = useState<{ isProfileComplete: boolean } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try to get current user - if this fails, user is not authenticated
      const userData = await apiService.getCurrentUser();
      if (userData) {
        // Now we can use the actual profile_completed field from backend
        setUser({ isProfileComplete: userData.profile_completed });
        setIsAuthenticated(true);
      }
    } catch (error) {
      // User not authenticated or token expired
      console.log("User not authenticated:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate
                  to={user?.isProfileComplete ? "/" : "/complete-profile"}
                />
              ) : (
                <Register
                  setUser={setUser}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={user?.isProfileComplete ? "/" : "/complete-profile"}
                />
              ) : (
                <Login
                  setUser={setUser}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )
            }
          />
          <Route
            path="/complete-profile"
            element={
              isAuthenticated ? (
                user && !user.isProfileComplete ? (
                  <CompleteProfile setUser={setUser} />
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
                user?.isProfileComplete ? (
                  <Home
                    user={user}
                    setUser={setUser}
                    setIsAuthenticated={setIsAuthenticated}
                  />
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
                user?.isProfileComplete ? (
                  <SkillSwap />
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
