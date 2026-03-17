import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { API_URL } from "../utils/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [globalMinMax, setGlobalMinMax] = useState([0, 100000]);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const [catRes, priceRes] = await Promise.all([
          fetch(`${API_URL}/api/categories`),
          fetch(`${API_URL}/api/products/price-range`),
        ]);

        const cats = await catRes.json();
        const prices = await priceRes.json();

        setCategories(cats);

        const min = prices.min != null ? Number(prices.min) : 0;
        const max =
          prices.max != null && prices.max > 0 ? Number(prices.max) : 100000;

        setGlobalMinMax([min, max]);
        setPriceRange([min, max]);

        setIsReady(true);
      } catch (error) {
        console.error("Error inicializando:", error);
        setIsReady(true);
      }
    };

    initData();
  }, []);

  const fetchProducts = async (
    e,
    overrideFilters = null,
    targetPage = page,
  ) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();

      const currentSearch = overrideFilters ? overrideFilters.search : search;
      const currentCategory = overrideFilters
        ? overrideFilters.category
        : category;
      const currentMin = overrideFilters
        ? overrideFilters.minPrice
        : priceRange[0];
      const currentMax = overrideFilters
        ? overrideFilters.maxPrice
        : priceRange[1];

      if (currentSearch) queryParams.append("search", currentSearch);
      if (currentCategory) queryParams.append("category", currentCategory);
      if (currentMin !== null && currentMin !== undefined)
        queryParams.append("minPrice", currentMin);
      if (currentMax !== null && currentMax !== undefined)
        queryParams.append("maxPrice", currentMax);

      queryParams.append("page", targetPage);
      queryParams.append("limit", 6);

      const res = await fetch(
        `${API_URL}/api/products?${queryParams.toString()}`,
      );
      const data = await res.json();

      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
    } catch (error) {
      console.error("Error trayendo productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      fetchProducts(null, null, page);
    }
  }, [page, isReady]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(e, null, 1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setPriceRange([...globalMinMax]);
    setPage(1);
    fetchProducts(
      null,
      {
        search: "",
        category: "",
        minPrice: globalMinMax[0],
        maxPrice: globalMinMax[1],
      },
      1,
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 mb-20">
      {/* --- HERO BANNER --- */}
      <div className="relative bg-linear-to-r from-violet-900 to-slate-900 rounded-4xl p-8 md:p-14 mb-10 overflow-hidden shadow-2xl border border-violet-500/20">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block py-1 px-3 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-bold mb-6 tracking-wide">
            🔥 NUEVOS INGRESOS 2026
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-violet-200 mb-6 leading-tight">
            Elevá tu setup al próximo nivel.
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
            Encontrá los mejores componentes y accesorios para armar la PC de
            tus sueños. Calidad premium para verdaderos Techies.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("catalogo")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-violet-600/30 transition-all transform hover:-translate-y-1"
          >
            Explorar Catálogo 👇
          </button>
        </div>

        {/* Decoración de fondo abstracta */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
      </div>

      {/* --- TRUST BADGES (Cinta de Beneficios) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="flex items-center gap-5 bg-linear-to-b from-slate-800 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 hover:border-violet-500/30 transition-colors shadow-lg">
          <div className="text-4xl bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-inner">
            🚚
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Envío Rápido</h3>
            <p className="text-slate-400 text-sm">A todo el país en 48hs</p>
          </div>
        </div>

        <div className="flex items-center gap-5 bg-linear-to-b from-slate-800 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 hover:border-violet-500/30 transition-colors shadow-lg">
          <div className="text-4xl bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-inner">
            💳
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Pago Seguro</h3>
            <p className="text-slate-400 text-sm">
              100% encriptado y protegido
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 bg-linear-to-b from-slate-800 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 hover:border-violet-500/30 transition-colors shadow-lg">
          <div className="text-4xl bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-inner">
            🛡️
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Garantía Oficial</h3>
            <p className="text-slate-400 text-sm">Soporte técnico directo</p>
          </div>
        </div>
      </div>

      {/* --- TÍTULO DEL CATÁLOGO --- */}
      <div
        id="catalogo"
        className="flex items-center justify-between mb-8 border-b border-slate-700/80 pb-4 pt-4"
      >
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400 border-l-4 border-violet-500 pl-4">
          Nuestro Catálogo
        </h2>
      </div>

      {/* --- SECCIÓN PRINCIPAL (Filtros + Grilla) --- */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* --- SIDEBAR DE FILTROS RENOVADO --- */}
        <div className="w-full md:w-1/4 bg-linear-to-b from-slate-800 to-slate-900 p-6 rounded-3xl border border-slate-700/50 h-fit sticky top-24 shadow-xl shadow-black/40">
          <h2 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-violet-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
            Filtros
          </h2>

          <form onSubmit={handleFilterSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">
                ¿Qué estás buscando?
              </label>
              <input
                type="text"
                placeholder="Ej: Teclado mecánico..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/50 text-white border border-slate-700 rounded-xl p-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950/50 text-white border border-slate-700 rounded-xl p-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner appearance-none cursor-pointer"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pb-4 border-b border-slate-700/50 mb-4">
              <label className="text-sm font-medium text-slate-300 block mb-6">
                Rango de Precio:{" "}
                <span className="text-violet-400 font-bold ml-1 bg-violet-900/30 px-2 py-1 rounded-md">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </label>
              <div className="px-2">
                <Slider
                  range
                  min={globalMinMax[0]}
                  max={globalMinMax[1]}
                  value={priceRange}
                  onChange={(newRange) => setPriceRange(newRange)}
                  trackStyle={[{ backgroundColor: "#8b5cf6", height: 6 }]}
                  handleStyle={[
                    {
                      borderColor: "#a78bfa",
                      height: 18,
                      width: 18,
                      marginTop: -6,
                      backgroundColor: "#1e1b4b",
                      opacity: 1,
                      boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                      cursor: "grab",
                    },
                    {
                      borderColor: "#a78bfa",
                      height: 18,
                      width: 18,
                      marginTop: -6,
                      backgroundColor: "#1e1b4b",
                      opacity: 1,
                      boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                      cursor: "grab",
                    },
                  ]}
                  railStyle={{ backgroundColor: "#334155", height: 6 }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-5 font-mono">
                <span>Mín: ${globalMinMax[0]}</span>
                <span>Máx: ${globalMinMax[1]}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-violet-600/20 transform hover:-translate-y-0.5"
              >
                Aplicar Filtros
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold py-3 rounded-xl transition-all"
              >
                Limpiar todo
              </button>
            </div>
          </form>
        </div>

        {/* --- GRILLA DE PRODUCTOS --- */}
        <div className="w-full md:w-3/4 flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-violet-400 font-bold text-lg animate-pulse">
                Cargando inventario...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-linear-to-b from-slate-800 to-slate-900 p-12 rounded-3xl border border-slate-700 text-center shadow-2xl mt-4">
              <span className="text-7xl mb-6 block drop-shadow-lg">🕵️‍♂️</span>
              <h3 className="text-2xl font-bold text-white mb-3">
                No encontramos coincidencias
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                No hay productos que coincidan con tu búsqueda actual. Intentá
                usar palabras más generales o ampliar el rango de precio.
              </p>
              <button
                onClick={clearFilters}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Ver todo el catálogo
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 content-start">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4 bg-slate-800/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-700 w-fit mx-auto shadow-xl">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-violet-600 transition-colors font-bold border border-slate-700"
                  >
                    ← Anterior
                  </button>
                  <span className="text-slate-300 font-medium px-4">
                    Página <strong className="text-white">{page}</strong> de{" "}
                    <strong className="text-white">{totalPages}</strong>
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-violet-600 transition-colors font-bold border border-slate-700"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
