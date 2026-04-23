const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function debugShopee() {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        userDataDir: './sessao_shopee',
        defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto('https://shopee.com.br/search?keyword=vestido%20feminino%20promo%C3%A7%C3%A3o', { waitUntil: 'networkidle2' });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h && h.length > 30).slice(0, 50);
    });
    console.log("LINKS ENCONTRADOS NO DOM:", links);
    await browser.close();
}
debugShopee();
