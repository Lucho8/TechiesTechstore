import { useState, useEffect } from 'react'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const res = await fetch('http://localhost:3000/api/categories')
    const data = await res.json()
    setCategories(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newName) return

    const res = await fetch('http://localhost:3000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    })

    if (res.ok) {
      setNewName("")
      fetchCategories() // Recargamos la lista
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6">Gestionar Categorías</h2>

      {/* FORMULARIO DE CREACIÓN */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input 
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nueva categoría (ej: Sillas)"
          className="flex-1 bg-slate-900 border border-slate-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
        />
        <button className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-lg font-bold transition-all">
          Agregar
        </button>
      </form>

      {/* LISTADO */}
      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.id} className="flex justify-between items-center p-4 bg-slate-900 rounded-lg border border-slate-700">
            <span className="text-white font-medium">{cat.name}</span>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
              {cat._count?.products || 0} productos
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminCategories