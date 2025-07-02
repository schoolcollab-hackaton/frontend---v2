import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CompleteProfileProps {
  setUser: (user: { isProfileComplete: boolean }) => void;
}

const filieres = ["WMD", "API", "BDAI", "CCSN"];
const niveaux = [1, 2, 3, 4, 5];
const competences = [
  "React",
  "Python",
  "JavaScript",
  "SQL",
  "Node.js",
  "FastAPI",
  "Machine Learning",
  "UI/UX Design",
  "DevOps",
  "Mobile Development",
];
const competenceNiveaux = ["débutant", "intermédiaire", "avancé"];
const centresInteret = [
  "Football",
  "Basketball",
  "Échecs",
  "Cinéma",
  "Musique",
  "Lecture",
  "Gaming",
  "Voyage",
  "Photographie",
  "Cuisine",
];

export default function CompleteProfile({ setUser }: CompleteProfileProps) {
  const [formData, setFormData] = useState({
    filiere: "",
    niveau: "" as number | "",
    competences: {} as { [key: string]: string },
    centresInteret: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCompetenceChange = (comp: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      competences: checked
        ? { ...prev.competences, [comp]: competenceNiveaux[0] }
        : { ...prev.competences, [comp]: undefined },
    }));
  };

  const handleCompetenceLevel = (comp: string, level: string) => {
    setFormData((prev) => ({
      ...prev,
      competences: { ...prev.competences, [comp]: level },
    }));
  };

  const handleCentreChange = (centre: string) => {
    setFormData((prev) => ({
      ...prev,
      centresInteret: prev.centresInteret.includes(centre)
        ? prev.centresInteret.filter((c) => c !== centre)
        : [...prev.centresInteret, centre],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setUser({ isProfileComplete: true });
    navigate("/");
    setIsLoading(false);
  };

  return (
    <div className="profile-layout">
      <div className="profile-card">
        <div className="auth-header">
          <h1 className="auth-title">Complétez votre profil</h1>
          <p className="auth-subtitle">
            Aidez-nous à vous connecter avec les bonnes personnes
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="filiere">
                Filière *
              </label>
              <select
                id="filiere"
                className="form-select"
                value={formData.filiere}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, filiere: e.target.value }))
                }
                required
              >
                <option value="">Choisir votre filière</option>
                {filieres.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="niveau">
                Niveau *
              </label>
              <select
                id="niveau"
                className="form-select"
                value={formData.niveau}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    niveau: Number(e.target.value),
                  }))
                }
                required
              >
                <option value="">Choisir votre niveau</option>
                {niveaux.map((n) => (
                  <option key={n} value={n}>
                    Année {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Compétences</label>
            <p className="text-sm text-muted mb-4">
              Sélectionnez vos compétences et indiquez votre niveau
            </p>
            <div className="competences-grid">
              {competences.map((comp) => (
                <div key={comp} className="competence-item">
                  <div className="competence-checkbox">
                    <input
                      type="checkbox"
                      id={comp}
                      checked={
                        comp in formData.competences &&
                        !!formData.competences[comp]
                      }
                      onChange={(e) =>
                        handleCompetenceChange(comp, e.target.checked)
                      }
                    />
                    <label htmlFor={comp} className="competence-label">
                      {comp}
                    </label>
                  </div>
                  {comp in formData.competences &&
                    formData.competences[comp] && (
                      <select
                        className="form-select competence-level"
                        value={formData.competences[comp]}
                        onChange={(e) =>
                          handleCompetenceLevel(comp, e.target.value)
                        }
                      >
                        {competenceNiveaux.map((niveau) => (
                          <option key={niveau} value={niveau}>
                            {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
                          </option>
                        ))}
                      </select>
                    )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Centres d'intérêt</label>
            <p className="text-sm text-muted mb-4">
              Sélectionnez vos centres d'intérêt pour trouver des personnes avec
              des passions similaires
            </p>
            <div className="interests-grid">
              {centresInteret.map((centre) => (
                <div key={centre} className="interest-item">
                  <input
                    type="checkbox"
                    id={centre}
                    checked={formData.centresInteret.includes(centre)}
                    onChange={() => handleCentreChange(centre)}
                  />
                  <label htmlFor={centre} className="interest-label">
                    {centre}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? "Finalisation du profil..." : "Finaliser mon profil"}
          </button>
        </form>
      </div>
    </div>
  );
}
