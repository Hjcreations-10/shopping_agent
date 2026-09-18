import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  ShoppingBag,
  Shirt,
  Heart,
  Home,
  Cpu,
  CheckCircle2,
  Sliders,
  IndianRupee,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'groceries':
        return ShoppingBag;
      case 'clothing':
        return Shirt;
      case 'personal_care':
        return Heart;
      case 'household':
        return Home;
      case 'electronics':
        return Cpu;
      default:
        return FolderTree;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Shopping Category Configuration</h1>
        <p className="text-sm text-stone-600 mt-0.5">
          Configure budget pills, flow steps, questionnaire constraints, and product allocations per category.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => {
          const Icon = getCategoryIcon(cat.id);
          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900">{cat.name}</h3>
                    <p className="text-xs text-stone-500">{cat.description}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {cat.productCount} SKUs
                </span>
              </div>

              {/* Budget Configuration */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    Default Target Budget:
                  </span>
                  <span className="font-bold text-stone-900">₹{cat.defaultBudget?.toLocaleString()}</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase text-stone-600 block mb-1">
                    Quick Budget Pills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(cat.budgetPills || []).map((pill: number) => (
                      <span
                        key={pill}
                        className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-semibold border border-stone-200"
                      >
                        ₹{pill.toLocaleString()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Multi-step Question Sequence */}
              <div className="pt-3 border-t border-stone-100 space-y-1.5">
                <span className="text-[11px] font-semibold uppercase text-stone-600 block">
                  Interactive Flow Steps:
                </span>
                <div className="space-y-1">
                  {(cat.flowSteps || []).map((step: string, idx: number) => (
                    <div key={step} className="flex items-center gap-2 text-xs text-stone-600">
                      <span className="w-4 h-4 rounded-full bg-stone-100 text-stone-600 font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
