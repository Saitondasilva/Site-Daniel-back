// models/Servico.js
const { pool } = require('../config/database');

class Servico {
    static async findAllByCategoria(categoriaId) {
        const [rows] = await pool.query(`
            SELECT s.*, 
                   COUNT(p.id) as total_parceiros
            FROM servicos s
            LEFT JOIN parceiros p ON p.servico_id = s.id
            WHERE s.categoria_id = ?
            GROUP BY s.id
            ORDER BY s.nome ASC
        `, [categoriaId]);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(`
            SELECT s.*, 
                   COUNT(p.id) as total_parceiros
            FROM servicos s
            LEFT JOIN parceiros p ON p.servico_id = s.id
            WHERE s.id = ?
            GROUP BY s.id
        `, [id]);
        return rows[0];
    }
}

module.exports = Servico;