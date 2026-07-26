const Admin = require('../models/Admin');
const { generateToken, comparePassword } = require('../config/auth');

const authController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Buscar admin pelo email
            const admin = await Admin.findByEmail(email);
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }
            
            // Verificar senha
            const isValid = await comparePassword(password, admin.senha);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }
            
            // Gerar token
            const token = generateToken(admin);
            
            res.json({
                success: true,
                token,
                data: {
                    id: admin.id,
                    email: admin.email,
                    nome: admin.nome,
                    role: admin.role
                }
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao realizar login'
            });
        }
    },
    
    async verifyToken(req, res) {
        try {
            // O middleware authenticate já verificou o token
            res.json({
                success: true,
                user: req.user
            });
        } catch (error) {
            console.error('Erro ao verificar token:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao verificar token'
            });
        }
    }
};

module.exports = authController;