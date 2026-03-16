const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");
const nodemailer = require("nodemailer");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: "CLIENT",
      },
    });
    res
      .status(201)
      .json({ message: "Usuario registrado exitosamente", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (user.password !== password) {
      return res.status(404).json({ error: "Credenciales invalidas" });
    }

    res.json({ message: "Inicio de sesión exitoso", user });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    // Por seguridad, siempre decimos que mandamos el mail aunque el correo no exista
    // así los hackers no pueden adivinar qué correos están registrados.
    if (!user) {
      return res.json({
        message: "Si el correo está registrado, te enviaremos un enlace.",
      });
    }

    // Creamos un código secreto aleatorio de 64 letras/números
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Vence en 1 hora

    // Guardamos el código temporal en la base de datos del usuario
    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    // Armamos el link mágico (apuntando al frontend que corre en el puerto 5173)
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Despachamos el mail
    await transporter.sendMail({
      from: `"Techies Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Recuperación de contraseña 🔒",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; padding: 20px;">
          <h2 style="color: #7c3aed;">¿Te olvidaste la contraseña?</h2>
          <p style="color: #333; font-size: 16px;">No pasa nada. Hacé click en el enlace de abajo para crear una nueva:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Restablecer Contraseña</a>
          <p style="color: #666; font-size: 14px;">Este enlace es válido por 1 hora. Si no solicitaste esto, ignorá este correo.</p>
        </div>
      `,
    });

    res.json({
      message: "Si el correo está registrado, te enviaremos un enlace.",
    });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    res.status(500).json({ error: "Error procesando la solicitud." });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Buscamos un usuario que tenga este token EXACTO y que la fecha de vencimiento sea MAYOR a ahora
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }, // gt = greater than
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "El enlace es inválido o ya expiró." });
    }

    // Hasheamos (encriptamos) la nueva clave
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Guardamos la nueva clave y LIMPIAMOS los tokens para que no se puedan volver a usar
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: "¡Contraseña actualizada con éxito!" });
  } catch (error) {
    console.error("Error en reset-password:", error);
    res.status(500).json({ error: "Error al actualizar contraseña." });
  }
});

module.exports = router;
