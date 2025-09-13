import { Router } from 'express';
import { ReceitaController } from '../controllers/receita.controller';
import { asyncHandler } from '../utils/asyncHandler';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.join(process.cwd(), 'uploads', 'receitas');
fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_'))
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (!allowed.includes(file.mimetype)) return cb(new Error('Tipo de arquivo não permitido. Use JPEG ou PNG.'));
    cb(null, true);
  }
});

const r = Router();
r.post('/congregacoes/:congregacaoId/receitas', (req, res, next) => {
  upload.single('foto')(req, res, err => {
    if (err) {
      if (err.message?.includes('Tipo de arquivo')) return res.status(400).json({ message: err.message });
      if ((err as any).code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'Arquivo excede 5MB' });
      return res.status(500).json({ message: 'Falha no upload', error: err.message });
    }
    next();
  });
}, asyncHandler(ReceitaController.create));

r.get('/congregacoes/:congregacaoId/receitas', asyncHandler(ReceitaController.list));
r.get('/congregacoes/:congregacaoId/relatorios/financeiro', asyncHandler(ReceitaController.relatorio));
export default r;
