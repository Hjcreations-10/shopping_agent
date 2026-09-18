import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  IndianRupee,
  Star,
  RefreshCw,
  X,
  Sparkles,
  ShoppingBag,
  Shirt,
  Heart,
  Home,
  Cpu
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<ProductCategory>('groceries');
  const [formName, setFormName] = useState<string>('');
  const [formBrand, setFormBrand] = useState<string>('');
  const [formSubcategory, setFormSubcategory] = useState<string>('');
  const [formPrice, setFormPrice] = useState<number>(199);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(249);
  const [formUnit, setFormUnit] = useState<string>('1 kg');
  const [formImageUrl, setFormImageUrl] = useState<string>('https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formInStock, setFormInStock] = useState<boolean>(true);

  // Category-specific form state
  const [formDietary, setFormDietary] = useState<string>('vegetarian');
  const [formClothingSize, setFormClothingSize] = useState<string>('M');
  const [formClothingOccasion, setFormClothingOccasion] = useState<string>('presentation');
  const [formPcIngredients, setFormPcIngredients] = useState<string>('Salicylic Acid, Biotin');
  const [formElecWarranty, setFormElecWarranty] = useState<number>(12);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/products';
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleToggleStock = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !product.inStock })
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(products.map(p => (p.id === updated.id ? updated : p)));
      }
    } catch (err) {
      console.error('Failed to toggle stock:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product from the catalog?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: formName,
        brand: formBrand,
        category: formCategory,
        subcategory: formSubcategory || 'Essentials',
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice) || undefined,
        unit: formUnit,
        imageUrl: formImageUrl,
        description: formDescription,
        inStock: formInStock,
        verified: true,
        rating: 4.6,
        reviewCount: 120,
        tags: [formCategory, formBrand.toLowerCase()]
      };

      if (formCategory === 'groceries') {
        payload.dietaryTags = [formDietary];
        payload.isPerishable = false;
        payload.ingredients = ['Standard Ingredients'];
      } else if (formCategory === 'clothing') {
        payload.size = formClothingSize;
        payload.color = 'Neutral';
        payload.material = 'Cotton';
        payload.style = 'Casual / Semi-Formal';
        payload.occasion = [formClothingOccasion];
        payload.gender = 'unisex';
      } else if (formCategory === 'personal_care') {
        payload.activeIngredients = formPcIngredients.split(',').map(s => s.trim());
        payload.isCrueltyFree = true;
        payload.benefits = ['Gentle Formulation'];
      } else if (formCategory === 'household') {
        payload.packSize = 1;
        payload.ecoFriendly = true;
      } else if (formCategory === 'electronics') {
        payload.specifications = { Connectivity: 'Wireless / USB' };
        payload.warrantyMonths = Number(formElecWarranty) || 12;
        payload.features = ['Reliable Performance'];
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        resetForm();
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormBrand('');
    setFormSubcategory('');
    setFormPrice(199);
    setFormOriginalPrice(249);
    setFormUnit('1 kg');
    setFormDescription('');
    setFormInStock(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Verified Catalog Management</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Manage product inventory, update real prices, toggle stock availability, and configure category specs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['all', 'groceries', 'clothing', 'personal_care', 'household', 'electronics'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, brand, tag..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <span className="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading catalog items...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200 bg-stone-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-stone-900 text-xs line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-stone-500">
                            {p.brand} • <span className="text-stone-400">{p.unit}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                        {p.category.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-stone-900">
                      ₹{p.price.toLocaleString()}
                      {p.originalPrice && (
                        <span className="text-[10px] text-stone-400 line-through ml-1 font-normal">
                          ₹{p.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-semibold text-stone-800">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{p.rating}</span>
                        <span className="text-stone-400 text-[10px]">({p.reviewCount})</span>
                      </div>
                    </td>

                    {/* Stock Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStock(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          p.inStock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {p.inStock ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-red-600" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-stone-900">Add New Product to Catalog</h3>
                <p className="text-xs text-stone-500">Item will instantly be accessible to the AI Shopping Agent and optimizer.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="groceries">Groceries</option>
                    <option value="clothing">Clothing</option>
                    <option value="personal_care">Personal Care</option>
                    <option value="household">Household</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aashirvaad, Allen Solly, Logitech"
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                  />
                </div>

                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Full product display name"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold"
                  />
                </div>

                {/* Original Price (MRP) */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Original Price (MRP)</label>
                  <input
                    type="number"
                    min="1"
                    value={formOriginalPrice}
                    onChange={e => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                  />
                </div>

                {/* Unit / Pack Size */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Unit / Size</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 kg, 500 g, Size 40, 100 ml"
                    value={formUnit}
                    onChange={e => setFormUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                  />
                </div>

                {/* Subcategory */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Subcategory</label>
                  <input
                    type="text"
                    placeholder="e.g. Flours & Grains, Skincare, Audio"
                    value={formSubcategory}
                    onChange={e => setFormSubcategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                  />
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={e => setFormImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Product Description</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    placeholder="Key specifications, ingredients, or benefits"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
