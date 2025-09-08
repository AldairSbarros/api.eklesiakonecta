import dotenv from 'dotenv';
dotenv.config();


import app from './app';

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor do Eklesia Konecta rodando na porta ${PORT}`);
<<<<<<< HEAD
  console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
=======
  console.log(`Documentação Swagger disponível em https://api.eklesia.app.br/api-docs`);
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
});