import { useRef } from "react"; //
import { Link } from "react-router-dom"; //
import { useCart } from "../context/CartContext"; //
import toast from "react-hot-toast"; //

function ProductCard({ product }) {
  const { addToCart } = useCart(); //

  // Referencia para controlar el tiempo entre carteles (no reinicia el componente)
  const lastToastTime = useRef(0); //

  const handleAddToCart = () => {
    //
    addToCart(product); // Sumamos al carrito siempre

    const now = Date.now(); //
    // Solo mostramos el cartel si pasaron más de 2 segundos (2000ms)
    if (now - lastToastTime.current > 2000) {
      //
      toast.success("¡Agregado al carrito! 🛒", {
        //
        position: "bottom-right", //
      });
      lastToastTime.current = now; // Guardamos la hora de este cartel
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-violet-500/20 transition-all duration-300 border border-slate-700 flex flex-col h-full">
      <Link to={`/product/${product.slug}`}>
        <div className="h-48 overflow-hidden relative group">
          <img
            src={product.image || "https://placehold.co/600x400"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="p-5 flex flex-col grow">
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

        <h3
          className="text-xl font-bold text-white mb-2 leading-tight line-clamp-2"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-700">
          <span className="text-2xl font-bold text-white">
            ${Number(product.price).toLocaleString()}
          </span>

          {product.stock > 0 ? (
            <button
              className="bg-violet-600 hover:bg-violet-500 text-white p-2 rounded-lg transition-colors shadow-lg shadow-violet-600/20"
              onClick={handleAddToCart} // Usamos la nueva función con el toast
            >
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
          ) : (
            <button
              className="bg-gray-600 text-white p-2 rounded-lg cursor-not-allowed opacity-50"
              disabled
            >
              Agotado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
