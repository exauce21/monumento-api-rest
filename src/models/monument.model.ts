import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize'
import { sequelize } from '../db/sequelize.js';

export class Monument extends Model<InferAttributes<Monument>, InferCreationAttributes<Monument>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare country: string;
    declare city: string;
    declare buildYear: number | null;
    declare picture : string | null;
    declare description: string | null;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Monument.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Le titre ne peut pas être vide"
            },
            len: {
                args: [3, 200],
                msg: "Le titre doit contenir entre 3 et 200 caractères"
            }
        }
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Le pays est obligatoire." },
            len: { args: [2, 100], msg: "Le pays doit contenir entre 2 et 100 caractères." },
        },
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "La ville est obligatoire." },
            len: { args: [2, 100], msg: "La ville doit contenir entre 2 et 100 caractères." },
        },
    },
    buildYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: { msg: "L'année doit être un entier." },
            min: { args: [-3000], msg: "L'année ne peut pas être inférieure à -3000." },
            max: { args: [new Date().getFullYear()], msg: "L'année ne peut pas être dans le futur." },
        },
    },
    picture: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isUrl: { msg: "L'URL de l'image n'est pas valide." } },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: { 
            len: { 
                args: [0, 2000], 
                msg: "La description ne peut pas dépasser 2000 caractères." 
            } 
        },

    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
});