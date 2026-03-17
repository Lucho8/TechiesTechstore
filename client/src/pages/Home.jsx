import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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
    <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-8 mb-20">
      <div className="w-full md:w-1/4 bg-slate-800 p-6 rounded-2xl border border-slate-700 h-fit sticky top-24 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">
          Filtros de Búsqueda
        </h2>

        <form onSubmit={handleFilterSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-slate-400 block mb-2">
              ¿Qué estás buscando?
            </label>
            <input
              type="text"
              placeholder="Ej: Teclado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-2">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-violet-500 transition-colors"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pb-4">
            <label className="text-sm text-slate-400 block mb-6">
              Rango de Precio:{" "}
              <span className="text-violet-400 font-bold">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </label>
            <Slider
              range
              min={globalMinMax[0]}
              max={globalMinMax[1]}
              value={priceRange}
              onChange={(newRange) => setPriceRange(newRange)}
              trackStyle={[{ backgroundColor: "#8b5cf6", height: 8 }]}
              handleStyle={[
                {
                  borderColor: "#8b5cf6",
                  height: 20,
                  width: 20,
                  marginTop: -6,
                  backgroundColor: "white",
                  opacity: 1,
                  boxShadow: "none",
                  cursor: "grab",
                },
                {
                  borderColor: "#8b5cf6",
                  height: 20,
                  width: 20,
                  marginTop: -6,
                  backgroundColor: "white",
                  opacity: 1,
                  boxShadow: "none",
                  cursor: "grab",
                },
              ]}
              railStyle={{ backgroundColor: "#334155", height: 8 }}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-4 font-mono">
              <span>Mín: ${globalMinMax[0]}</span>
              <span>Máx: ${globalMinMax[1]}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-violet-500/30"
          >
            🔍 Aplicar Filtros
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition-colors"
          >
            🧹 Limpiar
          </button>
        </form>
      </div>

      <div className="w-full md:w-3/4 flex flex-col">
        {loading ? (
          <div className="text-center py-20 text-violet-400 text-xl animate-pulse font-bold">
            Buscando en el inventario... 🚀
          </div>
        ) : products.length === 0 ? (
          <div className="bg-slate-800 p-12 rounded-3xl border border-slate-700 text-center shadow-2xl mt-10">
            <span className="text-6xl mb-4 block">🕵️‍♂️</span>
            <h3 className="text-2xl font-bold text-white mb-2">
              No encontramos nada
            </h3>
            <p className="text-slate-400">
              Probá buscando con otras palabras o ampliando el rango de precio.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 text-violet-400 font-bold hover:underline"
            >
              Ver todos los productos
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
              <div className="mt-12 flex items-center justify-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit mx-auto shadow-lg">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-600 transition-colors font-bold"
                >
                  ← Anterior
                </button>
                <span className="text-slate-300 font-medium">
                  Página <strong className="text-white">{page}</strong> de{" "}
                  <strong className="text-white">{totalPages}</strong>
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-600 transition-colors font-bold"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
