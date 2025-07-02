import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiService, type LoginData } from "../services/api";

interface LoginProps {
  setUser: (user: { isProfileComplete: boolean }) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
}

export default function Login({ setUser, setIsAuthenticated }: LoginProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loginData: LoginData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await apiService.login(loginData);

      // Use the actual profile_completed field from backend response
      setUser({ isProfileComplete: response.user.profile_completed });
      setIsAuthenticated(true);

      // Navigate based on actual profile completion status
      if (response.user.profile_completed) {
        navigate("/");
      } else {
        navigate("/complete-profile");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
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
          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

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
            <Link
              to="/register"
              style={{
                color: "var(--primary-color)",
                textDecoration: "none",
              }}
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
