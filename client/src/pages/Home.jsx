import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // 👈 Nuevo estado para las categorías
  const [selectedCategory, setSelectedCategory] = useState("all"); // 👈 Estado para el filtro activo
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usamos Promise.all para traer Productos y Categorías al mismo tiempo
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:3000/api/products"),
          fetch("http://localhost:3000/api/categories"),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error cargando la tienda:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🧠 LÓGICA DE FILTRADO: Antes de dibujar, vemos qué botón tocó el usuario
  const filteredProducts = products.filter(
    (product) =>
      selectedCategory === "all" || product.categoryId === selectedCategory,
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mb-20">
      {/* 🦸‍♂️ HERO SECTION (El banner principal) */}
      <div className="bg-linear-to-r from-violet-900 to-slate-900 rounded-2xl p-8 sm:p-12 mb-10 border border-violet-800/50 shadow-2xl flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight">
          El paraíso del <span className="text-violet-400">Setup Perfecto</span>
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl max-w-2xl">
          Encontrá los mejores periféricos, componentes y accesorios para llevar
          tu experiencia al siguiente nivel.
        </p>
      </div>

      {/* 🎛️ FILTROS POR CATEGORÍA */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-violet-500 pl-4">
          Explorar por categoría
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all shadow-md ${selectedCategory === "all" ? "bg-violet-600 text-white shadow-violet-500/30" : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"}`}
          >
            🔥 Todo el catálogo
          </button>

          {/* Generamos un botón por cada categoría que viene de la base de datos */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all shadow-md ${selectedCategory === cat.id ? "bg-violet-600 text-white shadow-violet-500/30" : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 📦 ESTADO DE CARGA O GRILLA DE PRODUCTOS */}
      {loading ? (
        <div className="text-center py-20 text-violet-400 text-xl animate-pulse font-bold">
          Cargando catálogo... 🚀
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center bg-slate-800 rounded-xl p-10 border border-slate-700">
          <p className="text-slate-400 text-lg">
            No hay productos en esta categoría por ahora. 😢
          </p>
        </div>
      ) : (
        /* Le subí a grid-cols-4 en pantallas grandes (xl) para aprovechar el espacio del max-w-7xl */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
