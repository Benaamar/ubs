import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import './Cards.css';

const BankCard = () => {
  const [cardData, setCardData] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Simuler les données de la carte (en production, viendrait de l'API)
    const mockCardData = {
      cardNumber: '4532 1234 5678 9010',
      cardHolder: 'JEAN DUPONT',
      expiryDate: '12/25',
      cvv: '123',
      cardType: 'VISA',
      cardTier: 'GOLD'
    };
    setCardData(mockCardData);
  }, []);

  if (!cardData) return <div className="loading">Chargement...</div>;

  return (
    <div className="card-container">
      <div className={`bank-card ${isFlipped ? 'flipped' : ''}`}>
        {/* Face avant de la carte */}
        <div className="card-face card-front">
          <div className="card-background"></div>
          
          {/* Logo Visa */}
          <div className="card-logo">
            <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
              <text x="0" y="15" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">
                VISA
              </text>
            </svg>
          </div>

          {/* Puce */}
          <div className="card-chip">
            <div className="chip-line"></div>
            <div className="chip-line"></div>
            <div className="chip-line"></div>
            <div className="chip-line"></div>
          </div>

          {/* Numéro de carte */}
          <div className="card-number">
            {cardData.cardNumber}
          </div>

          {/* Nom et date d'expiration */}
          <div className="card-details">
            <div className="card-holder">
              <div className="label">Titulaire</div>
              <div className="value">{cardData.cardHolder}</div>
            </div>
            <div className="card-expiry">
              <div className="label">Expire fin</div>
              <div className="value">{cardData.expiryDate}</div>
            </div>
          </div>

          {/* Badge Gold */}
          <div className="card-tier">GOLD</div>
        </div>

        {/* Face arrière de la carte */}
        <div className="card-face card-back">
          <div className="card-background"></div>
          <div className="magnetic-strip"></div>
          <div className="signature-panel">
            <div className="cvv-box">
              <span className="cvv-label">CVV</span>
              <span className="cvv-value">{cardData.cvv}</span>
            </div>
          </div>
          <div className="card-info-text">
            Pour toute question, contactez votre banque
          </div>
        </div>
      </div>

      {/* Bouton pour retourner la carte */}
      <button 
        className="flip-button"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {isFlipped ? 'Voir le recto' : 'Voir le verso'}
      </button>
    </div>
  );
};

function Cards() {
  const [showAddCard, setShowAddCard] = useState(false);

  return (
    <div className="cards-page">
      <div className="cards-header">
        <div className="page-header-with-back">
          <button 
            onClick={() => window.history.back()} 
            className="back-button"
            aria-label="Retour"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1>Mes Cartes</h1>
        </div>
        <button 
          className="add-card-btn"
          onClick={() => setShowAddCard(!showAddCard)}
        >
          <FiPlus size={20} />
          <span>Ajouter une carte</span>
        </button>
      </div>

      <div className="cards-content">
        <div className="cards-section">
          <h2>Mes Cartes Bancaires</h2>
          <div className="cards-grid">
            <BankCard />
          </div>
        </div>

        {showAddCard && (
          <div className="add-card-section">
            <h2>Ajouter une nouvelle carte</h2>
            <div className="add-card-form">
              <div className="form-group">
                <label>Type de carte</label>
                <select>
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nom du titulaire</label>
                <input type="text" placeholder="JEAN DUPONT" />
              </div>
              <div className="form-group">
                <label>Numéro de carte</label>
                <input type="text" placeholder="1234 5678 9012 3456" maxLength="19" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date d'expiration</label>
                  <input type="text" placeholder="MM/AA" maxLength="5" />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="text" placeholder="123" maxLength="3" />
                </div>
              </div>
              <button className="submit-btn">Ajouter la carte</button>
            </div>
          </div>
        )}

        <div className="card-actions">
          <h2>Actions rapides</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <span className="action-icon">🔒</span>
              <span>Bloquer la carte</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📱</span>
              <span>Payer sans contact</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">🌍</span>
              <span>Usage international</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📊</span>
              <span>Limite de dépense</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cards;
