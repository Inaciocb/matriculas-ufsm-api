const database = require('../database/connection');

class TurmaController {
    // Buscar todas as turmas
    get(req, res) {
        database.select().from('Turma')
            .then(data => {
                const obj = data.map(({
                    id_turma,
                    ano,
                    semestre_turma,
                    N_vagas,
                    data_inicio,
                    data_fim,
                    codigo_disciplina,
                    Matricula_Professor,
                    Centro_Sala,
                    Numero_Sala
                }) => ({
                    id: id_turma,
                    ano,
                    semestre: semestre_turma,
                    vagas: N_vagas,
                    data_inicio,
                    data_fim,
                    disciplina: codigo_disciplina,
                    professor: Matricula_Professor,
                    centro: Centro_Sala,
                    numero_Sala: Numero_Sala
                }));
                res.send(obj);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Erro ao buscar turmas!');
            });
    }

    // Buscar horários de uma turma específica
    getHorarios(req, res) {
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

    // Criar uma nova turma
    post(req, res) {
        const {
            id_turma,
            ano,
            semestre_turma,
            N_vagas,
            data_inicio,
            data_fim,
            codigo_disciplina,
            Matricula_Professor,
            Centro,
            Numero_Sala,
            id_curso
        } = req.body;
        let obj = {
            id_turma,
            ano,
            semestre_turma,
            N_vagas,
            data_inicio,
            data_fim,
            codigo_disciplina,
            Matricula_Professor,
            Centro_Sala: Centro,
            Numero_Sala,
            id_curso
        };

        database.select().from('Disciplina').where('codigo_disciplina', codigo_disciplina)
            .then(data => {
                if (data.length === 0) {
                    res.status(400).send('Disciplina não encontrada!');
                } else {
                    database.select().from('Professor').where('Matricula', Matricula_Professor)
                        .then(data2 => {
                            if (data2.length === 0) {
                                res.status(400).send('Professor não encontrado!');
                            } else {
                                database.select().from('Sala').where('numero', Numero_Sala).where('centro', Centro)
                                    .then(data3 => {
                                        if (data3.length === 0) {
                                            res.status(400).send('Sala não encontrada!');
                                        } else {
                                            database('Turma').insert(obj).then(() => {
                                                res.send('Turma cadastrada com sucesso!');
                                            }).catch(err => {
                                                console.log(err);
                                                res.status(500).send('Erro ao cadastrar turma!');
                                            });
                                        }
                                    }).catch(err => {
                                        console.log(err);
                                        res.status(500).send('Erro ao buscar sala!');
                                    });
                            }
                        }).catch(err => {
                            console.log(err);
                            res.status(400).send('Erro ao buscar professor!');
                        });
                }
            }).catch(err => {
                console.log(err);
                res.status(400).send('Erro ao buscar disciplina!');
            });
    }

    // Atualizar turma
    put(req, res) {
        const {
            id,
            ano,
            semestre,
            vagas,
            data_inicio,
            data_fim,
            disciplina,
            professor,
            Centro,
            numero_Sala,
            curso
        } = req.body;
        let obj = {
            id_turma: id,
            ano,
            semestre_turma: semestre,
            N_vagas: vagas,
            data_inicio,
            data_fim,
            codigo_disciplina: disciplina,
            Matricula_Professor: professor,
            Centro_Sala: Centro,
            Numero_Sala: numero_Sala,
            id_curso: curso
        };

        database('Turma').where('id_turma', id)
            .then(exist => {
                if (exist.length === 0) {
                    res.status(400).send('Turma não encontrada!');
                } else {
                    database('Turma').where('id_turma', id).update(obj)
                        .then(() => {
                            res.send('Turma atualizada com sucesso!');
                        }).catch(err => {
                            console.log(err);
                            res.status(500).send('Erro ao atualizar turma!');
                        });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send('Erro ao buscar turma!');
            });
    }

    // Deletar turma
    delete(req, res) {
        const { id_turma } = req.body;

        database('Turma').where('id_turma', id_turma)
            .then(exist => {
                if (exist.length === 0) {
                    res.status(404).send('Turma não encontrada!');
                } else {
                    database('Turma').where('id_turma', id_turma).del()
                        .then(() => {
                            res.send('Turma deletada com sucesso!');
                        }).catch(err => {
                            console.log(err);
                            res.status(500).send('Erro ao deletar turma!');
                        });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send('Erro ao buscar turma!');
            });
    }

    // Buscar turmas disponíveis para um aluno
    async getTurmasDisponiveis(req, res) {
        const matriculaAluno = req.params.matricula;
        try {
            const disciplinasDisponiveis = await database.raw('CALL GetDisciplinasDisponiveis(?)', [matriculaAluno]);

            if (disciplinasDisponiveis[0].length === 0) {
                return res.status(404).send('Nenhuma disciplina disponível para o aluno!');
            }

            const codigosDisciplinasDisponiveis = disciplinasDisponiveis[0][0].map(d => d.codigo_disciplina);

            const turmasDisponiveis = await database('Turma as t')
                .join('Disciplina as d', 't.codigo_disciplina', '=', 'd.codigo_disciplina')
                .whereIn('t.codigo_disciplina', codigosDisciplinasDisponiveis)
                .select(
                    't.id_turma',
                    't.codigo_disciplina',
                    'd.nome as nome_disciplina',
                    't.semestre_turma',
                    't.hora_inicio',
                    't.hora_fim',
                    't.Matricula_Professor',
                    't.Numero_Sala',
                    't.dia_semana'
                );

            if (turmasDisponiveis.length === 0) {
                return res.status(404).send('Nenhuma turma disponível para o aluno!');
            }

            return res.status(200).json(turmasDisponiveis);

        } catch (error) {
            console.error('Erro ao buscar turmas disponíveis:', error);
            return res.status(500).json({ error: 'Erro ao buscar turmas disponíveis.' });
        }
    }
}

module.exports = new TurmaController();
