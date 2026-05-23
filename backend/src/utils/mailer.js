const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS  
    }
});

const sendResetEmail = async (to, token) => {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`; 
    const mailOptions = {
        from: `"Magalab" <${process.env.MAIL_USER}>`,
        to,
        subject: "Restablecer tu contraseña",
        html: `
    <h3>Solicitud de reseteo de contraseña</h3>
    <p>Hacé clic en el siguiente enlace para continuar:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>Este enlace vence en 1 hora.</p>
    `
    };

    await transporter.sendMail(mailOptions);
};

const sendContactEmail = async ({ name, email, message }) => {
  const mailOptions = {
      from: `"Magalab Contact" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: `[CONTACTO] Mensaje de ${name}`,
      html: `
          <h3>Nuevo mensaje de contacto</h3>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
      `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail, sendContactEmail };
