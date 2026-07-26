const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de login (pública)
router.post('/login', authController.login);

// Rota de verificação de token (protegida)
router.get('/verify', authController.verifyToken);

module.exports = router;