const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { verifyAdmin } = require('../middleware/auth'); 


router.get('/', verifyAdmin, async (req, res) => {
  try {
    
    const [totalUsers, totalProducts, totalOrders, pendingOrders, revenue] = await Promise.all([
      prisma.user.count(),                                   
      prisma.product.count(),                                
      prisma.order.count(),                                  
      prisma.order.count({ where: { status: 'pending' } }),  
      prisma.order.aggregate({                               
        _sum: { total: true },
      })
    ]);

    res.json({
      users: totalUsers,
      products: totalProducts,
      orders: totalOrders,
      pending: pendingOrders,
      revenue: revenue._sum.total || 0 
    });

  } catch (error) {
    console.error("Error cargando estadísticas:", error);
    res.status(500).json({ error: "Error al calcular las estadísticas" });
  }
});

module.exports = router;