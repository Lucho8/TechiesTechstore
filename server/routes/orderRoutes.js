const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// POST /api/orders - Finalizar compra
router.post("/", async (req, res) => {
  const { userId, cartItems, total } = req.body;

  try {
    // 🛡️ USAMOS $TRANSACTION: O se hace todo, o no se hace nada.
    const result = await prisma.$transaction(async (tx) => {
      // 1. CREAR LA ORDEN Y SUS DETALLES (Relación anidada)
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          total: total,
          // Creamos los items de la orden automáticamente en la tabla vinculada
          items: {
            create: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price, // Guardamos el precio del momento de compra
            })),
          },
        },
      });

      // 2. ACTUALIZAR EL STOCK DE CADA PRODUCTO
      // Usamos un bucle for...of para asegurar que Prisma espere cada actualización
      for (const item of cartItems) {
        const updatedProduct = await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity, // Restamos la cantidad comprada
            },
          },
        });

        // Verificación de seguridad extra por si el stock quedó negativo
        if (updatedProduct.stock < 0) {
          throw new Error(
            `¡No hay stock suficiente para ${updatedProduct.name}!`,
          );
        }
      }

      return newOrder;
    });

    // Si llegamos acá, la transacción fue exitosa
    res.status(201).json({
      message: "¡Orden procesada con éxito!",
      order: result,
    });
  } catch (error) {
    console.error("Error en la transacción de orden:", error);
    res.status(500).json({
      error: "No se pudo procesar la compra",
      details: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc", // Las compras más nuevas aparecen primero arriba
      },
      include: {
        user: {
          select: { name: true, email: true }, // Traemos quién lo compró
        },
        items: {
          include: { product: true }, // Traemos qué productos son
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Error al cargar las órdenes:", error);
    res
      .status(500)
      .json({ error: "Explotó el servidor al buscar las órdenes." });
  }
});

// ---------------------------------------------------
// ACTUALIZAR EL ESTADO DE UNA ORDEN (PUT /api/orders/:id/status)
// ---------------------------------------------------
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Acá va a llegar "Enviado", "Completado", etc.

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: status },
    });

    res.json({
      message: "¡Estado actualizado con éxito!",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
    res
      .status(500)
      .json({ error: "No se pudo actualizar el estado de la orden." });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const myOrders = await prisma.order.findMany({
      where: {
        userId: parseInt(userId), // Filtramos solo por este cliente
      },
      orderBy: {
        createdAt: "desc", // Las más nuevas arriba
      },
      include: {
        items: {
          include: { product: true }, // Traemos los productos para mostrar la fotito
        },
      },
    });

    res.json(myOrders);
  } catch (error) {
    console.error("Error al buscar las compras del usuario:", error);
    res.status(500).json({ error: "No pudimos cargar tu historial." });
  }
});

module.exports = router;
