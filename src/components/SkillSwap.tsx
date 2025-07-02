import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiService,
  type SkillSwapRecommendation,
  type SwapRequest,
  type DemandeSoutien,
} from "../services/api";
import "./SkillSwap.css";

interface Profile {
  id: number;
  name: string;
  avatar: string;
  skills: string[];
  level: string;
  filiere: string;
  bio: string;
  rating: number;
  exchanges: number;
  swap_score?: number;
  swap_details?: any;
}

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
}

interface SwapRequestModal {
  isOpen: boolean;
  profile: Profile | null;
}

// Mock messages for chat (these could be fetched from backend later)
const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 5,
    text: "Salut ! Quand est-ce qu'on commence notre session d'échange ?",
    timestamp: "2025-07-01T15:30:00",
  },
  {
    id: 2,
    senderId: 1,
    text: "Hey ! On peut commencer demain après-midi si tu veux ?",
    timestamp: "2025-07-01T15:32:00",
  },
  {
    id: 3,
    senderId: 5,
    text: "Parfait ! À quelle heure ? Je suis libre après 14h",
    timestamp: "2025-07-01T15:35:00",
  },
  {
    id: 4,
    senderId: 1,
    text: "15h ça te va ? On peut faire ça en visio ou en présentiel",
    timestamp: "2025-07-01T15:37:00",
  },
];

