javascript:(function(){
    console.log("Iniciando Agente Fantasma na Shopee...");
    let produtosExtraidos = [];
    
    // Tenta pegar do estado interno
    try {
        const shopeeStateJSON = document.getElementById('__SHOPEE_PROMISE_STATE__');
        if (shopeeStateJSON) {
            const stateData = JSON.parse(shopeeStateJSON.innerText);
            let items = [];
            const buscarItens = (obj) => {
                if (!obj) return;
                if (obj.items && Array.isArray(obj.items) && obj.items.length > 0 && obj.items[0].item_basic) {
                    items = items.concat(obj.items);
                    return;
                }
                if (typeof obj === 'object') {
                    for (let key in obj) { buscarItens(obj[key]); }
                }
            };
            buscarItens(stateData);

            if (items.length > 0) {
                produtosExtraidos = items.map(item => {
                    const info = item.item_basic;
                    return {
                        nome: info.name,
                        preco: `R$ ${(info.price / 100000).toFixed(2).replace('.', ',')}`,
                        vendas: `${info.historical_sold || 0} vendidos`,
                        link: `https://shopee.com.br/product/${info.shopid}/${info.itemid}`,
                        imagem: `https://down-br.img.susercontent.com/file/${info.image}`
                    };
                }).flat();
            }
        }
    } catch(e) { console.log(e) }

    // Fallback visual
    if(produtosExtraidos.length === 0) {
        const resultados = [];
        const links = Array.from(document.querySelectorAll('a'));
        links.forEach(link => {
            try {
                const href = link.getAttribute('href') || '';
                if (href.includes('-i.') && !href.includes('search')) {
                    const img = link.querySelector('img');
                    let nome = img ? img.getAttribute('alt') : '';
                    if (!nome) {
                        const texto = link.innerText.split('\n');
                        nome = texto.find(t => t.length > 15) || 'Vestido Feminino';
                    }
                    const textos = link.innerText.split('\n');
                    let preco = 'R$ ?';
                    let vendas = '0 vendidos';
                    textos.forEach(t => {
                        if (t.includes('R$')) preco = t.trim();
                        if (t.toLowerCase().includes('vendido')) vendas = t.trim();
                    });
                    if (img && img.src && !img.src.includes('data:image')) {
                         resultados.push({
                             nome: nome,
                             preco: preco,
                             vendas: vendas,
                             link: 'https://shopee.com.br' + href,
                             imagem: img.src
                         });
                    }
                }
            } catch(err) {} // Ignora erros de iframe cross-origin
        });
        const unicos = [];
        const linksVistos = new Set();
        for (const item of resultados) {
            if (!linksVistos.has(item.link)) {
                linksVistos.add(item.link);
                unicos.push(item);
            }
        }
        produtosExtraidos = unicos;
    }

    if(produtosExtraidos.length > 0) {
        alert(`Agente Fantasma encontrou ${produtosExtraidos.length} vestidos! Baixando o arquivo...`);
        // Estratégia Ninja: Baixar o arquivo direto para burlar o bloqueio (CSP) da Shopee
        const dataStr = JSON.stringify(produtosExtraidos, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        alert("Nenhum produto encontrado na página! Role a página um pouco mais para carregar os produtos e tente clicar de novo.");
    }
})();
