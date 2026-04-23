import { useState, useEffect } from 'react'
import './index.css'
import data from './data.json'

function App() {
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    // Carrega os dados do JSON
    setProdutos(data)
  }, [])

  return (
    <div className="store-container">
      {/* HEADER DA LOJA */}
      <header className="profile-header">
        <div className="profile-img-container">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop" 
            alt="Foto de Perfil" 
            className="profile-img"
          />
        </div>
        <h1 className="store-name">Closet da Moda</h1>
        <p className="store-bio">Seus achadinhos favoritos e looks perfeitos escolhidos a dedo. 💖</p>
      </header>

      {/* CATEGORIAS */}
      <div className="categories">
        <div className="category-pill active">Em Alta 🔥</div>
        <div className="category-pill">Vestidos</div>
        <div className="category-pill">Plus Size</div>
        <div className="category-pill">Verão</div>
      </div>

      {/* FEED DE PRODUTOS */}
      <main className="products-feed">
        {produtos.map((produto, index) => (
          <article className="product-card" key={index}>
            <div className="product-img-wrapper">
              <span className="fire-badge">
                🔥 Mais Vendido
              </span>
              <img src={produto.imagem} alt={produto.nome} className="product-img" />
            </div>
            
            <div className="product-info">
              <h2 className="product-title">{produto.nome}</h2>
              
              <div className="product-price-row">
                <span className="product-price">{produto.preco}</span>
                <span className="product-sales">{produto.vendas}</span>
              </div>
              
              {/* O Link aqui já será o de Afiliado (após a fase de geração de link) */}
              <a href={produto.link} target="_blank" rel="noopener noreferrer" className="buy-button">
                Comprar na Shopee 🛍️
              </a>
            </div>
          </article>
        ))}
      </main>
    </div>
  )
}

export default App
