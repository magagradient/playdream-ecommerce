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
  await transporter.sendMail({
    from: `"Magalab" <${process.env.MAIL_USER}>`,
    to,
    subject: "Restablecer tu contraseña",
    html: `
      <h3>Solicitud de reseteo de contraseña</h3>
      <p>Hacé clic en el siguiente enlace para continuar:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este enlace vence en 1 hora.</p>
    `
  });
};

const sendContactEmail = async ({ name, email, message }) => {
  await transporter.sendMail({
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
  });
};

const sendPurchaseEmail = async (toEmail, products) => {
  const productsList = products.map(p => `
    <div style="margin-bottom: 24px;">
      <h3 style="color: #ffb4ab; margin-bottom: 8px;">${p.title}</h3>
      ${p.images.map(img => `
        <p style="margin: 4px 0;">
          <strong style="text-transform: uppercase;">${img.image_type}:</strong>
          <a href="${img.image_url}" style="color: #cfbcff;">${img.image_url}</a>
        </p>
      `).join("")}
    </div>
  `).join("");

  await transporter.sendMail({
    from: `"Magalab" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Tu compra en Magalab — Links de descarga",
    html: `
      <div style="background: #141218; color: #e6e0e9; padding: 32px; font-family: monospace;">
        <h1 style="color: #ffb4ab; text-transform: uppercase; letter-spacing: 0.1em;">GRACIAS_POR_TU_COMPRA</h1>
        <p style="color: #cbc4d2; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em;">// ACÁ ESTÁN TUS ARCHIVOS</p>
        ${productsList}
        <p style="color: #494551; font-size: 11px; margin-top: 32px; text-transform: uppercase;">[MAGALAB] // GUARDÁ ESTOS LINKS EN UN LUGAR SEGURO</p>
      </div>
    `
  });
};

const sendSaleNotification = async (product_titles, id_order, buyer_email) => {
  await transporter.sendMail({
    from: `"Magalab" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER,
    subject: `[VENTA] Orden #${id_order} confirmada`,
    html: `
      <div style="font-family: monospace; padding: 24px;">
        <h2 style="color: #381e72;">[NUEVA_VENTA] // ORDEN #${id_order}</h2>
        <p><strong>Comprador:</strong> ${buyer_email}</p>
        <p><strong>Productos:</strong></p>
        <ul>
          ${product_titles.map(t => `<li>${t}</li>`).join("")}
        </ul>
      </div>
    `
  });
};

const sendErrorEmail = async (source, errorMessage, buyerEmail = null) => {
  await transporter.sendMail({
    from: `"Magalab" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER,
    subject: `[ERROR] Falló ${source}`,
    html: `
      <div style="font-family: monospace; padding: 24px;">
        <h2 style="color: red;">[ERROR] // ${source}</h2>
        <p><strong>Mensaje:</strong> ${errorMessage}</p>
        ${buyerEmail ? `<p><strong>Comprador:</strong> ${buyerEmail}</p>` : ""}
      </div>
    `
  });

  if (buyerEmail) {
    await transporter.sendMail({
      from: `"Magalab" <${process.env.MAIL_USER}>`,
      to: buyerEmail,
      subject: "Tuvimos un problema con tu compra",
      html: `
        <div style="font-family: monospace; padding: 24px; background: #141218; color: #e6e0e9;">
          <h2 style="color: #ffb4ab;">HUBO_UN_PROBLEMA</h2>
          <p>Notamos que tuviste un inconveniente al completar tu compra. Lo estamos revisando y te contactaremos a la brevedad.</p>
          <p style="color: #cbc4d2;">Si el pago fue debitado y no recibiste tu archivo, escribinos a <a href="mailto:${process.env.MAIL_USER}" style="color: #cfbcff;">${process.env.MAIL_USER}</a></p>
        </div>
      `
    });
  }
};

module.exports = { sendResetEmail, sendContactEmail, sendPurchaseEmail, sendSaleNotification, sendErrorEmail };