import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SkillSwap.css';

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
}

interface SwapRequest {
  id: number;
  sender: Profile;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  skillOffered: string;
  skillWanted: string;
}

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
}

// Enhanced mock data
const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Marie Laurent",
    avatar: "https://i.pravatar.cc/150?img=1",
    skills: ["React", "TypeScript", "UI/UX", "Figma"],
    level: "3ème année",
    filiere: "WMD",
    bio: "Passionnée par le design et le développement frontend. J'adore créer des interfaces utilisateur intuitives et modernes.",
    rating: 4.8,
    exchanges: 12
  },
  {
    id: 2,
    name: "Thomas Martin",
    avatar: "https://i.pravatar.cc/150?img=2",
    skills: ["Python", "Machine Learning", "Data Analysis", "TensorFlow"],
    level: "4ème année",
    filiere: "BDAI",
    bio: "Expert en IA et analyse de données. Je peux t'aider à comprendre les algorithmes de machine learning.",
    rating: 4.9,
    exchanges: 18
  },
  {
    id: 3,
    name: "Sophie Dubois",
    avatar: "https://i.pravatar.cc/150?img=3",
    skills: ["Java", "Spring Boot", "DevOps", "Docker"],
    level: "5ème année",
    filiere: "CCSN",
    bio: "Développeuse backend expérimentée avec une expertise en architecture cloud et DevOps.",
    rating: 4.7,
    exchanges: 15
  },
  {
    id: 4,
    name: "Antoine Rousseau",
    avatar: "https://i.pravatar.cc/150?img=7",
    skills: ["Flutter", "Dart", "iOS", "Android"],
    level: "3ème année",
    filiere: "WMD",
    bio: "Développeur mobile passionné. Je crée des apps natives et cross-platform depuis 2 ans.",
    rating: 4.6,
    exchanges: 10
  },
  {
    id: 5,
    name: "Léa Moreau",
    avatar: "https://i.pravatar.cc/150?img=9",
    skills: ["Node.js", "MongoDB", "Express", "GraphQL"],
    level: "4ème année",
    filiere: "WMD",
    bio: "Backend developer spécialisée dans les APIs REST et GraphQL. Toujours prête à partager mes connaissances !",
    rating: 4.8,
    exchanges: 14
  }
];

const mockRequests: SwapRequest[] = [
  {
    id: 1,
    sender: {
      id: 4,
      name: "Lucas Bernard",
      avatar: "https://i.pravatar.cc/150?img=4",
      skills: ["Flutter", "Dart", "Mobile Development"],
      level: "3ème année",
      filiere: "WMD",
      bio: "Développeur mobile junior cherchant à s'améliorer",
      rating: 4.2,
      exchanges: 5
    },
    message: "Salut ! J'aimerais échanger des compétences en développement mobile contre du React/TypeScript. Je peux t'apprendre Flutter et tu pourrais m'aider avec React ?",
    status: 'pending',
    createdAt: '2025-07-01T14:30:00',
    skillOffered: "Flutter",
    skillWanted: "React"
  },
  {
    id: 2,
    sender: {
      id: 5,
      name: "Emma Petit",
      avatar: "https://i.pravatar.cc/150?img=5",
      skills: ["Node.js", "Express", "MongoDB"],
      level: "4ème année",
      filiere: "WMD",
      bio: "Backend developer expérimentée",
      rating: 4.7,
      exchanges: 11
    },
    message: "Hello ! Je cherche à approfondir mes connaissances en frontend. On peut échanger ? Je peux t'enseigner le backend Node.js en échange de tes compétences React.",
    status: 'accepted',
    createdAt: '2025-07-01T10:15:00',
    skillOffered: "Node.js",
    skillWanted: "React"
  },
  {
    id: 3,
    sender: {
      id: 6,
      name: "Paul Durand",
      avatar: "https://i.pravatar.cc/150?img=6",
      skills: ["Python", "Django", "PostgreSQL"],
      level: "5ème année",
      filiere: "CCSN",
      bio: "Senior developer en Python",
      rating: 4.9,
      exchanges: 20
    },
    message: "Interessé par un échange Python/Django contre du React ? J'ai 3 ans d'expérience en backend Python.",
    status: 'pending',
    createdAt: '2025-06-30T16:45:00',
    skillOffered: "Python",
    skillWanted: "React"
  }
];

const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 5,
    text: "Salut ! Quand est-ce qu'on commence notre session d'échange ?",
    timestamp: '2025-07-01T15:30:00'
  },
  {
    id: 2,
    senderId: 1,
    text: "Hey ! On peut commencer demain après-midi si tu veux ?",
    timestamp: '2025-07-01T15:32:00'
  },
  {
    id: 3,
    senderId: 5,
    text: "Parfait ! À quelle heure ? Je suis libre après 14h",
    timestamp: '2025-07-01T15:35:00'
  },
  {
    id: 4,
    senderId: 1,
    text: "15h ça te va ? On peut faire ça en visio ou en présentiel",
    timestamp: '2025-07-01T15:37:00'
  }
];

