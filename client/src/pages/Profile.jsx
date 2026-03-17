import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import MyOrders from "./MyOrders";
import { Link } from "react-router-dom"; 
import toast from "react-hot-toast"; 

function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("datos");

  
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchMyReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/reviews/user/${user.id}`,
        );
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Error trayendo reseñas", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchMyReviews();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés borrar esta reseña?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Reseña eliminada 🗑️");
        setReviews(reviews.filter((r) => r.id !== id));
      }
    } catch (error) {
      toast.error("Error al borrar la reseña");
    }
  };

  const startEditing = (review) => {
    setEditingReview(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: editRating, comment: editComment }),
      });

      if (res.ok) {
        const updated = await res.json();
        toast.success("Reseña actualizada ⭐");
        setReviews(
          reviews.map((r) =>
            r.id === id
              ? { ...r, rating: updated.rating, comment: updated.comment }
              : r,
          ),
        );
        setEditingReview(null);
      }
    } catch (error) {
      toast.error("Error al editar la reseña");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {}
      <div className="w-full md:w-1/4 bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit shadow-xl">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-violet-600 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl shadow-lg shadow-violet-500/30">
            👤
          </div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <span className="text-xs bg-slate-900 text-slate-400 px-3 py-1 rounded-full border border-slate-700 mt-2 inline-block">
            {user?.role === "ADMIN" ? "👑 Administrador" : "🛍️ Cliente"}
          </span>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setActiveTab("datos")}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "datos" ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}
          >
            📋 Mis Datos
          </button>
          <button
            onClick={() => setActiveTab("compras")}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "compras" ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}
          >
            📦 Mis Compras
          </button>
          {}
          <button
            onClick={() => setActiveTab("reseñas")}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "reseñas" ? "bg-amber-600 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}
          >
            ⭐ Mis Reseñas
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {}
      <div className="w-full md:w-3/4">
        {}
        {activeTab === "datos" && (
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
              Información Personal
            </h3>
            <div className="space-y-6 max-w-md">
              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Nombre Completo
                </label>
                <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700">
                  {user?.name}
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Correo Electrónico
                </label>
                <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700">
                  {user?.email}
                </div>
              </div>
              <button className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-slate-600 mt-4">
                ✏️ Editar Perfil (Próximamente)
              </button>
            </div>
          </div>
        )}

        {}
        {activeTab === "compras" && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
            <MyOrders />
          </div>
        )}

        {}
        {activeTab === "reseñas" && (
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
              Mi Historial de Reseñas
            </h3>

            {loadingReviews ? (
              <p className="text-amber-400 animate-pulse font-bold">
                Cargando tus opiniones...
              </p>
            ) : reviews.length === 0 ? (
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 text-center">
                <p className="text-slate-400 mb-4">
                  Todavía no dejaste ninguna opinión.
                </p>
                <Link
                  to="/"
                  className="text-amber-400 font-bold hover:underline"
                >
                  Ir a explorar productos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-slate-900 p-6 rounded-2xl border border-slate-700 flex flex-col sm:flex-row gap-6"
                  >
                    {}
                    <div className="sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-700 pb-4 sm:pb-0 sm:pr-6">
                      <img
                        src={
                          review.product?.image ||
                          "https://via.placeholder.com/150"
                        }
                        alt="Producto"
                        className="w-full h-32 object-cover rounded-lg bg-slate-800 mb-3"
                      />
                      <Link
                        to={`/product/${review.product?.slug}`}
                        className="font-bold text-white hover:text-amber-400 transition-colors line-clamp-2"
                      >
                        {review.product?.name}
                      </Link>
                    </div>

                    {}
                    <div className="sm:w-2/3 flex flex-col">
                      <div className="text-yellow-400 text-lg mb-2">
                        {editingReview === review.id ? (
                          <select
                            value={editRating}
                            onChange={(e) =>
                              setEditRating(Number(e.target.value))
                            }
                            className="bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 outline-none text-sm"
                          >
                            <option value="5">⭐⭐⭐⭐⭐</option>
                            <option value="4">⭐⭐⭐⭐</option>
                            <option value="3">⭐⭐⭐</option>
                            <option value="2">⭐⭐</option>
                            <option value="1">⭐</option>
                          </select>
                        ) : (
                          "⭐".repeat(review.rating)
                        )}
                      </div>

                      <div className="flex-1 mb-4">
                        {editingReview === review.id ? (
                          <textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-amber-500 resize-none h-24 text-sm"
                          />
                        ) : (
                          <p className="text-slate-300 italic text-sm">
                            "{review.comment}"
                          </p>
                        )}
                      </div>

                      {}
                      <div className="flex justify-end gap-3 mt-auto">
                        {editingReview === review.id ? (
                          <>
                            <button
                              onClick={() => setEditingReview(null)}
                              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg font-bold transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleSaveEdit(review.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg font-bold transition-colors"
                            >
                              Guardar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(review)}
                              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg font-bold transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg font-bold transition-colors"
                            >
                              Borrar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
