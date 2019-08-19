import { getUrl, getMissionId } from './commonFunc';
import { Browser } from 'puppeteer';
import Warship, { WarshipType, nameToWarshipType, Rarity, nameToRarity, Region, nameToRegion, generateDBStage } from '../../model/blhx/Warships';

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
            atags.forEach(async a => {
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
                        let stageName = strSpecial;
                        // warship.specialsalvage.push(generateDBStage())
                        let missionId = await getMissionId(strSpecial);
                        warship.specialsalvage.push(generateDBStage(missionId, parseInt(strSpecialSub[1]), parseInt(strSpecialSub[1], 16) - 9, isremake));
                    }
                }
            })
        }

        // 性能数据
<<<<<<< HEAD
        function getPerformanceInfo(tr: HTMLTableRowElement, result: {[key: string]: any}) {
            let tds = tr.children;
            // tds.item.
            let index = 0;
            let key = '';
            let value: any;
            for (let td of tds) {
                if (td.textContent.replace(/\s/g, '') === '') {
                    continue;
                }
                if (index % 2 === 0) {
                    key = td.textContent.replace(/\s/g, '');
                }
                else {
                    let reg = /([0-9]+)→([0-9]+)/;
                    let text = td.textContent.replace(/\s/g, '');
                    if (reg.test(text)) {
                        value = parseInt(reg.exec(text)[2]);
                    }
                    else if (isNaN(parseInt(text))) {
                        value = text;
                    }
                    else {
                        value = parseInt(text);
                    }
                    Object.assign(result, {[key]: value});
                }
                index++;
            }
        }
        let trsPerformance = divjntj.querySelectorAll<HTMLTableRowElement>('table.wikitable.sv-performance>tbody>tr');
        const info = {};
        for (let i = 3; i <= 8; i++) {
            let tr = trsPerformance[i];
            getPerformanceInfo(tr, info);
        }
=======
        let trsPerformance = divjntj.querySelectorAll('table.wikitable.sv-performance>tbody>tr');
        let armorType = trsPerformance[3].children[3].textContent;
        // Warship.
>>>>>>> 2ad410e71a3f8ec308a89a840809cee7c97513c9
    })
}