export default function SkillSwap() {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'requests'>('suggestions');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser] = useState({ id: 1, name: "John Doe" });
  const navigate = useNavigate();

  const handleAcceptRequest = (request: SwapRequest) => {
    console.log('Accepted request:', request);
    // Update request status to accepted
    setSelectedRequest({ ...request, status: 'accepted' });
  };

  const handleRejectRequest = (request: SwapRequest) => {
    console.log('Rejected request:', request);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: chatMessages.length + 1,
      senderId: currentUser.id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage('');
  };

  const handleSendSwapRequest = (profile: Profile) => {
    console.log('Sending swap request to:', profile);
    // Here you would open a modal or form to send a request
    alert(`Demande d'échange envoyée à ${profile.name}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="skillswap-container">
      {/* Enhanced Navbar */}
      <nav className="skillswap-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button className="back-btn" onClick={() => navigate('/')}>
              ← Retour
            </button>
            <div className="page-title">
              <h1>Skill Swap</h1>
              <p>Échangez vos compétences avec d'autres étudiants</p>
            </div>
          </div>
          <div className="navbar-right">
            <div className="user-stats">
              <div className="stat">
                <span className="stat-number">12</span>
                <span className="stat-label">Échanges</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.8</span>
                <span className="stat-label">Rating</span>
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
                onClick={() => setActiveTab('suggestions')}
                className={`tab-button ${activeTab === 'suggestions' ? 'active' : ''}`}
              >
                <span>Suggestions</span>
                <span className="tab-counter">{mockProfiles.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
              >
                <span>Demandes</span>
                <span className="tab-counter">{mockRequests.filter(r => r.status === 'pending').length}</span>
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
            </div>

            {/* Content */}
            {activeTab === 'suggestions' ? (
              <div className="profiles-list">
                {mockProfiles.map(profile => (
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
                          <span className="rating-text">({profile.exchanges} échanges)</span>
                        </div>
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
                      {profile.skills.map(skill => (
                        <span key={skill} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="requests-list">
                {mockRequests.map(request => (
                  <div key={request.id} className="request-card enhanced">
                    <div className="request-header">
                      <img
                        src={request.sender.avatar}
                        alt={request.sender.name}
                        className="profile-avatar"
                      />
                      <div className="request-content">
                        <div className="request-info">
                          <h3 className="profile-name">{request.sender.name}</h3>
                          <p className="profile-meta">
                            {request.sender.filiere} • {request.sender.level}
                          </p>
                          <div className="exchange-info">
                            <span className="exchange-offer">Offre: {request.skillOffered}</span>
                            <span className="exchange-arrow">→</span>
                            <span className="exchange-want">Cherche: {request.skillWanted}</span>
                          </div>
                        </div>
                        <div className="request-status">
                          <span className={`status-badge ${request.status}`}>
                            {request.status === 'pending' ? 'En attente' : 
                             request.status === 'accepted' ? 'Accepté' : 'Refusé'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="request-message">{request.message}</p>
                    
                    {request.status === 'pending' && (
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
                    
                    {request.status === 'accepted' && (
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="btn btn-primary chat-btn"
                      >
                        💬 Ouvrir le chat
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right section - Profile/Chat Details */}
          <div className="skillswap-right">
            {selectedProfile && !selectedRequest && (
              <div className="profile-details enhanced">
                <div className="profile-details-header">
                  <img
                    src={selectedProfile.avatar}
                    alt={selectedProfile.name}
                    className="profile-details-avatar"
                  />
                  <h2 className="profile-details-name">{selectedProfile.name}</h2>
                  <p className="profile-details-meta">
                    {selectedProfile.filiere} • {selectedProfile.level}
                  </p>
                  <div className="profile-stats">
                    <div className="stat-item">
                      <span className="stat-number">{selectedProfile.rating}</span>
                      <span className="stat-label">Rating</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{selectedProfile.exchanges}</span>
                      <span className="stat-label">Échanges</span>
                    </div>
                  </div>
                </div>

                <div className="profile-bio-section">
                  <h3 className="section-title">À propos</h3>
                  <p className="bio-text">{selectedProfile.bio}</p>
                </div>

                <div className="skills-section">
                  <h3 className="section-title">Compétences</h3>
                  <div className="skills-list">
                    {selectedProfile.skills.map(skill => (
                      <span key={skill} className="skill-tag enhanced">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

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

            {selectedRequest?.status === 'accepted' && (
              <div className="chat-container enhanced">
                <div className="chat-header">
                  <button 
                    className="back-chat-btn"
                    onClick={() => setSelectedRequest(null)}
                  >
                    ←
                  </button>
                  <img
                    src={selectedRequest.sender.avatar}
                    alt={selectedRequest.sender.name}
                    className="profile-avatar"
                  />
                  <div className="chat-user-info">
                    <h3 className="profile-name">{selectedRequest.sender.name}</h3>
                    <p className="profile-meta">En ligne</p>
                  </div>
                  <div className="chat-actions">
                    <button className="btn-icon">📞</button>
                    <button className="btn-icon">📹</button>
                  </div>
                </div>

                <div className="chat-messages">
                  {chatMessages.map(message => (
                    <div
                      key={message.id}
                      className={`message ${message.senderId === currentUser.id ? 'sent' : 'received'}`}
                    >
                      <p className="message-text">{message.text}</p>
                      <span className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="chat-input">
                  <div className="input-group">
                    <button type="button" className="attach-btn">📎</button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Écrivez votre message..."
                      className="message-input"
                    />
                    <button type="button" className="emoji-btn">😊</button>
                    <button type="submit" className="send-btn">
                      ➤
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!selectedProfile && !selectedRequest && (
              <div className="empty-state">
                <div className="empty-icon">🤝</div>
                <h3>Bienvenue sur Skill Swap</h3>
                <p>Sélectionnez un profil pour voir les détails ou une demande pour commencer à chatter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}