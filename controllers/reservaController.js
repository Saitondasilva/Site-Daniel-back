// controllers/reservaController.js
const Reserva = require('../models/Reserva');

const reservaController = {
    /**
     * Listar todas as reservas
     * GET /api/reservas
     */
    async listar(req, res) {
        try {
            const { status, usuario_email, page = 1, limit = 20 } = req.query;
            
            const reservas = await Reserva.findAll({
                status,
                usuario_email,
                page: parseInt(page),
                limit: parseInt(limit)
            });
            
            res.json({
                success: true,
                data: reservas.data,
                pagination: {
                    total: reservas.total,
                    page: reservas.page,
                    limit: reservas.limit,
                    totalPages: reservas.totalPages
                }
            });
        } catch (error) {
            console.error('❌ Erro ao listar reservas:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao listar reservas',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Buscar reserva por ID
     * GET /api/reservas/:id
     */
    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const reserva = await Reserva.findById(id);

            if (!reserva) {
                return res.status(404).json({
                    success: false,
                    message: 'Reserva não encontrada'
                });
            }

            res.json({
                success: true,
                data: reserva
            });
        } catch (error) {
            console.error('❌ Erro ao buscar reserva:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar reserva',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Criar nova reserva
     * POST /api/reservas
     */
    async criar(req, res) {
        try {
            console.log('📝 Body recebido:', req.body);
            
            const {
                usuario_id,
                usuario_nome,
                usuario_email,
                usuario_telefone,
                data_reserva,
                hora_reserva,
                numero_pessoas,
                observacoes
            } = req.body;

            // Validar campos obrigatórios
            const errors = [];
            if (!usuario_nome) errors.push('usuario_nome é obrigatório');
            if (!usuario_email) errors.push('usuario_email é obrigatório');
            if (!data_reserva) errors.push('data_reserva é obrigatório');
            if (!hora_reserva) errors.push('hora_reserva é obrigatório');

            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Campos obrigatórios faltando',
                    errors
                });
            }

            // Criar reserva
            const id = `res-${Date.now()}`;
            
            const dadosReserva = {
                id,
                usuario_id: usuario_id || null,
                usuario_nome,
                usuario_email,
                usuario_telefone: usuario_telefone || null,
                data_reserva,
                hora_reserva,
                numero_pessoas: numero_pessoas || 1,
                status: 'pendente',
                observacoes: observacoes || null
            };

            console.log('📝 Dados da reserva:', dadosReserva);

            const reserva = await Reserva.create(dadosReserva);

            res.status(201).json({
                success: true,
                message: 'Reserva criada com sucesso',
                data: reserva
            });

        } catch (error) {
            console.error('❌ Erro ao criar reserva:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao criar reserva',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Atualizar status da reserva
     * PATCH /api/reservas/:id/status
     */
    async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, observacoes } = req.body;

            // Validar status
            const statusValidos = ['pendente', 'confirmada', 'cancelada', 'concluida'];
            if (!status || !statusValidos.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Status inválido. Use: ' + statusValidos.join(', ')
                });
            }

            // Buscar reserva
            const reserva = await Reserva.findById(id);
            if (!reserva) {
                return res.status(404).json({
                    success: false,
                    message: 'Reserva não encontrada'
                });
            }

            // Validar transição de status
            const transicoesValidas = {
                pendente: ['confirmada', 'cancelada'],
                confirmada: ['cancelada', 'concluida'],
                cancelada: ['pendente'],
                concluida: []
            };

            if (!transicoesValidas[reserva.status]?.includes(status) && 
                reserva.status !== status) {
                return res.status(400).json({
                    success: false,
                    message: `Transição de status inválida: ${reserva.status} -> ${status}`
                });
            }

            // Atualizar status
            const reservaAtualizada = await Reserva.updateStatus(id, status);

            // Atualizar observações se fornecidas
            if (observacoes) {
                const novasObs = `${reserva.observacoes || ''}\n[${new Date().toISOString()}] ${observacoes}`;
                await Reserva.update(id, { observacoes: novasObs });
                // Buscar novamente para incluir as observações
                const reservaComObs = await Reserva.findById(id);
                return res.json({
                    success: true,
                    message: 'Status atualizado com sucesso',
                    data: reservaComObs
                });
            }

            res.json({
                success: true,
                message: 'Status atualizado com sucesso',
                data: reservaAtualizada
            });

        } catch (error) {
            console.error('❌ Erro ao atualizar status:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao atualizar status',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Atualizar reserva
     * PUT /api/reservas/:id
     */
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const {
                usuario_nome,
                usuario_email,
                usuario_telefone,
                data_reserva,
                hora_reserva,
                numero_pessoas,
                observacoes
            } = req.body;

            // Buscar reserva
            const reserva = await Reserva.findById(id);
            if (!reserva) {
                return res.status(404).json({
                    success: false,
                    message: 'Reserva não encontrada'
                });
            }

            // Atualizar reserva
            const dadosAtualizados = {
                usuario_nome: usuario_nome || reserva.usuario_nome,
                usuario_email: usuario_email || reserva.usuario_email,
                usuario_telefone: usuario_telefone !== undefined ? usuario_telefone : reserva.usuario_telefone,
                data_reserva: data_reserva || reserva.data_reserva,
                hora_reserva: hora_reserva || reserva.hora_reserva,
                numero_pessoas: numero_pessoas || reserva.numero_pessoas,
                observacoes: observacoes !== undefined ? observacoes : reserva.observacoes
            };

            const reservaAtualizada = await Reserva.update(id, dadosAtualizados);

            res.json({
                success: true,
                message: 'Reserva atualizada com sucesso',
                data: reservaAtualizada
            });

        } catch (error) {
            console.error('❌ Erro ao atualizar reserva:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao atualizar reserva',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Deletar reserva
     * DELETE /api/reservas/:id
     */
    async deletar(req, res) {
        try {
            const { id } = req.params;

            const reserva = await Reserva.findById(id);
            if (!reserva) {
                return res.status(404).json({
                    success: false,
                    message: 'Reserva não encontrada'
                });
            }

            // Verificar se pode deletar (apenas pendentes)
            if (reserva.status !== 'pendente') {
                return res.status(400).json({
                    success: false,
                    message: 'Apenas reservas pendentes podem ser deletadas'
                });
            }

            await Reserva.delete(id);

            res.json({
                success: true,
                message: 'Reserva deletada com sucesso'
            });

        } catch (error) {
            console.error('❌ Erro ao deletar reserva:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao deletar reserva',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Estatísticas de reservas
     * GET /api/reservas/estatisticas
     */
    async estatisticas(req, res) {
        try {
            const stats = await Reserva.getStats();

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('❌ Erro ao buscar estatísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar estatísticas',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Exportar reservas para CSV
     * GET /api/reservas/exportar
     */
    async exportarCSV(req, res) {
        try {
            const reservas = await Reserva.findAll({ limit: 10000 });

            // Formatar para CSV
            const cabecalho = [
                'ID',
                'Cliente',
                'Email',
                'Telefone',
                'Data',
                'Hora',
                'Pessoas',
                'Status',
                'Observações',
                'Criado em'
            ];

            const linhas = reservas.data.map(r => [
                r.id,
                r.usuario_nome,
                r.usuario_email,
                r.usuario_telefone || 'N/A',
                r.data_reserva,
                r.hora_reserva,
                r.numero_pessoas,
                r.status,
                r.observacoes || '',
                new Date(r.created_at).toLocaleString('pt-PT')
            ]);

            const csv = [
                cabecalho.join(';'),
                ...linhas.map(linha => linha.join(';'))
            ].join('\n');

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename=reservas_${new Date().toISOString().split('T')[0]}.csv`);
            res.send(csv);

        } catch (error) {
            console.error('❌ Erro ao exportar reservas:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao exportar reservas',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = reservaController;