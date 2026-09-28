import React from 'react';
import { Coffee, Compass, BookOpen, Clock, MessageSquare, Plus, BookMarked, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'recipes' | 'timer' | 'comparator' | 'community' | 'journal';
  setActiveTab: (tab: 'recipes' | 'timer' | 'comparator' | 'community' | 'journal') => void;
  onOpenCreateRecipe: () => void;
  onOpenBeginnerGuide: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateRecipe,
  onOpenBeginnerGuide,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#161412]/95 backdrop-blur-md border-b border-[#2d2824] px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('recipes')}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#d97706]/15 border border-[#d97706]/30 flex items-center justify-center text-[#f59e0b] group-hover:bg-[#d97706]/25 transition-all">
              <Coffee className="w-4 h-4" />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#f5efe6] group-hover:text-amber-200 transition-colors">
              Dialed
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#b5a89c]">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
              activeTab === 'recipes'
                ? 'text-[#f5efe6] font-semibold'
                : 'hover:text-[#f5efe6]'
            }`}
          >
            Recipes
            {activeTab === 'recipes' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d97706] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('timer')}
            className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'timer'
                ? 'text-[#f5efe6] font-semibold'
                : 'hover:text-[#f5efe6]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Brew Timer
            {activeTab === 'timer' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d97706] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('comparator')}
            className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'comparator'
                ? 'text-[#f5efe6] font-semibold'
                : 'hover:text-[#f5efe6]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            Dial-in Matrix
            {activeTab === 'comparator' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d97706] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'text-[#f5efe6] font-semibold'
                : 'hover:text-[#f5efe6]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            Community Tips
            {activeTab === 'community' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d97706] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'journal'
                ? 'text-[#f5efe6] font-semibold'
                : 'hover:text-[#f5efe6]'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-amber-500" />
            Brew Journal
            {savedCount > 0 && (
              <span className="text-[11px] font-mono text-[#d97706] ml-0.5">({savedCount})</span>
            )}
            {activeTab === 'journal' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d97706] rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenBeginnerGuide}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#d6c7b7] bg-[#221e1a] hover:bg-[#2c2621] border border-[#3d342d] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            title="V60, Aeropress & Moka Pot Beginner Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Beginner Guide
          </button>

          <button
            onClick={onOpenCreateRecipe}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#181411] bg-gradient-to-r from-amber-400 to-[#d97706] hover:from-amber-300 hover:to-amber-500 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Log Recipe</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-between border-t border-[#2a2420] mt-3 pt-2 text-xs font-medium text-[#a99c90] overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`py-1 px-2 whitespace-nowrap ${activeTab === 'recipes' ? 'text-[#f5efe6] font-semibold border-b-2 border-amber-500' : ''}`}
        >
          Recipes
        </button>
        <button
          onClick={() => setActiveTab('timer')}
          className={`py-1 px-2 whitespace-nowrap flex items-center gap-1 ${activeTab === 'timer' ? 'text-[#f5efe6] font-semibold border-b-2 border-amber-500' : ''}`}
        >
          <Clock className="w-3 h-3 text-amber-500" />
          Timer
        </button>
        <button
          onClick={() => setActiveTab('comparator')}
          className={`py-1 px-2 whitespace-nowrap flex items-center gap-1 ${activeTab === 'comparator' ? 'text-[#f5efe6] font-semibold border-b-2 border-amber-500' : ''}`}
        >
          <Compass className="w-3 h-3 text-amber-500" />
          Dial-in
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`py-1 px-2 whitespace-nowrap flex items-center gap-1 ${activeTab === 'community' ? 'text-[#f5efe6] font-semibold border-b-2 border-amber-500' : ''}`}
        >
          <MessageSquare className="w-3 h-3 text-amber-500" />
          Community
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`py-1 px-2 whitespace-nowrap flex items-center gap-1 ${activeTab === 'journal' ? 'text-[#f5efe6] font-semibold border-b-2 border-amber-500' : ''}`}
        >
          <BookMarked className="w-3 h-3 text-amber-500" />
          Journal
        </button>
        <button
          onClick={onOpenBeginnerGuide}
          className="py-1 px-2 whitespace-nowrap text-amber-400 flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          Guide
        </button>
      </div>
    </header>
  );
};
