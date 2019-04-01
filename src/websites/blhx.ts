import { Browser } from 'puppeteer';

const baseUrl = Object.freeze('http://wiki.joyme.com/blhx');

const pages = {
    main: '首页',
}

function getUrl(page: string) {
    return baseUrl + encodeURI(page);
}

export default async function getShipInfo(browser: Browser) {
    let page = await browser.newPage();
    await page.goto(getUrl(pages.main), { timeout: 0 });
    // page.$(a)
}
