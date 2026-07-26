// config/auth.js
const bcrypt = require('bcryptjs');  // Mude de 'bcrypt' para 'bcryptjs'
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'stpverde_secret_key_2024';

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };