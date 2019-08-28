import { getUrl, getMissionId } from './commonFunc';
import { Browser } from 'puppeteer';
import Warship from '../../model/blhx/Warships';

export async function getWarshipInfo(browser: Browser, name: string) {
    let url = getUrl(name);
    let page = await browser.newPage();
    await page.goto(url, { timeout: 0 });
    let warship = await page.evaluate<any>(() => {
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
            reloadState: number;
            antiaircraft: number;
            oilwear: number;
            antisubmarine: number;
            stamina: number;
            flexibility: number;
            luck: number;
            speed: number;
            airpower: number;
            ability: string;
        }
        /**
  DD = Destroyer = 驱逐舰

  CL = Cruiser Light = 轻巡洋舰
  
  CLT = Cruiser Light Torpedo = 重雷装巡洋舰
  
  CA = Cruiser Armoured = 重巡洋舰
  
  CAV = Cruiser Armoured Vessel= 航空巡洋舰
  
  BB = Battleship = 战列舰
  
  BBV = Battleship Vessel = 航空战列舰
  
  CVL = Carrier Vessel Light = 轻型航母
  
  CV = Carrier Vessel = 航母
  
  SS = Submarine = 潜水舰
  
  SSV = Submarine Vessel = 潜水母舰
 */
        enum WarshipType {
            Destroyer = 1,
            CruiserLight,
            CruiserLightTorpedo,
            CruiserArmoured,
            CruiserArmouredVessel,
            CruiserSuper,
            BattleCruiser,
            BattleShip,
            BattleshipVessel,
            CarrierVesselLight,
            CarrierVessel,
            Submarine,
            SubmarineVessel,
            Invalid = -1
        }

        enum Rarity {
            Normal,
            Rare,
            SuperRare,
            Elite = 2,
            SuperiorSuperRare,
            Priority,
            UltraRare,
            Decisive
        }

        enum Region {
            EagleUnion,
            RoyalNavy,
            IronBlood,
            VichyaDominion,
            IrisLibre,
            SakuraEmpire,
            DragonEmpery,
            NorthernParliament
        }

        const shipTypes = {
            '驱逐': WarshipType.Destroyer,
            '轻巡': WarshipType.CruiserLight,
            '重巡': WarshipType.CruiserArmoured,
            '战巡': WarshipType.BattleCruiser,
            '战列': WarshipType.BattleShip,
            '轻航': WarshipType.CarrierVesselLight,
            '航母': WarshipType.CarrierVessel,
            '潜艇': WarshipType.Submarine,
            '潜母': WarshipType.SubmarineVessel,
            '超巡': WarshipType.CruiserSuper
        }

        const raritys = {
            '普通': Rarity.Normal,
            '稀有': Rarity.Rare,
            '精锐': Rarity.SuperRare,
            '超稀有': Rarity.SuperiorSuperRare,
            '': Rarity.UltraRare,
            '特别计划': Rarity.Priority,
            '决战方案': Rarity.Decisive
        }

        const regions = {
            '白鹰': Region.EagleUnion,
            '重樱': Region.SakuraEmpire,
            '皇家': Region.RoyalNavy,
            '铁血': Region.IronBlood,
            '维西教廷': Region.VichyaDominion,
            '自由鸢尾': Region.IrisLibre,
            '东煌': Region.DragonEmpery,
            '北方联合': Region.NorthernParliament
        }

        const shipState = {
            '耐久': 'stamina',
            '炮击': 'cannon',
            '防空': 'antiaircraft',
            '反潜': 'antisubmarine',
            '幸运': 'luck',
            '航速': 'speed',
            '装甲': 'armorType',
            '雷击': 'torpedo',
            '航空': 'airpower',
            '装填': 'reloadState',
            '机动': 'flexibility',
            '消耗': 'oilwear'
        }

        function nameToWarshipType(name: string): WarshipType {
            return shipTypes[name] || WarshipType.Invalid;
        }

        function nameToRarity(name: string): Rarity {
            return raritys[name] || Rarity.Normal;
        }

        function nameToRegion(name: string): Region {
            return regions[name] || Region.EagleUnion;
        }


        function nameToStateTag(name: string): string {
            return shipState[name] || '';
        }

        // 关卡定义
        // 用short表示
        // 个位 小关数 十位 活动abcd关 百位 重置/档案 = 9
        // 千位以上大关
        // 前两位大关卡， 第三位，活动abcd关，最后一位，小关数
        /**
         * 
         * @param mainStage 大关
         * @param level 小关
         * @param subStage 活动abcd分组
         * @param remake 复刻
         */
        function generateDBStage(mainStage: number, level: number, subStage = 0, remake = 0) {
            return mainStage * 1000 + level + subStage * 10 + remake * 100;
        }

        let warship = new WarshipInfo();
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
        let shipNo = tdsNo[2].querySelector('#PNN').textContent;
        shipNo = shipNo.replace('Plan', '1');
        shipNo = shipNo.replace('Collab', '2');
        warship.shipNo = parseInt(shipNo);
        warship.type = nameToWarshipType(tdsNo[4].textContent.replace(/\s/g, ''));

        // 获取舰船稀有度 阵营
        let tdsRarity = trsGenral[2].children;
        warship.rarity = nameToRarity(tdsRarity[1].lastChild.textContent.replace(/\s/g, ''));
        warship.region = nameToRegion(tdsRarity[3].lastChild.textContent.replace(/\s/g, ''));

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
            let normalsalvage = [];
            let spsalvage = [];
            atags.forEach(async a => {
                let text = a.textContent;
                if (text === '限时建造') {

                }
                else if (text === '仅限打捞') {

                } else {
                    let regNormal = /([0-9]+)\-([0-9])/;
                    let regSpecial = /([\s\S]*)([A-Z]+[0-9])/;
                    if (regNormal.test(text)) {
                        let regArr = regNormal.exec(text);
                        let strNormalMain = parseInt(regArr[1]);
                        let strNormalSub = parseInt(regArr[2]);
                        normalsalvage.push(generateDBStage(strNormalMain, strNormalSub));
                    }
                    if (regSpecial.test(text)) {
                        let regArr = regNormal.exec(text);
                        let strSpecial = regArr[1];
                        let strSpecialSub = regArr[2];
                        let isremake = strSpecial.substr(0, 2) === '复刻' ? 1 : 0;
                        // let stageName = strSpecial;
                        // warship.specialsalvage.push(generateDBStage())
                        let missionId = await getMissionId(strSpecial);
                        let spsal = generateDBStage(missionId, parseInt(strSpecialSub[1]), parseInt(strSpecialSub[1], 16) - 9, isremake);
                        spsalvage.push(spsal);
                    }
                }
            })
            warship.normalsalvage = Array.from(new Uint8Array(new Uint16Array(normalsalvage).buffer));
            warship.specialsalvage = Array.from(new Uint8Array(new Uint16Array(spsalvage).buffer));
        }

        // 性能数据
        function getPerformanceInfo(tr: HTMLTableRowElement, result: { [key: string]: any }) {
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
                    let index = td.textContent.lastIndexOf('→');
                    let text = td.textContent.replace(/\s/g, '');
                    if (index >= 0) {
                        value = parseInt(td.textContent.slice(index + 1));
                    }
                    else if (isNaN(parseInt(text))) {
                        value = text;
                    }
                    else {
                        value = parseInt(text);
                    }
                    Object.assign(result, { [key]: value });
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
        for (const key in info) {
            if (info.hasOwnProperty(key)) {
                const state = info[key];
                warship[nameToStateTag(key)] = state;
            }
        }
        return warship;
    })
    warship.normalsalvage = Buffer.from(warship.normalsalvage || []);
    warship.specialsalvage = Buffer.from(warship.specialsalvage || []);
    let warshipEx = new Warship(warship);
    let result = await Warship.findOne({ where: { shipNo: warshipEx.shipNo } });
    if (result) {
        await Warship.update(warshipEx, { where: { shipNo: warshipEx.shipNo } });
    }
    else {
        await warshipEx.save();
    }
    await page.close();
}
