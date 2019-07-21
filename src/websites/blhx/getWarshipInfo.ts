import { getUrl } from './commonFunc';
import { Browser } from 'puppeteer';
import { WarshipType, nameToWarshipType, Rarity, nameToRarity, Region, nameToRegion, generateDBStage } from '../../model/blhx/Warships';

class WarshipAbility {
    name: string;
    desc: string;
}

class WarshipInfo {
    shipNo: number;
    shipname: string;
    shipclass: string;
    aliasname: string;
    englishname: string;
    rarity: Rarity;
    region: Region;
    iconsrc: string;
    type: WarshipType;
    normalsalvage: number[];
    specialsalvage: number[];
    buildtime: number;
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

        // 获取舰船稀有度 阵营
        let tdsRarity = trsGenral[2].children;
        warship.rarity = nameToRarity(tdsRarity[1].lastChild.textContent.replace('/\s/g', ''));
        warship.region = nameToRegion(tdsRarity[3].lastChild.textContent.replace('/\s/g', ''));

        // 获取舰船的建造时间 0为无法建造
        let tdsBuild = trsGenral[3].children;
        let buildInfo = tdsBuild[1].textContent;
        if (buildInfo === '无法建造') {
            warship.buildtime = 0;
        }
        else {
            warship.buildtime = buildInfo.replace(/\(*\)/, '').split(':').reduce((prev, cur, index) => Math.pow(60, (2 - index)) * parseInt(cur) + prev, 0);
        }

        // 普通掉落点
        let tdsNormalSalvage = trsGenral[4].children;
        let atags = tdsNormalSalvage[1].querySelectorAll('a');
        if (atags.length <= 0) {
            warship.normalsalvage = [];
        }
        else {
            atags.forEach(a => {
                let text = a.textContent;
                if (text === '限时建造') {

                }
                else if (text === '仅限打捞') {

                } else {
                    let regNormal = /([0-9]+)\-([0-9])/;
                    let regSpecial = /(*)([A-Z]+[0-9])/;
                    if (regNormal.test(text)) {
                        let regArr = regNormal.exec(text);
                        let strNormalMain = parseInt(regArr[1]);
                        let strNormalSub = parseInt(regArr[2]);
                        warship.normalsalvage.push(generateDBStage(strNormalMain, strNormalSub));
                    }
                    if (regSpecial.test(text)) {
                        let regArr = regNormal.exec(text);
                        let strSpecial = regArr[1];
                        let strSpecialSub = regArr[2];
                        let isremake = strSpecial.substr(0, 2) === '复刻' ? 1 : 0;
                        let stageName = strSpecial.substr(2);
                        // warship.specialsalvage.push(generateDBStage())
                    }
                }
            })
        }
    })
}
