"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        // Pegue congregacaoId, ano e mes do body ou query
        const congregacaoId = (req.body.congregacaoId || req.query.congregacaoId || 'desconhecida').toString();
        const ano = (req.body.ano || req.query.ano || new Date().getFullYear()).toString();
        const mes = (req.body.mes || req.query.mes || (new Date().getMonth() + 1)).toString();
        const folder = path_1.default.resolve(__dirname, `../../uploads/${congregacaoId}/${ano}-${mes}`);
        fs_1.default.mkdirSync(folder, { recursive: true }); // Cria a pasta se não existir
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
//# sourceMappingURL=upload.js.map