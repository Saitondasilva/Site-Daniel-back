const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/categoria/:categoriaId', servicoController.listarPorCategoria);
router.get('/:id', servicoController.buscarPorId);

router.post('/', authenticate, authorizeAdmin, servicoController.criar);
router.put('/:id', authenticate, authorizeAdmin, servicoController.atualizar);
router.delete('/:id', authenticate, authorizeAdmin, servicoController.deletar);

module.exports = router;