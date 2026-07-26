const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Rotas públicas
router.post('/', reservaController.criar);

// Rotas protegidas
router.get('/', authenticate, authorizeAdmin, reservaController.listar);
router.get('/estatisticas', authenticate, authorizeAdmin, reservaController.estatisticas);
router.get('/exportar', authenticate, authorizeAdmin, reservaController.exportarCSV);
router.get('/:id', authenticate, authorizeAdmin, reservaController.buscarPorId);
router.put('/:id', authenticate, authorizeAdmin, reservaController.atualizar);
router.patch('/:id/status', authenticate, authorizeAdmin, reservaController.atualizarStatus);
router.delete('/:id', authenticate, authorizeAdmin, reservaController.deletar);

module.exports = router;