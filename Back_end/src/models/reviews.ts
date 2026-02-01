/** @format */
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Review extends Model {
    public id!: number;
    public userId!: number;
    public stallId!: number;
    public rating!: number;
    public comment!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "User",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        stallId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Stall",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Review",
        tableName: "Review",
        indexes: [
            {
                unique: true,
                fields: ["userId", "stallId"],
            },
        ],
    }
);

export default Review;
