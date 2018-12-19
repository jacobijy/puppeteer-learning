import { Browser } from 'puppeteer';

const baseUrl = Object.freeze('http://wiki.joyme.com/blhx/%E9%A6%96%E9%A1%B5');

async function getShipInfo(browser: Browser) {
    let page = await browser.newPage();
    await page.goto(baseUrl, { timeout: 0 });
    // page.$(a)
}
