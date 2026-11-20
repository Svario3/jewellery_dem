import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  Search,
  Grid3X3,
  Grid2X2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';

const ShopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [gridCols, setGridCols] = useState(3);

  // Filters state
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMetal, setSelectedMetal] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('newest');

  const metals = [
    '22K Yellow Gold',
    '18K Yellow Gold',
    '18K Rose Gold',
    '18K White Gold',
    'Platinum 950',
    '925 Sterling Silver',
    'Kundan & Polki',
  ];

  // Parse URL search parameters on mount or change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category') || 'all';
    const kw = params.get('keyword') || '';
    const sort = params.get('sort') || 'newest';
    const metal = params.get('metal') || 'all';

    setSelectedCategory(cat);
    setKeyword(kw);
    setSortOption(sort);
    setSelectedMetal(metal);
    setCurrentPage(1);
  }, [location.search]);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoriesAPI.getAll();
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 12,
          sort: sortOption,
        };

        if (keyword.trim()) params.keyword = keyword.trim();
        if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
        if (selectedMetal && selectedMetal !== 'all') params.metalType = selectedMetal;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (inStockOnly) params.inStock = true;

        const res = await productsAPI.getProducts(params);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotal(res.data.total);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    keyword,
    selectedCategory,
    selectedMetal,
    minPrice,
    maxPrice,
    inStockOnly,
    sortOption,
  ]);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('all');
    setSelectedMetal('all');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortOption('newest');
    setCurrentPage(1);
    navigate('/shop');
  };

  const hasActiveFilters =
    keyword ||
    selectedCategory !== 'all' ||
    selectedMetal !== 'all' ||
    minPrice ||
    maxPrice ||
    inStockOnly;

  return (
    <div className="min-h-screen bg-ivory-100 font-sans">
      {/* Shop Header Banner */}
      <div className="bg-chocolate-900 text-white py-12 border-b border-gold-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold">
            Fine Jewellery Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white">
            The Aurélia Vault
          </h1>
          <p className="text-xs sm:text-sm text-ivory-300 max-w-lg mx-auto font-light">
            Certified 22K/18K Gold, Polki Jadau, Natural Diamonds & Basra Pearls
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Controls Bar (Results Count, Layout switcher, Mobile Filter toggle, Sort) */}
        <div className="bg-white p-4 rounded-xl border border-ivory-300 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Left: Mobile Filter Button & Results Count */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-chocolate-900 text-gold-300 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
            </button>

            <span className="text-xs text-chocolate-700">
              Showing <span className="font-semibold text-chocolate-900">{products.length}</span> of <span className="font-semibold text-chocolate-900">{total}</span> royal masterpieces
            </span>
          </div>

          {/* Right: Grid switcher & Sort dropdown */}
          <div className="flex items-center space-x-4">
            {/* Grid toggle */}
            <div className="hidden sm:flex items-center space-x-1 border border-ivory-300 rounded-lg p-1">
              <button
                onClick={() => setGridCols(2)}
                className={`p-1.5 rounded transition ${gridCols === 2 ? 'bg-gold-100 text-gold-900' : 'text-chocolate-500 hover:text-chocolate-900'}`}
                aria-label="2 columns"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded transition ${gridCols === 3 ? 'bg-gold-100 text-gold-900' : 'text-chocolate-500 hover:text-chocolate-900'}`}
                aria-label="3 columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-xs text-chocolate-600 font-medium hidden sm:inline">
                Sort By:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 font-medium focus:outline-none focus:border-gold-600"
              >
                <option value="newest">Newest Vault Additions</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rating</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Strip */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-ivory-200/60 rounded-lg text-xs">
            <span className="font-semibold text-chocolate-800">Active Filters:</span>
            {keyword && (
              <span className="bg-white border border-ivory-300 text-chocolate-800 px-2.5 py-1 rounded-full flex items-center space-x-1">
                <span>Keyword: "{keyword}"</span>
                <button onClick={() => setKeyword('')}><X className="w-3 h-3 hover:text-red-600" /></button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="bg-white border border-ivory-300 text-chocolate-800 px-2.5 py-1 rounded-full flex items-center space-x-1">
                <span className="capitalize">{selectedCategory.replace('-', ' ')}</span>
                <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
              </span>
            )}
            {selectedMetal !== 'all' && (
              <span className="bg-white border border-ivory-300 text-chocolate-800 px-2.5 py-1 rounded-full flex items-center space-x-1">
                <span>{selectedMetal}</span>
                <button onClick={() => setSelectedMetal('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="bg-white border border-ivory-300 text-chocolate-800 px-2.5 py-1 rounded-full flex items-center space-x-1">
                <span>Price: ₹{minPrice || 0} - ₹{maxPrice || '∞'}</span>
                <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}><X className="w-3 h-3 hover:text-red-600" /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="bg-white border border-ivory-300 text-chocolate-800 px-2.5 py-1 rounded-full flex items-center space-x-1">
                <span>In Stock Only</span>
                <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3 hover:text-red-600" /></button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-red-700 hover:text-red-800 font-semibold underline ml-2 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar on Desktop + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                <h3 className="font-serif text-lg font-bold text-chocolate-900">
                  Refine Collection
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] text-gold-700 hover:text-chocolate-900 font-semibold uppercase tracking-wider"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Keyword Search */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-2">
                  Search In Vault
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search polki, rings..."
                    className="w-full pl-9 pr-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                  />
                  <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-2">
                  Category
                </label>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-md transition flex items-center justify-between ${
                      selectedCategory === 'all'
                        ? 'bg-chocolate-900 text-gold-300 font-semibold'
                        : 'text-chocolate-700 hover:bg-ivory-100'
                    }`}
                  >
                    <span>All Vaults</span>
                    <span className="text-[11px] opacity-70">{total}</span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-1.5 rounded-md transition flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? 'bg-chocolate-900 text-gold-300 font-semibold'
                          : 'text-chocolate-700 hover:bg-ivory-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[11px] opacity-70">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Metal & Purity */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-2">
                  Precious Metal & Setting
                </label>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => setSelectedMetal('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-md transition ${
                      selectedMetal === 'all'
                        ? 'bg-chocolate-900 text-gold-300 font-semibold'
                        : 'text-chocolate-700 hover:bg-ivory-100'
                    }`}
                  >
                    All Metals
                  </button>
                  {metals.map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMetal(m)}
                      className={`w-full text-left px-3 py-1.5 rounded-md transition ${
                        selectedMetal === m
                          ? 'bg-chocolate-900 text-gold-300 font-semibold'
                          : 'text-chocolate-700 hover:bg-ivory-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-2">
                  Price Range (INR ₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                  />
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="pt-2 border-t border-ivory-200">
                <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-chocolate-800">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-gold-700 border-ivory-300 rounded focus:ring-gold-500"
                  />
                  <span className="font-medium">In-Stock Only (Vault Ready)</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-ivory-300 animate-pulse space-y-4">
                    <div className="aspect-square bg-ivory-200 rounded-lg" />
                    <div className="h-4 bg-ivory-200 rounded w-3/4" />
                    <div className="h-4 bg-ivory-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-ivory-300 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-ivory-200 mx-auto flex items-center justify-center text-chocolate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-chocolate-900">
                  No jewellery masterpieces match your selection
                </h3>
                <p className="text-xs sm:text-sm text-chocolate-600 max-w-md mx-auto">
                  Try adjusting your price range, metal settings, or clearing active filters to browse our full royal collection.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-6 ${
                    gridCols === 2
                      ? 'grid-cols-1 sm:grid-cols-2'
                      : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  }`}
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-ivory-300 rounded-lg text-xs font-semibold text-chocolate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ivory-200 transition"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 rounded-lg text-xs font-semibold transition ${
                          currentPage === i + 1
                            ? 'bg-chocolate-900 text-gold-300 shadow-sm'
                            : 'bg-white text-chocolate-700 border border-ivory-300 hover:bg-ivory-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-ivory-300 rounded-lg text-xs font-semibold text-chocolate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ivory-200 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                <h3 className="font-serif text-xl font-bold text-chocolate-900">
                  Refine Collection
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-chocolate-600 hover:text-gold-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category options */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-2">
                  Categories
                </label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => { setSelectedCategory('all'); setIsMobileFilterOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-md ${selectedCategory === 'all' ? 'bg-chocolate-900 text-gold-300' : 'text-chocolate-800'}`}
                  >
                    All Vaults
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => { setSelectedCategory(c.slug); setIsMobileFilterOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-md ${selectedCategory === c.slug ? 'bg-chocolate-900 text-gold-300' : 'text-chocolate-800'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Metals */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-2">
                  Metal Settings
                </label>
                <div className="space-y-1 text-xs">
                  {metals.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setSelectedMetal(m); setIsMobileFilterOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-md ${selectedMetal === m ? 'bg-chocolate-900 text-gold-300' : 'text-chocolate-800'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-2">
                  Price (₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-ivory-200 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-chocolate-900 text-gold-300 rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Apply Filters
              </button>
              <button
                onClick={() => { handleResetFilters(); setIsMobileFilterOpen(false); }}
                className="w-full py-2 border border-chocolate-800 text-chocolate-900 rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default ShopPage;
