import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiService, type RegisterData } from "../services/api";

interface RegisterProps {
  setUser: (user: { isProfileComplete: boolean }) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
}

export default function Register({
  setUser,
  setIsAuthenticated,
}: RegisterProps) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
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
      const registerData: RegisterData = {
        nom: formData.lastname,
        prenom: formData.firstname,
        email: formData.email,
        password: formData.password,
      };

      const response = await apiService.register(registerData);

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
      console.error("Registration failed:", error);
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Créer un compte</h1>
          <p className="auth-subtitle">
            Rejoignez SchoolCollab et connectez-vous avec vos camarades
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

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="firstname">
                Prénom
              </label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                className="form-input"
                placeholder="Votre prénom"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lastname">
                Nom
              </label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                className="form-input"
                placeholder="Votre nom"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
            {isLoading ? "Création en cours..." : "Créer mon compte"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-muted">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              style={{
                color: "var(--primary-color)",
                textDecoration: "none",
              }}
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
