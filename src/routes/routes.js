const express = require('express');
const router = express.Router();
const CentroController = require('../controllers/centro');
const CursoController = require('../controllers/curso');
const AlunoController = require('../controllers/aluno');
const DisciplinaController = require('../controllers/disciplina');
const ProfessorController = require('../controllers/professor');
const SalaController = require('../controllers/sala');
const TurmaController = require('../controllers/turma');
const TurmaAlunoController = require('../controllers/turma-aluno');

const TurmaHorarioController = require('../controllers/turma-horario');

router.get('/centros', CentroController.get);
router.post('/centros', CentroController.post);
router.put('/centros', CentroController.put);
router.delete('/centros', CentroController.delete);

router.get('/cursos', CursoController.get);
router.post('/cursos', CursoController.post);
router.put('/cursos', CursoController.put);
router.delete('/cursos', CursoController.delete);

router.get('/alunos', AlunoController.get);
router.post('/alunos', AlunoController.post);
router.put('/alunos', AlunoController.put);
router.delete('/alunos', AlunoController.delete);

router.get('/disciplinas', DisciplinaController.get);
router.post('/disciplinas', DisciplinaController.post);
router.put('/disciplinas', DisciplinaController.put);
router.delete('/disciplinas/:codigo', DisciplinaController.delete);

router.get('/professores', ProfessorController.get);
router.post('/professores', ProfessorController.post);
router.put('/professores', ProfessorController.put);
router.delete('/professores', ProfessorController.delete);
router.get('/professores/centro/:centro', ProfessorController.getProfessoresCentro);

router.get('/salas', SalaController.get);
router.post('/salas', SalaController.post);
router.put('/salas', SalaController.put);
router.delete('/salas', SalaController.delete);
router.post('/salas/disponiveis', SalaController.getSalasDisponiveis);

router.get('/turmas', TurmaController.get);
router.post('/turmas', TurmaController.post);
router.put('/turmas', TurmaController.put);
router.delete('/turmas', TurmaController.delete);
router.get('/turmas/disponiveis/:matricula', TurmaController.getTurmasDisponiveis);

router.get('/turmas-alunos', TurmaAlunoController.get);
router.post('/turmas-alunos', TurmaAlunoController.post);
router.put('/turmas-alunos', TurmaAlunoController.put);
router.delete('/turmas-alunos', TurmaAlunoController.delete);
router.get('/turmas-alunos/situacao/:matricula', TurmaAlunoController.getTurmasAluno);
router.get('/turmas/:id_turma/horarios', TurmaHorarioController.get);


module.exports = router;