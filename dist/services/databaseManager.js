"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarBanco = criarBanco;
const child_process_1 = require("child_process");
function criarBanco(nomeBanco) {
    (0, child_process_1.exec)(`createdb ${nomeBanco}`, (err) => {
        if (!err) {
            (0, child_process_1.exec)(`prisma migrate deploy --schema=prisma/${nomeBanco}.prisma`);
        }
    });
}
//# sourceMappingURL=databaseManager.js.map