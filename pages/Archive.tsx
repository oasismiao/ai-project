
import React from 'react';
import { Page, SavedOutfit } from '../types';

interface ArchiveProps {
  savedItems: SavedOutfit[];
  onItemClick: (item: SavedOutfit) => void;
  onPageChange: (page: Page) => void;
}

export const Archive: React.FC<ArchiveProps> = ({ savedItems, onItemClick, onPageChange }) => {
  return (
    <div className="flex-1 px-8 lg:px-20 max-w-7xl mx-auto w-full pb-48">
      <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-10 mt-16">
        <div className="space-y-4">
          <h1 className="songti-style text-7xl font-black tracking-tighter text-slate-900 italic">试衣记录</h1>
          <p className="text-slate-400 font-bold tracking-[0.4em] uppercase text-sm">Personal Fashion Asset Digitization</p>
        </div>
        <button 
          onClick={() => onPageChange('lab')}
          className="px-10 py-4 bg-primary text-white rounded-full text-base font-black tracking-widest hover:opacity-90 transition-all shadow-2xl flex items-center gap-3"
        >
          <span className="material-symbols-outlined text-base">add</span>
          新增试衣
        </button>
      </header>

      {savedItems.length === 0 ? (
        <div className="py-48 flex flex-col items-center justify-center text-center space-y-10">
           <div className="size-40 bg-slate-50 rounded-full flex items-center justify-center border-4 border-dashed border-slate-200">
              <span className="material-symbols-outlined text-6xl text-slate-200">inventory_2</span>
           </div>
           <h3 className="text-4xl font-black songti-style text-slate-800 italic">暂无试衣记录</h3>
        </div>
      ) : (
        <div className="masonry-grid">
          {savedItems.map((item) => (
            <div key={item.id} onClick={() => onItemClick(item)} className="masonry-item group cursor-pointer">
              <div className="relative overflow-hidden rounded-[3rem] bg-white p-8 shadow-xl border border-slate-50 hover:shadow-2xl transition-all duration-700 hover:-translate-y-3">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-8">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="songti-style text-2xl font-black text-slate-800">{item.title}</h4>
                    <p className="text-sm text-slate-400 mt-2">{item.timestamp}</p>
                  </div>
                  <span className="text-xs font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
