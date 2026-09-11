import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../db/sequelize.js";
import { Monument } from "./monument.model.js";

export class Anecdote extends Model<InferAttributes<Anecdote>, InferCreationAttributes<Anecdote>> {
  declare id: CreationOptional<number>;
  declare content: string;
  declare monumentId: number;
}

Anecdote.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [10, 2000],
          msg: "L'anecdote doit contenir entre 10 et 2000 caractères.",
        },
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

Monument.hasMany(Anecdote, {
  foreignKey: "monumentId",
  as: "anecdotes",
  onDelete: "CASCADE",
});

Anecdote.belongsTo(Monument, {
  foreignKey: "monumentId",
  as: "monument",
  onDelete: "CASCADE",
});
