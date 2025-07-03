import { useState, useEffect, useRef } from 'react';
import { apiService,type ChatHistory,type ChatResponse } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './AiChatbot.css';

export default function AiChatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot'; content: string; timestamp: Date; suggestions?: string[]; data?: any }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadChatHistory();
      loadSuggestions();
    }
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;
    
    try {
      const history = await apiService.getChatHistory(user.id, 20);
      setChatHistory(history);
      
      // Convert history to messages format
      const historyMessages = history.reverse().flatMap(h => [
        { type: 'user' as const, content: h.question, timestamp: new Date(h.date) },
        { type: 'bot' as const, content: h.reponse, timestamp: new Date(h.date), data: null }
      ]);
      
      setMessages(historyMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadSuggestions = async () => {
    if (!user) return;
    
    try {
      const response = await apiService.getChatSuggestions(user.id);
      setSuggestions(response.suggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim() || !user || isLoading) return;

    const userMessage = { type: 'user' as const, content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response: ChatResponse = await apiService.sendChatMessage(message, user.id);
      
      const botMessage = {
        type: 'bot' as const,
        content: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions,
        data: response.data
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'bot' as const,
        content: 'Désolé, je rencontre un problème technique. Veuillez réessayer.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([]);
    setSuggestions([]);
    loadSuggestions();
  };

  const renderStructuredData = (data: any) => {
    if (!data) return null;

    // If it's a single object (like demande_soutien response), wrap it in array for consistent handling
    const dataArray = Array.isArray(data) ? data : [data];

    // Check if it's skill swap data
    if (dataArray.length > 0 && dataArray[0].swap_score !== undefined) {
      return (
        <div className="skill-swap-results">
          {dataArray.map((partner: any, index: number) => (
            <div key={index} className="skill-swap-card">
              <div className="partner-info">
                <h4>{partner.prenom} {partner.nom}</h4>
                <p>{partner.filiere} -  {partner.niveau}iéme année</p>
                <div className="swap-score">
                  Score d'échange: <span className="score">{partner.swap_score}</span>
                </div>
              </div>
              
              {partner.skills_they_offer && partner.skills_they_offer.length > 0 && (
                <div className="skills-section">
                  <h5>💡 Il peut vous aider avec:</h5>
                  <ul className="skills-list">
                    {partner.skills_they_offer.map((skill: any, idx: number) => (
                      <li key={idx}>
                        <strong>{skill.skill}</strong> (Niveau {skill.their_level})
                        {skill.benefit && <span className="benefit"> - {skill.benefit}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {partner.skills_you_offer && partner.skills_you_offer.length > 0 && (
                <div className="skills-section">
                  <h5>🎯 Vous pouvez les aider avec:</h5>
                  <ul className="skills-list">
                    {partner.skills_you_offer.map((skill: any, idx: number) => (
                      <li key={idx}>
                        <strong>{skill.skill}</strong> (Votre niveau {skill.your_level})
                        {skill.benefit && <span className="benefit"> - {skill.benefit}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {partner.mutual_benefits && partner.mutual_benefits.length > 0 && (
                <div className="mutual-benefits">
                  <h5>🤝 Avantages mutuels:</h5>
                  <ul>
                    {partner.mutual_benefits.map((benefit: string, idx: number) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Handle other types of structured data (groups, mentors, etc.)
    if (dataArray.length > 0 && dataArray[0].nom !== undefined) {
      return (
        <div className="generic-results">
          {dataArray.map((item: any, index: number) => (
            <div key={index} className="result-card">
              <h4>{item.nom}</h4>
              {item.description && <p>{item.description}</p>}
              {item.centre_interet && <span className="tag">{item.centre_interet}</span>}
              {item.nombre_membres && <span className="members">👥 {item.nombre_membres} membres</span>}
            </div>
          ))}
        </div>
      );
    }

    // Handle single object responses (like demande_soutien confirmations)
    if (!Array.isArray(data) && typeof data === 'object') {
      return (
        <div className="single-response">
          <div className="response-card">
            {data.id && <p><strong>ID:</strong> {data.id}</p>}
            {data.competence && <p><strong>Compétence:</strong> {data.competence}</p>}
            {data.statut && <p><strong>Statut:</strong> {data.statut}</p>}
            {data.date_demande && <p><strong>Date:</strong> {new Date(data.date_demande).toLocaleDateString()}</p>}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <div className="chatbot-avatar">🤖</div>
          <div>
            <h1>Assistant IA SchoolCollab</h1>
            <p>Votre assistant intelligent pour la collaboration étudiante</p>
          </div>
        </div>
        <button onClick={clearChat} className="clear-chat-btn">
          🗑️ Effacer
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">👋</div>
            <h3>Bienvenue ! Comment puis-je vous aider aujourd'hui ?</h3>
            <p>Vous pouvez me demander de l'aide pour :</p>
            <ul>
              <li>Trouver des groupes d'étude</li>
              <li>Demander du soutien académique</li>
              <li>Chercher un mentor ou parrain</li>
              <li>Proposer vos services de mentorat</li>
            </ul>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              {message.data && renderStructuredData(message.data)}
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message bot">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions">
          <p>Suggestions :</p>
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-btn"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chatbot-input">
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="message-input"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="send-btn"
          >
            📤
          </button>
        </div>
      </div>
    </div>
  );
}