import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiService,
  type MentorRecommendation,
  type MentorshipRequest,
  type MentorshipRelationship,
} from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./Mentorship.css";

type ActiveTab = "recommendations" | "requests" | "relationships";

export default function Mentorship() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>("recommendations");
  const [recommendations, setRecommendations] = useState<
    MentorRecommendation[]
  >([]);
  const [receivedRequests, setReceivedRequests] = useState<MentorshipRequest[]>(
    []
  );
  const [sentRequests, setSentRequests] = useState<MentorshipRequest[]>([]);
  const [myMentors, setMyMentors] = useState<MentorshipRelationship[]>([]);
  const [myMentees, setMyMentees] = useState<MentorshipRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<{
    [key: number]: string;
  }>({});
  const [sendingRequest, setSendingRequest] = useState<number | null>(null);
  const [processingRequest, setProcessingRequest] = useState<number | null>(
    null
  );
  const [managingRelationship, setManagingRelationship] = useState<
    number | null
  >(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === "recommendations") {
        const recommendationsData = await apiService.getMentorRecommendations(
          10
        );
        setRecommendations(recommendationsData);
      } else if (activeTab === "requests") {
        const [received, sent] = await Promise.all([
          apiService.getReceivedMentorshipRequests(),
          apiService.getSentMentorshipRequests(),
        ]);
        setReceivedRequests(received);
        setSentRequests(sent);
      } else if (activeTab === "relationships") {
        const [mentors, mentees] = await Promise.all([
          apiService.getMyMentors(),
          apiService.getMyMentees(),
        ]);
        setMyMentors(mentors);
        setMyMentees(mentees);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (receiverId: number) => {
    const message = requestMessage[receiverId]?.trim();
    if (!message || !user) return;

    try {
      setSendingRequest(receiverId);
      await apiService.sendMentorshipRequest({
        receiver_id: receiverId,
        message: message,
      });
      setRequestMessage((prev) => ({ ...prev, [receiverId]: "" }));
      setError(null);
      // Optionally reload data or show success message
    } catch (err) {
      console.error("Error sending request:", err);
      setError("Erreur lors de l'envoi de la demande");
    } finally {
      setSendingRequest(null);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      setProcessingRequest(requestId);
      await apiService.acceptMentorshipRequest(requestId);
      await loadData(); // Reload to update the lists
    } catch (err) {
      console.error("Error accepting request:", err);
      setError("Erreur lors de l'acceptation");
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      setProcessingRequest(requestId);
      await apiService.rejectMentorshipRequest(requestId);
      await loadData(); // Reload to update the lists
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError("Erreur lors du refus");
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRemoveRelationship = async (relationshipId: number) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cette relation de mentorat ?"
      )
    )
      return;

    try {
      setManagingRelationship(relationshipId);
      await apiService.removeMentorship(relationshipId);
      await loadData(); // Reload to update the lists
    } catch (err) {
      console.error("Error removing relationship:", err);
      setError("Erreur lors de la suppression de la relation");
    } finally {
      setManagingRelationship(null);
    }
  };

  const handleBlockRelationship = async (relationshipId: number) => {
    if (
      !confirm("Êtes-vous sûr de vouloir bloquer cette relation de mentorat ?")
    )
      return;

    try {
      setManagingRelationship(relationshipId);
      await apiService.blockMentorship(relationshipId);
      await loadData(); // Reload to update the lists
    } catch (err) {
      console.error("Error blocking relationship:", err);
      setError("Erreur lors du blocage de la relation");
    } finally {
      setManagingRelationship(null);
    }
  };

  const handleUnblockRelationship = async (relationshipId: number) => {
    try {
      setManagingRelationship(relationshipId);
      await apiService.unblockMentorship(relationshipId);
      await loadData(); // Reload to update the lists
    } catch (err) {
      console.error("Error unblocking relationship:", err);
      setError("Erreur lors du déblocage de la relation");
    } finally {
      setManagingRelationship(null);
    }
  };

  const renderRecommendations = () => (
    <div className="mentorship-content">
      <h2 className="section-title">Mentors Recommandés</h2>
      <div className="recommendations-grid">
        {recommendations.map((mentor) => (
          <div key={mentor.id} className="mentor-card">
            <div className="mentor-header">
              <div className="mentor-avatar">
                {mentor.avatar ? (
                  <img
                    src={mentor.avatar}
                    alt={`${mentor.prenom} ${mentor.nom}`}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {mentor.prenom[0]}
                    {mentor.nom[0]}
                  </div>
                )}
              </div>
              <div className="mentor-info">
                <h3 className="mentor-name">
                  {mentor.prenom} {mentor.nom}
                </h3>
                <p className="mentor-details">
                  {mentor.filiere} - {mentor.niveau}ème année
                </p>
                <div className="mentor-score">
                  Score de compatibilité: {mentor.match_score * 100}%
                </div>
              </div>
            </div>
            {mentor.mentorship_details && (
              <div className="mentor-details-section">
                <div className="mentorship-areas">
                  <h4>Domaines de mentorat:</h4>
                  <div className="areas-list">
                    {mentor.mentorship_details.mentorship_areas.map(
                      (area, index) => (
                        <span key={index} className="area-tag">
                          {area}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="compatibility-scores">
                  <div className="score-item">
                    <span>
                      Expérience: {mentor.mentorship_details.experience_match}%
                    </span>
                  </div>
                  <div className="score-item">
                    <span>
                      Compétences: {mentor.mentorship_details.skill_alignment}%
                    </span>
                  </div>
                  <div className="score-item">
                    <span>
                      Compatibilité:{" "}
                      {mentor.mentorship_details.compatibility_score}%
                    </span>
                  </div>
                </div>

                <div className="mentor-contacts">
                  {mentor.discord && (
                    <div className="contact-item">
                      <strong>Discord:</strong> {mentor.discord}
                    </div>
                  )}
                  {mentor.linkedin && (
                    <div className="contact-item">
                      <strong>LinkedIn:</strong> {mentor.linkedin}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mentor-request-section">
              <textarea
                placeholder="Écrivez votre message de demande de mentorat..."
                value={requestMessage[mentor.id] || ""}
                onChange={(e) =>
                  setRequestMessage((prev) => ({
                    ...prev,
                    [mentor.id]: e.target.value,
                  }))
                }
                className="request-textarea"
                rows={3}
              />
              <button
                onClick={() => handleSendRequest(mentor.id)}
                disabled={
                  !requestMessage[mentor.id]?.trim() ||
                  sendingRequest === mentor.id
                }
                className="btn btn-primary"
              >
                {sendingRequest === mentor.id
                  ? "Envoi..."
                  : "Demander un mentorat"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="mentorship-content">
      <div className="requests-sections">
        <div className="received-requests">
          <h2 className="section-title">Demandes Reçues</h2>
          {receivedRequests.length > 0 ? (
            <div className="requests-list">
              {receivedRequests.map((request) => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <div className="request-status">
                      <span className={`status-badge status-${request.status}`}>
                        {request.status === "pending"
                          ? "En attente"
                          : request.status === "accepted"
                          ? "Accepté"
                          : "Refusé"}
                      </span>
                    </div>
                    <div className="request-date">
                      {new Date(request.created_at).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <div className="request-content">
                    <p className="request-message">{request.message}</p>
                  </div>
                  {request.status === "pending" && (
                    <div className="request-actions">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        disabled={processingRequest === request.id}
                        className="btn btn-success"
                      >
                        {processingRequest === request.id
                          ? "Traitement..."
                          : "Accepter"}
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={processingRequest === request.id}
                        className="btn btn-danger"
                      >
                        {processingRequest === request.id
                          ? "Traitement..."
                          : "Refuser"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Aucune demande reçue</p>
          )}
        </div>

        <div className="sent-requests">
          <h2 className="section-title">Demandes Envoyées</h2>
          {sentRequests.length > 0 ? (
            <div className="requests-list">
              {sentRequests.map((request) => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <div className="request-status">
                      <span className={`status-badge status-${request.status}`}>
                        {request.status === "pending"
                          ? "En attente"
                          : request.status === "accepted"
                          ? "Accepté"
                          : "Refusé"}
                      </span>
                    </div>
                    <div className="request-date">
                      {new Date(request.created_at).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <div className="request-content">
                    <p className="request-message">{request.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Aucune demande envoyée</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderRelationships = () => (
    <div className="mentorship-content">
      <div className="relationships-sections">
        <div className="my-mentors">
          <h2 className="section-title">Mes Mentors</h2>
          {myMentors.length > 0 ? (
            <div className="relationships-list">
              {myMentors.map((relationship) => (
                <div key={relationship.id} className="relationship-card">
                  <div className="relationship-header">
                    <div className="person-avatar">
                      {relationship.mentor?.avatar ? (
                        <img
                          src={relationship.mentor.avatar}
                          alt={`${relationship.mentor.prenom} ${relationship.mentor.nom}`}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {relationship.mentor
                            ? `${relationship.mentor.prenom[0]}${relationship.mentor.nom[0]}`
                            : "M"}
                        </div>
                      )}
                    </div>
                    <div className="person-info">
                      <h3 className="person-name">
                        {relationship.mentor
                          ? `${relationship.mentor.prenom} ${relationship.mentor.nom}`
                          : "Mentor"}
                      </h3>
                      <p className="relationship-date">
                        Depuis le{" "}
                        {new Date(relationship.date_added).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                    <div className="relationship-status">
                      <span
                        className={`status-badge status-${relationship.status}`}
                      >
                        {relationship.status === "active" ? "Actif" : "Bloqué"}
                      </span>
                    </div>
                  </div>
                  <div className="relationship-actions">
                    {relationship.status === "active" ? (
                      <button
                        onClick={() => handleBlockRelationship(relationship.id)}
                        disabled={managingRelationship === relationship.id}
                        className="btn btn-warning btn-sm"
                      >
                        {managingRelationship === relationship.id
                          ? "Blocage..."
                          : "Bloquer"}
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleUnblockRelationship(relationship.id)
                        }
                        disabled={managingRelationship === relationship.id}
                        className="btn btn-success btn-sm"
                      >
                        {managingRelationship === relationship.id
                          ? "Déblocage..."
                          : "Débloquer"}
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveRelationship(relationship.id)}
                      disabled={managingRelationship === relationship.id}
                      className="btn btn-danger btn-sm"
                    >
                      {managingRelationship === relationship.id
                        ? "Suppression..."
                        : "Supprimer"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Vous n'avez pas encore de mentor</p>
          )}
        </div>

        <div className="my-mentees">
          <h2 className="section-title">Mes Mentorés</h2>
          {myMentees.length > 0 ? (
            <div className="relationships-list">
              {myMentees.map((relationship) => (
                <div key={relationship.id} className="relationship-card">
                  <div className="relationship-header">
                    <div className="person-avatar">
                      {relationship.utilisateur?.avatar ? (
                        <img
                          src={relationship.utilisateur.avatar}
                          alt={`${relationship.utilisateur.prenom} ${relationship.utilisateur.nom}`}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {relationship.utilisateur
                            ? `${relationship.utilisateur.prenom[0]}${relationship.utilisateur.nom[0]}`
                            : "U"}
                        </div>
                      )}
                    </div>
                    <div className="person-info">
                      <h3 className="person-name">
                        {relationship.utilisateur
                          ? `${relationship.utilisateur.prenom} ${relationship.utilisateur.nom}`
                          : "Utilisateur"}
                      </h3>
                      <p className="relationship-date">
                        Depuis le{" "}
                        {new Date(relationship.date_added).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                    <div className="relationship-status">
                      <span
                        className={`status-badge status-${relationship.status}`}
                      >
                        {relationship.status === "active" ? "Actif" : "Bloqué"}
                      </span>
                    </div>
                  </div>
                  <div className="relationship-actions">
                    {relationship.status === "active" ? (
                      <button
                        onClick={() => handleBlockRelationship(relationship.id)}
                        disabled={managingRelationship === relationship.id}
                        className="btn btn-warning btn-sm"
                      >
                        {managingRelationship === relationship.id
                          ? "Blocage..."
                          : "Bloquer"}
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleUnblockRelationship(relationship.id)
                        }
                        disabled={managingRelationship === relationship.id}
                        className="btn btn-success btn-sm"
                      >
                        {managingRelationship === relationship.id
                          ? "Déblocage..."
                          : "Débloquer"}
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveRelationship(relationship.id)}
                      disabled={managingRelationship === relationship.id}
                      className="btn btn-danger btn-sm"
                    >
                      {managingRelationship === relationship.id
                        ? "Suppression..."
                        : "Supprimer"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Vous n'avez pas encore de mentoré</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mentorship-container">
      {/* Enhanced Navbar */}
      <nav className="mentorship-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button className="back-btn" onClick={() => navigate("/")}>
              ← Retour
            </button>
            <div className="page-title">
              <h1>Mentorat</h1>
              <p>
                Trouvez des mentors ou devenez mentor pour d'autres étudiants
              </p>
            </div>
          </div>
          <div className="navbar-right">
            <div className="user-stats">
              <div className="stat">
                <span className="stat-number">{recommendations.length}</span>
                <span className="stat-label">Recommandations</span>
              </div>
              <div className="stat">
                <span className="stat-number">{receivedRequests.length}</span>
                <span className="stat-label">Demandes reçues</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {myMentors.length + myMentees.length}
                </span>
                <span className="stat-label">Relations</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="mentorship-main">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="error-close">
              ×
            </button>
          </div>
        )}

        <div className="mentorship-tabs">
          <button
            className={`tab-button ${
              activeTab === "recommendations" ? "active" : ""
            }`}
            onClick={() => setActiveTab("recommendations")}
          >
            Recommandations
          </button>
          <button
            className={`tab-button ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            Demandes
          </button>
          <button
            className={`tab-button ${
              activeTab === "relationships" ? "active" : ""
            }`}
            onClick={() => setActiveTab("relationships")}
          >
            Mes Relations
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Chargement...</p>
          </div>
        ) : (
          <>
            {activeTab === "recommendations" && renderRecommendations()}
            {activeTab === "requests" && renderRequests()}
            {activeTab === "relationships" && renderRelationships()}
          </>
        )}
      </div>
    </div>
  );
}
