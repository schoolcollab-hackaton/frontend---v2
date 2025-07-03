import { useState, useEffect } from 'react';
import { apiService, type DemandeSoutienDetailed, type CommentCreate } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './AcademicSupport.css';

export default function AcademicSupport() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DemandeSoutienDetailed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
  const [commentLoading, setCommentLoading] = useState<number | null>(null);

  useEffect(() => {
    loadSupportRequests();
  }, []);

  const loadSupportRequests = async () => {
    try {
      setLoading(true);
      const requestsData = await apiService.getAllSupportRequests();
      setRequests(requestsData);
    } catch (err) {
      console.error('Error loading support requests:', err);
      setError('Erreur lors du chargement des demandes de soutien');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (requestId: number) => {
    const content = commentText[requestId]?.trim();
    if (!content || !user) return;

    try {
      setCommentLoading(requestId);
      const commentData: CommentCreate = { content };
      await apiService.addCommentToRequest(requestId, commentData);
      
      // Clear comment text
      setCommentText(prev => ({ ...prev, [requestId]: '' }));
      
      // Reload requests to get updated comments
      await loadSupportRequests();
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Erreur lors de l\'ajout du commentaire');
    } finally {
      setCommentLoading(null);
    }
  };

  const toggleExpandRequest = (requestId: number) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Approved': return 'status-approved';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending': return 'En attente';
      case 'Approved': return 'Approuvé';
      case 'Completed': return 'Terminé';
      case 'Cancelled': return 'Annulé';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="academic-support-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement des demandes de soutien...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="academic-support-container">
      <div className="academic-support-header">
        <h1 className="academic-support-title">Soutien Académique</h1>
        <p className="academic-support-subtitle">
          Découvrez les demandes d'aide et partagez vos connaissances
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      <div className="support-stats">
        <div className="stat">
          <span className="stat-number">{requests.length}</span>
          <span className="stat-label">Demandes</span>
        </div>
        <div className="stat">
          <span className="stat-number">{requests.filter(r => r.statut === 'Pending').length}</span>
          <span className="stat-label">En attente</span>
        </div>
        <div className="stat">
          <span className="stat-number">{requests.filter(r => r.statut === 'Completed').length}</span>
          <span className="stat-label">Terminées</span>
        </div>
      </div>

      <div className="support-requests-grid">
        {requests.map(request => (
          <div key={request.id} className="support-request-card">
            <div className="request-header">
              <div className="request-info">
                <h3 className="request-competence">{request.competence_name}</h3>
                <span className={`status-badge ${getStatusBadgeClass(request.statut)}`}>
                  {getStatusText(request.statut)}
                </span>
              </div>
              <div className="request-date">
                {new Date(request.dateDemande).toLocaleDateString('fr-FR')}
              </div>
            </div>

            <div className="request-details">
              <div className="requester-info">
                <div className="requester-avatar">
                  {request.demandeur_avatar ? (
                    <img src={request.demandeur_avatar} alt={request.demandeur_name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {request.demandeur_name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div className="requester-details">
                  <div className="requester-name">Demandé par: {request.demandeur_name}</div>
                  {request.helper_name && (
                    <div className="helper-name">Aidé par: {request.helper_name}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="request-actions">
              <button
                onClick={() => toggleExpandRequest(request.id)}
                className="btn btn-secondary"
              >
                {expandedRequest === request.id ? 'Masquer les commentaires' : `Voir les commentaires (${request.comments.length})`}
              </button>
            </div>

            {expandedRequest === request.id && (
              <div className="request-comments">
                <div className="comments-section">
                  <h4 className="comments-title">Commentaires</h4>
                  
                  {request.comments.length > 0 ? (
                    <div className="comments-list">
                      {request.comments.map(comment => (
                        <div key={comment.id} className="comment-card">
                          <div className="comment-header">
                            <div className="comment-author">
                              <div className="comment-avatar">
                                {comment.user_avatar ? (
                                  <img src={comment.user_avatar} alt={comment.user_name} />
                                ) : (
                                  <div className="avatar-placeholder">
                                    {comment.user_name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                )}
                              </div>
                              <div className="comment-info">
                                <div className="comment-user-name">{comment.user_name}</div>
                                <div className="comment-date">
                                  {new Date(comment.created_at).toLocaleString('fr-FR')}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="comment-content">
                            {comment.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-comments">Aucun commentaire pour le moment</p>
                  )}

                  <div className="add-comment">
                    <div className="comment-form">
                      <textarea
                        placeholder="Ajouter un commentaire..."
                        value={commentText[request.id] || ''}
                        onChange={(e) => setCommentText(prev => ({ ...prev, [request.id]: e.target.value }))}
                        className="comment-textarea"
                        rows={3}
                      />
                      <button
                        onClick={() => handleAddComment(request.id)}
                        disabled={!commentText[request.id]?.trim() || commentLoading === request.id}
                        className="btn btn-primary comment-submit"
                      >
                        {commentLoading === request.id ? 'Envoi...' : 'Commenter'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {requests.length === 0 && !loading && (
        <div className="no-requests">
          <div className="no-requests-icon">🎓</div>
          <h3>Aucune demande de soutien</h3>
          <p>Les demandes d'aide apparaîtront ici</p>
        </div>
      )}
    </div>
  );
}