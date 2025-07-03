import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  GraduationCap,
  Award,
  ArrowLeft,
  Edit,
  Github,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { apiService, type User as UserType } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="error-state">
        <p>Erreur lors du chargement du profil</p>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="profile-layout">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button
              onClick={() => navigate("/")}
              className="btn-icon back-button"
            >
              <ArrowLeft size={20} color="black"/>
            </button>
            <div className="brand-logo">
              <GraduationCap className="brand-icon" size={24} />
              <span className="brand-text">SchoolCollab</span>
            </div>
          </div>

          <div className="navbar-actions">
            <button onClick={handleLogout} className="btn-icon">
              <User size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={`${currentUser.prenom} ${currentUser.nom}`}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  <User size={48} />
                </div>
              )}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">
                {currentUser.prenom} {currentUser.nom}
              </h1>
              <p className="profile-email">{currentUser.email}</p>
              <div className="profile-stats">
                <div className="stat-item">
                  <Award size={16} />
                  <span>{currentUser.score} points</span>
                </div>
              </div>
            </div>
            <button className="btn btn-secondary edit-profile">
              <Edit size={16} />
              Modifier
            </button>
          </div>

          <div className="profile-sections">
            <div className="profile-section">
              <h2 className="section-title">Informations académiques</h2>
              <div className="section-content">
                <div className="info-item">
                  <GraduationCap size={20} />
                  <div>
                    <span className="info-label">Filière</span>
                    <span className="info-value">
                      {currentUser.filiere || "Non spécifiée"}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <Award size={20} />
                  <div>
                    <span className="info-label">Niveau</span>
                    <span className="info-value">
                      {currentUser.niveau
                        ? `Niveau ${currentUser.niveau}`
                        : "Non spécifié"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2 className="section-title">Contact</h2>
              <div className="section-content">
                <div className="info-item">
                  <Mail size={20} />
                  <div>
                    <span className="info-label">Email</span>
                    <span className="info-value">{currentUser.email}</span>
                  </div>
                </div>
                {currentUser.discord && (
                  <div className="info-item">
                    <MessageCircle size={20} />
                    <div>
                      <span className="info-label">Discord</span>
                      <span className="info-value">{currentUser.discord}</span>
                    </div>
                  </div>
                )}
                {currentUser.linkedin && (
                  <div className="info-item">
                    <Linkedin size={20} />
                    <div>
                      <span className="info-label">LinkedIn</span>
                      <a
                        href={currentUser.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-link"
                      >
                        Voir le profil
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-section">
              <h2 className="section-title">Statut du profil</h2>
              <div className="section-content">
                <div className="status-item">
                  <div
                    className={`status-indicator ${
                      currentUser.profile_completed ? "completed" : "incomplete"
                    }`}
                  ></div>
                  <span>
                    {currentUser.profile_completed
                      ? "Profil complet"
                      : "Profil incomplet"}
                  </span>
                </div>
                {!currentUser.profile_completed && (
                  <button
                    onClick={() => navigate("/complete-profile")}
                    className="btn btn-primary"
                  >
                    Compléter le profil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}