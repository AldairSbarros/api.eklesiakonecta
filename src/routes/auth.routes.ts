import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthService } from '../services/auth.service';

const r = Router();

// Login: email + senha com header schema
r.post('/login', asyncHandler(async (req, res, next) => {
  const { email, senha } = req.body;
  const schema = (req.headers['x-schema'] as string) || 'public';
  const result = await AuthService.login({ email, senha }, schema);
  res.json(result);
}));

export default r;
