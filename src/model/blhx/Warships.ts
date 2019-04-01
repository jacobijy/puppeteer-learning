import * as Sequelize from 'sequelize';
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
    BattleShip,
    BattleshipVessel,
    CarrierVesselLight,
    CarrierVessel,
    Submarine,
    SubmarineVessel
}

const Warship = blhxDB.define('warship', {
    shipname: Sequelize.STRING,
    aliasname: Sequelize.STRING,
    type: Sequelize.NUMERIC,
    armorType: Sequelize.NUMBER,
    cannon: Sequelize.NUMBER,
    torpedo: Sequelize.NUMBER,
    reload: Sequelize.NUMBER,
    antiaircraft: Sequelize.NUMBER,
    oilwear: Sequelize.NUMBER,
    maneuverability: Sequelize.NUMBER,
    antisubmarine: Sequelize.NUMBER,
    stamina: Sequelize.NUMBER,
    ability1: Sequelize.NUMBER,
    ability2: Sequelize.NUMBER,
    ability3: Sequelize.NUMBER
})

export default Warship;
// Warship.sync()
