import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Debug: Afficher la configuration de l'API
console.log('🔧 Configuration API:')
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('Base URL finale:', `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`)

// Enregistrer le Service Worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès:', registration.scope);
        
        // Vérifier les mises à jour toutes les heures
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
        
        // Écouter les mises à jour disponibles
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nouveau service worker disponible, forcer le rechargement
              if (confirm('Une nouvelle version est disponible. Voulez-vous recharger la page ?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.log('Échec de l\'enregistrement du Service Worker:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

