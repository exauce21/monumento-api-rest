import type { RequestHandler } from 'express';
import { Monument } from '../models/monument.model.js';
import { notFoundError, badRequestError } from '../errors/http-error.js';
import { Op, WhereOptions } from 'sequelize';

const SORTABLE = ["title", "buildYear", "createdAt"] as const;
type Sortable = (typeof SORTABLE)[number];


export const findAll: RequestHandler = async (req, res) => {
    const { title, country, afterDate, beforeDate, orderBy, order, limit } = req.query;
    const where: WhereOptions<Monument> = {};

    if(typeof title === 'string' && title.trim().length >= 2) {
        where.title = { [Op.like]: `%${title.trim()}%` };
    }

    if(typeof country === 'string') {
        where.country = { [Op.like]: `%${country.trim()}%` };
    }

    const yearRange: Record<symbol, number> = {};
    if(typeof afterDate === 'string') {
        const n = Number(afterDate);
        if(!Number.isInteger(n)) throw badRequestError("afterDate doit être un entier");
        yearRange[Op.gte] = n;
    }

    if(typeof beforeDate === 'string') {
        const n = Number(beforeDate);
        if(!Number.isInteger(n)) throw badRequestError("beforeDate doit être un entier");
        yearRange[Op.lte] = n;
    }

    if(Object.getOwnPropertySymbols(yearRange).length > 0) where.buildYear = yearRange;

    if(orderBy !== undefined && !SORTABLE.includes(orderBy as Sortable)) {
        throw badRequestError(`orderBy doit être l'une des valeurs suivantes : ${SORTABLE.join(", ")}`);
    }

    const direction = order === 'desc' ? 'DESC' : 'ASC';

    const monuments = await Monument.findAll({
        where,
        order: [[(orderBy as Sortable) ?? 'title', direction]],
        limit: typeof limit === 'string' ? Number(limit) : undefined
    });
    res.json({ message: 'Liste des monuments', data: monuments });
};

export const findById: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const monument = await Monument.findByPk(id);
    if (!monument) throw notFoundError(`Le monument avec l'ID ${id} n'a pas été trouvé`);
    res.json({ message: 'Monument trouvé', data: monument });
};

export const create: RequestHandler = async (req, res) => {
    const newMonument = await Monument.create(req.body);
    res.status(201).json({ message: 'Monument créé', data: newMonument });
};

export const update: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const updatedRows = await Monument.update(req.body, {
        where: { id }
    });

    if (!updatedRows[0]) throw notFoundError(`Le monument avec l'ID ${id} n'a pas été trouvé`);
    res.json({ message: 'Monument mis à jour', data: updatedRows[0] });
};

export const remove: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const deletedRowsCount = await Monument.destroy({ where: { id } });

    if (deletedRowsCount === 0) throw notFoundError(`Le monument avec l'ID ${id} n'a pas été trouvé`);
    res.json({ message: 'Monument supprimé', data: null });
};