// models/Categoria.js
const { pool } = require('../config/database');

class Categoria {
    static async findAll(ativo = null) {
        let sql = `SELECT c.*, 
                   COUNT(DISTINCT s.id) as total_servicos,
                   COUNT(DISTINCT p.id) as total_parceiros
                   FROM categorias c
                   LEFT JOIN servicos s ON s.categoria_id = c.id
                   LEFT JOIN parceiros p ON p.servico_id = s.id`;
        const params = [];
        
        if (ativo !== null) {
            sql += ' WHERE c.ativo = ?';
            params.push(ativo);
        }
        
        sql += ' GROUP BY c.id ORDER BY c.nome ASC';
        const [rows] = await pool.query(sql, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(`
            SELECT c.*, 
                   COUNT(DISTINCT s.id) as total_servicos,
                   COUNT(DISTINCT p.id) as total_parceiros
            FROM categorias c
            LEFT JOIN servicos s ON s.categoria_id = c.id
            LEFT JOIN parceiros p ON p.servico_id = s.id
            WHERE c.id = ?
            GROUP BY c.id
        `, [id]);
        return rows[0];
    }

    static async create(data) {
        const { id, nome, descricao, icon, cor, ativo, heroImage } = data;
        await pool.query(
            `INSERT INTO categorias (id, nome, descricao, icon, cor, ativo, hero_image) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, nome, descricao || null, icon || null, cor || null, 
             ativo !== undefined ? ativo : true, heroImage || null]
        );
        return this.findById(id);
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        const allowedFields = ['nome', 'descricao', 'icon', 'cor', 'ativo', 'hero_image'];
        
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        }
        
        if (fields.length === 0) return this.findById(id);
        
        values.push(id);
        await pool.query(`UPDATE categorias SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    static async delete(id) {
        await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
    }

    static async toggleAtivo(id) {
        const categoria = await this.findById(id);
        if (!categoria) return null;
        const novoAtivo = !categoria.ativo;
        await pool.query('UPDATE categorias SET ativo = ? WHERE id = ?', [novoAtivo, id]);
        return this.findById(id);
    }
}

module.exports = Categoria;