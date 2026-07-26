// middleware/auth.js
const { verifyToken } = require('../config/auth');

/**
 * Middleware de autenticação
 * Verifica se o token JWT é válido
 */
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token não fornecido' 
            });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token inválido ou expirado' 
            });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro na autenticação:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao autenticar' 
        });
    }
}

/**
 * Middleware de autorização
 * Verifica se o usuário é administrador
 */
function authorizeAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acesso restrito a administradores' 
        });
    }
    next();
}

module.exports = { authenticate, authorizeAdmin };