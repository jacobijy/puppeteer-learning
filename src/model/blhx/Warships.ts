import { DataTypes, Model } from 'sequelize';
import sequelize from '.';
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
export enum WarshipType {
    Destroyer,
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

export enum Rarity {
    Normal,
    Rare,
    SuperRare,
    Elite = 2,
    SuperiorSuperRare,
    Priority,
    UltraRare,
    Decisive
}

export enum Region {
    EagleUnion,
    RoyalNavy,
    IronBlood,
    VichyaDominion,
    IrisLibre,
    SakuraEmpire,
    DragonEmpery,
    NorthernParliament
}

export enum AchieveType {
    OnlyBuildNormal,
    OnlyBuildLimit,
    OnlySalvage,
    All,
    None,
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

export function nameToWarshipType(name: string): WarshipType {
    return shipTypes[name] || WarshipType.Invalid;
}

export function shipTypeToName(type: WarshipType): string {
    return Object.keys(shipTypes).find(name => shipTypes[name] === type);
}

export function nameToRarity(name: string): Rarity {
    return raritys[name] || Rarity.Normal;
}

export function rarityToName(rare: Rarity): string {
    return Object.keys(raritys).find(name => raritys[name] === rare);
}

export function nameToRegion(name: string): Region {
    return regions[name] || Region.EagleUnion;
}

export function regionToName(reg: Region): string {
    return Object.keys(regions).find(name => regions[name] === reg);
}

export default class Warship extends Model {
}

Warship.init({
    shipNo: DataTypes.NUMBER,
    shipname: DataTypes.STRING,
    shipclass: DataTypes.STRING,
    aliasname: DataTypes.STRING,
    englishname: DataTypes.STRING,
    rarity: DataTypes.ENUM,
    region: DataTypes.ENUM,
    iconsrc: DataTypes.STRING,
    type: DataTypes.ENUM,
    normalsalvage: DataTypes.ARRAY(DataTypes.NUMBER),
    specialsalvage: DataTypes.ARRAY(DataTypes.NUMBER),
    buildtime: DataTypes.NUMBER,
    armorType: DataTypes.NUMBER,
    cannon: DataTypes.NUMBER,
    torpedo: DataTypes.NUMBER,
    reload: DataTypes.NUMBER,
    antiaircraft: DataTypes.NUMBER,
    oilwear: DataTypes.NUMBER,
    maneuverability: DataTypes.NUMBER,
    antisubmarine: DataTypes.NUMBER,
    stamina: DataTypes.NUMBER,
    ability: DataTypes.ARRAY(DataTypes.JSON)
}, { sequelize })

// export default Warship;
Warship.sync();


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
export function generateDBStage(mainStage: number, level: number, subStage = 0, remake = 0) {
    return mainStage * 1000 + level + subStage * 10 + remake * 100;
}

export function decodeDBStage(stage: number) {
    let main = Math.floor(stage / 1000);
    let level = stage % 10;
    let subStage = Math.floor(stage / 10) % 10;
    let remake = Math.floor(stage / 100) % 10;
    return { main, level, subStage, remake };
}
