const { RefreshTokens } = require("../../../database/indexModels");

const logout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token no proporcionado" });
    }

    try {
        const deleted = await RefreshTokens.destroy({
            where: { token: refreshToken }
        });

        if (!deleted) {
            return res.status(404).json({ message: "Token no encontrado" });
        }

        return res.json({ message: "Sesión cerrada correctamente" });

    } catch (error) {
        console.error("Error en logout:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = logout;