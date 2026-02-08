
import React, { useState, useRef } from 'react';
import { BodyData, UserPreferences, CharacterProfile } from '../types';

interface ProfileProps {
  profiles: CharacterProfile[];
  onSave: (data: CharacterProfile) => void;
  onSelect: (profile: CharacterProfile) => void;
}

const DEFAULT_STORES = ['优衣库', 'ZARA', 'Nike', 'Adidas', 'Lululemon', '始祖鸟', 'Chanel', 'Gucci', 'Prada', 'Hermès', 'Dior', 'Louis Vuitton'];
const BUDGET_OPTIONS = [
  { label: '< ¥1,000', value: '<1000' },
  { label: '¥1,000 - ¥5,000', value: '1000-5000' },
  { label: '¥5,000 - ¥10,000', value: '5000-10000' },
  { label: '¥10,000+', value: '10000+' }
];

const STYLE_OPTIONS = [
  '新中式', '街头潮酷', '优雅风', '都市极简', '老钱风', '运动风', '静奢风', '美式复古',
  'Y2K辣妹', '山系机能', '废土风', '极简主义', '多巴胺风', '法式慵懒', '暗黑哥特', '美式学院',
  '赛博朋克', '森系仙女', '波西米亚', '中性男友风', '华丽摇滚', '重工刺绣'
];

const PALETTE_OPTIONS = [
  '经典中性', '大地色系', '黑白灰', '莫兰迪色', '马卡龙色', '多巴胺色', '霓虹赛博', '暗黑冷淡',
  '焦糖暖色', '森林绿系', '海洋蓝系', '金属银感', '复古红金', '薄荷清冷', '燕麦暖咖', '薰衣草紫'
];

