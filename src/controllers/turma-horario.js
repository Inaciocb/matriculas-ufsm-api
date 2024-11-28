const database = require('../database/connection');

class TurmaHorarioController {

    // Método para obter os horários de uma turma específica
    get(req, res) {
        const { id_turma } = req.params;
        
        database.select()
            .from('Turma_Horarios')
            .where('id_turma', id_turma)
            .then(data => {
                if (data.length === 0) {
                    res.status(404).send('Horários não encontrados para a turma especificada!');
                } else {
                    const obj = data.map(({ id_turma, dia_semana, hora_inicio, hora_fim }) => ({
                        turma: id_turma,
                        dia: dia_semana,
                        inicio: hora_inicio,
                        fim: hora_fim
                    }));
                    res.send(obj);
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Erro ao buscar os horários da turma!');
            });
    }

    // Método para cadastrar horários para uma turma
    post(req, res) {
        const { id_turma, dia_semana, hora_inicio, hora_fim } = req.body;
        
        if (!id_turma || !dia_semana || !hora_inicio || !hora_fim) {
            return res.status(400).send('Todos os campos são obrigatórios!');
        }

        const obj = { id_turma, dia_semana, hora_inicio, hora_fim };

        database.select().from('Turma').where('id_turma', id_turma)
            .then(exist => {
                if (exist.length === 0) {
                    res.status(400).send('Turma não encontrada!');
                } else {
                    database('Turma_Horarios').insert(obj)
                        .then(() => res.send('Horário cadastrado com sucesso!'))
                        .catch(err => {
                            console.log(err);
                            res.status(500).send('Erro ao cadastrar o horário da turma!');
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(400).send('Erro ao buscar a turma!');
            });
    }

    // Método para atualizar um horário específico de uma turma
    put(req, res) {
        const { id_turma, dia_semana, hora_inicio, hora_fim } = req.body;
        
        const obj = { id_turma, dia_semana, hora_inicio, hora_fim };

        database('Turma_Horarios').where('id_turma', id_turma).andWhere('dia_semana', dia_semana).andWhere('hora_inicio', hora_inicio)
            .then(exist => {
                if (exist.length === 0) {
                    res.status(404).send('Horário não encontrado para a turma especificada!');
                } else {
                    database('Turma_Horarios').where('id_turma', id_turma).andWhere('dia_semana', dia_semana).andWhere('hora_inicio', hora_inicio).update(obj)
                        .then(() => res.send('Horário atualizado com sucesso!'))
                        .catch(err => {
                            console.log(err);
                            res.status(500).send('Erro ao atualizar o horário da turma!');
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Erro ao buscar o horário da turma!');
            });
    }

    // Método para deletar um horário específico de uma turma
    delete(req, res) {
        const { id_turma, dia_semana, hora_inicio } = req.body;

        database('Turma_Horarios').where('id_turma', id_turma).andWhere('dia_semana', dia_semana).andWhere('hora_inicio', hora_inicio)
            .then(exist => {
                if (exist.length === 0) {
                    res.status(404).send('Horário não encontrado para a turma especificada!');
                } else {
                    database('Turma_Horarios').where('id_turma', id_turma).andWhere('dia_semana', dia_semana).andWhere('hora_inicio', hora_inicio).del()
                        .then(() => res.send('Horário deletado com sucesso!'))
                        .catch(err => {
                            console.log(err);
                            res.status(500).send('Erro ao deletar o horário da turma!');
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Erro ao buscar o horário da turma!');
            });
    }
}

module.exports = new TurmaHorarioController();
