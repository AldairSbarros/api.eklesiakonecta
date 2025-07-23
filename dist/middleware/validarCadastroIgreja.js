"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCadastroIgreja = void 0;
const express_validator_1 = require("express-validator");
exports.validarCadastroIgreja = [
    (0, express_validator_1.body)("nome")
        .trim()
        .notEmpty().withMessage("Nome é obrigatório.")
        .isLength({ min: 3 }).withMessage("Nome deve ter pelo menos 3 caracteres."),
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty().withMessage("E-mail é obrigatório.")
        .isEmail().withMessage("E-mail inválido."),
    (0, express_validator_1.body)("password")
        .optional()
        .isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres."),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["ativa", "inativa"])
        .withMessage("Status deve ser 'ativa' ou 'inativa'."),
];
//# sourceMappingURL=validarCadastroIgreja.js.map