import { Model, DataType, Table, Column } from 'sequelize-typescript';


@Table({
    timestamps: false
})
export default class Warship extends Model<Warship> {
    @Column({ 
        type: DataType.SMALLINT,
        primaryKey: true
     })
    shipNo: number;
    @Column({ type: DataType.STRING })
    shipname: string;
    @Column({ type: DataType.STRING })
    shipclass: string;
    @Column({ type: DataType.STRING })
    aliasname: string;
    @Column({ type: DataType.STRING })
    englishname: string;
    @Column({ type: DataType.SMALLINT })
    rarity: number;
    @Column({ type: DataType.SMALLINT })
    region: number;
    @Column({ type: DataType.STRING })
    iconsrc: string;
    @Column({ type: DataType.SMALLINT })
    type: number;
    @Column({type: DataType.BLOB})
    normalsalvage: Buffer;
    @Column({type: DataType.BLOB})
    specialsalvage: Buffer;
    @Column({type: DataType.INTEGER})
    buildtime: number;
    @Column({type: DataType.SMALLINT})
    armorType: number;
    @Column({type: DataType.INTEGER})
    cannon: number;
    @Column({type: DataType.INTEGER})
    torpedo: number;
    @Column({type: DataType.INTEGER})
    reloadState: number;
    @Column({type: DataType.INTEGER})
    antiaircraft: number;
    @Column({type: DataType.INTEGER})
    oilwear: number;
    @Column({type: DataType.INTEGER})
    antisubmarine: number;
    @Column({type: DataType.INTEGER})
    stamina: number;
    @Column({type: DataType.INTEGER})
    flexibility: number;
    @Column({type: DataType.INTEGER})
    luck: number;
    @Column({type: DataType.INTEGER})
    speed: number;
    @Column({type: DataType.INTEGER})
    airpower: number;
    @Column({type: DataType.STRING})
    ability: string;
}
