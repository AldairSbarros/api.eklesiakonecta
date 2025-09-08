import { body } from "express-validator";

export const validarCadastroUsuario = [
  body("nome")
    .notEmpty().withMessage("Nome é obrigatório."),
  body("email")
    .isEmail().withMessage("E-mail inválido."),
  body("senha")
    .isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres."),
  body("perfil")
<<<<<<< HEAD
    .isIn(["admin", "dirigente", "tesoureiro"])
    .withMessage("Perfil deve ser admin, dirigente ou tesoureiro."),
=======
    .isIn(["admin", "dirigente", "tesoureiro", 'SUPERUSER'])
    .withMessage("Perfil deve ser admin, dirigente ou tesoureiro, superuser."),
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
  // ...outras validações se necessário
];