const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyAdmin } = require('../middleware/auth');



const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Reemplaza espacios con guiones
    .replace(/[^\w\-]+/g, "") // Borra caracteres raros
    .replace(/\-\-+/g, "-") // Borra guiones duplicados
    .replace(/^-+/, "") // Corta guiones al principio
    .replace(/-+$/, ""); // Corta guiones al final
};

// RUTA 1: Obtener todos los productos
// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true, // ¡Truco Pro! Traemos el nombre de la categoría también
      },
      orderBy: {
        id: "asc", // Esto los mantiene siempre ordenados por su ID de menor a mayor
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// RUTA 2: Obtener un solo producto por su SLUG (para el detalle)
// GET /api/products/teclado-mecanico-rgb
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { slug: slug },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description, price, image, stock, categoryId } = req.body;

    // 1. EL PATOVICA DE LOS DATOS (Validación temprana)
    if (!name || !price || !categoryId) {
      return res.status(400).json({
        error: "Faltan datos obligatorios jefe, revise el formulario.",
      });
    }

    // 2. CREAMOS EL SLUG AUTOMÁTICAMENTE
    const generatedSlug = slugify(name);

    // 3. GUARDAMOS EN LA BASE DE DATOS
    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: generatedSlug, // Se guarda solito
        description: description || "Sin descripción", // Valor por defecto si viene vacío
        price: parseFloat(price),
        image: image || "https://via.placeholder.com/300", // Imagen por defecto por si se olvidan
        stock: parseInt(stock) || 0,
        categoryId: parseInt(categoryId),
      },
    });

    res.status(201).json({
      message: "¡Producto creado con éxito!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);

    // Si el nombre o slug ya existen (error P2002 de Prisma)
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "Ya existe un producto con ese nombre." });
    }

    res.status(500).json({ error: "Error interno del servidor." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Capturamos el ID de la URL

    // Prisma hace el trabajo sucio
    await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json({ message: "Producto eliminado para siempre 💥" });
  } catch (error) {
    console.error("Error al borrar:", error);
    res.status(500).json({ error: "No se pudo eliminar el producto." });
  }
});

// ---------------------------------------------------
// EDITAR UN PRODUCTO (PUT /api/products/:id)
// ---------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, stock, categoryId } = req.body;

    // Actualizamos usando Prisma
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        image: image,
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
      },
    });

    res.json({ message: "¡Producto actualizado!", product: updatedProduct });
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ error: "No se pudo actualizar el producto." });
  }
});

module.exports = router;
