"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trocarDiscipulador = exports.listarDiscipulandos = exports.removerDiscipulando = exports.atualizarDiscipulando = exports.listarTodosDiscipulandos = exports.criarDiscipulando = void 0;
const prismaDynamic_1 = require("../config/prismaDynamic");
// Criar discipulando
const criarDiscipulando = async (req, res) => {
    const schema = req.headers['schema'];
    const { nome, congregacaoId, discipuladorId, celulaId } = req.body;
    try {
        const novo = await (0, prismaDynamic_1.getPrismaForSchema)(schema).member.create({
            data: { nome, congregacaoId, discipuladorId, celulaId }
        });
        res.status(201).json(novo);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.criarDiscipulando = criarDiscipulando;
// Listar todos os discipulandos
const listarTodosDiscipulandos = async (req, res) => {
    const schema = req.headers['schema'];
    const membros = await (0, prismaDynamic_1.getPrismaForSchema)(schema).member.findMany();
    res.json(membros);
};
exports.listarTodosDiscipulandos = listarTodosDiscipulandos;
// Atualizar discipulando
const atualizarDiscipulando = async (req, res) => {
    const schema = req.headers['schema'];
    const { id } = req.params;
    try {
        const membro = await (0, prismaDynamic_1.getPrismaForSchema)(schema).member.update({
            where: { id: Number(id) },
            data: req.body
        });
        res.json(membro);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.atualizarDiscipulando = atualizarDiscipulando;
// Remover discipulando
const removerDiscipulando = async (req, res) => {
    const schema = req.headers['schema'];
    const { id } = req.params;
    try {
        await (0, prismaDynamic_1.getPrismaForSchema)(schema).member.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Discipulando removido com sucesso.' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.removerDiscipulando = removerDiscipulando;
// Listar discipulandos de um discipulador
const listarDiscipulandos = async (req, res) => {
    const schema = req.headers['schema'];
    const { id } = req.params;
    const discipulandos = await (0, prismaDynamic_1.getPrismaForSchema)(schema).member.findMany({
        where: { discipuladorId: Number(id) }
    });
    res.json(discipulandos);
};
exports.listarDiscipulandos = listarDiscipulandos;
// Trocar discipulador de um membro
const trocarDiscipulador = async (req, res) => {
    const schema = req.headers['schema'];
    const { id } = req.params;
    const { novoDiscipuladorId } = req.body;
    const membro = await (0, prismaDynamic_1.getPrismaForSchema)(schema).member.update({
        where: { id: Number(id) },
        data: { discipuladorId: novoDiscipuladorId }
    });
    res.json(membro);
};
exports.trocarDiscipulador = trocarDiscipulador;
//# sourceMappingURL=discipulado.controller.js.map