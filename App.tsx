
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Lab } from './pages/Lab';
import { Archive } from './pages/Archive';
import { Profile } from './pages/Profile';
import { Result } from './pages/Result';
import { Inspiration } from './pages/Inspiration';
import { Wardrobe } from './pages/Wardrobe';
import { Page, UserSelections, CharacterProfile, SavedOutfit, ExistingItem } from './types';

const STORAGE_KEY_PROFILES = 'style_lab_character_profiles';
const STORAGE_KEY_SELECTIONS = 'style_lab_current_selections';
const STORAGE_KEY_OWNED_ITEMS = 'style_lab_owned_items';
const STORAGE_KEY_ARCHIVE = 'style_lab_archive';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('profile');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selections, setSelections] = useState<UserSelections>({});
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [characterProfiles, setCharacterProfiles] = useState<CharacterProfile[]>([]);
  const [ownedItems, setOwnedItems] = useState<ExistingItem[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Initial Data Load
  useEffect(() => {
    const savedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (savedProfiles) try { setCharacterProfiles(JSON.parse(savedProfiles)); } catch (e) {}
    const savedSelections = localStorage.getItem(STORAGE_KEY_SELECTIONS);
    if (savedSelections) try { setSelections(JSON.parse(savedSelections)); } catch (e) {}
    const savedOwned = localStorage.getItem(STORAGE_KEY_OWNED_ITEMS);
    if (savedOwned) try { setOwnedItems(JSON.parse(savedOwned)); } catch (e) {}
    const savedArchive = localStorage.getItem(STORAGE_KEY_ARCHIVE);
    if (savedArchive) try { setSavedOutfits(JSON.parse(savedArchive)); } catch (e) {}
  }, []);

  // Persistence
  useEffect(() => localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(characterProfiles)), [characterProfiles]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_SELECTIONS, JSON.stringify(selections)), [selections]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_OWNED_ITEMS, JSON.stringify(ownedItems)), [ownedItems]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_ARCHIVE, JSON.stringify(savedOutfits)), [savedOutfits]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleLabComplete = (newSelections: UserSelections) => {
    setSelections(prev => ({ ...prev, ...newSelections }));
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentPage('result');
      triggerToast("AI 试衣报告已渲染完成");
    }, 4500); 
  };

  const handleProfileSave = (profile: CharacterProfile) => {
    setCharacterProfiles(prev => {
      const exists = prev.find(p => p.id === profile.id);
      if (exists) return prev.map(p => p.id === profile.id ? profile : p);
      return [profile, ...prev];
    });
    setSelections({ profileId: profile.id, gender: profile.gender, faceImage: profile.faceImage || undefined, bodyData: profile.bodyData, preferences: profile.preferences });
    triggerToast("设置完成，正在进入衣橱录入单品...");
    setCurrentPage('wardrobe');
  };

  const handleProfileSelect = (profile: CharacterProfile) => {
    setSelections({ profileId: profile.id, gender: profile.gender, faceImage: profile.faceImage || undefined, bodyData: profile.bodyData, preferences: profile.preferences });
    triggerToast(`已调取档案：${profile.name}`);
  };

  const handleSaveToArchive = (imageUrl: string) => {
    const newOutfit: SavedOutfit = {
      id: `arc-${Date.now()}`,
      title: `${selections.preferences?.style || '时尚'}造型`,
      category: `${selections.preferences?.palette || '经典'} • 拟合存档`,
      image: imageUrl,
      timestamp: new Date().toLocaleString(),
      selections: { ...selections, savedResultImage: imageUrl } 
    };
    setSavedOutfits(prev => [newOutfit, ...prev]);
    triggerToast("已存入存档库");
  };

  const handleArchiveItemClick = (item: SavedOutfit) => {
    setSelections(item.selections);
    setCurrentPage('result');
  };

  const handleAddItem = (item: ExistingItem) => {
    setOwnedItems(prev => [item, ...prev]);
    triggerToast("单品已录入衣橱");
  };

  const handleDeleteItem = (id: string) => {
    setOwnedItems(prev => prev.filter(i => i.id !== id));
  };

  const renderContent = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-12">
          <div className="relative size-64 animate-pulse">
            <div className="absolute inset-0 border-[24px] border-primary/10 rounded-full"></div>
            <div className="absolute inset-0 border-[24px] border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-4xl font-black songti-style italic text-slate-800">正在执行视觉特征拟合协议...</h2>
        </div>
      );
    }

    switch (currentPage) {
      case 'profile': return <Profile profiles={characterProfiles} onSave={handleProfileSave} onSelect={handleProfileSelect} />;
      case 'lab': return <Lab onComplete={handleLabComplete} onPageChange={setCurrentPage} ownedItems={ownedItems} />;
      case 'wardrobe': return <Wardrobe items={ownedItems} onAddItem={handleAddItem} onDeleteItem={handleDeleteItem} onPageChange={setCurrentPage} />;
      case 'archive': return <Archive savedItems={savedOutfits} onItemClick={handleArchiveItemClick} onPageChange={setCurrentPage} />;
      case 'inspiration': return <Inspiration />;
      case 'result': return <Result selections={selections} onReset={() => setCurrentPage('lab')} onToast={triggerToast} onSave={handleSaveToArchive} allOwnedItems={ownedItems} />;
      default: return <Profile profiles={characterProfiles} onSave={handleProfileSave} onSelect={handleProfileSelect} />;
    }
  };

  return (
    <Layout>
      <Header currentPage={currentPage} onPageChange={setCurrentPage} isLoggedIn={isLoggedIn} onLoginClick={() => setShowLoginModal(true)} />
      {renderContent()}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[300] flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[4rem] p-16 animate-fade-in-up relative">
             <button onClick={() => setShowLoginModal(false)} className="absolute top-10 right-10 size-12 rounded-full border border-gray-100 flex items-center justify-center"><span className="material-symbols-outlined text-gray-400">close</span></button>
             <div className="text-center mb-10"><h3 className="text-4xl font-black songti-style italic">身份识别</h3></div>
             <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setShowLoginModal(false); triggerToast("登录成功"); }} className="space-y-8">
                <input required type="text" className="w-full bg-slate-50 border-0 rounded-3xl px-8 py-5 text-lg" placeholder="账号" />
                <input required type="password" title="Password" className="w-full bg-slate-50 border-0 rounded-3xl px-8 py-5 text-lg" placeholder="密码" />
                <button type="submit" className="w-full bg-primary text-white py-6 rounded-full font-black text-xl shadow-2xl">确认登录</button>
             </form>
          </div>
        </div>
      )}
      {showToast && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[100] bg-white text-black px-12 py-6 rounded-full shadow-2xl border border-gray-100 animate-fade-in-up flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
          <span className="text-lg font-black uppercase tracking-widest">{showToast}</span>
        </div>
      )}
    </Layout>
  );
};

export default App;
