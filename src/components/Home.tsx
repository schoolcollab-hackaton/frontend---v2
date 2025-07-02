import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import "./Home.css";

interface HomeProps {
  user: { isProfileComplete: boolean };
  setUser: (user: { isProfileComplete: boolean } | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
}

export default function Home({ user, setUser, setIsAuthenticated }: HomeProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleAppClick = (appName: string) => {
    setActiveApp(appName);
    switch (appName) {
      case "Skill Swap":
        navigate("/skill-swap");
        break;
      // Add other app routes here
      default:
        console.log(`Opening ${appName} app...`);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de votre espace personnel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-layout">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="brand-logo">
            <span className="brand-emoji">🎓</span>
            <span className="brand-text">SchoolCollab</span>
          </div>

          <div className="navbar-actions">
            <div className="notifications">
              <button className="btn-icon">
                <span>🔔</span>
                <span className="notification-badge">2</span>
              </button>
            </div>

            <div className="user-profile">
              <img
                src={currentUser?.avatar || "https://via.placeholder.com/32"}
                alt="Profile"
                className="user-avatar"
              />
            </div>

            <button onClick={handleLogout} className="btn-icon">
              <span>↪️</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="home-main">
        <div className="apps-container">
          <div className="welcome-section">
            <h1 className="welcome-title">
              <span className="user-highlight">{currentUser?.prenom}</span>
            </h1>
          </div>

          <div className="apps-row">
            <div
              className={`app-card ${
                activeApp === "Skill Swap" ? "active" : ""
              }`}
              onClick={() => handleAppClick("Skill Swap")}
            >
              <div className="app-icon-wrapper skill-swap">
                <span>🔄</span>
              </div>
              <h3 className="app-name">Skill Swap</h3>
            </div>

            <div
              className={`app-card ${
                activeApp === "Mentorship" ? "active" : ""
              }`}
              onClick={() => handleAppClick("Mentorship")}
            >
              <div className="app-icon-wrapper mentorship">
                <span>🤝</span>
              </div>
              <h3 className="app-name">Mentorship</h3>
            </div>

            <div
              className={`app-card ${
                activeApp === "Assistant IA" ? "active" : ""
              }`}
              onClick={() => handleAppClick("Assistant IA")}
            >
              <div className="app-icon-wrapper chatbot">
                <span>🤖</span>
              </div>
              <h3 className="app-name">Assistant IA</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
