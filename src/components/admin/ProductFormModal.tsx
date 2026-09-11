import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Save, Plus, Trash2, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit
}) => {
  const { categories, addProduct, updateProduct, showToast } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Cooling Fans');
  const [price, setPrice] = useState(2500);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState(20);
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [features, setFeatures] = useState<string[]>(['Ultra-low latency', 'High durability']);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setDiscountPrice(productToEdit.discountPrice);
      setStock(productToEdit.stock);
      setFeatured(productToEdit.featured || false);
      setDescription(productToEdit.description);
      setImageUrl(productToEdit.images[0] || '');
      setFeatures(productToEdit.features || []);
    } else {
      setName('');
      setCategory(categories[0]?.name || 'Cooling Fans');
      setPrice(2500);
      setDiscountPrice(undefined);
      setStock(20);
      setFeatured(false);
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&auto=format&fit=crop&q=80');
      setFeatures(['High durability', 'Designed for mobile esports']);
    }
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const catObj = categories.find((c) => c.name === category);
    const categorySlug = catObj ? catObj.slug : category.toLowerCase().replace(/\s+/g, '-');

    if (productToEdit) {
      updateProduct({
        ...productToEdit,
        name: name.trim(),
        category,
        categorySlug,
        price,
        discountPrice: discountPrice && discountPrice < price ? discountPrice : undefined,
        stock,
        featured,
        description: description.trim(),
        images: [imageUrl || productToEdit.images[0]],
        features
      });
      showToast('Product updated successfully!');
    } else {
      addProduct({
        name: name.trim(),
        category,
        categorySlug,
        price,
        discountPrice: discountPrice && discountPrice < price ? discountPrice : undefined,
        rating: 5.0,
        reviewCount: 0,
        images: [
          imageUrl ||
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&auto=format&fit=crop&q=80'
        ],
        description: description.trim(),
        features,
        stock,
        compatibility: ['Android', 'iOS'],
        featured,
        createdAt: new Date().toISOString()
      });
      showToast('New product added to catalog!');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md">
      <div
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c101a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="font-heading font-bold text-white text-base">
            {productToEdit ? 'Edit Catalog Product' : 'Add New Hardware Product'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="CryoFrost RGB Mobile Radiator"
              className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#090b10]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Stock Inventory</label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Retail Price (PKR)</label>
              <input
                type="number"
                min={100}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">
                Discount Price (PKR, Optional)
              </label>
              <input
                type="number"
                min={0}
                value={discountPrice || ''}
                onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 1999"
                className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed specs and gaming advantages..."
              className="w-full rounded-xl border border-white/10 bg-[#090b10] p-3 text-white focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Key Highlights & Specs</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g. Peltier thermoelectric plate"
                className="flex-1 rounded-xl border border-white/10 bg-[#090b10] px-3 py-1.5 text-white"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="rounded-xl bg-white/10 px-3 py-1.5 font-bold text-white hover:bg-white/20"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {features.map((feat, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-300"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-500 hover:text-rose-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="sgm-prod-featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-emerald-500 rounded"
            />
            <label htmlFor="sgm-prod-featured" className="text-slate-300 font-medium">
              Mark as Featured Product (Displayed in Top Carousel)
            </label>
          </div>

          <div className="pt-4 border-t border-white/10 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-2.5 font-semibold text-slate-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 font-bold text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
            >
              <Save className="h-4 w-4" />
              <span>{productToEdit ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
