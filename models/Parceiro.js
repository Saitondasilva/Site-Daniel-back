// models/Parceiro.js
const { pool } = require('../config/database');

class Parceiro {
    static async findAll(servicoId = null) {
        let sql = 'SELECT * FROM parceiros WHERE 1=1';
        const params = [];
        
        if (servicoId) {
            sql += ' AND servico_id = ?';
            params.push(servicoId);
        }
        
        sql += ' ORDER BY nome ASC';
        const [rows] = await pool.query(sql, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM parceiros WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = Parceiro;