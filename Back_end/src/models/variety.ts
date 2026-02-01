/** @format */
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Variety extends Model { }

Variety.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        speciesId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "species",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
    },
    {
        sequelize,
        modelName: "Variety",
        tableName: "varieties",
        timestamps: true,
    },
);

export default Variety;
