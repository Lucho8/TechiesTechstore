import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    // Si hay un usuario logueado, vamos a buscar sus compras
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const fetchMyOrders = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/orders/user/${user.id}`,
      );
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setLoading(false);
    }
  };

  // Colores amigables para el cliente
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/50">
            ⏳ En Preparación
          </span>
        );
      case "Enviado":
        return (
          <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold border border-blue-500/50">
            🚚 En Camino
          </span>
        );
      case "Entregado":
        return (
          <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold border border-emerald-500/50">
            ✅ Entregado
          </span>
        );
      default:
        return (
          <span className="bg-slate-500/20 text-slate-400 px-3 py-1 rounded-full text-sm font-bold">
            Estado Desconocido
          </span>
        );
    }
  };

  if (loading)
    return (
      <div className="text-white text-center mt-10">
        Cargando tus compras...
      </div>
    );

  const filteredOrders = orders.filter((order) => {
    // 1. ¿Coincide con el número de orden?
    const matchId = order.id.toString().includes(searchTerm);

    // 2. ¿Coincide con algún nombre de producto adentro de la caja?
    const matchProduct = order.items?.some((item) =>
      item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return matchId || matchProduct;
  });

  const toggleDetails = (orderId) => {
    if (expandedOrder === orderId) setExpandedOrder(null);
    else setExpandedOrder(orderId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-700 pb-4">
        Mis Compras 🛍️
      </h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por número de orden o nombre de producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700">
          <p className="text-slate-400 mb-4 text-lg">
            Todavía no hiciste ninguna compra.
          </p>
          <p className="text-slate-500">¡Andá al inicio y llená ese carrito!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg"
            >
              {/* 📌 CABECERA DE LA ORDEN */}
              <div className="bg-slate-900 p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Fecha de compra</p>
                  <p className="text-white font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  {/* BOTÓN PARA ABRIR/CERRAR EL ACORDEÓN */}
                  <button
                    onClick={() => toggleDetails(order.id)}
                    className="mt-2 text-sm text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                  >
                    {expandedOrder === order.id
                      ? "Ocultar detalles"
                      : "Ver detalle de la compra"}
                  </button>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Total pagado</p>
                  <p className="text-emerald-400 font-bold text-xl">
                    ${order.total}
                  </p>
                </div>

                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* 📦 DETALLES DE LA ORDEN (Solo se ven si tocás el botón) */}
              {expandedOrder === order.id && (
                <div className="p-6 space-y-4 bg-slate-800/50">
                  <h4 className="text-white font-bold mb-4 border-b border-slate-700 pb-2">
                    Productos incluidos:
                  </h4>
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-slate-900 p-3 rounded-lg border border-slate-700"
                    >
                      <img
                        src={
                          item.product?.image ||
                          "https://via.placeholder.com/80"
                        }
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-md bg-slate-800"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {item.product?.name || "Producto no disponible"}
                        </p>
                        <p className="text-slate-400 text-sm">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <div className="text-emerald-400 font-bold">
                        ${item.price}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
