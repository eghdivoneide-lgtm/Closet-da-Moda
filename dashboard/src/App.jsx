import React, { useState } from 'react';
import './index.css';
import data from './data.json';

function App() {
  const [activeTab, setActiveTab] = useState('radar');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Olá! Sou o seu Agente Fantasma Shoppe. Pronta para faturar com moda feminina hoje? O que vamos buscar?", sender: 'bot' }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMessages([...messages, { text: chatInput, sender: 'user' }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: `Buscando as melhores ofertas para "${chatInput}" usando meus scripts furtivos... Vou atualizar o radar em alguns segundos!`, 
        sender: 'bot' 
      }]);
    }, 1000);

    setChatInput('');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-icon">S</div>
          <div className="logo-text">Shoppe Pro</div>
        </div>
        
        <ul className="nav-links">
          <li className={`nav-item ${activeTab === 'radar' ? 'active' : ''}`} onClick={() => setActiveTab('radar')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            Radar de Ofertas
          </li>
          <li className={`nav-item ${activeTab === 'links' ? 'active' : ''}`} onClick={() => setActiveTab('links')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Gerador de Links
          </li>
          <li className={`nav-item ${activeTab === 'nichos' ? 'active' : ''}`} onClick={() => setActiveTab('nichos')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            Nichos (Tags)
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>Dashboard Afiliado</h1>
            <p>Monitore o mercado e gere vendas no nicho de Moda Feminina</p>
          </div>
          <div className="user-profile">
            <div className="avatar"></div>
            <span>Vendedora Pro</span>
          </div>
        </header>

        <div className="dashboard-grid">
          
          {/* Left Column: Radar (Products) */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="panel-header">
              <div className="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                Radar de Ofertas (Top Conversão)
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Atualizado há 2 min</span>
            </div>
            
            <div className="products-grid">
              {data.map((produto, index) => (
                <div className="product-card animate-fade-in" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                  <img src={produto.imagem} alt={produto.nome} className="product-image" />
                  <div className="product-info">
                    <h3 className="product-title">{produto.nome}</h3>
                    <div className="product-price">{produto.preco}</div>
                    <div className="product-sales">🔥 {produto.vendas}</div>
                    <button className="btn-gerar-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      Criar Link de Afiliado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Agent Chat */}
          <div className="glass-panel agent-chat">
            <div className="panel-header">
              <div className="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2a2 2 0 0 1 2-2z"/><path d="M12 14c-5.52 0-10 4.48-10 10h20c0-5.52-4.48-10-10-10z"/></svg>
                Agente Fantasma
              </div>
            </div>
            
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`msg ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Ex: Busque vestidos plus size..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="chat-send">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
