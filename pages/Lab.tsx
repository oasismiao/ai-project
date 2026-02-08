
import React, { useState, useMemo } from 'react';
import { LabStep, UserSelections, StyleOption, AccessoryCategory, Page, ExistingItem } from '../types';
import { STEPS, HAIRSTYLES, MAKEUPS, SCENES, ACCESSORY_CATEGORIES } from '../constants';

interface LabProps {
  onComplete: (selections: UserSelections) => void;
  onPageChange: (page: Page) => void;
  ownedItems: ExistingItem[];
}

export const Lab: React.FC<LabProps> = ({ onComplete, onPageChange, ownedItems }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<UserSelections>({ accessoryCategories: [], oldClothes: [] });
  const [activeFilter, setActiveFilter] = useState('全部');

  const currentStep = STEPS[currentStepIndex];

  const optionsMap: Record<string, StyleOption[]> = {
    [LabStep.HAIRSTYLE]: HAIRSTYLES,
    [LabStep.MAKEUP]: MAKEUPS,
    [LabStep.SCENE]: SCENES,
  };

  const currentOptions = optionsMap[currentStep as string] || [];

  const filters = useMemo(() => {
    if (currentStep === LabStep.ACCESSORIES || currentStep === LabStep.WARDROBE) return ['全部'];
    const subs = Array.from(new Set(currentOptions.map(o => o.subCategory).filter(Boolean)));
    return ['全部', ...subs];
  }, [currentStep, currentOptions]);

  const filteredOptions = useMemo(() => {
    if (activeFilter === '全部') return currentOptions;
    return currentOptions.filter(o => o.subCategory === activeFilter);
  }, [currentOptions, activeFilter]);

  const handleSelect = (optionId: string) => {
    const keyMap: Record<string, keyof UserSelections> = {
      [LabStep.HAIRSTYLE]: 'hairstyle',
      [LabStep.MAKEUP]: 'makeup',
      [LabStep.SCENE]: 'scene',
    };
    if (keyMap[currentStep]) {
      setSelections(prev => ({ ...prev, [keyMap[currentStep]]: optionId }));
    }
  };

  const handleCategoryToggle = (id: string) => {
    setSelections(prev => {
        const categories = prev.accessoryCategories || [];
        if (categories.includes(id)) {
            return { ...prev, accessoryCategories: categories.filter(c => c !== id) };
        }
        return { ...prev, accessoryCategories: [...categories, id].slice(-3) };
    });
  };

  const toggleOldClothes = (id: string) => {
    setSelections(prev => {
      const existing = prev.oldClothes || [];
      if (existing.includes(id)) return { ...prev, oldClothes: existing.filter(c => c !== id) };
      // Allow selecting up to 4 items for a full AI look (Top, Bottom, Shoes, Acc)
      return { ...prev, oldClothes: [...existing, id].slice(-4) }; 
    });
  };

  const currentSelectionId = selections[{
    [LabStep.HAIRSTYLE]: 'hairstyle',
    [LabStep.MAKEUP]: 'makeup',
    [LabStep.SCENE]: 'scene',
  }[currentStep] as keyof UserSelections];

  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setActiveFilter('全部');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(selections);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setActiveFilter('全部');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-4 md:px-20 lg:px-40 flex flex-col items-center">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full">
        
        <div className="flex flex-wrap justify-between items-end gap-6 px-4 mb-12 mt-16">
          <div className="flex flex-col gap-3">
            <h1 className="text-black text-7xl font-black songti-style tracking-tighter">
              {currentStep === LabStep.SCENE ? '场景设定' : `${currentStep}定制`}
            </h1>
            <p className="text-gray-400 text-xl font-bold italic">构建您的数字试衣实验报告</p>
          </div>
          <button onClick={nextStep} className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-full h-16 px-10 bg-primary text-white text-xl font-black shadow-2xl hover:scale-105 transition-transform active:scale-95">
            <span>{currentStepIndex === STEPS.length - 1 ? '一键开启拟合' : '保存选择'}</span>
          </button>
        </div>

        <div className="px-4 mb-10">
          <div className="flex border-b border-gray-100 gap-16 overflow-x-auto no-scrollbar">
            {STEPS.map((step, index) => (
              <button
                key={step} onClick={() => setCurrentStepIndex(index)}
                className={`flex flex-col items-center justify-center border-b-4 pb-5 min-w-[100px] transition-all whitespace-nowrap ${
                  index === currentStepIndex ? 'border-primary text-primary' : index < currentStepIndex ? 'border-primary/20 text-primary/60' : 'border-transparent text-gray-300'
                }`}
              >
                <span className="material-symbols-outlined mb-2 text-3xl">
                  {step === LabStep.HAIRSTYLE ? 'content_cut' : 
                   step === LabStep.MAKEUP ? 'face_5' : 
                   step === LabStep.WARDROBE ? 'checkroom' : 
                   step === LabStep.ACCESSORIES ? 'diamond' : 'landscape'}
                </span>
                <p className="text-xs font-black uppercase tracking-[0.2em]">{step}</p>
              </button>
            ))}
          </div>
        </div>

        {currentStep === LabStep.WARDROBE ? (
          <div className="px-4 mb-48">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div>
                <h3 className="text-4xl font-black songti-style mb-2 italic text-slate-900">选择衣橱单品参与混搭</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">AI 将把这些单品穿在您的数字孪生模特身上</p>
              </div>
              <div className="flex items-center gap-4 bg-primary/5 px-6 py-3 rounded-full border border-primary/20">
                <span className="text-primary font-black text-sm">已选中 {selections.oldClothes?.length || 0} 件单品</span>
                <button onClick={() => setSelections(p => ({...p, oldClothes: []}))} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-accent-pink">清空</button>
              </div>
            </div>
            
            {ownedItems.length === 0 ? (
              <div className="py-32 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center text-center">
                 <span className="material-symbols-outlined text-6xl text-slate-300 mb-6">inventory_2</span>
                 <h4 className="text-2xl font-black text-slate-400 songti-style">您的衣橱空空如也</h4>
                 <button onClick={() => onPageChange('wardrobe')} className="mt-8 px-8 py-3 bg-primary text-white rounded-full font-black shadow-xl">去录入单品</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                {ownedItems.map(item => {
                  const isSelected = selections.oldClothes?.includes(item.id);
                  return (
                    <div key={item.id} onClick={() => toggleOldClothes(item.id)} className="group cursor-pointer">
                      <div className={`relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border-4 transition-all duration-500 ${isSelected ? 'border-primary ring-8 ring-primary/10 scale-[1.05] shadow-2xl' : 'border-white shadow-lg group-hover:border-gray-100'}`}>
                         <img src={item.image} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" alt={item.name} />
                         <div className="absolute top-4 left-4">
                           <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">{item.category}</span>
                         </div>
                         {isSelected && (
                           <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[2px]">
                             <span className="material-symbols-outlined text-white text-6xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">check_circle</span>
                           </div>
                         )}
                      </div>
                      <div className="mt-4 text-center">
                         <h4 className={`text-sm font-black uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-slate-400'}`}>{item.name || item.category}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : currentStep === LabStep.ACCESSORIES ? (
          <div className="p-4 mb-48">
            <h3 className="text-3xl font-black songti-style mb-12 text-slate-900 italic">配饰方案定制 (指定 1-3 项)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {ACCESSORY_CATEGORIES.map((cat) => {
                const isSelected = selections.accessoryCategories?.includes(cat.id);
                return (
                  <div key={cat.id} onClick={() => handleCategoryToggle(cat.id)} className="group cursor-pointer">
                    <div className={`relative aspect-square rounded-[3rem] overflow-hidden border-2 transition-all duration-700 ${isSelected ? 'border-primary ring-8 ring-primary/10 scale-[1.03] shadow-2xl' : 'border-gray-50 shadow-xl hover:border-primary/20'}`}>
                      <img src={cat.image} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-125" alt={cat.name} />
                      {isSelected && (
                         <div className="absolute top-6 right-6 size-10 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl">
                           <span className="material-symbols-outlined">check</span>
                         </div>
                      )}
                    </div>
                    <div className="mt-6 px-2 text-center">
                       <h4 className={`text-2xl font-black songti-style ${isSelected ? 'text-primary' : 'text-slate-800'}`}>{cat.name}</h4>
                       <p className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-widest">{cat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${currentStep === LabStep.SCENE ? 'lg:grid-cols-2' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-12 p-4 mb-48`}>
            {filteredOptions.map((option) => (
              <div key={option.id} onClick={() => handleSelect(option.id)} className="group flex flex-col gap-6 cursor-pointer">
                <div className={`relative w-full ${currentStep === LabStep.SCENE ? 'aspect-[16/10]' : 'aspect-[3/4]'} rounded-[3rem] overflow-hidden border-[1px] ${option.borderColor} ${currentSelectionId === option.id ? 'border-[8px] ring-12 ring-primary/10 shadow-2xl scale-[1.02]' : 'group-hover:border-4'} transition-all duration-700 bg-white shadow-xl`}>
                  <div className={`absolute inset-0 bg-center bg-cover transition-transform duration-[4s] ${currentSelectionId === option.id ? 'scale-110' : 'group-hover:scale-125'}`} style={{ backgroundImage: `url("${option.image}")` }}></div>
                  {currentSelectionId === option.id && (
                     <div className="absolute top-8 right-8 size-14 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl">
                       <span className="material-symbols-outlined text-4xl">verified</span>
                     </div>
                  )}
                </div>
                <div className="px-3">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`text-3xl font-black songti-style ${currentSelectionId === option.id ? 'text-primary' : 'text-slate-800'}`}>{option.name}</h3>
                    {option.tag && <span className="bg-accent-pink text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{option.tag}</span>}
                  </div>
                  <p className="text-gray-400 text-base font-bold leading-relaxed italic">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="fixed bottom-12 left-0 right-0 flex justify-center px-4 z-40">
          <div className="flex items-center gap-6 bg-white/90 backdrop-blur-3xl p-5 rounded-full border border-gray-100 shadow-[0_48px_80px_-16px_rgba(0,0,0,0.3)]">
            <button onClick={prevStep} className={`flex min-w-[160px] items-center justify-center rounded-full h-18 px-10 ${currentStepIndex === 0 ? 'opacity-30 bg-gray-50' : 'bg-slate-50 hover:bg-slate-100 hover:text-slate-900'} text-lg font-black transition-all text-slate-400`} disabled={currentStepIndex === 0}>
              上一步骤
            </button>
            <button onClick={nextStep} className="flex min-w-[320px] items-center justify-center rounded-full h-18 px-14 bg-primary text-white text-2xl font-black tracking-[0.2em] shadow-[0_32px_64px_-16px_rgba(91,19,236,0.4)] hover:scale-[1.03] transition-all uppercase">
              {currentStepIndex === STEPS.length - 1 ? '启动 AI 拟合渲染' : '保存并下一步'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
