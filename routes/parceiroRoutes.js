const express = require('express');
const router = express.Router();
const parceiroController = require('../controllers/parceiroController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/servico/:servicoId', parceiroController.listarPorServico);
router.get('/:id', parceiroController.buscarPorId);

router.post('/', authenticate, authorizeAdmin, parceiroController.criar);
router.put('/:id', authenticate, authorizeAdmin, parceiroController.atualizar);
router.patch('/:id/toggle-featured', authenticate, authorizeAdmin, parceiroController.toggleFeatured);
router.delete('/:id', authenticate, authorizeAdmin, parceiroController.deletar);

module.exports = router;