import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <Link
      to={`/product/${product.slug}`}
      className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-violet-500/20 transition-all duration-300 border border-slate-700 flex flex-col h-full"
    >
      {/* IMAGEN (Con un contenedor para que siempre tenga el mismo tamaño) */}
      <div className="h-48 overflow-hidden relative group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* CONTENIDO */}
      <div className="p-5 flex flex-col grow">
        {/* Categoría pequeñita */}
        <span className="text-violet-400 text-xs font-bold uppercase tracking-wider mb-2">
          {product.category.name}
        </span>

        <div className="text-xs font-bold mb-2">
          {product.stock === 0 ? (
            <span className="text-red-500">❌ Agotado</span>
          ) : product.stock <= 5 ? (
            <span className="text-orange-400 animate-pulse">
              ⚠️ ¡Últimas {product.stock} unidades!
            </span>
          ) : (
            <span className="text-emerald-400">✅ Stock disponible</span>
          )}
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-white mb-2 leading-tight">
          {product.name}
        </h3>

        {/* Precio (A la derecha y grande) */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-700">
          <span className="text-2xl font-bold text-white">
            ${Number(product.price).toLocaleString()}
          </span>

          {/* Botón de Acción */}
          <button
            className="bg-violet-600 hover:bg-violet-500 text-white p-2 rounded-lg transition-colors shadow-lg shadow-violet-600/20"
            onClick={() => addToCart(product)}
          >
            {/* Ícono de carrito (SVG simple) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
