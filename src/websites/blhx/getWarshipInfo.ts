import { getUrl } from './commonFunc';
import { Browser } from 'puppeteer';
import { WarshipType, nameToWarshipType } from '../../model/blhx/Warships';

class WarshipAbility {
    name: string;
    desc: string;
}

class WarshipInfo {
    shipNo: number ;
    shipname: string;
    shipclass: string;
    aliasname: string;
    englishname: string;
    iconsrc: string;
    type: WarshipType;
    armorType: number;
    cannon: number;
    torpedo: number;
    reload: number;
    antiaircraft: number;
    oilwear: number;
    maneuverability: number;
    antisubmarine: number;
    stamina: number;
    ability: WarshipAbility[];
}

export async function getWarshipInfo(browser: Browser, name: string) {
    let url = getUrl(name);
    let page = await browser.newPage();
    let warship = new WarshipInfo();
    await page.goto(url, { timeout: 0 });
    page.evaluate(() => {
        let divjntj = document.querySelector<HTMLDivElement>('.jntj');
        let tableGenral = divjntj.querySelector('.wikitable.sv-general>tbody');
        let trsGenral = tableGenral.querySelectorAll('tr');
        // 获取舰船名
        let shipNames = trsGenral[0].querySelectorAll('b');
        warship.shipclass = shipNames[0].textContent;
        warship.shipname = shipNames[1].textContent;
        // IJN舰船，中文有个和谐名
        if (shipNames.length === 5) {
            warship.aliasname = shipNames[2].textContent.replace(/[\(\)]/g, '');
            warship.englishname = shipNames[3].textContent;
        }
        else {
            warship.englishname = shipNames[2].textContent;
        }
        // 获取舰船编号 类型
        let tdsNo = trsGenral[1].children;
        warship.iconsrc = tdsNo[0].querySelector('img').src;
        warship.shipNo = parseInt(tdsNo[2].querySelector('#PNN').textContent);
        warship.type = nameToWarshipType(tdsNo[4].textContent.replace('/\s/g', ''));
    })
}
