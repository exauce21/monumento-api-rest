import { Monument } from '../models/monument.model.js';
export const findAll = async (req, res) => {
    try {
        const monuments = await Monument.findAll();
        res.json({ message: 'Liste des monuments', data: monuments });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des monuments :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
export const findById = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const monument = await Monument.findByPk(id);
        if (monument) {
            res.json({ message: 'Monument trouvé', data: monument });
        }
        else {
            res.status(404).json({ message: `Le monument avec l'ID ${id} n'a pas été trouvé`, data: null });
        }
    }
    catch (error) {
        console.error(`Erreur lors de la récupération du monument avec l'ID ${id} :`, error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
export const create = async (req, res) => {
    try {
        const newMonument = await Monument.create(req.body);
        res.status(201).json({ message: 'Monument créé', data: newMonument });
    }
    catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            res.status(400).json({ message: 'Erreur de validation', data: validationErrors });
            return;
        }
        console.error('Erreur lors de la création du monument :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
export const update = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const [updatedRowsCount, updatedRows] = await Monument.update(req.body, {
            where: { id },
            returning: true,
        });
        if (updatedRowsCount === 0) {
            res.status(404).json({ message: `Le monument avec l'ID ${id} n'a pas été trouvé`, data: null });
        }
        else {
            res.json({ message: 'Monument mis à jour', data: updatedRows[0] });
        }
    }
    catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            res.status(400).json({ message: 'Erreur de validation', data: validationErrors });
            return;
        }
        console.error(`Erreur lors de la mise à jour du monument avec l'ID ${id} :`, error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
export const remove = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const deletedRowsCount = await Monument.destroy({ where: { id } });
        if (deletedRowsCount === 0) {
            res.status(404).json({ message: `Le monument avec l'ID ${id} n'a pas été trouvé`, data: null });
        }
        else {
            res.json({ message: 'Monument supprimé', data: null });
        }
    }
    catch (error) {
        console.error(`Erreur lors de la suppression du monument avec l'ID ${id} :`, error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
//# sourceMappingURL=monument.controller.js.map