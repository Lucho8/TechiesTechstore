const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. OBTENER LAS RESEÑAS DE UN USUARIO
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: Number(req.params.userId) },
      include: { product: true }, // Traemos el producto para mostrar foto y nombre
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar las reseñas" });
  }
});

// 2. EDITAR UNA RESEÑA
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const updatedReview = await prisma.review.update({
      where: { id: Number(id) },
      data: { rating: Number(rating), comment }
    });
    res.json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar la reseña" });
  }
});

// 3. BORRAR UNA RESEÑA
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({
      where: { id: Number(id) }
    });
    res.json({ message: "Reseña eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al borrar la reseña" });
  }
});

module.exports = router;