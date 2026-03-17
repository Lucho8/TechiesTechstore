import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import PaymentModal from "../components/PaymentModal";
import { useState } from "react";

const Cart = () => {
  const [showPayment, setShowPayment] = useState(false);

  const {
    cart,
    removeFromCart,
    addToCart,
    decreaseQuantity,
    total,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const createOrderInDatabase = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          cartItems: cart,
          total: total,
        }),
      });

      if (response.ok) {
        toast.success(
          "¡Compra realizada con éxito! Gracias por elegir Techies.",
        );
        clearCart();
        navigate("/");
      }
    } catch (error) {
      console.error("Explotó todo en el checkout:", error);
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      toast.error("Necesitás iniciar sesión para finalizar tu compra");
      return navigate("/login", { state: { from: "/cart" } });
    }

    setShowPayment(true);
  };

  return (
    <div className="container mx-auto px-4">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-3xl text-slate-400 mb-6 font-semibold">
            Tu carrito está vacio
          </p>
          <Link to="/" className="w-max">
            <button className="bg-violet-600 px-6 py-3 rounded-lg text-white font-bold hover:bg-violet-500 transition-colors">
              Volver a la tienda
            </button>
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto mt-10 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 relative">
          <h2 className="text-3xl font-bold mb-8 text-white border-b border-slate-700 pb-4">
            Tu Carrito
          </h2>

          <ul className="divide-y divide-slate-700">
            {cart.map((item) => (
              <li
                key={item.id}
                className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-x-6 flex-1 w-full">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                  <div>
                    <p className="text-xl font-bold text-white">{item.name}</p>
                    <p className="text-violet-400 font-medium">
                      ${Number(item.price).toLocaleString()} c/u
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-x-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center bg-slate-900 rounded-lg overflow-hidden border border-slate-600">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-white font-bold font-mono w-12 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.quantity >= item.stock}
                      className={`px-4 py-2 transition-colors ${
                        item.quantity >= item.stock
                          ? "text-slate-600 cursor-not-allowed"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      +
                    </button>
                  </div>

                  <p className="text-xl font-bold text-white w-32 text-right">
                    ${(Number(item.price) * item.quantity).toLocaleString()}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors"
                    title="Eliminar producto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-8 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-3xl text-white">
              Total a pagar:{" "}
              <span className="font-bold text-violet-400">
                ${total.toLocaleString()}
              </span>
            </p>
            <button
              onClick={handleCheckoutClick}
              className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-violet-600/30 w-full sm:w-auto"
            >
              Finalizar Compra
            </button>
          </div>

          {showPayment && (
            <PaymentModal
              total={total.toLocaleString()}
              onClose={() => setShowPayment(false)}
              onSuccess={() => {
                setShowPayment(false);
                createOrderInDatabase();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
