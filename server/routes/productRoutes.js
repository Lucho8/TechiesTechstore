const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyAdmin } = require("../middleware/auth");

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
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 6,
    } = req.query;

    let whereClause = {};

    if (search) {
      whereClause.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (category) {
      whereClause.categoryId = Number(category);
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = Number(minPrice);
      if (maxPrice) whereClause.price.lte = Number(maxPrice);
    }

    // --- MAGIA DE LA PAGINACIÓN ---
    const currentPage = Number(page);
    const productsPerPage = Number(limit);
    const skip = (currentPage - 1) * productsPerPage;

    // Hacemos DOS consultas al mismo tiempo
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: productsPerPage, // Solo traemos los que pide el limit
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    // Calculamos el total de páginas
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    // DEVOLVEMOS EL OBJETO ESTRUCTURADO QUE EL FRONTEND ESPERA
    res.json({
      products: products,
      totalPages: totalPages,
      currentPage: currentPage,
      totalProducts: totalProducts,
    });
  } catch (error) {
    console.error("Error trayendo productos:", error);
    res
      .status(500)
      .json({ error: "Error en el servidor al filtrar productos" });
  }
});

router.get("/price-range", async (req, res) => {
  try {
    const stats = await prisma.product.aggregate({
      _min: { price: true },
      _max: { price: true },
    });

    res.json({
      min: Number(stats._min.price) || 0,
      max: Number(stats._max.price) || 100000, // Por si la base está vacía
    });
  } catch (error) {
    console.error("Error buscando rango de precios:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.get("/related/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // 1. Buscamos el producto actual para saber de qué categoría es
    const currentProduct = await prisma.product.findUnique({
      where: { slug: slug },
    });

    if (!currentProduct) {
      return res.json([]); // Si no existe, devolvemos un array vacío
    }

    // 2. Buscamos otros de la misma categoría, excluyendo el actual
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        slug: { not: slug }, // Magia de Prisma: "Que el slug NO sea el actual"
      },
      take: 4, // Solo queremos 4 sugerencias como máximo
      include: { category: true },
    });

    res.json(relatedProducts);
  } catch (error) {
    console.error("Error al buscar productos relacionados:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// RUTA 2: Obtener un solo producto por su SLUG (para el detalle)
// GET /api/products/teclado-mecanico-rgb
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { slug: slug },
      include: {
        category: true,
        // 👇 AGREGAMOS ESTO PARA TRAER LAS RESEÑAS
        reviews: {
          include: {
            user: {
              select: { name: true }, // Solo traemos el nombre, nada de contraseñas
            },
          },
          orderBy: { createdAt: "desc" }, // Las más nuevas arriba
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el producto" });
  }
});

router.post("/", verifyAdmin, async (req, res) => {
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

router.delete("/:id", verifyAdmin, async (req, res) => {
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
router.put("/:id", verifyAdmin, async (req, res) => {
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

// ---------------------------------------------------
// OBTENER PRODUCTOS RELACIONADOS (GET /api/products/related/:slug)
// ---------------------------------------------------

router.post("/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, userId } = req.body;

    // Validamos que no nos manden información vacía
    if (!rating || !comment || !userId) {
      return res
        .status(400)
        .json({ error: "Faltan datos para crear la reseña" });
    }

    // Le decimos a Prisma que guarde la reseña
    const newReview = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment: comment,
        productId: Number(id),
        userId: Number(userId),
      },
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error al guardar la reseña:", error);
    res.status(500).json({ error: "Error interno al guardar la reseña" });
  }
});

module.exports = router;
