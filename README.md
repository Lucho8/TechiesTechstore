# 🛒 Techies Store - E-Commerce Full-Stack

¡Hola! Bienvenido al repositorio de **Techies Store**. 

Este es un proyecto de comercio electrónico Full-Stack que desarrollé desde cero para aplicar y consolidar mis conocimientos en el ecosistema JavaScript. No quería armar solo un "carrito de compras" de tutorial; me enfoqué mucho en la seguridad, en manejar bien los estados y en construir un backend robusto que se banque validaciones reales.

## 🚀 Tecnologías que usé

**Frontend:**
* **React** (creado con Vite para mayor velocidad)
* **Tailwind CSS** (para un diseño rápido, responsivo y moderno)
* **React Router DOM** (manejo de rutas y vistas protegidas)
* **Context API** (para el carrito de compras y el estado de la sesión)

**Backend & Base de Datos:**
* **Node.js + Express** (creación de la API REST)
* **PostgreSQL** (base de datos relacional)
* **Prisma ORM** (modelado de datos y migraciones)
* **Bcrypt** (encriptación de contraseñas)
* **Nodemailer + Crypto** (para el sistema de recuperación de claves)

## ✨ Funcionalidades Destacadas

Más allá de lo básico (crear productos y verlos), me enfoqué en estos detalles:

* 🔐 **Seguridad Real:** Las contraseñas no se guardan en texto plano, pasan por `bcrypt`. El panel de administrador está protegido por middleware en el backend y rutas privadas en el frontend.
* ✉️ **Recuperación de Contraseñas:** Armé un flujo completo donde el usuario solicita recuperar su clave, el servidor genera un token criptográfico temporal y le envía un enlace real a su bandeja de entrada.
* 🎛️ **Filtros y Paginación:** El catálogo permite buscar por texto, filtrar por categoría y ajustar un slider de rango de precio. La paginación la hace el backend con consultas combinadas en Prisma para no saturar la red trayendo datos innecesarios.
* 🛡️ **Prevención de Errores (Integridad de Datos):** El panel de admin no te deja borrar una categoría si esta tiene productos asociados, previniendo que la base de datos quede inconsistente.

## 📸 Vistazo al proyecto

(cuando lo suba, Proximamente)

## 🛠️ Cómo correr el proyecto localmente

Si querés clonar este proyecto y probarlo en tu máquina, es súper fácil:

### 1. Clonar el repositorio
```bash
git clone https://github.com/Lucho8/TechiesTechstore
cd techies-store

Tengo pensado seguir actualizandolo....
