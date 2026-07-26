const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Rotas públicas
router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.buscarPorId);

// Rotas protegidas (admin)
router.post('/', authenticate, authorizeAdmin, categoriaController.criar);
router.put('/:id', authenticate, authorizeAdmin, categoriaController.atualizar);
router.patch('/:id/toggle', authenticate, authorizeAdmin, categoriaController.toggleAtivo);
router.delete('/:id', authenticate, authorizeAdmin, categoriaController.deletar);

module.exports = router;