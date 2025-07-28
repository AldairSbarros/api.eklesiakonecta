const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API EklesiaKonecta',
      version: '1.0.0',
      description: 'Documentação automática da API EklesiaKonecta'
    },
    servers: [
      {
        url: 'https://api.eklesia.app.br:3001',
        description: 'Servidor de produção'
      },
      {
        url: 'http://localhost:3001',
        description: 'Servidor local'
      }

    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export default options;
import swaggerUi from 'swagger-ui-express';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

