
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Empezando el semillero...')

  
  
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  
  const catPerifericos = await prisma.category.create({
    data: { name: 'Periféricos' }
  })
  
  const catHardware = await prisma.category.create({
    data: { name: 'Hardware' }
  })

  
  await prisma.product.createMany({
    data: [
      {
        name: 'Teclado Mecánico RGB',
        slug: 'teclado-mecanico-rgb',
        description: 'Switches Blue, luces locas y mucho ruido.',
        price: 150000,
        stock: 20,
        categoryId: catPerifericos.id,
        image: 'https://m.media-amazon.com/images/I/716hIpq8+tL._AC_SX679_.jpg'
      },
      {
        name: 'Mouse Gamer Pro',
        slug: 'mouse-gamer-pro',
        description: '10 botones programables y 25000 DPI.',
        price: 80000,
        stock: 15,
        categoryId: catPerifericos.id,
        image: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX679_.jpg'
      },
      {
        name: 'Monitor 144Hz',
        slug: 'monitor-144hz',
        description: 'La fluidez que tus ojos merecen.',
        price: 350000,
        stock: 5,
        categoryId: catHardware.id,
        image: 'https://m.media-amazon.com/images/I/71sxlhYhKWL._AC_SX679_.jpg'
      }
    ]
  })

  
  
  await prisma.user.create({
    data: {
      email: 'admin@techstore.com',
      password: 'admin123', 
      role: 'ADMIN',
      name: 'Super Admin'
    }
  })

  console.log('✅ Base de datos poblada con éxito')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })