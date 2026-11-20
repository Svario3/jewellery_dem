import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, FolderTree } from 'lucide-react';
import { categoriesAPI } from '../../services/api';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesAPI.getAll();
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete category? It must contain zero products.')) {
      try {
        await categoriesAPI.delete(id);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting category');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = { name, description, image };
      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, payload);
      } else {
        await categoriesAPI.create(payload);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ivory-300">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
            Vault Organization
          </span>
          <h1 className="font-serif text-3xl font-bold text-chocolate-900">
            Jewellery Categories ({categories.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-chocolate-800">
            <thead className="bg-chocolate-900 text-gold-300 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Category</th>
                <th className="p-4">Slug Identifier</th>
                <th className="p-4">Vault Products</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-chocolate-500">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-ivory-50/60 transition">
                  <td className="p-4 flex items-center space-x-3">
                    <img
                      src={cat.image}
                      alt=""
                      className="w-12 h-12 object-cover rounded-lg bg-ivory-100 border"
                    />
                    <strong className="font-semibold text-chocolate-900 text-sm">
                      {cat.name}
                    </strong>
                  </td>

                  <td className="p-4 font-mono text-chocolate-600">{cat.slug}</td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-gold-50 text-gold-900 border border-gold-200 rounded-full font-bold">
                      {cat.productCount || 0} designs
                    </span>
                  </td>

                  <td className="p-4 text-chocolate-600 max-w-xs truncate">
                    {cat.description || 'Standard jewellery category'}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-chocolate-700 hover:text-gold-700 hover:bg-ivory-100 rounded transition"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-ivory-300 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-serif text-xl font-bold text-chocolate-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-chocolate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Brooches"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-chocolate-900 text-gold-300 rounded-lg uppercase tracking-wider font-semibold"
                >
                  {formLoading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
