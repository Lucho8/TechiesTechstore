import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const res = await fetch("http://localhost:3000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (res.ok) {
        const data = await res.json();
        setCategories([...categories, data]);
        setNewCategory("");
        toast.success("Categoría creada con éxito 📁");
      } else {
        toast.error("Error al crear la categoría");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés borrar esta categoría?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        
        toast.error(data.error || "No se pudo borrar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  
  const startEditing = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return toast.error("El nombre no puede estar vacío");

    try {
      const res = await fetch(`http://localhost:3000/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });

      if (res.ok) {
        toast.success("Categoría actualizada ✏️");
        setCategories(
          categories.map((c) => (c.id === id ? { ...c, name: editName } : c)),
        );
        setEditingId(null);
      } else {
        toast.error("Error al actualizar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
        Gestión de Categorías
      </h2>

      
      <form onSubmit={handleAddCategory} className="flex gap-4 mb-8">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nueva categoría (ej: Monitores)"
          className="flex-1 bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-violet-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!newCategory.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          + Agregar
        </button>
      </form>

      
      {loading ? (
        <p className="text-violet-400 animate-pulse font-bold text-center">
          Cargando...
        </p>
      ) : categories.length === 0 ? (
        <p className="text-slate-400 text-center py-4">
          No hay categorías creadas.
        </p>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700"
            >
              
              {editingId === category.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  className="flex-1 bg-slate-800 text-white border border-violet-500 rounded p-2 outline-none mr-4"
                />
              ) : (
                <span className="text-white font-medium flex-1">
                  {category.name}
                </span>
              )}

              
              <div className="flex gap-2">
                {editingId === category.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(category.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded font-bold transition-colors text-sm"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded font-bold transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(category)}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded font-bold transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded font-bold transition-colors text-sm"
                    >
                      Borrar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
