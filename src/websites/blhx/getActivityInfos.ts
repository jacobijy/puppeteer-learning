import { Browser } from 'puppeteer';
import * as fs from 'fs';

const mainPage = 'http://wiki.joyme.com/blhx/%E9%A6%96%E9%A1%B5';

export interface ActivityInfo {
    url: string;
    name: string;
    id: number;
}

export default async function getAcitivityInfo(browser: Browser) {
    let page = await browser.newPage();
    await page.goto(mainPage, {timeout: 0});
    let spex =  await page.evaluate(() => {
        const ExActivities: ActivityInfo[] = [];
        const SpActivities: ActivityInfo[] = [];
        let liMaps = document.querySelectorAll<HTMLLIElement>('li.wiki-nav-地图>ul>li');
        function getEXActivityInfos(li: HTMLLIElement) {
            let lisEx = li.querySelectorAll<HTMLLIElement>('ul>li');
            lisEx.forEach((li, index) => {
                let url = li.querySelector('a').href;
                let name = li.textContent;
                let id = index + 101;
                ExActivities.push({url, name, id});
            })
        }
        
        function getSPActivityInfos(li: HTMLLIElement) {
            let lisEx = li.querySelectorAll<HTMLLIElement>('ul>li');
            lisEx.forEach((li, index) => {
                let url = li.querySelector('a').href;
                let name = li.textContent;
                let id = index + 201;
                SpActivities.push({url, name, id});
            })
        }
        getEXActivityInfos(liMaps[1]);
        getSPActivityInfos(liMaps[2]);
        return {ex: ExActivities, sp:SpActivities};
    })
    await fs.promises.writeFile('./blhxConfJson/SpAcitivities.json', JSON.stringify(spex.sp, null, '\t'));
    await fs.promises.writeFile('./blhxConfJson/ExAcitivities.json', JSON.stringify(spex.ex, null, '\t'));
}
