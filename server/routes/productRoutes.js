const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyAdmin } = require("../middleware/auth");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") 
    .replace(/[^\w\-]+/g, "") 
    .replace(/\-\-+/g, "-") 
    .replace(/^-+/, "") 
    .replace(/-+$/, ""); 
};



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

    
    const currentPage = Number(page);
    const productsPerPage = Number(limit);
    const skip = (currentPage - 1) * productsPerPage;

    
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: productsPerPage, 
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    
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
      max: Number(stats._max.price) || 100000, 
    });
  } catch (error) {
    console.error("Error buscando rango de precios:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.get("/related/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    
    const currentProduct = await prisma.product.findUnique({
      where: { slug: slug },
    });

    if (!currentProduct) {
      return res.json([]); 
    }

    
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        slug: { not: slug }, 
      },
      take: 4, 
      include: { category: true },
    });

    res.json(relatedProducts);
  } catch (error) {
    console.error("Error al buscar productos relacionados:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});



router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { slug: slug },
      include: {
        category: true,
        
        reviews: {
          include: {
            user: {
              select: { name: true }, 
            },
          },
          orderBy: { createdAt: "desc" }, 
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

    
    if (!name || !price || !categoryId) {
      return res.status(400).json({
        error: "Faltan datos obligatorios jefe, revise el formulario.",
      });
    }

    
    const generatedSlug = slugify(name);

    
    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: generatedSlug, 
        description: description || "Sin descripción", 
        price: parseFloat(price),
        image: image || "https://via.placeholder.com/300", 
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
    const { id } = req.params; 

    
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




router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, stock, categoryId } = req.body;

    
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





router.post("/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, userId } = req.body;

    
    if (!rating || !comment || !userId) {
      return res
        .status(400)
        .json({ error: "Faltan datos para crear la reseña" });
    }

    
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
