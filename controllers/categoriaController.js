const Categoria = require('../models/Categoria');
const Servico = require('../models/Servico');
const { v4: uuidv4 } = require('uuid');

const categoriaController = {
    // Listar todas as categorias
    async listar(req, res) {
        try {
            const { ativo } = req.query;
            const categorias = await Categoria.findAll(ativo);
            res.json({ success: true, data: categorias });
        } catch (error) {
            console.error('Erro ao listar categorias:', error);
            res.status(500).json({ success: false, message: 'Erro ao listar categorias' });
        }
    },

    // Buscar uma categoria por ID
    async buscarPorId(req, res) {
        try {
            const categoria = await Categoria.findById(req.params.id);
            if (!categoria) {
                return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
            }
            // Buscar serviços da categoria
            const servicos = await Servico.findAllByCategoria(req.params.id);
            res.json({ success: true, data: { ...categoria, services: servicos } });
        } catch (error) {
            console.error('Erro ao buscar categoria:', error);
            res.status(500).json({ success: false, message: 'Erro ao buscar categoria' });
        }
    },

    // Criar categoria
    async criar(req, res) {
        try {
            const { nome, descricao, icon, cor, ativo } = req.body;
            const id = `cat-${Date.now()}`;
            
            const categoria = await Categoria.create({
                id,
                nome,
                descricao,
                icon,
                cor,
                ativo
            });
            
            res.status(201).json({ success: true, data: categoria });
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            res.status(500).json({ success: false, message: 'Erro ao criar categoria' });
        }
    },

    // Atualizar categoria
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, icon, cor, ativo } = req.body;
            
            const categoria = await Categoria.update(id, {
                nome,
                descricao,
                icon,
                cor,
                ativo
            });
            
            if (!categoria) {
                return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
            }
            
            res.json({ success: true, data: categoria });
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
            res.status(500).json({ success: false, message: 'Erro ao atualizar categoria' });
        }
    },

    // Toggle ativo/inativo
    async toggleAtivo(req, res) {
        try {
            const categoria = await Categoria.toggleAtivo(req.params.id);
            if (!categoria) {
                return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
            }
            res.json({ success: true, data: categoria });
        } catch (error) {
            console.error('Erro ao alternar status:', error);
            res.status(500).json({ success: false, message: 'Erro ao alternar status' });
        }
    },

    // Deletar categoria
    async deletar(req, res) {
        try {
            const categoria = await Categoria.findById(req.params.id);
            if (!categoria) {
                return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
            }
            
            await Categoria.delete(req.params.id);
            res.json({ success: true, message: 'Categoria deletada com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar categoria:', error);
            res.status(500).json({ success: false, message: 'Erro ao deletar categoria' });
        }
    }
};

module.exports = categoriaController;