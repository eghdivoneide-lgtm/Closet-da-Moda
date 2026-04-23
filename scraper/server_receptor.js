const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Rota para receber os produtos extraídos do navegador do usuário
app.post('/receber-produtos', (req, res) => {
    const produtos = req.body;
    console.log(`[Agente Fantasma] Recebido ${produtos.length} produtos do navegador!`);
    
    if (produtos && produtos.length > 0) {
        // Salva os dados no Dashboard
        fs.writeFileSync('../dashboard/src/data.json', JSON.stringify(produtos, null, 2), 'utf-8');
        console.log(`[Agente Fantasma] Painel atualizado com sucesso!`);
        res.json({ success: true, message: 'Produtos enviados para o painel!' });
    } else {
        res.status(400).json({ success: false, message: 'Nenhum produto recebido.' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`[Agente Fantasma Receptor] Rodando na porta ${PORT}`);
    console.log(`[Agente Fantasma Receptor] Aguardando transmissões do Bookmarklet...`);
});
