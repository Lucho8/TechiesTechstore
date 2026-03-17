const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt"); // 👈 IMPORTAMOS BCRYPT ACA

// ---------------------------------------------------
// REGISTRO (Ahora encripta la clave)
// ---------------------------------------------------
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "El correo ya está registrado" });

    // Encriptamos la clave antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // 👈 Guardamos la encriptada
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

// ---------------------------------------------------
// LOGIN (Ahora compara contraseñas encriptadas)
// ---------------------------------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Comparamos la contraseña que escribió el usuario con la encriptada de la BD
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    res.json({ message: "Inicio de sesión exitoso", user });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// ... ACÁ ABAJO DEJÁ TUS RUTAS DE FORGOT-PASSWORD Y RESET-PASSWORD EXACTAMENTE COMO LAS TENÍAS ...
// (Solo asegurate de que ya no tiren error de bcrypt)
