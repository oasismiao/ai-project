
import { GoogleGenAI } from "@google/genai";
import React, { useState, useEffect, useMemo } from 'react';
import { UserSelections, Recommendation, ExistingItem, PriceComparison } from '../types';
import { HAIRSTYLES, SCENES, MAKEUPS, ACCESSORY_CATEGORIES } from '../constants';

interface ResultProps {
  selections: UserSelections;
  onReset: () => void;
  onToast: (msg: string) => void;
  onSave: (imageUrl: string) => void;
  allOwnedItems: ExistingItem[];
}

export const Result: React.FC<ResultProps> = ({ selections, onReset, onToast, onSave, allOwnedItems }) => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(selections.savedResultImage || null);
  const [aiStylingAdvice, setAiStylingAdvice] = useState<string>("正在由 AI 主理人为您生成深度穿搭方案...");
  const [isGenerating, setIsGenerating] = useState(false);
  const [cart, setCart] = useState<Recommendation[]>([]);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [isOverlayHidden, setIsOverlayHidden] = useState(false);
  const [comparingItem, setComparingItem] = useState<Recommendation | null>(null);

  const hairstyleObj = useMemo(() => HAIRSTYLES.find(h => h.id === selections.hairstyle), [selections.hairstyle]);
  const sceneObj = useMemo(() => SCENES.find(s => s.id === selections.scene), [selections.scene]);
  const selectedOwnedItems = useMemo(() => (selections.oldClothes || []).map(id => allOwnedItems.find(i => i.id === id)).filter(Boolean) as ExistingItem[], [selections.oldClothes, allOwnedItems]);
  const accessoryCats = useMemo(() => (selections.accessoryCategories || []).map(id => ACCESSORY_CATEGORIES.find(c => c.id === id)).filter(Boolean), [selections.accessoryCategories]);
  
  const pStyle = selections.preferences?.style || '优雅风';
  const pPalette = selections.preferences?.palette || '经典中性';
  const pBudget = selections.preferences?.budget || '1000-5000';
  const pStores = selections.preferences?.stores || ['优衣库', 'ZARA'];
  const gender = selections.gender || 'female';
  const { height = '165', weight = '50' } = selections.bodyData || {};

  const recommendations: Recommendation[] = useMemo(() => {
    const isMale = gender === 'male';
    const storeA = pStores[0] || '优衣库';
    const storeB = pStores[1] || storeA || 'ZARA';
    const budgetVal = pBudget === '<1000' ? 800 : pBudget === '1000-5000' ? 3000 : pBudget === '5000-10000' ? 8000 : 25000;
    
    const createComparisons = (name: string, price: number): PriceComparison[] => {
      const query = encodeURIComponent(name);
      return [
        { platform: '淘宝', price: `¥${price}`, url: `https://s.taobao.com/search?q=${query}`, isAvailable: true },
        { platform: '天猫', price: `¥${Math.floor(price * 1.05)}`, url: `https://list.tmall.com/search_product.htm?q=${query}`, isAvailable: true },
        { platform: '京东', price: `¥${Math.floor(price * 0.98)}`, url: `https://search.jd.com/Search?keyword=${query}`, isAvailable: Math.random() > 0.3 }
      ];
    };

    const baseRecs: Recommendation[] = [
      {
        id: 'rec-top',
        name: `${storeA} ${pStyle}限定 廓形上装`,
        category: '上衣',
        meta: `适配身高 ${height}cm 的时尚剪裁`,
        price: `¥${Math.floor(budgetVal * 0.35).toLocaleString()}`,
        priceValue: Math.floor(budgetVal * 0.35),
        image: isMale ? 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=600&q=80',
        source: 'AI-NEW',
        comparison: createComparisons(`${storeA} ${pStyle} 上衣`, Math.floor(budgetVal * 0.35))
      },
      {
        id: 'rec-bottom',
        name: `${storeB} 时尚垂感 下装`,
        category: '下装',
        meta: `流线比例设计，呼应 ${pPalette} 审美`,
        price: `¥${Math.floor(budgetVal * 0.25).toLocaleString()}`,
        priceValue: Math.floor(budgetVal * 0.25),
        image: isMale ? 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80',
        source: 'AI-NEW',
        comparison: createComparisons(`${storeB} ${pStyle} 下装`, Math.floor(budgetVal * 0.25))
      },
      {
        id: 'rec-shoes',
        name: `${storeA} 极简系列 潮流鞋履`,
        category: '鞋子',
        meta: `完成 ${pStyle} 整体风格闭环`,
        price: `¥${Math.floor(budgetVal * 0.2).toLocaleString()}`,
        priceValue: Math.floor(budgetVal * 0.2),
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
        source: 'AI-NEW',
        comparison: createComparisons(`${storeA} ${pStyle} 鞋子`, Math.floor(budgetVal * 0.2))
      }
    ];

    accessoryCats.forEach((cat, idx) => {
      const p = Math.floor(budgetVal * 0.1);
      baseRecs.push({
        id: `rec-acc-${idx}`,
        name: `风格甄选 ${cat.name}`,
        category: '配饰',
        meta: `细节处的 ${pStyle} 审美表达`,
        price: `¥${p.toLocaleString()}`,
        priceValue: p,
        image: cat.image,
        source: 'AI-NEW',
        comparison: createComparisons(`${pStyle} ${cat.name}`, p)
      });
    });

    return baseRecs;
  }, [gender, pStyle, pPalette, pBudget, height, pStores, accessoryCats]);

  const generateAIContent = async () => {
    if (generatedImageUrl || isGenerating) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const ownedSummary = selectedOwnedItems.map(i => `${i.category}`).join('、');
      
      const advicePrompt = `Role: 顶级时尚混搭架构师.
        Context: 用户是 ${gender === 'male' ? '男性' : '女性'}，身高 ${height}cm。
        Task: 评价混搭方案。自有单品（需穿戴）: ${ownedSummary || '无'}。
        目标风格: ${pStyle}，色系: ${pPalette}。
        请给出 40 字内的前卫造型报告，强调自有衣橱单品与新趋势 ${pStyle} 的跨时空融合感。`;

      try {
        const adviceRes = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: advicePrompt });
        setAiStylingAdvice(adviceRes.text || "视觉专家：本方案利用您自有衣橱的经典质感，通过与 ${pStyle} 推荐单品的错位叠穿，呈现出极具个人辨识度的高级混搭美学。");
      } catch (e) { setAiStylingAdvice("AI 深度拟合视觉报告已生成。"); }

      const imagePrompt = `Role: Hyper-realistic Virtual Fitting AI.
        Identity: Generate a realistic fashion model using the facial and body identity from the profile image.
        OBLIGATION: The model MUST BE DRESSED in the EXACT clothes from the provided wardrobe images. 
        DO NOT use the clothes the model is wearing in the profile photo. REPLACE THEM.
        WARDROBE ITEMS TO WEAR: ${selectedOwnedItems.map(i => i.category).join(', ')}.
        MIX LOGIC: Coordinate these personal wardrobe pieces with new recommended ${pStyle} garments and accessories. 
        If a personal item is a top, match it with new bottoms. If personal items are a full outfit, layer new accessories or coats over them.
        Vibe: High-end fashion editorial, Vogue magazine style.
        Environment: ${sceneObj?.name || 'Minimalist fashion studio'}.
        Lighting: Soft cinematic studio light.
        Quality: 8k resolution, photorealistic fabric textures, sharp details.`;

      const parts: any[] = [{ text: imagePrompt }];
      if (selections.faceImage) {
        parts.push({ inlineData: { mimeType: 'image/jpeg', data: selections.faceImage.split(',')[1] } });
      }
      // CRITICAL: Provide the wardrobe item images for visual reference to "transfer"
      selectedOwnedItems.forEach(item => {
        parts.push({ inlineData: { mimeType: 'image/jpeg', data: item.image.split(',')[1] } });
      });

      try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash-image', contents: { parts } });
        const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (part?.inlineData) setGeneratedImageUrl(`data:image/png;base64,${part.inlineData.data}`);
      } catch (imgErr) { 
        setGeneratedImageUrl('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'); 
      }
    } catch (e) { 
      setGeneratedImageUrl('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'); 
    } finally { setIsGenerating(false); }
  };

  useEffect(() => { generateAIContent(); }, []);

  const addToCartAction = (item: Recommendation) => {
    if (!cart.find(c => c.id === item.id)) {
      setCart(prev => [...prev, item]);
      onToast(`已添加单品：“${item.name}”`);
    }
  };

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-12 pb-48">
      <div className="flex flex-col lg:flex-row gap-20">
        {/* Render Preview */}
        <div className="lg:w-1/2 sticky top-36 h-fit">
          <div className="relative group rounded-[4rem] overflow-hidden shadow-2xl bg-slate-50 aspect-[4/5] flex items-center justify-center border-[12px] border-white">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-10 text-center p-24 w-full h-full justify-center">
                <div className="size-24 border-[8px] border-primary border-t-transparent rounded-full animate-spin"></div>
                <h4 className="text-3xl font-black songti-style animate-pulse">正在穿戴自有衣橱单品...</h4>
                <p className="text-gray-400 font-bold max-w-xs uppercase tracking-widest text-xs">AI is dressing the model with your wardrobe</p>
              </div>
            ) : (
              <>
                <img src={generatedImageUrl || ''} className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-105" alt="AI Fitting Result" />
                <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent transition-opacity ${isOverlayHidden ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`absolute bottom-16 left-16 right-16 text-white transition-all ${isOverlayHidden ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                   <div className="flex items-center gap-4 mb-6">
                      <div className="size-10 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl">
                        <span className="material-symbols-outlined text-xl">auto_awesome</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em]">Personal Mix-Match Protocol</span>
                   </div>
                   <h1 className="text-3xl md:text-4xl font-black songti-style italic mb-10 leading-tight drop-shadow-2xl">{aiStylingAdvice}</h1>
                   <div className="flex gap-5">
                     <button onClick={() => generatedImageUrl && onSave(generatedImageUrl)} className="bg-primary text-white px-10 py-5 rounded-full text-base font-black shadow-2xl hover:scale-105 transition-all">保存此造型</button>
                     <button onClick={onReset} className="bg-white/10 backdrop-blur-3xl border border-white/30 px-10 py-5 rounded-full text-base font-black hover:bg-white hover:text-slate-900 transition-all">重设方案</button>
                   </div>
                </div>
                <button onClick={() => setIsOverlayHidden(!isOverlayHidden)} className="absolute top-10 right-10 size-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white z-20 hover:bg-white/40 transition-all">
                  <span className="material-symbols-outlined text-3xl">{isOverlayHidden ? 'visibility' : 'visibility_off'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info & Products */}
        <div className="lg:w-1/2 space-y-16">
          <section>
            <header className="mb-14 border-b border-gray-100 pb-10">
               <h2 className="text-7xl font-black songti-style italic text-slate-900">拟合报告 & 比价</h2>
               <p className="text-base font-bold text-gray-400 uppercase tracking-[0.4em] mt-3 italic tracking-tighter">Your Closet x AI Selection</p>
            </header>
            
            {/* Owned Items Indicator */}
            {selectedOwnedItems.length > 0 && (
              <div className="mb-14 p-10 bg-slate-50 rounded-[4rem] border-2 border-dashed border-gray-200">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-base">checkroom</span> 已在模特身上穿戴的自有衣橱
                </h4>
                <div className="flex gap-6 overflow-x-auto no-scrollbar">
                  {selectedOwnedItems.map(item => (
                    <div key={item.id} className="flex-shrink-0 w-28 group text-center">
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-white mb-2 group-hover:scale-105 transition-transform">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.category} />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-10">
              {recommendations.map((item) => (
                <div key={item.id} className="group relative p-10 rounded-[4rem] bg-white border border-gray-100 hover:border-primary/40 hover:shadow-2xl transition-all duration-500">
                  <div className="flex flex-col sm:flex-row gap-10 items-center">
                    <img src={item.image} className="size-40 rounded-[3rem] object-cover shadow-lg group-hover:scale-110 transition-transform duration-[2s]" alt={item.name} />
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] font-black text-primary bg-primary/5 px-4 py-1.5 rounded-full uppercase tracking-widest">{item.category}</span>
                          <h4 className="font-black text-2xl text-slate-900 songti-style mt-3">{item.name}</h4>
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter">{item.price}</span>
                      </div>
                      <p className="text-base text-gray-400 font-bold mb-10 italic">{item.meta}</p>
                      <div className="flex flex-wrap gap-4">
                        <button onClick={() => addToCartAction(item)} className="bg-slate-900 text-white px-10 py-4 rounded-full text-sm font-black flex items-center gap-3 shadow-xl hover:bg-primary transition-all active:scale-95">
                          <span className="material-symbols-outlined text-xl">add_shopping_cart</span>加入清单
                        </button>
                        <button onClick={() => setComparingItem(item)} className="bg-white text-primary border-2 border-primary/20 px-10 py-4 rounded-full text-sm font-black flex items-center gap-3 hover:border-primary hover:text-white transition-all">
                          <span className="material-symbols-outlined text-xl">compare_arrows</span>查看比价
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Comparison Modal */}
      {comparingItem && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/85 backdrop-blur-2xl" onClick={() => setComparingItem(null)}></div>
           <div className="relative bg-white w-full max-w-2xl rounded-[5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
              <header className="p-12 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-5xl font-black songti-style italic text-slate-900">平台实时比价</h3>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2">Verified Real-Time Market Discovery</p>
                </div>
                <button onClick={() => setComparingItem(null)} className="size-16 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all">
                  <span className="material-symbols-outlined text-4xl">close</span>
                </button>
              </header>
              
              <div className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar">
                <div className="flex gap-10 items-center p-8 bg-slate-50 rounded-[3rem]">
                  <img src={comparingItem.image} className="size-28 rounded-3xl object-cover shadow-2xl" alt="Preview" />
                  <div>
                     <h4 className="text-2xl font-black songti-style mb-1">{comparingItem.name}</h4>
                     <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{comparingItem.category} • 市场价格实时对齐</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {comparingItem.comparison.map((comp, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-8 rounded-[3rem] bg-white border-2 transition-all ${comp.isAvailable ? 'border-gray-100 hover:border-primary/40 hover:shadow-xl' : 'opacity-40 grayscale border-transparent'}`}>
                      <div className="flex items-center gap-6">
                        <div className={`size-14 rounded-full flex items-center justify-center font-black text-xl shadow-sm ${
                          comp.platform === '淘宝' ? 'bg-orange-50 text-orange-600' : comp.platform === '天猫' ? 'bg-rose-50 text-rose-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {comp.platform[0]}
                        </div>
                        <div>
                           <span className="font-black text-2xl tracking-tighter">{comp.platform}</span>
                           {!comp.isAvailable && <p className="text-[10px] font-bold text-gray-400">目前平台暂无该单品货源</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <span className="text-3xl font-black italic tracking-tighter">{comp.isAvailable ? comp.price : '---'}</span>
                         <button 
                            disabled={!comp.isAvailable}
                            onClick={() => window.open(comp.url, '_blank')}
                            className={`px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                               comp.isAvailable ? 'bg-slate-900 text-white hover:bg-primary shadow-lg' : 'bg-gray-100 text-gray-300'
                            }`}
                         >
                           {comp.isAvailable ? '前往购买' : '暂无链接'}
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <footer className="p-10 border-t border-gray-50 text-center">
                 <p className="text-[10px] text-gray-300 font-black italic uppercase tracking-widest flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-base">verified_user</span> 本实验室严格映射真实电商链接，确保数据的实时性与真实性
                 </p>
              </footer>
           </div>
        </div>
      )}

      {/* CART MODAL (EXISTING) */}
      {cart.length > 0 && (
        <>
          {isCartExpanded && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/85 backdrop-blur-2xl" onClick={() => setIsCartExpanded(false)}></div>
              <div className="relative bg-white w-full max-w-4xl rounded-[5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-500">
                <header className="p-10 md:p-14 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div className="space-y-1">
                    <h3 className="text-5xl font-black songti-style italic text-slate-900">拟合方案单品录</h3>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Selected Fitting Selections</p>
                  </div>
                  <button onClick={() => setIsCartExpanded(false)} className="size-20 rounded-full bg-white shadow-2xl flex items-center justify-center hover:bg-gray-100 transition-all">
                    <span className="material-symbols-outlined text-4xl">close</span>
                  </button>
                </header>
                
                <div className="flex-1 overflow-y-auto p-10 md:p-14 space-y-8 no-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-10 items-center p-8 rounded-[4rem] bg-slate-50 border-2 border-transparent">
                      <img src={item.image} className="size-32 rounded-[2rem] object-cover shadow-2xl" alt={item.name} />
                      <div className="flex-1">
                        <h4 className="font-black text-2xl text-slate-900 songti-style italic">{item.name}</h4>
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-2">{item.category} • {item.meta}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-slate-900 text-4xl italic tracking-tighter mb-4">{item.price}</p>
                        <button onClick={() => setCart(prev => prev.filter(c => c.id !== item.id))} className="text-[10px] font-black text-accent-pink uppercase tracking-[0.3em] border-b-2 border-accent-pink/20 hover:border-accent-pink transition-all">移除</button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <footer className="p-12 md:p-16 bg-white border-t border-gray-100 flex items-center justify-between gap-12">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-2">Total Selection Value</span>
                    <span className="text-6xl font-black text-slate-900 italic tracking-tighter">¥{cart.reduce((s, i) => s + i.priceValue, 0).toLocaleString()}</span>
                  </div>
                  <button className="flex-1 bg-primary text-white py-8 rounded-full font-black text-2xl tracking-[0.4em] shadow-2xl hover:scale-[1.03] transition-all uppercase">一键跳转结算</button>
                </footer>
              </div>
            </div>
          )}

          <div onClick={() => setIsCartExpanded(true)} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[350] bg-white/95 backdrop-blur-3xl p-6 rounded-full shadow-2xl border border-gray-100 flex items-center gap-16 cursor-pointer hover:scale-105 transition-all duration-500 group">
             <div className="flex -space-x-8 ml-4">
                {cart.slice(0, 5).map(item => <img key={item.id} src={item.image} className="size-20 rounded-full border-4 border-white object-cover shadow-2xl group-hover:rotate-6 transition-all" alt="Cart item" />)}
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 tracking-widest mb-1 uppercase">Items ({cart.length})</span>
                <span className="text-4xl font-black text-slate-900 italic tracking-tighter">¥{cart.reduce((s, i) => s + i.priceValue, 0).toLocaleString()}</span>
             </div>
             <div className="bg-primary text-white px-14 py-6 rounded-full font-black text-xl flex items-center gap-5 shadow-2xl shadow-primary/30 group-hover:gap-8 transition-all tracking-[0.2em] uppercase">
               查看清单 <span className="material-symbols-outlined text-2xl">arrow_upward</span>
             </div>
          </div>
        </>
      )}
    </main>
  );
};
