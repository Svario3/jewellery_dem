import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { productsAPI, categoriesAPI, adminAPI } from '../../services/api';
import { formatPrice } from '../../components/common/ProductCard';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form Fields
  const [form, setForm] = useState({
    name: '',
    category: '',
    subCategory: 'Traditional',
    price: '',
    compareAtPrice: '',
    stock: 10,
    metalType: '22K Yellow Gold',
    purity: '22 Karat (91.6% Pure Gold)',
    grossWeight: '12.5 g',
    netWeight: '11.8 g',
    diamondWeight: 'None',
    gemstone: 'None',
    description: '',
    imageUrl: '',
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    isBridal: false,
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (categoryFilter !== 'all') params.category = categoryFilter;
      const res = await productsAPI.getProducts(params);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: categories[0]?._id || '',
      subCategory: 'Traditional',
      price: '',
      compareAtPrice: '',
      stock: 10,
      metalType: '22K Yellow Gold',
      purity: '22 Karat (91.6% Pure Gold)',
      grossWeight: '12.5 g',
      netWeight: '11.8 g',
      diamondWeight: 'None',
      gemstone: 'None',
      description: '',
      imageUrl: '',
      isFeatured: false,
      isBestseller: false,
      isNewArrival: true,
      isBridal: false,
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      category: prod.category?._id || prod.category,
      subCategory: prod.subCategory || 'Traditional',
      price: prod.price,
      compareAtPrice: prod.compareAtPrice || '',
      stock: prod.stock,
      metalType: prod.metalType || '22K Yellow Gold',
      purity: prod.purity || '',
      grossWeight: prod.grossWeight || '',
      netWeight: prod.netWeight || '',
      diamondWeight: prod.diamondWeight || '',
      gemstone: prod.gemstone || '',
      description: prod.description || '',
      imageUrl: prod.images?.[0]?.url || '',
      isFeatured: Boolean(prod.isFeatured),
      isBestseller: Boolean(prod.isBestseller),
      isNewArrival: Boolean(prod.isNewArrival),
      isBridal: Boolean(prod.isBridal),
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you wish to permanently remove this piece from the vault?')) {
      try {
        await productsAPI.delete(id);
        fetchProducts();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let finalImgUrl = form.imageUrl;

      // Handle image upload if user selected a file
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await adminAPI.uploadImage(formData);
        if (uploadRes.data.success) {
          finalImgUrl = uploadRes.data.url;
        }
      }

      if (!finalImgUrl) {
        finalImgUrl =
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';
      }

      const payload = {
        ...form,
        images: [{ url: finalImgUrl, isPrimary: true }],
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct._id, payload);
      } else {
        await productsAPI.create(payload);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Title & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ivory-300">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
            Vault Catalog Inventory
          </span>
          <h1 className="font-serif text-3xl font-bold text-chocolate-900">
            Jewellery Masterpieces ({products.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Masterpiece</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-ivory-300 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or SKU..."
            className="w-full pl-9 pr-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-chocolate-900 focus:outline-none focus:border-gold-600"
          />
          <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-semibold text-chocolate-700">Category Filter:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg font-medium text-chocolate-900 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-chocolate-800">
            <thead className="bg-chocolate-900 text-gold-300 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Metal & Karat</th>
                <th className="p-4">Price (₹)</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Flags</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-chocolate-500">
                    Loading vault catalog...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-chocolate-500">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-ivory-50/60 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <img
                        src={p.images?.[0]?.url || ''}
                        alt=""
                        className="w-12 h-12 object-cover rounded-lg bg-ivory-100 border"
                      />
                      <div>
                        <strong className="block font-semibold text-chocolate-900 line-clamp-1">
                          {p.name}
                        </strong>
                        <span className="text-chocolate-500 text-[11px]">
                          {p.categoryName || p.category?.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-chocolate-700">{p.sku}</td>

                    <td className="p-4">
                      <span className="block font-medium">{p.metalType}</span>
                      <span className="text-[11px] text-chocolate-500">{p.grossWeight}</span>
                    </td>

                    <td className="p-4 font-sans font-bold text-chocolate-900">
                      {formatPrice(p.price)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          p.stock <= 3
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isBridal && <span className="bg-chocolate-800 text-gold-300 text-[9px] px-1.5 py-0.5 rounded font-bold">Bridal</span>}
                        {p.isBestseller && <span className="bg-gold-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">Best</span>}
                        {p.isNewArrival && <span className="bg-emerald-700 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">New</span>}
                      </div>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-chocolate-700 hover:text-gold-700 hover:bg-ivory-100 rounded transition"
                        title="Edit Masterpiece"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Masterpiece Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-ivory-300 space-y-6 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-serif text-2xl font-bold text-chocolate-900">
                {editingProduct ? 'Edit Vault Masterpiece' : 'Add New Fine Jewellery'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-chocolate-600 hover:text-gold-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border rounded-lg font-medium"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Compare Price (₹)</label>
                  <input
                    type="number"
                    value={form.compareAtPrice}
                    onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                    placeholder="Optional strikethrough"
                    className="w-full px-3 py-2 bg-ivory-50 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Vault Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Metal Setting</label>
                  <select
                    value={form.metalType}
                    onChange={(e) => setForm({ ...form, metalType: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border rounded-lg font-medium"
                  >
                    <option value="22K Yellow Gold">22K Yellow Gold</option>
                    <option value="18K Yellow Gold">18K Yellow Gold</option>
                    <option value="18K Rose Gold">18K Rose Gold</option>
                    <option value="18K White Gold">18K White Gold</option>
                    <option value="Platinum 950">Platinum 950</option>
                    <option value="925 Sterling Silver">925 Sterling Silver</option>
                    <option value="Kundan & Polki">Kundan & Polki</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Gross Weight</label>
                  <input
                    type="text"
                    value={form.grossWeight}
                    onChange={(e) => setForm({ ...form, grossWeight: e.target.value })}
                    placeholder="e.g. 14.5 g"
                    className="w-full px-3 py-2 bg-ivory-50 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Net Gold Weight</label>
                  <input
                    type="text"
                    value={form.netWeight}
                    onChange={(e) => setForm({ ...form, netWeight: e.target.value })}
                    placeholder="e.g. 13.8 g"
                    className="w-full px-3 py-2 bg-ivory-50 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Product Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border rounded-lg"
                />
              </div>

              {/* Image Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block font-semibold mb-1">Image URL (Direct link)</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-ivory-50 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Or Upload Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full text-xs text-chocolate-700 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-chocolate-900 file:text-gold-300 hover:file:bg-gold-700"
                  />
                </div>
              </div>

              {/* Badges / Checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-gold-700"
                  />
                  <span>Featured Vault</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isBridal}
                    onChange={(e) => setForm({ ...form, isBridal: e.target.checked })}
                    className="w-4 h-4 text-gold-700"
                  />
                  <span>Bridal Trousseau</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isBestseller}
                    onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
                    className="w-4 h-4 text-gold-700"
                  />
                  <span>Bestseller</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
                    className="w-4 h-4 text-gold-700"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 bg-chocolate-900 text-gold-300 rounded-lg uppercase tracking-wider font-semibold disabled:opacity-50"
                >
                  {formLoading ? 'Preserving...' : editingProduct ? 'Update Product' : 'Add To Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
