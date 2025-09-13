import { body } from "express-validator";

export const validarCadastroUsuario = [
  body("nome")
    .notEmpty().withMessage("Nome é obrigatório."),
  body("email")
    .isEmail().withMessage("E-mail inválido."),
  body("senha")
    .isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres."),
  body("perfil")
    .custom((value) => {
      if (!value) return false;
      const mapa: Record<string, string> = {
        'admin': 'ADMIN',
        'dirigente': 'Dirigente',
        'tesoureiro': 'Tesoureiro',
        'secretario': 'Secretario',
        'pastor': 'Pastor',
        'superuser': 'SUPERUSER'
      };
      const normalizado = mapa[String(value).toLowerCase()];
      return !!normalizado;
    })
    .withMessage("Perfil inválido. Use admin, dirigente, tesoureiro, secretario, pastor ou superuser."),
  // ...outras validações se necessário
];