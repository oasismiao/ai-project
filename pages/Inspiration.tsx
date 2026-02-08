
import React, { useState } from 'react';
import { LOOKBOOK_ITEMS } from '../constants';

export const Inspiration: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'merchant' | 'blogger'>('all');

  const filteredItems = LOOKBOOK_ITEMS.filter(item => 
    activeFilter === 'all' ? true : item.type === activeFilter
  );

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-16 pb-48">
      <header className="mb-20 text-center md:text-left mt-16">
        <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight songti-style italic text-slate-900">
          灵感<span className="text-primary">集</span>
        </h1>
        <p className="text-2xl text-gray-500 max-w-3xl font-light mb-12">
          同步全球顶尖买手店搭配与博主穿搭动态，为您提供拟合灵感。
        </p>
        
        <div className="flex gap-6 justify-center md:justify-start">
          {[
            { id: 'all', label: '全部灵感' },
            { id: 'merchant', label: '商家推荐' },
            { id: 'blogger', label: '博主精选' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-10 py-4 rounded-full text-lg font-black transition-all ${
                activeFilter === f.id ? 'bg-primary text-white shadow-2xl' : 'bg-white text-slate-400 border border-slate-100 hover:border-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="masonry-grid gap-12">
        {filteredItems.map(item => (
          <div key={item.id} className="masonry-item group cursor-pointer mb-12">
            <div className="relative rounded-[3rem] overflow-hidden bg-white shadow-xl border border-slate-50 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_64px_96px_-16px_rgba(0,0,0,0.2)]">
              <div className="aspect-[4/5] relative overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-115" />
                <div className="absolute top-8 left-8">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${
                    item.type === 'merchant' ? 'bg-accent-lime/80 text-black' : 'bg-primary/80 text-white'
                  }`}>
                    {item.type === 'merchant' ? 'OFFICIAL' : 'BLOGGER'}
                  </span>
                </div>
              </div>
              <div className="p-10 space-y-6">
                <div>
                  <h3 className="text-3xl font-black songti-style text-slate-900 mb-2 leading-tight">{item.title}</h3>
                  <p className="text-lg font-bold text-slate-400 italic">By {item.author}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-slate-50 text-slate-400 text-xs font-black rounded-full uppercase tracking-widest">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button className="w-full py-4 border-2 border-slate-100 rounded-full text-sm font-black tracking-[0.2em] uppercase hover:bg-primary hover:text-white hover:border-primary transition-all">
                  查看参考搭配
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
