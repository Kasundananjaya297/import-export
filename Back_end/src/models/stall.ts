/** @format */
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Stall extends Model {
    public id!: number;
    public userId!: number;
    public stallName!: string;
    public description?: string;
    public logo?: string;
    public status!: "active" | "inactive";

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Stall.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: "User",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        stallName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            allowNull: false,
            defaultValue: "active",
        },
    },
    {
        sequelize,
        modelName: "Stall",
        tableName: "Stall",
    }
);

export default Stall;
