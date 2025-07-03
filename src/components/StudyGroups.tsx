import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, type StudyGroup } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./StudyGroups.css";

export default function StudyGroups() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [joinLoading, setJoinLoading] = useState<number | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const groupsData = await apiService.getAllGroups();
      setGroups(groupsData);
    } catch (err) {
      console.error("Error loading groups:", err);
      setError("Erreur lors du chargement des groupes");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    if (!user) return;

    try {
      setJoinLoading(groupId);
      await apiService.joinGroup(groupId);
      // Reload groups to update member counts
      await loadGroups();
    } catch (err) {
      console.error("Error joining group:", err);
      setError("Erreur lors de l'adhésion au groupe");
    } finally {
      setJoinLoading(null);
    }
  };

  const handleLeaveGroup = async (groupId: number) => {
    if (!user) return;

    try {
      setJoinLoading(groupId);
      await apiService.leaveGroup(groupId);
      // Reload groups to update member counts
      await loadGroups();
    } catch (err) {
      console.error("Error leaving group:", err);
      setError("Erreur lors de la sortie du groupe");
    } finally {
      setJoinLoading(null);
    }
  };

  const toggleExpandGroup = (groupId: number) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  // Get unique interests for filter
  const uniqueInterests = Array.from(
    new Set(groups.map((group) => group.centre_interet).filter(Boolean))
  ).sort();

  // Filter groups based on search and interest
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInterest =
      !selectedInterest || group.centre_interet === selectedInterest;
    return matchesSearch && matchesInterest;
  });

  const isUserInGroup = (group: StudyGroup) => {
    return user && group.membres.some((member) => member.id === user.id);
  };

  if (loading) {
    return (
      <div className="study-groups-layout">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement des groupes d'étude...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="study-groups-layout">
      {/* Enhanced Navbar */}
      <nav className="study-groups-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button className="back-btn" onClick={() => navigate("/")}>
              ← Retour
            </button>
            <div className="page-title">
              <h1>Groupes d'Étude</h1>
              <p>
                Rejoignez des groupes d'étude et collaborez avec d'autres
                étudiants
              </p>
            </div>
          </div>
          <div className="navbar-right">
            <div className="user-stats">
              <div className="stat">
                <span className="stat-number">{filteredGroups.length}</span>
                <span className="stat-label">Groupes</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {filteredGroups.reduce(
                    (total, group) => total + group.nombre_membres,
                    0
                  )}
                </span>
                <span className="stat-label">Membres Total</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="study-groups-container">
        <div className="study-groups-main">
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)} className="error-close">
                ×
              </button>
            </div>
          )}

          <div className="study-groups-filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher un groupe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-container">
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="filter-select"
              >
                <option value="">Tous les centres d'intérêt</option>
                {uniqueInterests.map((interest) => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="study-groups-grid">
            {filteredGroups.map((group) => (
              <div key={group.id} className="study-group-card">
                <div className="group-header">
                  <h3 className="group-name">{group.nom}</h3>
                  {group.centre_interet && (
                    <span className="group-interest-tag">
                      {group.centre_interet}
                    </span>
                  )}
                </div>

                <p className="group-description">{group.description}</p>

                <div className="group-stats">
                  <div className="group-members-count">
                    👥 {group.nombre_membres} membre
                    {group.nombre_membres > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="group-actions">
                  <button
                    onClick={() => toggleExpandGroup(group.id)}
                    className="btn btn-secondary"
                  >
                    {expandedGroup === group.id
                      ? "Masquer les membres"
                      : "Voir les membres"}
                  </button>

                  {isUserInGroup(group) ? (
                    <button
                      onClick={() => handleLeaveGroup(group.id)}
                      disabled={joinLoading === group.id}
                      className="btn btn-danger"
                    >
                      {joinLoading === group.id ? "En cours..." : "Quitter"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      disabled={joinLoading === group.id}
                      className="btn btn-primary"
                    >
                      {joinLoading === group.id ? "En cours..." : "Rejoindre"}
                    </button>
                  )}
                </div>

                {expandedGroup === group.id && (
                  <div className="group-members">
                    <h4 className="members-title">Membres du groupe</h4>
                    {group.membres.length > 0 ? (
                      <div className="members-list">
                        {group.membres.map((member) => (
                          <div key={member.id} className="member-card">
                            <div className="member-avatar">
                              {member.avatar ? (
                                <img
                                  src={member.avatar}
                                  alt={`${member.prenom} ${member.nom}`}
                                />
                              ) : (
                                <div className="avatar-placeholder">
                                  {member.prenom[0]}
                                  {member.nom[0]}
                                </div>
                              )}
                            </div>
                            <div className="member-info">
                              <div className="member-name">
                                {member.prenom} {member.nom}
                              </div>
                              {member.filiere && member.niveau && (
                                <div className="member-details">
                                  {member.filiere} - {member.niveau}ème année
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-members">Aucun membre pour le moment</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredGroups.length === 0 && !loading && (
            <div className="no-groups">
              <div className="no-groups-icon">📚</div>
              <h3>Aucun groupe trouvé</h3>
              <p>Essayez de modifier vos filtres de recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
