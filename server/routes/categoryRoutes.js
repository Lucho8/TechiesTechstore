const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyAdmin } = require("../middleware/auth"); 


router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error al traer categorías" });
  }
});


router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name: name },
    });
    res.status(201).json(category);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Esa categoría ya existe o el nombre es inválido" });
  }
});


router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre no puede estar vacío" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name: name.trim() },
    });

    res.json({ message: "Categoría actualizada", category: updatedCategory });
  } catch (error) {
    console.error("Error al editar categoría:", error);
    res.status(500).json({ error: "Error al editar la categoría" });
  }
});


router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const productsCount = await prisma.product.count({
      where: { categoryId: Number(id) },
    });

    if (productsCount > 0) {
      return res.status(400).json({
        error: `No podés borrar esta categoría porque tiene ${productsCount} producto(s) adentro. Cambialos de categoría primero.`,
      });
    }

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Categoría eliminada con éxito 🗑️" });
  } catch (error) {
    console.error("Error al borrar categoría:", error);
    res.status(500).json({ error: "Error al borrar la categoría" });
  }
});

module.exports = router;
