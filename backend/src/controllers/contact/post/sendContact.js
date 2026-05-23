const { sendContactEmail } = require("../../../utils/mailer");

const sendContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        await sendContactEmail({ name, email, message });

        return res.json({ message: "Mensaje enviado correctamente." });

    } catch (error) {
        console.error("Error al enviar mensaje de contacto:", error);
        return res.status(500).json({ message: "Error al enviar el mensaje." });
    }
};

module.exports = sendContact;