import * as puppeteer from 'puppeteer';

let url = 'https://exhibitors.electronica.de/onlinecatalog/2018/Exhibitors';

export default async function getExhibitors(browser: puppeteer.Browser) {
    const page = await browser.newPage();
    await page.goto(url);
    
}
