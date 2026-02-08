
import React, { useState, useRef, useMemo } from 'react';
import { ExistingItem, Page } from '../types';

interface WardrobeProps {
  items: ExistingItem[];
  onAddItem: (item: ExistingItem) => void;
  onDeleteItem: (id: string) => void;
  onPageChange: (page: Page) => void;
}

const CATEGORIES: ('上衣' | '下装' | '鞋子' | '配饰')[] = ['上衣', '下装', '鞋子', '配饰'];

export const Wardrobe: React.FC<WardrobeProps> = ({ items, onAddItem, onDeleteItem, onPageChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemCategory, setNewItemCategory] = useState<'上衣' | '下装' | '鞋子' | '配饰'>('上衣');
  const [newItemImage, setNewItemImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'全部' | '上衣' | '下装' | '鞋子' | '配饰'>('全部');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    if (activeTab === '全部') return items;
    return items.filter(item => item.category === activeTab);
  }, [items, activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewItemImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (newItemImage) {
      onAddItem({
        id: `item-${Date.now()}`,
        name: newItemCategory, // Use category as name since user doesn't want to type
        category: newItemCategory,
        image: newItemImage,
        description: '自有衣物'
      });
      setNewItemImage(null);
      setIsAdding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pb-48">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-10 mt-16">
        <div className="space-y-4">
          <h1 className="songti-style text-7xl font-black tracking-tighter text-slate-900 italic">我的衣橱</h1>
          <p className="text-slate-400 font-bold tracking-[0.4em] uppercase text-sm">Digital Wardrobe Archive</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAdding(true)}
            className="px-8 py-5 border-2 border-primary text-primary rounded-full text-lg font-black tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-4"
          >
            <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
            录入单品
          </button>
          <button 
            onClick={() => onPageChange('lab')}
            className="px-10 py-5 bg-primary text-white rounded-full text-lg font-black tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-4"
          >
            <span>开始数字试衣</span>
            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </button>
        </div>
      </header>

      <div className="flex gap-4 mb-12 border-b border-gray-100 pb-4 overflow-x-auto no-scrollbar">
        {['全部', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat as any)}
            className={`px-8 py-3 rounded-full text-base font-black transition-all whitespace-nowrap ${
              activeTab === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-32 border-4 border-dashed border-gray-100 rounded-[4rem] flex flex-col items-center justify-center text-gray-300">
             <span className="material-symbols-outlined text-6xl mb-4">inventory</span>
             <p className="text-xl font-bold">暂无该分类单品</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="group relative">
              <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-gray-50 shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-slate-50">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">{item.category}</span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button onClick={() => onDeleteItem(item.id)} className="bg-accent-pink text-white size-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
                      <span className="material-symbols-outlined">delete</span>
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[4rem] p-12 shadow-2xl space-y-8 animate-fade-in-up">
            <h3 className="text-4xl font-black songti-style text-center">录入单品</h3>
            
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input type="file" title="Upload item image" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <div className="aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden hover:bg-primary/5 transition-all">
                {newItemImage ? (
                  <img src={newItemImage} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-5xl text-gray-200 mb-2">photo_camera</span>
                    <p className="text-gray-400 font-bold">点击上传单品照</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">单品类别</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNewItemCategory(cat)}
                    className={`py-3 rounded-xl border-2 text-sm font-black transition-all ${
                      newItemCategory === cat ? 'border-primary bg-primary text-white' : 'border-gray-100 text-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-5 bg-gray-100 rounded-full font-bold text-gray-600">取消</button>
              <button onClick={handleSave} className="flex-1 py-5 bg-primary text-white rounded-full font-black shadow-lg disabled:opacity-50" disabled={!newItemImage}>
                存入衣橱
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
