import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LogOut,
  RefreshCw,
  Users,
  Bot,
  BookOpen,
  HelpCircle,
  User,
} from "lucide-react";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./Home.css";

export default function Home() {
  const { logout } = useAuth();
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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleAppClick = (appName: string) => {
    setActiveApp(appName);
    switch (appName) {
      case "Skill Swap":
        navigate("/skill-swap");
        break;
      case "Assistant IA":
        navigate("/ai-chatbot");
        break;
      case "Groupes d'Étude":
        navigate("/study-groups");
        break;
      case "Mentorship":
        navigate("/mentorship");
        break;
      case "Soutien Académique":
        navigate("/academic-support");
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
            <GraduationCap className="brand-icon" size={24} />
            <span className="brand-text">SchoolCollab</span>
          </div>

          <div className="navbar-actions">
            <div 
              className="user-profile"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
            >
              <User size={20} />
            </div>

            <div onClick={handleLogout} className="btn-icon">
              <LogOut size={20} />
            </div>
          </div>
        </div>
      </nav>

      <main className="home-main">
        <div className="apps-container">
          <div className="welcome-section">
            <h1 className="welcome-title">
              Bienvenue,{" "}
              <span className="user-highlight">{currentUser?.prenom} 🎉</span>
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
                <RefreshCw size={32} />
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
                <Users size={32} />
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
                <Bot size={32} />
              </div>
              <h3 className="app-name">Assistant IA</h3>
            </div>

            <div
              className={`app-card ${
                activeApp === "Groupes d'Étude" ? "active" : ""
              }`}
              onClick={() => handleAppClick("Groupes d'Étude")}
            >
              <div className="app-icon-wrapper study-groups">
                <BookOpen size={32} />
              </div>
              <h3 className="app-name">Groupes d'Étude</h3>
            </div>

            <div
              className={`app-card ${
                activeApp === "Soutien Académique" ? "active" : ""
              }`}
              onClick={() => handleAppClick("Soutien Académique")}
            >
              <div className="app-icon-wrapper academic-support">
                <HelpCircle size={32} />
              </div>
              <h3 className="app-name">Soutien Académique</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
