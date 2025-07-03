import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiService,
  type SkillSwapRecommendation,
  type SwapRequest,
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
  const [sentRequests, setSentRequests] = useState<SwapRequest[]>([]);

  const navigate = useNavigate();

  // Load recommendations and requests from backend
  useEffect(() => {
    loadRecommendations();
    loadSwapRequests();
    loadSentRequests();
  }, []);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("=== LOADING RECOMMENDATIONS FROM BACKEND ===");
      const data = await apiService.getSkillSwapRecommendations(10);
      console.log("Raw recommendations received from API:", data);
      console.log("Number of recommendations:", data.length);

      // Log each recommendation in detail
      data.forEach((rec, index) => {
        console.log(`=== RAW RECOMMENDATION ${index + 1} ===`);
        console.log("Complete object:", rec);
        console.log("Filiere:", rec.filiere, "Type:", typeof rec.filiere);
        console.log("Niveau:", rec.niveau, "Type:", typeof rec.niveau);
        console.log("Competences structure:", rec.competences);
        console.log("Competences length:", rec.competences?.length);
        if (rec.competences && rec.competences.length > 0) {
          console.log("First competence:", rec.competences[0]);
          console.log(
            "Competence keys:",
            Object.keys(rec.competences[0] || {})
          );
        }
        console.log("Swap details:", rec.swap_details);
        console.log("=== END RAW RECOMMENDATION ===");
      });

      setRecommendations(data);
    } catch (err) {
      console.error("Failed to load recommendations:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des recommandations"
      );
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
      setSwapRequests([]); // Show empty state for other errors
    }
  };

  const loadSentRequests = async () => {
    try {
      const sent = await apiService.getSentSwapRequests();
      setSentRequests(sent);
    } catch (err) {
      console.error("Failed to load sent requests:", err);
      setSentRequests([]);
    }
  };

  // Convert backend recommendation to frontend profile format
  const convertRecommendationToProfile = (
    rec: SkillSwapRecommendation
  ): Profile => {
    console.log("=== CONVERTING RECOMMENDATION TO PROFILE ===");
    console.log("Raw recommendation data:", rec);
    console.log("ID:", rec.id);
    console.log("Name:", rec.prenom, rec.nom);
    console.log("Filiere:", rec.filiere, "Type:", typeof rec.filiere);
    console.log("Niveau:", rec.niveau, "Type:", typeof rec.niveau);
    console.log("Score:", rec.score);
    console.log("Swap Score:", rec.swap_score);
    console.log("Competences:", rec.competences);
    console.log("Interests:", rec.interests);
    console.log("Roles:", rec.roles);
    console.log("Swap Details:", rec.swap_details);

    // Fix filiere enum values (remove "FiliereEnum." prefix)
    const cleanFiliere =
      typeof rec.filiere === "string"
        ? rec.filiere.replace(/^FiliereEnum\./, "")
        : rec.filiere;

    // Fix niveau - convert to string if it's a number
    const cleanNiveau = rec.niveau ? String(rec.niveau) : "Non spécifié";

    // Extract skills from competences - handle different possible structures
    let skills: string[] = [];

    if (Array.isArray(rec.competences)) {
      skills = rec.competences
        .map((comp) => {
          console.log("Processing competence:", comp);

          // Handle different competence structures
          if (typeof comp === "string") {
            return comp;
          } else if (typeof comp === "object" && comp !== null) {
            // If it's an object with a "nom" property
            if ("nom" in comp && typeof comp.nom === "string") {
              return comp.nom;
            }
            // If it's an object like {"React": "avancé"}
            const keys = Object.keys(comp);
            if (keys.length > 0 && keys[0] !== "nom") {
              return keys[0]; // Return the skill name (key)
            }
            // If it has only "nom" as key, it might be malformed
            if (keys.length === 1 && keys[0] === "nom") {
              return String(comp[keys[0]]);
            }
          }
          return null;
        })
        .filter(
          (skill): skill is string =>
            skill !== null && skill !== "" && skill !== "nom"
        );
    }

    console.log("Final extracted skills:", skills);

    // Generate avatar URL
    const avatar = `https://i.pravatar.cc/150?img=${rec.id}`;

    // Create bio - fix enum values in mutual benefits
    let bio = "";
    if (
      rec.swap_details?.mutual_benefits &&
      Array.isArray(rec.swap_details.mutual_benefits)
    ) {
      bio = rec.swap_details.mutual_benefits
        .map((benefit) =>
          typeof benefit === "string"
            ? benefit.replace(/FiliereEnum\./g, "") // Remove all FiliereEnum. prefixes
            : String(benefit)
        )
        .join(". ");
    }

    // Fallback bio if no mutual benefits
    if (!bio) {
      bio = `Étudiant en ${cleanFiliere || "formation"} avec un score de ${
        rec.score
      }.`;
    }

    console.log("Generated bio:", bio);

    const profile = {
      id: rec.id,
      name: `${rec.prenom} ${rec.nom}`,
      avatar,
      skills,
      level: cleanNiveau,
      filiere: cleanFiliere || "Non spécifié",
      bio,
      rating: Math.min(5, Math.max(3, rec.swap_score || 4)),
      exchanges: Math.floor(rec.score / 10) || 1,
      swap_score: rec.swap_score,
      swap_details: rec.swap_details,
    };

    console.log("Final converted profile:", profile);
    console.log("=== END CONVERSION ===\n");

    return profile;
  };

  // Convert profiles to display format
  const profiles = recommendations.map(convertRecommendationToProfile);

  // Check if a profile has already been contacted
  const isAlreadyContacted = (profileId: number) => {
    return sentRequests.some((request) => request.receiver_id === profileId);
  };

  // Filter profiles to hide already contacted ones OR mark them as contacted
  const getFilteredProfiles = () => {
    return profiles.map((profile) => ({
      ...profile,
      isContacted: isAlreadyContacted(profile.id),
    }));
  };

  // Get profiles with contact status
  const profilesWithStatus = getFilteredProfiles();

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

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
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
                {profilesWithStatus.length === 0 ? (
                  <div className="empty-recommendations">
                    <div className="empty-icon">🤖</div>
                    <h3>Aucune recommandation disponible</h3>
                    <p>
                      Complétez votre profil pour obtenir des recommandations
                      personnalisées.
                    </p>
                  </div>
                ) : (
                  profilesWithStatus.map((profile) => (
                    <div
                      key={profile.id}
                      className={`profile-card enhanced ${
                        profile.isContacted ? "contacted" : ""
                      }`}
                      onClick={() => handleProfileClick(profile)}
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
                                Score IA: {profile.swap_score.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="profile-actions">
                          {profile.isContacted ? (
                            <div className="contacted-badge">
                              <span className="contacted-text">
                                ✓ Déjà demandé
                              </span>
                            </div>
                          ) : (
                            <button
                              className="quick-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendSwapRequest(profile);
                              }}
                            >
                              Échanger
                            </button>
                          )}
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
            ) : (
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
                                Type: {request.type}
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
                          {selectedProfile.swap_score.toFixed(2)}
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
                        (benefit: string, index: number) => {
                          // Clean enum values from benefit text
                          const cleanBenefit =
                            typeof benefit === "string"
                              ? benefit.replace(/FiliereEnum\./g, "")
                              : String(benefit);

                          return (
                            <div key={index} className="benefit-item">
                              <span className="benefit-icon">✨</span>
                              <span className="benefit-text">
                                {cleanBenefit}
                              </span>
                            </div>
                          );
                        }
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

      {/* Swap Request Modal (updated for backend integration) */}
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
                <strong>Profil:</strong> {swapRequestModal.profile.filiere} •{" "}
                {swapRequestModal.profile.level}
              </div>
              <div className="skill-wanted">
                <strong>Compétences:</strong>{" "}
                {swapRequestModal.profile.skills.join(", ")}
              </div>
            </div>
            <textarea
              placeholder="Écrivez votre message d'échange..."
              className="modal-message-input"
              id="swap-message"
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                resize: "vertical",
                fontFamily: "inherit",
                fontSize: "0.9rem",
                margin: "1rem 0",
              }}
            />
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  const messageInput = document.getElementById(
                    "swap-message"
                  ) as HTMLTextAreaElement;
                  const message =
                    messageInput?.value || "Demande d'échange de compétences";

                  confirmSwapRequest(swapRequestModal.profile!, {
                    message,
                    skillOffered: "",
                    skillWanted: "",
                  });
                  setSwapRequestModal({ isOpen: false, profile: null });
                }}
              >
                Envoyer la demande
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
