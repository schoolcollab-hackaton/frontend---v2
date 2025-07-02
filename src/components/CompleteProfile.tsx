import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, type ProfileCompleteData } from "../services/api";
import "./CompleteProfile.css";

interface CompleteProfileProps {
  setUser: (user: { isProfileComplete: boolean }) => void;
}

const filieres = ["WMD", "API", "BDAI", "CCSN"];
const niveaux = [1, 2, 3, 4, 5];
const competenceNiveaux = ["débutant", "intermédiaire", "avancé"];

export default function CompleteProfile({ setUser }: CompleteProfileProps) {
  const [formData, setFormData] = useState({
    filiere: "",
    niveau: "" as number | "",
    competences: {} as { [key: string]: string },
    centresInteret: [] as string[],
    is_mentor: false,
    discord: "",
    linkedin: "",
  });

  // State for dynamic data from database
  const [competences, setCompetences] = useState<
    Array<{ nom: string; description: string }>
  >([]);
  const [centresInteret, setCentresInteret] = useState<
    Array<{ titre: string }>
  >([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Search and filter states
  const [competenceSearch, setCompetenceSearch] = useState("");
  const [interestSearch, setInterestSearch] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch competences and centres d'intérêt from database on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoadingData(true);
        const [competencesData, centresData] = await Promise.all([
          apiService.getCompetences(),
          apiService.getCentresInteret(),
        ]);

        setCompetences(competencesData);
        setCentresInteret(centresData);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError("Erreur lors du chargement des données du profil");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchProfileData();
  }, []);

  // Filter competences based on search
  const filteredCompetences = competences.filter((comp) =>
    comp.nom.toLowerCase().includes(competenceSearch.toLowerCase())
  );

  // Filter interests based on search
  const filteredInterests = centresInteret.filter((centre) =>
    centre.titre.toLowerCase().includes(interestSearch.toLowerCase())
  );

  // Get selected competences and interests for summary
  const selectedCompetences = Object.keys(formData.competences).filter(
    (comp) => formData.competences[comp]
  );

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

  const clearCompetences = () => {
    setFormData((prev) => ({ ...prev, competences: {} }));
  };

  const clearInterests = () => {
    setFormData((prev) => ({ ...prev, centresInteret: [] }));
  };

  const removeCompetence = (comp: string) => {
    setFormData((prev) => ({
      ...prev,
      competences: { ...prev.competences, [comp]: undefined },
    }));
  };

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      centresInteret: prev.centresInteret.filter((c) => c !== interest),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Filter out undefined competences
      const cleanedCompetences = Object.fromEntries(
        Object.entries(formData.competences).filter(
          ([_, value]) => value !== undefined
        )
      );

      const profileData: ProfileCompleteData = {
        filiere: formData.filiere,
        niveau: formData.niveau as number,
        competences: cleanedCompetences,
        centres_interet: formData.centresInteret,
        is_mentor: formData.is_mentor,
        discord: formData.discord || undefined,
        linkedin: formData.linkedin || undefined,
      };

      await apiService.completeProfile(profileData);

      // Update user state to mark profile as complete
      setUser({ isProfileComplete: true });

      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Profile completion failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Échec de la finalisation du profil"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="profile-layout">
        <div className="profile-card">
          <div className="auth-header">
            <h1 className="auth-title">Chargement...</h1>
            <p className="auth-subtitle">Récupération des données du profil</p>
          </div>
        </div>
      </div>
    );
  }

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
          {error && <div className="error-message">{error}</div>}

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
            <div className="section-header">
              <label className="form-label">Compétences</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span className="selected-count">
                  {selectedCompetences.length} sélectionnée(s)
                </span>
                {selectedCompetences.length > 0 && (
                  <button
                    type="button"
                    className="clear-selection-btn"
                    onClick={clearCompetences}
                  >
                    Effacer tout
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted mb-4">
              Recherchez et sélectionnez vos compétences, puis indiquez votre
              niveau
            </p>

            <input
              type="text"
              className="search-input"
              placeholder="🔍 Rechercher une compétence..."
              value={competenceSearch}
              onChange={(e) => setCompetenceSearch(e.target.value)}
            />

            <div className="competences-container">
              {filteredCompetences.length === 0 ? (
                <div className="no-results">
                  {competenceSearch
                    ? `Aucune compétence trouvée pour "${competenceSearch}"`
                    : "Aucune compétence disponible"}
                </div>
              ) : (
                <div className="competences-grid">
                  {filteredCompetences.map((comp) => (
                    <div key={comp.nom} className="competence-item">
                      <div className="competence-checkbox">
                        <input
                          type="checkbox"
                          id={comp.nom}
                          checked={
                            comp.nom in formData.competences &&
                            !!formData.competences[comp.nom]
                          }
                          onChange={(e) =>
                            handleCompetenceChange(comp.nom, e.target.checked)
                          }
                        />
                        <label htmlFor={comp.nom} className="competence-label">
                          {comp.nom}
                        </label>
                      </div>
                      {comp.nom in formData.competences &&
                        formData.competences[comp.nom] && (
                          <select
                            className="form-select competence-level"
                            value={formData.competences[comp.nom]}
                            onChange={(e) =>
                              handleCompetenceLevel(comp.nom, e.target.value)
                            }
                          >
                            {competenceNiveaux.map((niveau) => (
                              <option key={niveau} value={niveau}>
                                {niveau.charAt(0).toUpperCase() +
                                  niveau.slice(1)}
                              </option>
                            ))}
                          </select>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedCompetences.length > 0 && (
              <div className="selected-items-summary">
                <div className="selected-items-title">
                  Compétences sélectionnées :
                </div>
                <div className="selected-items-list">
                  {selectedCompetences.map((comp) => (
                    <span key={comp} className="selected-item-tag">
                      {comp} ({formData.competences[comp]})
                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => removeCompetence(comp)}
                        title="Supprimer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <div className="section-header">
              <label className="form-label">Centres d'intérêt</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span className="selected-count">
                  {formData.centresInteret.length} sélectionné(s)
                </span>
                {formData.centresInteret.length > 0 && (
                  <button
                    type="button"
                    className="clear-selection-btn"
                    onClick={clearInterests}
                  >
                    Effacer tout
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted mb-4">
              Recherchez et sélectionnez vos centres d'intérêt pour trouver des
              personnes avec des passions similaires
            </p>

            <input
              type="text"
              className="search-input"
              placeholder="🔍 Rechercher un centre d'intérêt..."
              value={interestSearch}
              onChange={(e) => setInterestSearch(e.target.value)}
            />

            <div className="interests-container">
              {filteredInterests.length === 0 ? (
                <div className="no-results">
                  {interestSearch
                    ? `Aucun centre d'intérêt trouvé pour "${interestSearch}"`
                    : "Aucun centre d'intérêt disponible"}
                </div>
              ) : (
                <div className="interests-grid">
                  {filteredInterests.map((centre) => (
                    <div key={centre.titre} className="interest-item">
                      <input
                        type="checkbox"
                        id={centre.titre}
                        checked={formData.centresInteret.includes(centre.titre)}
                        onChange={() => handleCentreChange(centre.titre)}
                      />
                      <label htmlFor={centre.titre} className="interest-label">
                        {centre.titre}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {formData.centresInteret.length > 0 && (
              <div className="selected-items-summary">
                <div className="selected-items-title">
                  Centres d'intérêt sélectionnés :
                </div>
                <div className="selected-items-list">
                  {formData.centresInteret.map((interest) => (
                    <span key={interest} className="selected-item-tag">
                      {interest}
                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => removeInterest(interest)}
                        title="Supprimer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Réseaux sociaux (optionnel)</label>
            <p className="text-sm text-muted mb-4">
              Ajoutez vos profils pour faciliter les échanges
            </p>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="discord">
                  Discord
                </label>
                <input
                  type="text"
                  id="discord"
                  className="form-input"
                  placeholder="@votre_pseudo"
                  value={formData.discord}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discord: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="linkedin">
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedin"
                  className="form-input"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      linkedin: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="interest-item">
              <input
                type="checkbox"
                id="is_mentor"
                checked={formData.is_mentor}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_mentor: e.target.checked,
                  }))
                }
              />
              <label htmlFor="is_mentor" className="interest-label">
                Je souhaite devenir mentor pour aider d'autres étudiants
              </label>
            </div>
            <p className="text-sm text-muted">
              En tant que mentor, vous pourrez partager vos connaissances et
              guider d'autres étudiants
            </p>
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
