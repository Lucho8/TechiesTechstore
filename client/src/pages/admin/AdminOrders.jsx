import { useState, useEffect } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [pendingStatuses, setPendingStatuses] = useState({});

  const [expandedOrder, setExpandedOrder] = useState(null);

  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error al traer las órdenes:", error);
    }
  };

  const handleSelectChange = (orderId, value) => {
    setPendingStatuses({
      ...pendingStatuses,
      [orderId]: value,
    });
  };

  const handleStatusChange = async (orderId) => {
    const newStatus = pendingStatuses[orderId];
    if (!newStatus) return;

    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const newPending = { ...pendingStatuses };
        delete newPending[orderId];
        setPendingStatuses(newPending);

        fetchOrders();
      } else {
        alert("Hubo un error al cambiar el estado.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const toggleDetails = (orderId) => {
    if (expandedOrder === orderId) setExpandedOrder(null);
    else setExpandedOrder(orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "Enviado":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Entregado":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const filteredOrders = orders.filter(
    (order) => filterStatus === "all" || order.status === filterStatus,
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
      <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-700 pb-4">
        Gestión de Órdenes
      </h2>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${filterStatus === "all" ? "bg-violet-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${filterStatus === "pending" ? "bg-yellow-500 text-slate-900" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
        >
          Pendientes ⏳
        </button>
        <button
          onClick={() => setFilterStatus("Enviado")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${filterStatus === "Enviado" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
        >
          Enviados 🚚
        </button>
        <button
          onClick={() => setFilterStatus("Entregado")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${filterStatus === "Entregado" ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
        >
          Entregados ✅
        </button>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            Todavía no hay ventas. ¡A meterle marketing! 🚀
          </p>
        ) : (
          filteredOrders.map((order) => {
            const currentSelectedStatus =
              pendingStatuses[order.id] || order.status;

            const isChanged =
              pendingStatuses[order.id] &&
              pendingStatuses[order.id] !== order.status;

            return (
              <div
                key={order.id}
                className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden"
              >
                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl font-bold text-white">
                        Orden #{order.id}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(order.status)} font-medium`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-400 font-medium">
                      👤 {order.user?.name} ({order.user?.email})
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      📅 {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    <button
                      onClick={() => toggleDetails(order.id)}
                      className="mt-3 text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4"
                    >
                      {expandedOrder === order.id
                        ? "Ocultar Detalles"
                        : "Ver Detalles de Compra"}
                    </button>
                  </div>

                  <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-slate-700 md:border-0">
                    <span className="text-2xl font-bold text-emerald-400">
                      ${order.total}
                    </span>

                    <div className="flex items-center gap-2">
                      <select
                        value={currentSelectedStatus}
                        onChange={(e) =>
                          handleSelectChange(order.id, e.target.value)
                        }
                        className="bg-slate-800 text-white p-2 rounded-lg border border-slate-600 focus:border-violet-500 outline-none text-sm cursor-pointer"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                      </select>

                      {isChanged && (
                        <button
                          onClick={() => handleStatusChange(order.id)}
                          className="bg-violet-600 hover:bg-violet-500 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                          Confirmar
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="bg-slate-950 p-6 border-t border-slate-800">
                    <h4 className="text-white font-bold mb-4">
                      Productos en esta orden:
                    </h4>
                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-800"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                item.product?.image ||
                                "https://via.placeholder.com/50"
                              }
                              alt={item.product?.name}
                              className="w-10 h-10 object-cover rounded bg-slate-800"
                            />
                            <div>
                              <p className="text-slate-300 text-sm font-medium">
                                {item.product?.name || "Producto Eliminado"}
                              </p>
                              <p className="text-slate-500 text-xs">
                                Cantidad: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="text-slate-300 font-medium">
                            ${item.price} c/u
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
