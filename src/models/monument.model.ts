import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize'
import { sequelize } from '../db/sequelize.js';

export class Monument extends Model<InferAttributes<Monument>, InferCreationAttributes<Monument>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare location: string;
  declare imageUrl: string;
}