// middleware/validation.js
const { body, validationResult } = require('express-validator');

/**
 * Validação para criação de categoria
 */
const validateCategoria = [
    body('nome')
        .notEmpty().withMessage('Nome é obrigatório')
        .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),
    
    body('descricao')
        .optional()
        .isLength({ max: 500 }).withMessage('Descrição não pode exceder 500 caracteres'),
    
    body('icon')
        .optional()
        .isString().withMessage('Ícone inválido'),
    
    body('cor')
        .optional()
        .matches(/^#[0-9a-fA-F]{6}$/).withMessage('Cor deve estar no formato hexadecimal (#RRGGBB)'),
    
    // Middleware para verificar erros
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Erro de validação',
                errors: errors.array()
            });
        }
        next();
    }
];

module.exports = { validateCategoria };