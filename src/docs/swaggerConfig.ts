<<<<<<< HEAD
import swaggerJSDoc from 'swagger-jsdoc';

=======
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API EklesiaKonecta',
      version: '1.0.0',
      description: 'Documentação automática da API EklesiaKonecta'
<<<<<<< HEAD
    }
=======
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
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

<<<<<<< HEAD
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
=======
export default options;
import swaggerUi from 'swagger-ui-express';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
