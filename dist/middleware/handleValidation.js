"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidation = handleValidation;
const express_validator_1 = require("express-validator");
function handleValidation(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
}
//# sourceMappingURL=handleValidation.js.map