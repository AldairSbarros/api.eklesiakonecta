import { Request, Response } from 'express';
import { CadastroService } from '../services/cadastro.service';

export const CadastroController = {
  async cadastroInicial(req: Request, res: Response) {
    const { nomeIgreja, nomePastor, emailPastor, senhaPastor } = req.body;
    const result = await CadastroService.cadastroInicial({
      nomeIgreja,
      nomePastor,
      emailPastor,
      senhaPastor,
    });
    res.status(201).json(result);
  },
};