export const Profile: React.FC<ProfileProps> = ({ profiles, onSave, onSelect }) => {
  const [activeGender, setActiveGender] = useState<'male' | 'female'>('female');
  const [activeStyle, setActiveStyle] = useState('优雅风');
  const [activePalette, setActivePalette] = useState('经典中性');
  const [activeBudget, setActiveBudget] = useState('1000-5000');
  const [selectedStores, setSelectedStores] = useState<string[]>(['优衣库', 'ZARA']);
  const [customStore, setCustomStore] = useState('');
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [profileName, setProfileName] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  
  const heightRef = useRef<HTMLInputElement>(null);
  const weightRef = useRef<HTMLInputElement>(null);
  const chestRef = useRef<HTMLInputElement>(null);
  const waistRef = useRef<HTMLInputElement>(null);
  const shoulderRef = useRef<HTMLInputElement>(null);
  const faceInputRef = useRef<HTMLInputElement>(null);

  const loadProfile = (p: CharacterProfile) => {
    setSelectedProfileId(p.id);
    setProfileName(p.name);
    setActiveGender(p.gender);
    setActiveStyle(p.preferences.style);
    setActivePalette(p.preferences.palette);
    setActiveBudget(p.preferences.budget);
    setSelectedStores(p.preferences.stores || ['优衣库', 'ZARA']);
    setFaceImage(p.faceImage);
    if (heightRef.current) heightRef.current.value = p.bodyData.height;
    if (weightRef.current) weightRef.current.value = p.bodyData.weight;
    if (chestRef.current) chestRef.current.value = p.bodyData.chest || '';
    if (waistRef.current) waistRef.current.value = p.bodyData.waist || '';
    if (shoulderRef.current) shoulderRef.current.value = p.bodyData.shoulder || '';
    onSelect(p);
  };

  const handleFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFaceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setFaceImage(null);
    setProfileName('');
    setSelectedProfileId(null);
    setActiveGender('female');
    setActiveStyle('优雅风');
    setActivePalette('经典中性');
    setActiveBudget('1000-5000');
    setSelectedStores(['优衣库', 'ZARA']);
    if (heightRef.current) heightRef.current.value = '';
    if (weightRef.current) weightRef.current.value = '';
    if (chestRef.current) chestRef.current.value = '';
    if (waistRef.current) waistRef.current.value = '';
    if (shoulderRef.current) shoulderRef.current.value = '';
  };

  const toggleStore = (store: string) => {
    setSelectedStores(prev => 
      prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store]
    );
  };

  const addCustomStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStore && !selectedStores.includes(customStore)) {
      setSelectedStores(prev => [...prev, customStore]);
      setCustomStore('');
    }
  };

  const handleSaveAll = () => {
    const bodyData: BodyData = {
      height: heightRef.current?.value || '165',
      weight: weightRef.current?.value || '50',
      chest: chestRef.current?.value,
      waist: waistRef.current?.value,
      shoulder: shoulderRef.current?.value,
    };

    const preferences: UserPreferences = {
      style: activeStyle,
      palette: activePalette,
      budget: activeBudget,
      stores: selectedStores,
    };

    const newProfile: CharacterProfile = {
      id: selectedProfileId || `profile-${Date.now()}`,
      name: profileName || (activeGender === 'female' ? '时尚女神' : '型格绅士'),
      gender: activeGender,
      faceImage,
      bodyData,
      preferences,
      timestamp: new Date().toLocaleString(),
    };

    onSave(newProfile);
  };

  return (
    <main className="max-w-7xl mx-auto w-full px-6 py-12">
      <section className="mb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black songti-style">已存档案人物</h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Archived Fashion Personas</p>
          </div>
          <button onClick={handleReset} className="text-primary text-base font-bold flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined text-xl">add_circle</span>
            创建新档案
          </button>
        </div>
        
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
          {profiles.length === 0 ? (
            <div className="w-full py-12 rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300">
              <span className="material-symbols-outlined text-5xl mb-2">person_add</span>
              <p className="text-base font-bold">暂无档案，请在下方创建</p>
            </div>
          ) : (
            profiles.map((p) => (
              <div key={p.id} onClick={() => loadProfile(p)} className={`flex-shrink-0 w-52 group cursor-pointer transition-all ${selectedProfileId === p.id ? 'scale-105' : ''}`}>
                <div className={`aspect-[3/4] rounded-[2rem] overflow-hidden border-4 mb-3 transition-all ${selectedProfileId === p.id ? 'border-primary ring-4 ring-primary/10 shadow-xl' : 'border-white shadow-md'}`}>
                  {p.faceImage ? (
                    <img src={p.faceImage} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-gray-200">person</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h4 className={`font-black text-base songti-style ${selectedProfileId === p.id ? 'text-primary' : 'text-slate-800'}`}>{p.name}</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{p.preferences.style} • {p.bodyData.height}cm</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="mb-16 text-center md:text-left">
        <h1 className="text-6xl md:text-8xl font-black mb-4 leading-tight songti-style italic text-slate-900">
          虚拟<span className="text-primary">试衣间</span> — <span className="text-primary/60">{selectedProfileId ? '档案修改' : '档案构建'}</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 max-w-3xl font-light">
          重建您的数字孪生。录入个性化数据、审美偏好及预算范围。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-bold bg-slate-800 text-white px-3 py-1 rounded uppercase tracking-widest">Name</span>
              <h2 className="text-3xl font-bold songti-style">档案命名</h2>
            </div>
            <input 
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-primary transition-colors text-2xl font-bold py-2 placeholder:text-gray-200" 
              placeholder="例如：周中职场风 / 运动周末..."
            />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-bold bg-primary text-white px-3 py-1 rounded uppercase tracking-widest">Step 00</span>
              <h2 className="text-3xl font-bold songti-style">性别</h2>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setActiveGender('female')} className={`flex-1 h-20 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${activeGender === 'female' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400'}`}>
                <span className="material-symbols-outlined text-2xl">female</span>
                <span className="font-black text-base">女士</span>
              </button>
              <button onClick={() => setActiveGender('male')} className={`flex-1 h-20 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${activeGender === 'male' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400'}`}>
                <span className="material-symbols-outlined text-2xl">male</span>
                <span className="font-black text-base">男士</span>
              </button>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-bold bg-accent-pink text-white px-3 py-1 rounded uppercase tracking-widest">Step 01</span>
              <h2 className="text-3xl font-bold songti-style">面部建模</h2>
            </div>
            <div className="relative cursor-pointer" onClick={() => faceInputRef.current?.click()}>
              <input type="file" ref={faceInputRef} className="hidden" accept="image/*" onChange={handleFaceUpload} />
              <div className="h-[360px] w-full bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden hover:bg-primary/5 hover:border-primary transition-all shadow-sm">
                {faceImage ? (
                  <img src={faceImage} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-8">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">face_6</span>
                    <p className="text-base font-bold text-gray-400">点击上传面部特征图</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-7 space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-bold bg-accent-lime text-black px-3 py-1 rounded uppercase tracking-widest">Step 02</span>
              <h2 className="text-3xl font-bold songti-style">个性化</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
              {[
                { label: '身高 (cm)', placeholder: '165', ref: heightRef },
                { label: '体重 (kg)', placeholder: '50', ref: weightRef },
                { label: '胸围 (cm)', placeholder: '85', ref: chestRef },
                { label: '腰围 (cm)', placeholder: '65', ref: waistRef },
                { label: '肩宽 (cm)', placeholder: '38', ref: shoulderRef }
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{field.label}</label>
                  <input ref={field.ref} className="w-full bg-transparent border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-primary transition-colors text-xl font-bold py-1" placeholder={field.placeholder} type="number" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-10">
            <div className="space-y-4">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest">价格区间 (Price Range)</label>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {BUDGET_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setActiveBudget(opt.value)} className={`h-16 rounded-2xl border-2 transition-all font-bold text-sm flex items-center justify-center px-2 ${activeBudget === opt.value ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10' : 'border-gray-100 text-gray-400 bg-white hover:border-gray-200'}`}>
                      {opt.label}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest">店铺/品牌偏好 (Brand Preference)</label>
               <div className="flex flex-wrap gap-2 mb-4">
                  {DEFAULT_STORES.map((store) => (
                    <button key={store} onClick={() => toggleStore(store)} className={`px-5 py-3 rounded-full border-2 text-sm font-bold transition-all ${selectedStores.includes(store) ? 'border-primary bg-primary text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}>
                      {store}
                    </button>
                  ))}
               </div>
               <form onSubmit={addCustomStore} className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-base">search</span>
                    <input type="text" value={customStore} onChange={(e) => setCustomStore(e.target.value)} placeholder="搜索更多品牌..." className="w-full bg-gray-50 border-0 rounded-2xl pl-12 pr-4 py-4 text-base focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <button type="submit" className="bg-slate-800 text-white px-8 py-4 rounded-2xl text-base font-bold shadow-lg">添加</button>
               </form>
            </div>

            <div className="space-y-4">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest">审美风格</label>
               <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {STYLE_OPTIONS.map((s) => (
                    <button key={s} onClick={() => setActiveStyle(s)} className={`h-12 rounded-xl border-2 transition-all font-bold text-[10px] ${activeStyle === s ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400 bg-white hover:border-gray-200'}`}>{s}</button>
                  ))}
               </div>
            </div>
            
            <div className="space-y-4">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest">色系偏好</label>
               <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {PALETTE_OPTIONS.map((p) => (
                    <button key={p} onClick={() => setActivePalette(p)} className={`h-12 rounded-xl border-2 transition-all font-bold text-[10px] ${activePalette === p ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400 bg-white hover:border-gray-200'}`}>{p}</button>
                  ))}
               </div>
            </div>
          </section>

          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <button onClick={handleSaveAll} className="w-full bg-primary text-white text-2xl font-black py-6 rounded-3xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
              <span>{selectedProfileId ? '更新档案并开启试衣' : '保存档案并开启试衣'}</span>
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
