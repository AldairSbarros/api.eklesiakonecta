import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor do Eklesia Konecta rodando na porta ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Documentação Swagger disponível em https://api.eklesia.app.br/api-docs');
  } else {
    console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
  }
});