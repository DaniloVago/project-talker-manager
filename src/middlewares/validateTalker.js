const validateToken = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: 'Token não encontrado' });
    }
    if (authorization.length !== 16 || typeof authorization !== 'string') {
        return res.status(401).json({ message: 'Token inválido' });
    }
    next();
};

const validateName = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'O campo "name" é obrigatório' });
    }
    if (name.length < 3) {
        return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    }
    next();
};

const validateAge = (req, res, next) => {
    const { age } = req.body;
    if (!age) {
        return res.status(400).json({ message: 'O campo "age" é obrigatório' });
    }
    if (age < 18 || !Number.isInteger(age)) {
        return res.status(400).json({ 
            message: 'O campo "age" deve ser um número inteiro igual ou maior que 18', 
        });
    }
    next();
};

const valideDate = (date) => {
    const dateEstructure = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    return dateEstructure.test(date); 
};

const validateTalk = (req, res, next) => {
    const { talk } = req.body;
    if (talk === undefined) {
        return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
    }
    next();
};

const validateWatchedAt = (req, res, next) => {
    const { talk } = req.body;
    const { watchedAt } = talk;
    if (!watchedAt) {
        return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
    }
    if (!valideDate(watchedAt)) {
        return res.status(400).json({ 
            message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"', 
        });
    }
    next();
};

const validateRate = (req, res, next) => {
    const { talk } = req.body;
    const { rate } = talk;
    if (rate === undefined) {
        return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
    }
    if (rate <= 0 || rate > 5 || !Number.isInteger(rate)) {
        return res.status(400).json({ 
            message: 'O campo "rate" deve ser um número inteiro entre 1 e 5', 
        });
    }
    next();
};

module.exports = { 
    validateToken, validateName, validateAge, validateTalk, validateWatchedAt, validateRate };