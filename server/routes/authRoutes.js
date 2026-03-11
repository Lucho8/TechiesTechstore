const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

module.exports = router;
