import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
import { useAuth } from "../context/AuthContext"; 
import toast from "react-hot-toast"; 
import ProductCard from "../components/ProductCard";

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart(); 
  const { user } = useAuth(); 

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false); 

  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, relatedRes] = await Promise.all([
          fetch(`http://localhost:3000/api/products/${slug}`),
          fetch(`http://localhost:3000/api/products/related/${slug}`)
        ]);

        if (!productRes.ok) throw new Error("Producto no encontrado");
        
        const productData = await productRes.json();
        const relatedData = await relatedRes.json();

        
        setProduct({ ...productData, reviews: productData.reviews || [] });
        setRelatedProducts(relatedData);
      } catch (error) {
        console.error(error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, navigate]);

  const handleAddToCart = () => {
    addToCart(product); 
    setIsAdded(true); 
    toast.success("¡Producto agregado al carrito! 🛒"); 

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Tenés que iniciar sesión para comentar");
    if (!comment.trim()) return toast.error("El comentario no puede estar vacío");

    setIsSubmitting(true);
    try {
      
      const res = await fetch(`http://localhost:3000/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          userId: user.id
        })
      });

      if (res.ok) {
        const newReview = await res.json();
        toast.success("¡Gracias por tu reseña! ⭐");
        setComment("");
        setRating(5);
        
        
        const reviewConUsuario = { ...newReview, user: { name: user.name || "Usuario" } };
        setProduct({ ...product, reviews: [reviewConUsuario, ...product.reviews] });
      } else {
        toast.error("Hubo un error al publicar tu reseña.");
      }
    } catch (error) {
      toast.error("Error de conexión al guardar la reseña.");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const averageRating = product?.reviews?.length > 0 
    ? (product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

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
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-violet-400 transition-colors mb-8 font-medium">
        <span>←</span> Volver al catálogo
      </Link>

      
      <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row mb-12">
        <div className="md:w-1/2 bg-slate-900 p-8 flex items-center justify-center relative">
          <div className="absolute top-4 left-4 bg-violet-900/50 text-violet-300 px-4 py-1 rounded-full border border-violet-700/50 text-sm font-bold backdrop-blur-sm">
            {product.category?.name || "General"}
          </div>
          <img src={product.image || "https://via.placeholder.com/600"} alt={product.name} className="w-full h-auto max-h-[500px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
        </div>

        <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-2 leading-tight">{product.name}</h1>
          
          
          <div className="flex items-center gap-2 mb-6 text-yellow-400">
            <span>⭐ {averageRating > 0 ? averageRating : "Nuevo"}</span>
            <span className="text-slate-400 text-sm">({product.reviews?.length || 0} reseñas)</span>
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl sm:text-5xl font-black text-emerald-400">${product.price}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${product.stock > 0 ? "bg-emerald-900/30 text-emerald-400 border-emerald-500/50" : "bg-red-900/30 text-red-400 border-red-500/50"}`}>
              {product.stock > 0 ? `Stock: ${product.stock} disponibles` : "Sin Stock"}
            </span>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-white mb-2 border-b border-slate-700 pb-2">Descripción del producto</h3>
            <p className="text-slate-300 leading-relaxed">{product.description || "Este producto no tiene una descripción detallada por el momento."}</p>
          </div>

          <button disabled={product.stock <= 0 || isAdded} onClick={handleAddToCart} className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${isAdded ? "bg-emerald-600 text-white shadow-emerald-600/30 scale-95" : product.stock > 0 ? "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30 hover:-translate-y-1" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}>
            {isAdded ? "¡Agregado al Carrito! ✔️" : product.stock > 0 ? "🛒 Agregar al Carrito" : "🚫 Producto Agotado"}
          </button>
        </div>
      </div>

      
      <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-8 sm:p-12 mb-12">
        <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-violet-500 pl-4">
          Reseñas de los clientes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Dejá tu opinión</h3>
                
                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-2">Puntuación</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-violet-500"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5) - Excelente</option>
                    <option value="4">⭐⭐⭐⭐ (4) - Muy Bueno</option>
                    <option value="3">⭐⭐⭐ (3) - Bueno</option>
                    <option value="2">⭐⭐ (2) - Regular</option>
                    <option value="1">⭐ (1) - Malo</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-2">Comentario</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="¿Qué te pareció el producto?"
                    rows="3"
                    className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-violet-500 resize-none"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-slate-600"
                >
                  {isSubmitting ? "Publicando..." : "Publicar Reseña"}
                </button>
              </form>
            ) : (
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 text-center">
                <p className="text-slate-400 mb-4">Tenés que iniciar sesión para dejar una reseña.</p>
                <Link to="/login" className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>

          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {product.reviews?.length === 0 ? (
              <p className="text-slate-400 italic">Todavía no hay reseñas. ¡Sé el primero en opinar!</p>
            ) : (
              product.reviews?.map((rev, index) => (
                <div key={index} className="bg-slate-900 p-5 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-violet-300">{rev.user?.name || "Usuario"}</span>
                    <span className="text-yellow-400 text-sm">{"⭐".repeat(rev.rating)}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-violet-500 pl-4">
            También te puede interesar...
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductDetail;