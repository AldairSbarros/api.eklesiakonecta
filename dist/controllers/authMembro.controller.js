"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginMembro = void 0;
const memberService = __importStar(require("../services/member.service"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'seusegredoaqui';
const loginMembro = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { email, senha } = req.body;
        // Use o service para buscar o membro pelo schema
        const membro = await memberService.findMemberByEmail(schema, email);
        if (membro == null || !('senha' in membro)) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }
        const senhaCorreta = membro.password && membro.senha.startsWith('$2a')
            ? await bcryptjs_1.default.compare(senha, membro.senha)
            : senha === membro.senha;
        if (!senhaCorreta) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: membro.id, nome: membro.nome, email: membro.email, tipo: 'membro', congregacaoId: membro.congregacaoId }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            membro: {
                id: membro.id,
                nome: membro.nome,
                email: membro.email,
                congregacaoId: membro.congregacaoId,
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.loginMembro = loginMembro;
//# sourceMappingURL=authMembro.controller.js.map