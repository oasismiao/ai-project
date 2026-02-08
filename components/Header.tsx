
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange, isLoggedIn, onLoginClick }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap px-4 md:px-10 py-6 mb-8 max-w-[1440px] mx-auto w-full sticky top-0 bg-white/40 backdrop-blur-lg z-50 rounded-b-xl border-b border-white/20">
      <div className="flex items-center gap-4 text-black dark:text-white cursor-pointer" onClick={() => onPageChange('profile')}>
        <div className="size-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[18px]">checkroom</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight songti-style">试衣间</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8 items-center">
        <nav className="hidden md:flex items-center gap-10">
          <button 
            className={`${currentPage === 'profile' ? 'text-primary font-bold border-b-2 border-primary' : 'text-black'} text-sm font-medium hover:text-primary transition-colors pb-1`}
            onClick={() => onPageChange('profile')}
          >
            我的穿搭
          </button>
          <button 
            className={`${currentPage === 'wardrobe' ? 'text-primary font-bold border-b-2 border-primary' : 'text-black'} text-sm font-medium hover:text-primary transition-colors pb-1`}
            onClick={() => onPageChange('wardrobe')}
          >
            我的衣橱
          </button>
          <button 
            className={`${currentPage === 'lab' ? 'text-primary font-bold border-b-2 border-primary' : 'text-black'} text-sm font-medium hover:text-primary transition-colors pb-1`}
            onClick={() => onPageChange('lab')}
          >
            数字试衣
          </button>
          <button 
            className={`${currentPage === 'inspiration' ? 'text-primary font-bold border-b-2 border-primary' : 'text-black'} text-sm font-medium hover:text-primary transition-colors pb-1`}
            onClick={() => onPageChange('inspiration')}
          >
            灵感集
          </button>
          <button 
            className={`${currentPage === 'archive' ? 'text-primary font-bold border-b-2 border-primary' : 'text-black'} text-sm font-medium hover:text-primary transition-colors pb-1`}
            onClick={() => onPageChange('archive')}
          >
            试衣记录
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            className={`flex size-10 items-center justify-center rounded-full bg-white/80 shadow-sm border border-gray-100 hover:scale-110 transition-transform ${isLoggedIn ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            onClick={onLoginClick}
          >
            <span className={`material-symbols-outlined ${isLoggedIn ? 'text-primary' : 'text-gray-700'}`}>
              {isLoggedIn ? 'account_circle' : 'person'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
