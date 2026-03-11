import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Guardamos las categorías para el Select
  const [editingId, setEditingId] = useState(null); // Si es null, estamos creando. Si tiene un número, estamos editando.

  const { user } = useAuth();

  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    categoryId: "",
  });

  // Al cargar la página, traemos los productos y las categorías
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:3000/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  // Manejador para cuando escribís en cualquier input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validamos que haya elegido una categoría
    if (!formData.categoryId) {
      alert("¡Che, te olvidaste de elegir la categoría!");
      return;
    }

    // 🧠 LA MAGIA: ¿Estamos creando o editando?
    // Si editingId tiene un número, usamos la URL con ese ID específico. Si es null, usamos la general.
    const url = editingId
      ? `http://localhost:3000/api/products/${editingId}` // MODO EDICIÓN
      : "http://localhost:3000/api/products"; // MODO CREACIÓN

    // Si hay un ID, el método HTTP es PUT (actualizar). Si no, es POST (crear).
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user?.role,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // 1. Limpiamos el formulario dejándolo en blanco
        setFormData({
          name: "",
          price: "",
          stock: "",
          description: "",
          image: "",
          categoryId: "",
        });

        // 2. Apagamos el "Modo Edición" para que el próximo producto sea uno nuevo
        setEditingId(null);

        // 3. Recargamos la lista del inventario
        fetchProducts();

        // 4. Mostramos el mensaje correcto
        alert(
          editingId
            ? "¡Cambios guardados correctamente! ✏️"
            : "¡Producto cargado con éxito! 📦",
        );
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Hubo un error al guardar");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Explotó la conexión con el servidor.");
    }
  };

  const handleDelete = async (id) => {
    // 🛑 Confirmación de seguridad (UX clave)
    const isConfirmed = window.confirm(
      "¿Estás seguro de que querés borrar este producto? Esta acción no se puede deshacer.",
    );

    if (!isConfirmed) return; // Si dice que no, cancelamos

    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-role": user?.role,
        },
      });

      if (res.ok) {
        alert("Producto eliminado.");
        fetchProducts(); // Recargamos la lista para que desaparezca visualmente
      } else {
        alert("Hubo un error al borrar.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id); // Le avisamos al sistema que entramos en modo edición
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      image: product.image || "",
      categoryId: product.categoryId,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
      <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-700 pb-4">
        Gestionar Productos
      </h2>

      {/* 📝 FORMULARIO DE CARGA */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-lg border border-slate-700 mb-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
            className="bg-slate-800 text-white p-3 rounded-lg border border-slate-600 focus:border-violet-500 outline-none"
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Precio ($)"
            required
            className="bg-slate-800 text-white p-3 rounded-lg border border-slate-600 focus:border-violet-500 outline-none"
          />

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Cantidad en Stock"
            required
            className="bg-slate-800 text-white p-3 rounded-lg border border-slate-600 focus:border-violet-500 outline-none"
          />

          {/* EL SELECT MÁGICO DE CATEGORÍAS */}
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="bg-slate-800 text-white p-3 rounded-lg border border-slate-600 focus:border-violet-500 outline-none"
          >
            <option value="" disabled>
              Seleccioná una categoría
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="URL de la imagen (Opcional)"
          className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-600 focus:border-violet-500 outline-none mb-4"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción del producto..."
          rows="3"
          className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-600 focus:border-violet-500 outline-none mb-4"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-violet-600/30"
        >
          {editingId ? "Guardar Cambios" : "Guardar Producto"}
        </button>
      </form>

      {/* 📦 LISTA DE PRODUCTOS CARGADOS */}
      <h3 className="text-xl font-bold text-white mb-4">
        Inventario Actual ({products.length})
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="flex justify-between items-center p-4 bg-slate-900 rounded-lg border border-slate-700"
          >
            <div className="flex items-center gap-4">
              <img
                src={prod.image}
                alt={prod.name}
                className="w-12 h-12 object-cover rounded bg-slate-800"
              />
              <div>
                <p className="text-white font-bold">{prod.name}</p>
                <p className="text-sm text-slate-400">
                  Stock: {prod.stock} | ${prod.price}
                </p>
              </div>
            </div>
            {/* ... adentro del map de products ... */}
            <div className="flex gap-2 items-center">
              <span className="text-xs bg-violet-900/50 text-violet-300 px-3 py-1 rounded-full border border-violet-700/50">
                {prod.category?.name || "Sin Categoría"}
              </span>

              {/* 🔥 EL BOTÓN ROJO 🔥 */}
              <button
                onClick={() => handleDelete(prod.id)}
                className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white p-2 rounded-lg transition-colors border border-red-500/50"
                title="Eliminar producto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleEditClick(prod)}
                className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white p-2 rounded-lg transition-colors border border-blue-500/50 mr-2"
                title="Editar producto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;
