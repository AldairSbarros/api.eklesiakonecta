"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMember = exports.updateMember = exports.getMember = exports.listMembers = exports.createMember = void 0;
exports.findMemberByEmail = findMemberByEmail;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const twilio_service_1 = require("./twilio.service");
const createMember = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    // Busca a congregação pelo nome (caso venha no data)
    let congregacaoId = data.congregacaoId;
    if (!congregacaoId && data.congregacaoNome) {
        const congregacao = await prisma.congregacao.findFirst({
            where: { nome: data.congregacaoNome }
        });
        if (!congregacao)
            throw new Error('Congregação não encontrada.');
        congregacaoId = congregacao.id;
    }
    const membro = await prisma.member.create({
        data: {
            nome: data.nome,
            congregacaoId,
            telefone: data.telefone,
            email: data.email,
            senha: data.senha,
            dataNascimento: data.dataNascimento,
            whatsapp: data.whatsapp,
        }
    });
    // Envio automático de mensagem de boas-vindas
    if (data.whatsapp) {
        await (0, twilio_service_1.enviarWhatsAppTwilio)(data.whatsapp, `Olá ${data.nome}, seja bem-vindo à nossa igreja!`);
    }
    return membro;
};
exports.createMember = createMember;
const listMembers = async (schema, congregacaoId) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    const where = {};
    if (congregacaoId)
        where.congregacaoId = congregacaoId;
    return prisma.member.findMany({
        where,
        select: {
            id: true,
            nome: true,
            congregacaoId: true
        }
    });
};
exports.listMembers = listMembers;
const getMember = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.member.findUnique({
        where: { id }
    });
};
exports.getMember = getMember;
const updateMember = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.member.update({
        where: { id },
        data
    });
};
exports.updateMember = updateMember;
const deleteMember = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.member.delete({
        where: { id }
    });
};
exports.deleteMember = deleteMember;
function findMemberByEmail(schema, email) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=member.service.js.map