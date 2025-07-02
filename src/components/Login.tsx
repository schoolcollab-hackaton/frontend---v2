import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface LoginProps {
  setUser: (user: { isProfileComplete: boolean }) => void;
}

export default function Login({ setUser }: LoginProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock logic: if email contains 'complete', profile is complete
    const isProfileComplete = formData.email.includes("complete");
    setUser({ isProfileComplete });
    navigate(isProfileComplete ? "/" : "/complete-profile");
    setIsLoading(false);
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Connexion</h1>
          <p className="auth-subtitle">
            Connectez-vous à votre compte SchoolCollab
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-muted">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-primary-color">
              Créer un compte
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-muted">
            💡 Pour tester: utilisez "complete@test.com" pour un profil complet
          </p>
        </div>
      </div>
    </div>
  );
}
