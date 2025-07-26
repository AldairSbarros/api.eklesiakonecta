"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
                url: 'https://api.eklesia.app.br',
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
exports.default = options;
//# sourceMappingURL=swaggerConfig.js.map