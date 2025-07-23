"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCadastroUsuario = void 0;
const express_validator_1 = require("express-validator");
exports.validarCadastroUsuario = [
    (0, express_validator_1.body)("nome")
        .notEmpty().withMessage("Nome é obrigatório."),
    (0, express_validator_1.body)("email")
        .isEmail().withMessage("E-mail inválido."),
    (0, express_validator_1.body)("senha")
        .isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres."),
    (0, express_validator_1.body)("perfil")
        .isIn(["admin", "dirigente", "tesoureiro"])
        .withMessage("Perfil deve ser admin, dirigente ou tesoureiro."),
    // ...outras validações se necessário
];
//# sourceMappingURL=usuario.validatior.js.map