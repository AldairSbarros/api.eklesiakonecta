"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const churchService = __importStar(require("../services/church.service"));
const churchController = {
    async create(req, res) {
        try {
            // Remove o campo schema, caso venha no body
            if ('schema' in req.body)
                delete req.body.schema;
            const novaIgreja = await churchService.createChurch(req.body);
            res.status(201).json({ message: "Igreja cadastrada com sucesso!", igreja: novaIgreja });
        }
        catch (error) {
            if (error.message === "E-mail já cadastrado.") {
                res.status(409).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: error.message });
        }
    },
    async atualizarLocalizacao(req, res) {
        const { latitude, longitude } = req.body;
        const { id } = req.params;
        try {
            const igreja = await churchService.updateChurch(Number(id), { latitude, longitude });
            res.json(igreja);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async list(req, res) {
        try {
            const igrejas = await churchService.listChurches();
            res.json(igrejas);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async get(req, res) {
        try {
            const igreja = await churchService.getChurch(Number(req.params.id));
            if (!igreja) {
                res.status(404).json({ error: "Igreja não encontrada." });
                return;
            }
            res.json(igreja);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async update(req, res) {
        const { id } = req.params;
        try {
            // Remove o campo schema, caso venha no body
            if ('schema' in req.body)
                delete req.body.schema;
            const igreja = await churchService.updateChurch(Number(id), req.body);
            res.json(igreja);
        }
        catch (error) {
            if (error.message === "E-mail já cadastrado.") {
                res.status(409).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: error.message });
        }
    },
    async remove(req, res) {
        const { id } = req.params;
        try {
            await churchService.deleteChurch(Number(id));
            res.json({ message: "Igreja removida com sucesso." });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
exports.default = churchController;
//# sourceMappingURL=church.controller.js.map