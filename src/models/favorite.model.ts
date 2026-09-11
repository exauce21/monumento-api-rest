import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db/sequelize.js";
import { User } from "./user.model.js";
import { Monument } from "./monument.model.js";

export class Favorite extends Model<InferAttributes<Favorite>, InferCreationAttributes<Favorite>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare monumentId: number;
}

Favorite.init(
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
        model: User,
        key: "id",
      },
    },
    monumentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Monument,
        key: "id",
      },
    },
  },
  { sequelize },
);

User.belongsToMany(Monument, {
  through: Favorite,
  foreignKey: "userId",
  otherKey: "monumentId",
  as: "favoriteMonuments",
});

Monument.belongsToMany(User, {
  through: Favorite,
  foreignKey: "monumentId",
  otherKey: "userId",
  as: "favoritedBy",
});
