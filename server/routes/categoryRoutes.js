const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// OBTENER TODAS LAS CATEGORÍAS
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } } // Contamos cuántos productos tiene cada una
      }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error al traer categorías" });
  }
});

// CREAR NUEVA CATEGORÍA
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name: name }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: "Esa categoría ya existe o el nombre es inválido" });
  }
});

module.exports = router;