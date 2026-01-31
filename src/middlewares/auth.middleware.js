export const authorization = (role) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                status: "error",
                error: "No autorizado"
            });
        }

        if (req.user.role !== role) {
            return res.status(403).json({
                status: "error",
                error: "No tienes permisos para esta acción"
            });
        }

        next();
    };
};