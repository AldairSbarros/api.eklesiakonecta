"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlySuperUser = onlySuperUser;
function onlySuperUser(req, res, next) {
    const user = req.user;
    if (user && user.superuser) {
        next();
        return;
    }
    res.status(403).json({ error: 'Acesso restrito ao superusuário.' });
}
//# sourceMappingURL=onlySuperUser.js.map