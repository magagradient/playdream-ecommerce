const { RefreshTokens, Users } = require("../../../database/indexModels");
const jwt = require("jsonwebtoken");

const refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token no proporcionado" });
    }

    try {
        // verificar que el token es válido
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // buscar el token en la base de datos
        const storedToken = await RefreshTokens.findOne({
            where: { token: refreshToken, id_user: decoded.id_user }
        });

        if (!storedToken) {
            return res.status(403).json({ message: "Refresh token inválido" });
        }

        // verificar que no expiró
        if (new Date() > new Date(storedToken.expires_at)) {
            await storedToken.destroy();
            return res.status(403).json({ message: "Refresh token expirado" });
        }

        // buscar usuario
        const user = await Users.findByPk(decoded.id_user);
        if (!user || user.is_deleted) {
            return res.status(403).json({ message: "Usuario no encontrado" });
        }

        // generar nuevo access token
        const accessToken = jwt.sign(
            { id_user: user.id_user, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        return res.json({ accessToken });

    } catch (error) {
        return res.status(403).json({ message: "Refresh token inválido o expirado" });
    }
};

module.exports = refresh;