import { NUMBER, STRING, ENUM, ARRAY } from 'sequelize';
import blhxDB from '.';
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

export function nameToWarshipType(name: string): WarshipType {
    return shipTypes[name] || WarshipType.Invalid;
}

export function shipTypeToName(type: WarshipType): string {
    return Object.keys(shipTypes).find(name => shipTypes[name] === type);
}

const Warship = blhxDB.define('warship', {
    shipNo: NUMBER,
    shipname: STRING,
    aliasname: STRING,
    type: ENUM,
    armorType: NUMBER,
    cannon: NUMBER,
    torpedo: NUMBER,
    reload: NUMBER,
    antiaircraft: NUMBER,
    oilwear: NUMBER,
    maneuverability: NUMBER,
    antisubmarine: NUMBER,
    stamina: NUMBER,
    ability: ARRAY
})

export default Warship;
// Warship.sync()
