/** @format */
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Species extends Model { }

Species.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "Species",
        tableName: "species",
        timestamps: true,
    },
);

export default Species;
