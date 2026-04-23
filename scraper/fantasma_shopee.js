const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

// Adiciona o plugin stealth para evitar bloqueios de bot
puppeteer.use(StealthPlugin());

async function varrerShopee(palavraChave) {
    console.log(`[Agente Fantasma] Iniciando busca por: "${palavraChave}"...`);
    
    // Inicia o navegador
    const browser = await puppeteer.launch({
        headless: false, // Mantendo false para ver a página abrindo
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        userDataDir: './sessao_shopee', // Salva os cookies e o login para não pedir de novo!
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    
    // Define um User-Agent comum
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    const urlBusca = `https://shopee.com.br/search?keyword=${encodeURIComponent(palavraChave)}`;
    console.log(`[Agente Fantasma] Acessando URL: ${urlBusca}`);
    await page.goto(urlBusca, { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log(`[Agente Fantasma] Verificando se há bloqueio de login...`);
    
    // Espera até que a página não seja a de login. Se for login, dá 60 segundos pro usuário logar manualmente na tela
    try {
        if (page.url().includes('login') || page.url().includes('verify')) {
            console.log(`[Agente Fantasma] ⚠️ ATENÇÃO: A Shopee pediu Login ou Verificação!`);
            console.log(`[Agente Fantasma] Por favor, faça o login na janela do Chrome que abriu.`);
            console.log(`[Agente Fantasma] Aguardando você fazer o login (tempo limite 2 minutos)...`);
            await page.waitForNavigation({ timeout: 120000 });
            console.log(`[Agente Fantasma] Login detectado! Retomando a busca...`);
            // Garante que está na URL certa após o login
            if (!page.url().includes('search')) {
                await page.goto(urlBusca, { waitUntil: 'domcontentloaded', timeout: 60000 });
            }
        }
    } catch(e) {
        console.log(`[Agente Fantasma] Passou direto pela verificação.`);
    }

    // Espera os produtos carregarem na tela
    try {
        await page.waitForSelector('div[data-sqe="item"], a[data-sqe="link"], .shopee-search-item-result', { timeout: 15000 });
    } catch(e) {
        console.log(`[Agente Fantasma] Aviso: Seletores padrão não encontrados imediatamente. Tentando prosseguir mesmo assim.`);
    }

    console.log(`[Agente Fantasma] Simulando rolagem de tela para carregar todos os produtos da página...`);
    
    // Rola a tela lentamente até o final
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 400;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                // Parar um pouco antes do final para não engatilhar footer gigante
                if (totalHeight >= scrollHeight - window.innerHeight - 500) {
                    clearInterval(timer);
                    resolve();
                }
            }, 600);
        });
    });

    console.log(`[Agente Fantasma] Extraindo produtos diretamente do cérebro da Shopee (Estado Interno)...`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Nova Estratégia Definitiva: A Shopee injeta os resultados da busca direto em uma variável Javascript!
    // Isso é imune a mudanças de CSS ou Layout!
    const produtosExtraidos = await page.evaluate(() => {
        try {
            // A Shopee guarda os dados aqui no carregamento inicial!
            const shopeeStateJSON = document.getElementById('__SHOPEE_PROMISE_STATE__');
            if (shopeeStateJSON) {
                const stateData = JSON.parse(shopeeStateJSON.innerText);
                // Vasculha o JSON enorme para encontrar a lista de itens
                // O caminho muda às vezes, mas geralmente está sob algo como search_items
                let items = [];
                const buscarItens = (obj) => {
                    if (!obj) return;
                    if (obj.items && Array.isArray(obj.items) && obj.items.length > 0 && obj.items[0].item_basic) {
                        items = items.concat(obj.items);
                        return;
                    }
                    if (typeof obj === 'object') {
                        for (let key in obj) {
                            buscarItens(obj[key]);
                        }
                    }
                };
                buscarItens(stateData);

                if (items.length > 0) {
                    return items.map(item => {
                        const info = item.item_basic;
                        return {
                            nome: info.name,
                            preco: `R$ ${(info.price / 100000).toFixed(2).replace('.', ',')}`,
                            vendas: `${info.historical_sold || 0} vendidos`,
                            link: `https://shopee.com.br/product/${info.shopid}/${info.itemid}`,
                            imagem: `https://down-br.img.susercontent.com/file/${info.image}`
                        };
                    });
                }
            }
        } catch (e) {
             // Cai no fallback se não achar o JSON
        }

        // FALLBACK: Tenta achar os scripts do Next.js
        const nextData = document.getElementById('__NEXT_DATA__');
        if (nextData) {
             try {
                 const ndata = JSON.parse(nextData.innerText);
                 let fallbackItems = [];
                 const buscaNext = (obj) => {
                    if (!obj) return;
                    if (obj.items && Array.isArray(obj.items) && obj.items.length > 0 && obj.items[0].item_basic) {
                        fallbackItems = fallbackItems.concat(obj.items);
                        return;
                    }
                    if (typeof obj === 'object') {
                        for (let key in obj) {
                            buscaNext(obj[key]);
                        }
                    }
                };
                buscaNext(ndata);
                if (fallbackItems.length > 0) {
                     return fallbackItems.map(item => {
                        const info = item.item_basic;
                        return {
                            nome: info.name,
                            preco: `R$ ${(info.price / 100000).toFixed(2).replace('.', ',')}`,
                            vendas: `${info.historical_sold || 0} vendidos`,
                            link: `https://shopee.com.br/product/${info.shopid}/${info.itemid}`,
                            imagem: `https://down-br.img.susercontent.com/file/${info.image}`
                        };
                    });
                }
             } catch(e) {}
        }

        // Se falhar tudo, tenta ler do HTML genérico
        const resultados = [];
        const links = Array.from(document.querySelectorAll('a'));
        links.forEach(link => {
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
        });
        
        const unicos = [];
        const linksVistos = new Set();
        for (const item of resultados) {
            if (!linksVistos.has(item.link)) {
                linksVistos.add(item.link);
                unicos.push(item);
            }
        }
        return unicos;
    });

    console.log(`[Agente Fantasma] Total de ${produtosExtraidos.length} produtos extraídos perfeitamente!`);

    // Salva em arquivos JSON: Um no scraper e outro já lá no dashboard
    fs.writeFileSync('produtos_encontrados.json', JSON.stringify(produtosExtraidos, null, 2), 'utf-8');
    fs.writeFileSync('../dashboard/src/data.json', JSON.stringify(produtosExtraidos, null, 2), 'utf-8');
    
    console.log(`[Agente Fantasma] Dados salvos e enviados diretamente para o Painel de Controle!`);

    await browser.close();
    console.log(`[Agente Fantasma] Missão concluída.`);
}

// Executa o script
const nicho = "vestido feminino promoção";
varrerShopee(nicho).catch(console.error);
