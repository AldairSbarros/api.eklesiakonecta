"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3001;
app_1.default.listen(PORT, () => {
    console.log(`Servidor do Eklesia Konecta rodando na porta ${PORT}`);
    console.log(`Documentação Swagger disponível em https://api.eklesia.app.br/api-docs`);
});
//# sourceMappingURL=server.js.map