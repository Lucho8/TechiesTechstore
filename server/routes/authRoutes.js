const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "El correo ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
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
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales invalidas" });
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

    if (!user) {
      return res.json({
        message: "Si el correo está registrado, te enviaremos un enlace.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"Techies Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Recuperación de contraseña 🔒",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; padding: 20px;">
          <h2 style="color: #7c3aed;">¿Te olvidaste la contraseña?</h2>
          <p style="color: #333; font-size: 16px;">No pasa nada. Hacé click en el enlace de abajo para crear una nueva:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Restablecer Contraseña</a>
          <p style="color: #666; font-size: 14px;">Este enlace es válido por 1 hora.</p>
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

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "El enlace es inválido o ya expiró." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

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
