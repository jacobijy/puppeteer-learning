import { getUrl } from './commonFunc';
import { Browser } from 'puppeteer';

export async function getWarshipInfo(browser: Browser, name: string) {
    let url = getUrl(name);
    let page = await browser.newPage();
    await page.goto(url, { timeout: 0 });
    page.evaluate(() => {
        let divjntj = document.querySelector<HTMLDivElement>('.jntj');
        let tableGenral = divjntj.querySelector('.wikitable.sv-general>tbody');
        let tdsGenral = tableGenral.querySelectorAll('tr');
        // 获取舰船名
        let shipNames = tdsGenral[0].querySelectorAll('b');
        // IJN舰船，中文有个和谐名
        if (shipNames.length === 5) {
            
        }
    })
}
