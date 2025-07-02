interface HomeProps {
  user: { isProfileComplete: boolean };
  setUser: (user: { isProfileComplete: boolean } | null) => void;
}

export default function Home({ user, setUser }: HomeProps) {
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="home-layout">
      <nav className="navbar">
        <div className="navbar-brand">SchoolCollab</div>
        <div className="navbar-nav">
          <span className="text-sm text-muted">Bienvenue !</span>
          <button onClick={handleLogout} className="btn btn-outline">
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="text-center">
          <h1 className="auth-title">Bienvenue sur SchoolCollab ! 🎉</h1>
          <p className="auth-subtitle mb-4">
            Votre profil est maintenant complet. Explorez la plateforme et
            connectez-vous avec vos camarades.
          </p>

          <div
            className="grid grid-2"
            style={{ maxWidth: 800, margin: "2rem auto" }}
          >
            <div className="auth-card">
              <h3
                style={{ marginBottom: "1rem", color: "var(--primary-color)" }}
              >
                📚 Publications
              </h3>
              <p className="text-sm text-muted">
                Partagez vos projets, posez des questions et découvrez le
                contenu de vos camarades.
              </p>
            </div>

            <div className="auth-card">
              <h3
                style={{ marginBottom: "1rem", color: "var(--primary-color)" }}
              >
                👥 Groupes
              </h3>
              <p className="text-sm text-muted">
                Rejoignez des groupes selon vos centres d'intérêt et collaborez
                sur des projets.
              </p>
            </div>

            <div className="auth-card">
              <h3
                style={{ marginBottom: "1rem", color: "var(--primary-color)" }}
              >
                🤝 Parrainage
              </h3>
              <p className="text-sm text-muted">
                Trouvez un mentor ou devenez parrain pour aider les étudiants
                plus jeunes.
              </p>
            </div>

            <div className="auth-card">
              <h3
                style={{ marginBottom: "1rem", color: "var(--primary-color)" }}
              >
                🤖 Assistant IA
              </h3>
              <p className="text-sm text-muted">
                Utilisez notre chatbot intelligent pour obtenir de l'aide et des
                recommandations.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
