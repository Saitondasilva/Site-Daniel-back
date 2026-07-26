const Servico = require('../models/Servico');
const Categoria = require('../models/Categoria');

const servicoController = {
    async listarPorCategoria(req, res) {
        try {
            const { categoriaId } = req.params;
            const servicos = await Servico.findAllByCategoria(categoriaId);
            res.json({ success: true, data: servicos });
        } catch (error) {
            console.error('Erro ao listar serviços:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao listar serviços' 
            });
        }
    },

    async buscarPorId(req, res) {
        try {
            const servico = await Servico.findById(req.params.id);
            if (!servico) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Serviço não encontrado' 
                });
            }
            res.json({ success: true, data: servico });
        } catch (error) {
            console.error('Erro ao buscar serviço:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao buscar serviço' 
            });
        }
    },

    async criar(req, res) {
        try {
            const { categoria_id, nome, descricao, icon, ativo } = req.body;
            const id = `svc-${Date.now()}`;
            
            const categoria = await Categoria.findById(categoria_id);
            if (!categoria) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Categoria não encontrada' 
                });
            }
            
            const servico = await Servico.create({
                id,
                categoria_id,
                nome,
                descricao,
                icon,
                ativo
            });
            
            res.status(201).json({ success: true, data: servico });
        } catch (error) {
            console.error('Erro ao criar serviço:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao criar serviço' 
            });
        }
    },

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, icon, ativo } = req.body;
            
            const servico = await Servico.update(id, {
                nome,
                descricao,
                icon,
                ativo
            });
            
            if (!servico) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Serviço não encontrado' 
                });
            }
            
            res.json({ success: true, data: servico });
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao atualizar serviço' 
            });
        }
    },

    async deletar(req, res) {
        try {
            const servico = await Servico.findById(req.params.id);
            if (!servico) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Serviço não encontrado' 
                });
            }
            
            await Servico.delete(req.params.id);
            res.json({ 
                success: true, 
                message: 'Serviço deletado com sucesso' 
            });
        } catch (error) {
            console.error('Erro ao deletar serviço:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao deletar serviço' 
            });
        }
    }
};

module.exports = servicoController;