export default function SkillSwap() {
  const [activeTab, setActiveTab] = useState<"suggestions" | "requests">(
    "suggestions"
  );
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(
    null
  );
  const [chatMessages, setChatMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser] = useState({ id: 1, name: "John Doe" });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [swapRequestModal, setSwapRequestModal] = useState<SwapRequestModal>({
    isOpen: false,
    profile: null,
  });

  // Real data from backend
  const [recommendations, setRecommendations] = useState<
    SkillSwapRecommendation[]
  >([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [supportRequests, setSupportRequests] = useState<DemandeSoutien[]>([]);

  const navigate = useNavigate();

  // Load recommendations and requests from backend
  useEffect(() => {
    loadRecommendations();
    loadSwapRequests();
    loadSupportRequests();
  }, []);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getSkillSwapRecommendations(10);
      setRecommendations(data);
    } catch (err) {
      console.error("Failed to load recommendations:", err);

      // Temporary: Handle auth errors gracefully with mock data
      if (
        err instanceof Error &&
        (err.message.includes("401") || err.message.includes("auth"))
      ) {
        console.log("Using mock data for demonstration");

        // Mock recommendations data for UI preview
        const mockRecommendations: SkillSwapRecommendation[] = [
          {
            id: 1,
            nom: "Dupont",
            prenom: "Marie",
            score: 85,
            filiere: "WMD",
            niveau: "4",
            roles: [],
            interests: ["JavaScript", "React", "UI/UX"],
            competences: [
              { React: "avancé" },
              { JavaScript: "avancé" },
              { "Node.js": "intermédiaire" },
            ],
            swap_score: 0.92,
            swap_details: {
              skills_they_offer: [
                {
                  skill: "React",
                  their_level: 4,
                  your_level: 2,
                  benefit: "Improve from level 2 to 4",
                },
                {
                  skill: "JavaScript",
                  their_level: 4,
                  your_level: 3,
                  benefit: "Advanced techniques",
                },
              ],
              skills_you_offer: [
                {
                  skill: "Python",
                  your_level: 4,
                  their_level: 1,
                  benefit: "You can teach this skill",
                },
              ],
              mutual_benefits: [
                "Cross-domain collaboration between BDAI and WMD",
                "Complementary frontend/backend skills",
              ],
              skill_gaps_filled: 2,
              complementary_skills: 1,
            },
            recommendation_type: "skill_swap",
          },
          {
            id: 2,
            nom: "Martin",
            prenom: "Alex",
            score: 78,
            filiere: "BDAI",
            niveau: "3",
            roles: [],
            interests: ["Python", "Machine Learning", "Data Science"],
            competences: [
              { Python: "avancé" },
              { "Machine Learning": "intermédiaire" },
              { SQL: "avancé" },
            ],
            swap_score: 0.87,
            swap_details: {
              skills_they_offer: [
                {
                  skill: "Machine Learning",
                  their_level: 3,
                  your_level: 1,
                  benefit: "Learn new skill",
                },
                {
                  skill: "SQL",
                  their_level: 4,
                  your_level: 2,
                  benefit: "Database expertise",
                },
              ],
              skills_you_offer: [
                {
                  skill: "React",
                  your_level: 3,
                  their_level: 1,
                  benefit: "Frontend development",
                },
              ],
              mutual_benefits: [
                "Data Science meets Web Development",
                "Perfect for full-stack collaboration",
              ],
              skill_gaps_filled: 2,
              complementary_skills: 1,
            },
            recommendation_type: "skill_swap",
          },
          {
            id: 3,
            nom: "Rousseau",
            prenom: "Sophie",
            score: 92,
            filiere: "CCSN",
            niveau: "5",
            roles: [],
            interests: ["Cybersecurity", "Network", "Ethical Hacking"],
            competences: [
              { Cybersecurity: "avancé" },
              { "Network Security": "avancé" },
              { Linux: "avancé" },
            ],
            swap_score: 0.83,
            swap_details: {
              skills_they_offer: [
                {
                  skill: "Cybersecurity",
                  their_level: 4,
                  your_level: 0,
                  benefit: "New skill to learn",
                },
                {
                  skill: "Linux",
                  their_level: 4,
                  your_level: 2,
                  benefit: "System administration",
                },
              ],
              skills_you_offer: [
                {
                  skill: "Web Development",
                  your_level: 3,
                  their_level: 1,
                  benefit: "Modern web security",
                },
              ],
              mutual_benefits: [
                "Security meets Development",
                "Build secure applications together",
              ],
              skill_gaps_filled: 2,
              complementary_skills: 1,
            },
            recommendation_type: "skill_swap",
          },
        ];

        setRecommendations(mockRecommendations);

        // Show a notice that this is demo data
        setTimeout(() => {
          if (recommendations.length > 0) {
            console.log("📝 Demo Mode: Affichage des données de démonstration");
          }
        }, 1000);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des recommandations"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadSwapRequests = async () => {
    try {
      const received = await apiService.getReceivedSwapRequests();
      setSwapRequests(received);
    } catch (err) {
      console.error("Failed to load swap requests:", err);

      // Temporary: Handle auth errors gracefully with mock data
      if (
        err instanceof Error &&
        (err.message.includes("401") || err.message.includes("auth"))
      ) {
        console.log("Using mock swap requests for demonstration");

        // Mock swap requests for UI preview
        const mockRequests: SwapRequest[] = [
          {
            id: 1,
            sender_id: 5,
            receiver_id: 1,
            message:
              "Salut ! J'aimerais apprendre React avec toi, en échange je peux t'enseigner Python et Django !",
            status: "pending",
            created_at: "2025-07-02T14:30:00Z",
            skill_offered: "Python/Django",
            skill_wanted: "React",
          },
          {
            id: 2,
            sender_id: 8,
            receiver_id: 1,
            message:
              "Hello ! On pourrait faire un échange sur les bases de données ? J'ai de l'expérience en SQL et NoSQL.",
            status: "accepted",
            created_at: "2025-07-01T10:15:00Z",
            skill_offered: "SQL/MongoDB",
            skill_wanted: "JavaScript avancé",
          },
          {
            id: 3,
            sender_id: 12,
            receiver_id: 1,
            message:
              "Intéressé par un échange UI/UX contre du développement mobile ?",
            status: "pending",
            created_at: "2025-07-03T09:45:00Z",
            skill_offered: "UI/UX Design",
            skill_wanted: "React Native",
          },
        ];

        setSwapRequests(mockRequests);
      } else {
        setSwapRequests([]); // Show empty state for other errors
      }
    }
  };

  const loadSupportRequests = async () => {
    try {
      const myDemandes = await apiService.getMyDemandes();
      setSupportRequests(myDemandes);
    } catch (err) {
      console.error("Failed to load support requests:", err);

      // Temporary: Handle auth errors gracefully with mock data
      if (
        err instanceof Error &&
        (err.message.includes("401") || err.message.includes("auth"))
      ) {
        console.log("Using mock support requests for demonstration");

        // Mock support requests for UI preview
        const mockSupportRequests: DemandeSoutien[] = [
          {
            id: 1,
            demandeur_id: 1,
            helper_id: 7,
            competence_id: 3,
            competence_name: "Machine Learning",
            statut: "Pending",
            dateDemande: "2025-07-01T09:30:00Z",
          },
          {
            id: 2,
            demandeur_id: 1,
            competence_id: 8,
            competence_name: "Docker & Kubernetes",
            statut: "Approved",
            dateDemande: "2025-06-28T14:15:00Z",
          },
          {
            id: 3,
            demandeur_id: 1,
            helper_id: 12,
            competence_id: 5,
            competence_name: "UI/UX Design",
            statut: "Completed",
            dateDemande: "2025-06-25T11:20:00Z",
          },
          {
            id: 4,
            demandeur_id: 1,
            competence_id: 15,
            competence_name: "Cybersecurity Basics",
            statut: "Pending",
            dateDemande: "2025-07-03T16:45:00Z",
          },
        ];

        setSupportRequests(mockSupportRequests);
      } else {
        setSupportRequests([]);
      }
    }
  };

  // Convert backend recommendation to frontend profile format
  const convertRecommendationToProfile = (
    rec: SkillSwapRecommendation
  ): Profile => {
    // Extract skills from competences
    const skills = rec.competences
      .map((comp) => Object.keys(comp)[0] || "")
      .filter(Boolean);

    // Generate avatar URL
    const avatar = `https://i.pravatar.cc/150?img=${rec.id}`;

    // Create bio from swap details
    const bio =
      rec.swap_details?.mutual_benefits?.join(". ") ||
      `Étudiant en ${rec.filiere || "formation"} avec un score de ${
        rec.score
      }.`;

    return {
      id: rec.id,
      name: `${rec.prenom} ${rec.nom}`,
      avatar,
      skills,
      level: rec.niveau || "Non spécifié",
      filiere: rec.filiere || "Non spécifié",
      bio,
      rating: Math.min(5, Math.max(3, rec.swap_score || 4)),
      exchanges: Math.floor(rec.score / 10) || 1,
      swap_score: rec.swap_score,
      swap_details: rec.swap_details,
    };
  };

  // Convert profiles to display format
  const profiles = recommendations.map(convertRecommendationToProfile);

  const handleAcceptRequest = async (request: SwapRequest) => {
    try {
      await apiService.acceptSwapRequest(request.id);
      setSelectedRequest({ ...request, status: "accepted" });
      // Reload requests to update UI
      loadSwapRequests();
    } catch (err) {
      console.error("Failed to accept request:", err);
    }
  };

  const handleRejectRequest = async (request: SwapRequest) => {
    try {
      await apiService.rejectSwapRequest(request.id);
      // Reload requests to update UI
      loadSwapRequests();
    } catch (err) {
      console.error("Failed to reject request:", err);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: chatMessages.length + 1,
      senderId: currentUser.id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  const handleSendSwapRequest = (profile: Profile) => {
    // Open the smooth modal instead of using alerts/prompts
    setSwapRequestModal({
      isOpen: true,
      profile: profile,
    });
  };

  const confirmSwapRequest = async (
    profile: Profile,
    requestData: { message: string; skillOffered: string; skillWanted: string }
  ) => {
    try {
      await apiService.sendSwapRequest({
        receiver_id: profile.id,
        message: requestData.message,
        skill_offered: requestData.skillOffered,
        skill_wanted: requestData.skillWanted,
      });

      // Show success with smooth notification instead of alert
      showNotification(
        `Demande d'échange envoyée à ${profile.name} !`,
        "success"
      );

      // Reload requests to show the new one
      loadSwapRequests();
    } catch (err) {
      console.error("Failed to send swap request:", err);
      showNotification("Erreur lors de l'envoi de la demande", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    // Create a smooth notification system
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const handleCancelSupportRequest = async (requestId: number) => {
    try {
      await apiService.deleteDemande(requestId);
      showNotification("Demande de support annulée", "success");
      loadSupportRequests(); // Reload to update UI
    } catch (err) {
      console.error("Failed to cancel support request:", err);
      showNotification("Erreur lors de l'annulation", "error");
    }
  };

  const handleMarkCompleted = async (requestId: number) => {
    try {
      await apiService.updateDemande(requestId, { statut: "Completed" });
      showNotification("Support marqué comme terminé", "success");
      loadSupportRequests(); // Reload to update UI
    } catch (err) {
      console.error("Failed to mark as completed:", err);
      showNotification("Erreur lors de la mise à jour", "error");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`star ${i < Math.floor(rating) ? "filled" : ""}`}
      >
        ⭐
      </span>
    ));
  };

  const openChat = (request: SwapRequest) => {
    setSelectedRequest(request);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedRequest(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="skillswap-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement des recommandations IA...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="skillswap-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <button onClick={loadRecommendations} className="btn btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="skillswap-container">
      {/* Enhanced Navbar */}
      <nav className="skillswap-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button className="back-btn" onClick={() => navigate("/")}>
              ← Retour
            </button>
            <div className="page-title">
              <h1>Skill Swap IA</h1>
              <p>Recommandations intelligentes basées sur vos compétences</p>
            </div>
          </div>
          <div className="navbar-right">
            <div className="user-stats">
              <div className="stat">
                <span className="stat-number">{recommendations.length}</span>
                <span className="stat-label">Recommandations</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {swapRequests.filter((r) => r.status === "pending").length}
                </span>
                <span className="stat-label">En attente</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="skillswap-main">
        <div className="skillswap-content">
          {/* Left section - Tabs and Lists */}
          <div className="skillswap-left">
            {/* Enhanced Tabs with counters */}
            <div className="tabs">
              <button
                onClick={() => setActiveTab("suggestions")}
                className={`tab-button ${
                  activeTab === "suggestions" ? "active" : ""
                }`}
              >
                <span>Recommandations IA</span>
                <span className="tab-counter">{profiles.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`tab-button ${
                  activeTab === "requests" ? "active" : ""
                }`}
              >
                <span>Demandes</span>
                <span className="tab-counter">
                  {swapRequests.filter((r) => r.status === "pending").length}
                </span>
              </button>
            </div>

            {/* Filter Section */}
            <div className="filters">
              <select className="filter-select">
                <option value="">Toutes les filières</option>
                <option value="WMD">WMD</option>
                <option value="BDAI">BDAI</option>
                <option value="CCSN">CCSN</option>
              </select>
              <select className="filter-select">
                <option value="">Tous les niveaux</option>
                <option value="3">3ème année</option>
                <option value="4">4ème année</option>
                <option value="5">5ème année</option>
              </select>
              <button
                onClick={loadRecommendations}
                className="btn btn-secondary"
              >
                🔄 Actualiser
              </button>
            </div>

            {/* Content */}
            {activeTab === "suggestions" ? (
              <div className="profiles-list">
                {profiles.length === 0 ? (
                  <div className="empty-recommendations">
                    <div className="empty-icon">🤖</div>
                    <h3>Aucune recommandation disponible</h3>
                    <p>
                      Complétez votre profil pour obtenir des recommandations
                      personnalisées.
                    </p>
                  </div>
                ) : (
                  profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="profile-card enhanced"
                      onClick={() => setSelectedProfile(profile)}
                    >
                      <div className="profile-header">
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="profile-avatar"
                        />
                        <div className="profile-info">
                          <h3 className="profile-name">{profile.name}</h3>
                          <p className="profile-meta">
                            {profile.filiere} • {profile.level}
                          </p>
                          <div className="profile-rating">
                            {renderStars(profile.rating)}
                            <span className="rating-text">
                              ({profile.exchanges} échanges)
                            </span>
                          </div>
                          {profile.swap_score && (
                            <div className="ai-score">
                              <span className="ai-badge">
                                Score IA:{" "}
                                {(profile.swap_score * 100).toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="profile-actions">
                          <button
                            className="quick-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendSwapRequest(profile);
                            }}
                          >
                            Échanger
                          </button>
                        </div>
                      </div>
                      <div className="profile-bio">
                        <p>{profile.bio}</p>
                      </div>
                      <div className="skills-list">
                        {profile.skills.map((skill) => (
                          <span key={skill} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === "requests" ? (
              <div className="requests-list">
                {swapRequests.length === 0 ? (
                  <div className="empty-requests">
                    <div className="empty-icon">📬</div>
                    <h3>Aucune demande</h3>
                    <p>Vous n'avez pas encore reçu de demandes d'échange.</p>
                  </div>
                ) : (
                  swapRequests.map((request) => (
                    <div key={request.id} className="request-card enhanced">
                      <div className="request-header">
                        <img
                          src={`https://i.pravatar.cc/150?img=${request.sender_id}`}
                          alt="Profile"
                          className="profile-avatar"
                        />
                        <div className="request-content">
                          <div className="request-info">
                            <h3 className="profile-name">
                              Utilisateur #{request.sender_id}
                            </h3>
                            <div className="exchange-info">
                              <span className="exchange-offer">
                                Offre: {request.skill_offered}
                              </span>
                              <span className="exchange-arrow">→</span>
                              <span className="exchange-want">
                                Cherche: {request.skill_wanted}
                              </span>
                            </div>
                          </div>
                          <div className="request-status">
                            <span className={`status-badge ${request.status}`}>
                              {request.status === "pending"
                                ? "En attente"
                                : request.status === "accepted"
                                ? "Accepté"
                                : "Refusé"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="request-message">{request.message}</p>
                      <div className="request-date">
                        Reçu le{" "}
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>

                      {request.status === "pending" && (
                        <div className="request-actions">
                          <button
                            onClick={() => handleAcceptRequest(request)}
                            className="btn btn-primary"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request)}
                            className="btn btn-secondary"
                          >
                            Refuser
                          </button>
                        </div>
                      )}

                      {request.status === "accepted" && (
                        <button
                          onClick={() => openChat(request)}
                          className="btn btn-primary chat-btn"
                        >
                          💬 Ouvrir le chat
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="support-requests-list">
                {supportRequests.length === 0 ? (
                  <div className="empty-support-requests">
                    <div className="empty-icon">🆘</div>
                    <h3>Aucune demande de support</h3>
                    <p>Vous n'avez pas encore de demandes de support.</p>
                  </div>
                ) : (
                  supportRequests.map((request) => (
                    <div key={request.id} className="request-card enhanced">
                      <div className="request-header">
                        <div className="support-icon">
                          {request.statut === "Pending"
                            ? "⏳"
                            : request.statut === "Approved"
                            ? "✅"
                            : request.statut === "Completed"
                            ? "🎉"
                            : "❌"}
                        </div>
                        <div className="request-content">
                          <div className="request-info">
                            <h3 className="profile-name">
                              Aide pour {request.competence_name}
                            </h3>
                            <div className="support-meta">
                              <span className="support-date">
                                Demandé le{" "}
                                {new Date(
                                  request.dateDemande
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="request-status">
                            <span
                              className={`status-badge ${request.statut.toLowerCase()}`}
                            >
                              {request.statut === "Pending"
                                ? "En attente"
                                : request.statut === "Approved"
                                ? "Approuvé"
                                : request.statut === "Completed"
                                ? "Terminé"
                                : "Annulé"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="support-description">
                        <p>
                          Recherche d'un mentor pour m'aider à progresser en{" "}
                          {request.competence_name}
                        </p>
                        {request.helper_id && (
                          <p className="helper-info">
                            👨‍🏫 Helper assigné : Utilisateur #{request.helper_id}
                          </p>
                        )}
                      </div>

                      <div className="request-actions">
                        {request.statut === "Pending" && (
                          <button
                            onClick={() =>
                              handleCancelSupportRequest(request.id)
                            }
                            className="btn btn-secondary"
                          >
                            Annuler la demande
                          </button>
                        )}
                        {request.statut === "Approved" && (
                          <button
                            onClick={() => handleMarkCompleted(request.id)}
                            className="btn btn-primary"
                          >
                            Marquer comme terminé
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right section - Profile Details */}
          <div className="skillswap-right">
            {selectedProfile && (
              <div className="profile-details enhanced">
                <div className="profile-details-header">
                  <img
                    src={selectedProfile.avatar}
                    alt={selectedProfile.name}
                    className="profile-details-avatar"
                  />
                  <h2 className="profile-details-name">
                    {selectedProfile.name}
                  </h2>
                  <p className="profile-details-meta">
                    {selectedProfile.filiere} • {selectedProfile.level}
                  </p>
                  <div className="profile-stats">
                    <div className="stat-item">
                      <span className="stat-number">
                        {selectedProfile.rating}
                      </span>
                      <span className="stat-label">Rating</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">
                        {selectedProfile.exchanges}
                      </span>
                      <span className="stat-label">Échanges</span>
                    </div>
                    {selectedProfile.swap_score && (
                      <div className="stat-item">
                        <span className="stat-number">
                          {(selectedProfile.swap_score * 100).toFixed(0)}%
                        </span>
                        <span className="stat-label">Match IA</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="profile-bio-section">
                  <h3 className="section-title">À propos</h3>
                  <p className="bio-text">{selectedProfile.bio}</p>
                </div>

                <div className="skills-section">
                  <h3 className="section-title">Compétences</h3>
                  <div className="skills-list">
                    {selectedProfile.skills.map((skill) => (
                      <span key={skill} className="skill-tag enhanced">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedProfile.swap_details && (
                  <div className="swap-analysis">
                    <h3 className="section-title">
                      Analyse IA des échanges possibles
                    </h3>
                    <div className="swap-benefits">
                      {selectedProfile.swap_details.mutual_benefits?.map(
                        (benefit: string, index: number) => (
                          <div key={index} className="benefit-item">
                            <span className="benefit-icon">✨</span>
                            <span className="benefit-text">{benefit}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="action-buttons">
                  <button
                    className="btn btn-primary full-width"
                    onClick={() => handleSendSwapRequest(selectedProfile)}
                  >
                    Demander un échange
                  </button>
                  <button className="btn btn-secondary full-width">
                    Voir le profil complet
                  </button>
                </div>
              </div>
            )}

            {!selectedProfile && (
              <div className="empty-state">
                <div className="empty-icon">🤝</div>
                <h3>Recommandations IA</h3>
                <p>
                  Sélectionnez un profil recommandé par notre IA pour voir
                  l'analyse détaillée des échanges possibles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Chat */}
      {isChatOpen && selectedRequest && (
        <div className="floating-chat-overlay">
          <div className="floating-chat-container">
            <div className="floating-chat-header">
              <div className="chat-user-info">
                <img
                  src={`https://i.pravatar.cc/150?img=${selectedRequest.sender_id}`}
                  alt="Utilisateur"
                  className="chat-avatar"
                />
                <div className="chat-user-details">
                  <h3 className="chat-user-name">
                    Utilisateur #{selectedRequest.sender_id}
                  </h3>
                  <p className="chat-user-status">En ligne</p>
                </div>
              </div>
              <div className="chat-header-actions">
                <button className="chat-action-btn">📞</button>
                <button className="chat-action-btn">📹</button>
                <button className="chat-action-btn" onClick={closeChat}>
                  ✕
                </button>
              </div>
            </div>

            <div className="floating-chat-messages">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`floating-message ${
                    message.senderId === currentUser.id ? "sent" : "received"
                  }`}
                >
                  <div className="message-bubble">
                    <p className="message-text">{message.text}</p>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="floating-chat-input">
              <div className="chat-input-group">
                <button type="button" className="input-action-btn">
                  📎
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="floating-message-input"
                />
                <button type="button" className="input-action-btn">
                  😊
                </button>
                <button type="submit" className="floating-send-btn">
                  ➤
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Swap Request Modal (simplified for demo) */}
      {swapRequestModal.isOpen && swapRequestModal.profile && (
        <div className="swap-request-modal">
          <div className="modal-content">
            <span
              className="close-modal"
              onClick={() =>
                setSwapRequestModal({ isOpen: false, profile: null })
              }
            >
              &times;
            </span>
            <h2>Demande d'échange</h2>
            <p>
              Vous souhaitez échanger des compétences avec{" "}
              {swapRequestModal.profile.name} ?
            </p>
            <div className="modal-skills">
              <div className="skill-offered">
                <strong>Compétence proposée :</strong>{" "}
                {
                  swapRequestModal.profile.swap_details.skills_they_offer[0]
                    .skill
                }
              </div>
              <div className="skill-wanted">
                <strong>Compétence recherchée :</strong>{" "}
                {
                  swapRequestModal.profile.swap_details.skills_you_offer[0]
                    .skill
                }
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleSendSwapRequest(swapRequestModal.profile);
                  setSwapRequestModal({ isOpen: false, profile: null });
                }}
              >
                Confirmer l'échange
              </button>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setSwapRequestModal({ isOpen: false, profile: null })
                }
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
