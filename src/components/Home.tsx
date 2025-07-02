import { useState, useEffect } from "react";
import { apiService } from "../services/api";

interface HomeProps {
  user: { isProfileComplete: boolean };
  setUser: (user: { isProfileComplete: boolean } | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
}

interface DashboardStats {
  totalUsers: number;
  totalPublications: number;
  skillSwaps: number;
  mentorships: number;
}

export default function Home({ user, setUser, setIsAuthenticated }: HomeProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPublications: 0,
    skillSwaps: 0,
    mentorships: 0,
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      setCurrentUser(userData);

      // Mock stats for now - you can replace with real API calls later
      setStats({
        totalUsers: 156,
        totalPublications: 89,
        skillSwaps: 34,
        mentorships: 12,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="home-layout">
        <nav className="navbar">
          <div className="navbar-brand">SchoolCollab</div>
          <div className="navbar-nav">
            <div className="loading-spinner">Chargement...</div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="home-layout">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">🎓 SchoolCollab</div>
        <div className="navbar-nav">
          <span className="user-welcome">
            Bonjour, {currentUser?.prenom || "Utilisateur"} !
          </span>
          <button onClick={handleLogout} className="btn btn-outline">
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <main className="main-content">
        {/* Welcome Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Tableau de Bord SchoolCollab</h1>
          <p className="dashboard-subtitle">
            Explorez nos trois principales fonctionnalités pour enrichir votre
            parcours étudiant
          </p>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Étudiants actifs</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>{stats.totalPublications}</h3>
              <p>Publications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3>{stats.skillSwaps}</h3>
              <p>Échanges de compétences</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🤝</div>
            <div className="stat-content">
              <h3>{stats.mentorships}</h3>
              <p>Parrainages actifs</p>
            </div>
          </div>
        </div>

        {/* Main Apps Section */}
        <div className="apps-section">
          <h2 className="section-title">Nos Applications</h2>
          <div className="apps-grid">
            {/* Skill Swap App */}
            <div className="app-card skill-swap">
              <div className="app-header">
                <div className="app-icon">🔄</div>
                <h3 className="app-title">Skill Swap</h3>
              </div>
              <div className="app-content">
                <p className="app-description">
                  Échangez vos compétences avec d'autres étudiants. Enseignez ce
                  que vous maîtrisez et apprenez de nouvelles compétences auprès
                  de vos pairs.
                </p>
                <div className="app-features">
                  <div className="feature">
                    <span className="feature-icon">📖</span>
                    <span>Partager ses compétences</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🎯</span>
                    <span>Apprendre de nouveaux skills</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">⭐</span>
                    <span>Système de notation</span>
                  </div>
                </div>
              </div>
              <div className="app-actions">
                <button className="btn btn-primary app-btn">
                  Explorer Skill Swap
                </button>
                <button className="btn btn-outline app-btn">
                  Proposer une compétence
                </button>
              </div>
            </div>

            {/* Chatbot Assistant App */}
            <div className="app-card chatbot">
              <div className="app-header">
                <div className="app-icon">🤖</div>
                <h3 className="app-title">Assistant IA</h3>
              </div>
              <div className="app-content">
                <p className="app-description">
                  Notre assistant intelligent vous aide à naviguer dans la
                  plateforme, trouve des réponses à vos questions et vous
                  recommande des connexions.
                </p>
                <div className="app-features">
                  <div className="feature">
                    <span className="feature-icon">💬</span>
                    <span>Support 24/7</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🔍</span>
                    <span>Recommandations personnalisées</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📋</span>
                    <span>Aide navigation</span>
                  </div>
                </div>
              </div>
              <div className="app-actions">
                <button className="btn btn-primary app-btn">
                  Discuter avec l'IA
                </button>
                <button className="btn btn-outline app-btn">
                  Historique des conversations
                </button>
              </div>
            </div>

            {/* Mentorship App */}
            <div className="app-card mentorship">
              <div className="app-header">
                <div className="app-icon">🤝</div>
                <h3 className="app-title">Mentorship</h3>
              </div>
              <div className="app-content">
                <p className="app-description">
                  Connectez-vous avec des mentors expérimentés ou devenez mentor
                  pour guider les étudiants plus jeunes dans leur parcours
                  académique.
                </p>
                <div className="app-features">
                  <div className="feature">
                    <span className="feature-icon">👨‍🏫</span>
                    <span>Trouver un mentor</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🌟</span>
                    <span>Devenir mentor</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📈</span>
                    <span>Suivi des progrès</span>
                  </div>
                </div>
              </div>
              <div className="app-actions">
                <button className="btn btn-primary app-btn">
                  Explorer Mentorship
                </button>
                <button className="btn btn-outline app-btn">
                  Devenir mentor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="quick-actions-section">
          <h2 className="section-title">Actions Rapides</h2>
          <div className="quick-actions-grid">
            <button className="quick-action-card">
              <span className="action-icon">📝</span>
              <div className="action-content">
                <h4>Nouvelle Publication</h4>
                <p>Partager un projet ou une question</p>
              </div>
            </button>
            <button className="quick-action-card">
              <span className="action-icon">👥</span>
              <div className="action-content">
                <h4>Rejoindre un Groupe</h4>
                <p>Trouver des groupes par centres d'intérêt</p>
              </div>
            </button>
            <button className="quick-action-card">
              <span className="action-icon">⚙️</span>
              <div className="action-content">
                <h4>Modifier Profil</h4>
                <p>Mettre à jour vos informations</p>
              </div>
            </button>
            <button className="quick-action-card">
              <span className="action-icon">📊</span>
              <div className="action-content">
                <h4>Mes Statistiques</h4>
                <p>Voir votre progression</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
