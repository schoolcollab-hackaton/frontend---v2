import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Register from "./components/Register.tsx";
import Login from "./components/Login.tsx";
import CompleteProfile from "./components/CompleteProfile.tsx";
import Home from "./components/Home.tsx";
import "./App.css";

function AppRoutes() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/register" 
        element={!isAuthenticated ? <Register /> : <Navigate to="/" />} 
      />
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
      />
      <Route
        path="/complete-profile"
        element={
          isAuthenticated && user && !user.profile_completed ? (
            <CompleteProfile />
          ) : (
            <Navigate to={isAuthenticated ? "/" : "/login"} />
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
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
