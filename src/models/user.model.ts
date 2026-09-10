import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../db/sequelize.js";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare password: string;
  declare role: CreationOptional<"visitor" | "guide">;
  declare refreshToken: CreationOptional<string | null>;
  declare refreshTokenExpiry: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Le nom d'utilisateur est requis." },
        len: { args: [3, 25], msg: "Le nom d'utilisateur doit contenir entre 3 et 25 caractères." },
      },
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            notEmpty: { msg: "Le mot de passe est requis." },
            len: { args: [6, 100], msg: "Le mot de passe doit contenir entre 6 et 100 caractères." },
        },
    },
    role: { 
      type: DataTypes.ENUM("visitor", "guide"), 
      allowNull: false, 
      defaultValue: "visitor" 
    },
    refreshToken: { type: DataTypes.TEXT, allowNull: true },
    refreshTokenExpiry: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize },
);