const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { verifyAdmin } = require('../middleware/auth'); // Traemos al patovica

// GET /api/stats (Protegido solo para Admin)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    // Promise.all ejecuta todas las consultas a la vez para que sea instantáneo
    const [totalUsers, totalProducts, totalOrders, pendingOrders, revenue] = await Promise.all([
      prisma.user.count(),                                   // Cuenta usuarios
      prisma.product.count(),                                // Cuenta productos
      prisma.order.count(),                                  // Cuenta ventas totales
      prisma.order.count({ where: { status: 'pending' } }),  // Cuenta ventas pendientes
      prisma.order.aggregate({                               // Suma el total de guita
        _sum: { total: true },
      })
    ]);

    res.json({
      users: totalUsers,
      products: totalProducts,
      orders: totalOrders,
      pending: pendingOrders,
      revenue: revenue._sum.total || 0 // Si no hay ventas, devuelve 0
    });

  } catch (error) {
    console.error("Error cargando estadísticas:", error);
    res.status(500).json({ error: "Error al calcular las estadísticas" });
  }
});

module.exports = router;