import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // 👈 1. DESCOMENTAMOS EL CONTEXTO

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart(); // 👈 2. TRAEMOS LA FUNCIÓN DE TU CARRITO

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false); // 👈 3. ESTADO PARA EL EFECTO VISUAL

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${slug}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, navigate]);

  // 👈 4. LA FUNCIÓN QUE HACE EL TRABAJO
  const handleAddToCart = () => {
    addToCart(product); // Mandamos el producto a tu contexto global
    setIsAdded(true); // Ponemos el botón en modo "Agregado"

    // A los 2 segundos, lo volvemos a la normalidad
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-violet-400 text-xl animate-pulse font-bold">
        Cargando detalles... 🚀
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 mb-20">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-violet-400 transition-colors mb-8 font-medium"
      >
        <span>←</span> Volver al catálogo
      </Link>

      <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Lado Izquierdo: Imagen Gigante */}
        <div className="md:w-1/2 bg-slate-900 p-8 flex items-center justify-center relative">
          <div className="absolute top-4 left-4 bg-violet-900/50 text-violet-300 px-4 py-1 rounded-full border border-violet-700/50 text-sm font-bold backdrop-blur-sm">
            {product.category?.name || "General"}
          </div>
          <img
            src={product.image || "https://via.placeholder.com/600"}
            alt={product.name}
            className="w-full h-auto max-h-125 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Lado Derecho: Info y Compra */}
        <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl sm:text-5xl font-black text-emerald-400">
              ${product.price}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold border ${product.stock > 0 ? "bg-emerald-900/30 text-emerald-400 border-emerald-500/50" : "bg-red-900/30 text-red-400 border-red-500/50"}`}
            >
              {product.stock > 0
                ? `Stock: ${product.stock} disponibles`
                : "Sin Stock"}
            </span>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-white mb-2 border-b border-slate-700 pb-2">
              Descripción del producto
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {product.description ||
                "Este producto no tiene una descripción detallada por el momento."}
            </p>
          </div>

          {/* 👈 5. EL BOTÓN INTELIGENTE */}
          <button
            disabled={product.stock <= 0 || isAdded}
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
              isAdded
                ? "bg-emerald-600 text-white shadow-emerald-600/30 scale-95" // Efecto visual al agregar
                : product.stock > 0
                  ? "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30 hover:-translate-y-1"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isAdded
              ? "¡Agregado al Carrito! ✔️"
              : product.stock > 0
                ? "🛒 Agregar al Carrito"
                : "🚫 Producto Agotado"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
