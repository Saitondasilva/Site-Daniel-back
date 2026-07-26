const Parceiro = require('../models/Parceiro');
const Servico = require('../models/Servico');

const parceiroController = {
    async listarPorServico(req, res) {
        try {
            const { servicoId } = req.params;
            const parceiros = await Parceiro.findAll(servicoId);
            res.json({ success: true, data: parceiros });
        } catch (error) {
            console.error('Erro ao listar parceiros:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao listar parceiros' 
            });
        }
    },

    async buscarPorId(req, res) {
        try {
            const parceiro = await Parceiro.findById(req.params.id);
            if (!parceiro) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Parceiro não encontrado' 
                });
            }
            res.json({ success: true, data: parceiro });
        } catch (error) {
            console.error('Erro ao buscar parceiro:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao buscar parceiro' 
            });
        }
    },

    async criar(req, res) {
        try {
            const { servico_id, nome, tipo, local, descricao, preco, featured } = req.body;
            const id = `lst-${Date.now()}`;
            
            const servico = await Servico.findById(servico_id);
            if (!servico) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Serviço não encontrado' 
                });
            }
            
            const parceiro = await Parceiro.create({
                id,
                servico_id,
                nome,
                tipo,
                local,
                descricao,
                preco,
                featured: featured || false,
                ativo: true
            });
            
            res.status(201).json({ success: true, data: parceiro });
        } catch (error) {
            console.error('Erro ao criar parceiro:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao criar parceiro' 
            });
        }
    },

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, tipo, local, descricao, preco, featured, ativo } = req.body;
            
            const parceiro = await Parceiro.update(id, {
                nome,
                tipo,
                local,
                descricao,
                preco,
                featured,
                ativo
            });
            
            if (!parceiro) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Parceiro não encontrado' 
                });
            }
            
            res.json({ success: true, data: parceiro });
        } catch (error) {
            console.error('Erro ao atualizar parceiro:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao atualizar parceiro' 
            });
        }
    },

    async toggleFeatured(req, res) {
        try {
            const parceiro = await Parceiro.toggleFeatured(req.params.id);
            if (!parceiro) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Parceiro não encontrado' 
                });
            }
            res.json({ success: true, data: parceiro });
        } catch (error) {
            console.error('Erro ao alternar destaque:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao alternar destaque' 
            });
        }
    },

    async deletar(req, res) {
        try {
            const parceiro = await Parceiro.findById(req.params.id);
            if (!parceiro) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Parceiro não encontrado' 
                });
            }
            
            await Parceiro.delete(req.params.id);
            res.json({ 
                success: true, 
                message: 'Parceiro deletado com sucesso' 
            });
        } catch (error) {
            console.error('Erro ao deletar parceiro:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao deletar parceiro' 
            });
        }
    }
};

module.exports = parceiroController;