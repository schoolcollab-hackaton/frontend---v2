import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface RegisterProps {
  setUser: (user: { isProfileComplete: boolean }) => void;
}

export default function Register({ setUser }: RegisterProps) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
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

    setUser({ isProfileComplete: false });
    navigate("/complete-profile");
    setIsLoading(false);
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
            <Link to="/login" className="text-primary-color">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
