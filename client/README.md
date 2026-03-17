# 💻 Techies Store - Frontend (Client)

Este es el lado del cliente (Frontend) de **Techies Store**, una aplicación de e-commerce construida para ofrecer una experiencia de usuario rápida, fluida y moderna. 

Este proyecto fue inicializado con Vite para garantizar tiempos de carga y recarga ultrarrápidos durante el desarrollo.

## 🛠️ Tecnologías Principales

* **React + Vite:** Motor principal de la interfaz y empaquetador.
* **Tailwind CSS:** Framework de CSS utilizado para construir un diseño completamente responsivo y moderno (Dark Mode nativo).
* **React Router DOM:** Para la navegación SPA (Single Page Application) y la implementación de rutas protegidas.
* **Context API:** Herramienta nativa de React utilizada para el manejo del estado global (Sesión de Usuario y Carrito de Compras).
* **React Hot Toast:** Implementado para brindar feedback visual elegante e instantáneo al usuario (éxitos, errores, advertencias).
* **RC-Slider:** Librería utilizada para el componente visual del filtro de rango de precios.

## ✨ Características Clave

* **Catálogo Dinámico y Paginado:** El frontend se comunica de manera eficiente con la API para filtrar productos por nombre, categoría y rango de precio, renderizando solo los resultados de la página actual.
* **Gestión del Carrito:** Los usuarios pueden agregar productos, modificar cantidades y ver el total dinámico. El estado persiste para evitar que se pierda la compra al recargar.
* **Autenticación Robusta:** Flujos completos de Login, Registro y Recuperación de Contraseñas, comunicándose de forma segura con el backend.
* **Panel de Administrador (Rutas Protegidas):** El componente `<AdminRoute />` actúa como "Bouncer", verificando el rol del usuario en el estado global antes de permitir el acceso al Dashboard, donde se pueden gestionar productos, categorías y órdenes.
* **Diseño Componentizado:** Arquitectura limpia separando Componentes de UI (Tarjetas, Navbars) de las Páginas principales (Vistas).

## 📂 Estructura del Proyecto

```text
client/
├── public/           # Assets públicos (favicon, logos)
├── src/
│   ├── assets/       # Imágenes y SVGs utilizados en la UI
│   ├── components/   # Componentes reutilizables (NavBar, ProductCard, PaymentModal)
│   ├── context/      # Estados globales (AuthContext, CartContext)
│   ├── pages/        # Vistas completas (Home, Login, Perfil y carpeta /admin)
│   ├── App.jsx       # Configuración principal de React Router y Toaster
│   ├── index.css     # Directivas principales de Tailwind CSS
│   └── main.jsx      # Punto de entrada de la aplicación React
├── index.html        # Plantilla HTML principal
├── tailwind.config.js# Configuración y personalización de Tailwind
└── package.json      # Dependencias y scripts del frontend
