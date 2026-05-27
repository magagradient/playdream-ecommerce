const { Users, RefreshTokens } = require("../../../database/indexModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son obligatorios" });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Formato de datos inválido" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await Users.findOne({
            where: { email: normalizedEmail, is_deleted: false }
        });

        if (!user) {
            return res.status(401).json({ message: "Usuario o contraseña inválidos" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Usuario o contraseña inválidos" });
        }

        // generar access token (15 minutos)
        const accessToken = jwt.sign(
            { id_user: user.id_user, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // generar refresh token (7 días)
        const refreshToken = jwt.sign(
            { id_user: user.id_user },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // guardar refresh token en la base de datos
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await RefreshTokens.create({
            id_user: user.id_user,
            token: refreshToken,
            expires_at: expiresAt,
        });

        return res.json({
            accessToken,
            refreshToken,
            user: {
                id_user: user.id_user,
                email: user.email,
                role: user.role,
                name: user.name,
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = login;