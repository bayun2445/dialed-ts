import React from 'react';
import { BrewRecipe } from '../types/coffee';
import { Play, Heart, Bookmark, MessageSquare, SlidersHorizontal, Scale, Thermometer, Gauge } from 'lucide-react';

interface RecipeCardProps {
  recipe: BrewRecipe;
  onBrew: (recipe: BrewRecipe) => void;
  onSelect: (recipe: BrewRecipe) => void;
  onToggleLike: (recipeId: string) => void;
  onToggleBookmark: (recipeId: string) => void;
  onAddToCompare: (recipe: BrewRecipe) => void;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isCompared?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onBrew,
  onSelect,
  onToggleLike,
  onToggleBookmark,
  onAddToCompare,
  isLiked = false,
  isBookmarked = false,
  isCompared = false,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getMethodBadgeText = (method: string) => {
    switch (method) {
      case 'v60':
        return 'Hario V60';
      case 'aeropress':
        return 'AeroPress';
      case 'mokapot':
        return 'Moka Pot';
      case 'kalita':
        return 'Kalita Wave';
      case 'chemex':
        return 'Chemex';
      case 'frenchpress':
        return 'French Press';
      default:
        return method.toUpperCase();
    }
  };

  return (
    <div className="group bg-[#191614] border border-[#2e2823] hover:border-[#4d4239] rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 shadow-sm flex flex-col justify-between">
      {/* Top Header: Unboxed metadata */}
      <div>
        <div className="flex items-center justify-between text-xs text-[#9d8f81] mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-400 tracking-wide uppercase text-[11px]">
              {getMethodBadgeText(recipe.method)}
            </span>
            <span aria-hidden="true" className="text-[#51463e]">·</span>
            <span className="capitalize">{recipe.difficulty}</span>
            <span aria-hidden="true" className="text-[#51463e]">·</span>
            <span>{recipe.coffeeBean.process}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#8c7f73]">
            <span>{recipe.createdAt}</span>
          </div>
        </div>

        {/* Recipe Title & Subtitle */}
        <h3
          onClick={() => onSelect(recipe)}
          className="font-serif text-lg sm:text-xl font-bold text-[#f5efe6] group-hover:text-amber-200 transition-colors cursor-pointer leading-snug"
        >
          {recipe.title}
        </h3>
        <p className="text-xs text-[#a89c90] line-clamp-2 mt-1 mb-4 leading-relaxed">
          {recipe.subtitle}
        </p>

        {/* Coffee Bean Details */}
        <div className="bg-[#201c18] border border-[#2b2520] rounded-lg p-3 mb-4">
          <div className="text-xs font-semibold text-[#ede4da] truncate">
            {recipe.coffeeBean.name}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#9a8d80] mt-0.5">
            <span>{recipe.coffeeBean.origin}</span>
            <span aria-hidden="true" className="text-[#51463e]">·</span>
            <span className="capitalize">{recipe.coffeeBean.roastLevel} Roast</span>
            {recipe.coffeeBean.altitude && (
              <>
                <span aria-hidden="true" className="text-[#51463e]">·</span>
                <span>{recipe.coffeeBean.altitude}</span>
              </>
            )}
          </div>
        </div>

        {/* Extraction Variables Grid (Clean tabular figures) */}
        <div className="grid grid-cols-4 gap-2 py-3 px-3.5 bg-[#141210] rounded-lg border border-[#28221d] mb-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#8e8174] mb-0.5">
              <Scale className="w-3 h-3 text-amber-500/80" />
              <span>Dose</span>
            </div>
            <div className="font-mono text-xs font-semibold text-[#f0e7dd] tabular-nums">
              {recipe.doseGrams}g : {recipe.waterGrams}g
            </div>
            <div className="text-[10px] font-mono text-[#a59789]">{recipe.ratio}</div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#8e8174] mb-0.5">
              <Gauge className="w-3 h-3 text-amber-500/80" />
              <span>Grind</span>
            </div>
            <div className="font-mono text-xs font-semibold text-[#f0e7dd] truncate" title={recipe.grindSize.category}>
              {recipe.grindSize.category}
            </div>
            <div className="text-[10px] font-mono text-[#a59789] tabular-nums">
              {recipe.grindSize.microns}μm
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#8e8174] mb-0.5">
              <Thermometer className="w-3 h-3 text-amber-500/80" />
              <span>Temp</span>
            </div>
            <div className="font-mono text-xs font-semibold text-[#f0e7dd] tabular-nums">
              {recipe.waterTempC}°C
            </div>
            <div className="text-[10px] font-mono text-[#a59789] tabular-nums">
              {recipe.waterTempF}°F
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#8e8174] mb-0.5">
              <span>Time</span>
            </div>
            <div className="font-mono text-xs font-semibold text-amber-300 tabular-nums">
              {formatTime(recipe.totalTargetTimeSec)}
            </div>
            <div className="text-[10px] font-mono text-[#a59789]">{recipe.steps.length} stages</div>
          </div>
        </div>

        {/* Tasting Notes as clean text with typographic separator (Anti-slop zero pills) */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-[#cfc2b4] mb-4">
          <span className="text-[11px] text-[#7d7064] mr-1">Notes:</span>
          {recipe.tastingNotes.map((note, idx) => (
            <React.Fragment key={note}>
              <span className="hover:text-amber-300 transition-colors">{note}</span>
              {idx < recipe.tastingNotes.length - 1 && (
                <span aria-hidden="true" className="text-[#554a41]">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Author information */}
        <div className="flex items-center justify-between border-t border-[#26201b] pt-3 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full ${recipe.author.avatarColor} flex items-center justify-center text-[10px] font-bold text-amber-100`}>
              {recipe.author.avatarInitials}
            </div>
            <div>
              <div className="font-medium text-[#ded4c8]">{recipe.author.name}</div>
              <div className="text-[10px] text-[#8a7d71]">{recipe.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#8a7d71]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(recipe.id);
              }}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                isLiked ? 'text-rose-400' : 'hover:text-rose-300'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400' : ''}`} />
              <span className="font-mono tabular-nums text-[11px]">{recipe.likesCount + (isLiked ? 1 : 0)}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(recipe);
              }}
              className="flex items-center gap-1 hover:text-[#d4c7b8] transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="font-mono tabular-nums text-[11px]">{recipe.commentsCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons: Brew, Details, Compare */}
      <div className="flex items-center gap-2 pt-1 border-t border-[#26201b]">
        <button
          onClick={() => onBrew(recipe)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#181411] bg-gradient-to-r from-amber-400 to-[#d97706] hover:from-amber-300 hover:to-amber-500 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-98"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Brew with Timer</span>
        </button>

        <button
          onClick={() => onAddToCompare(recipe)}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            isCompared
              ? 'bg-[#d97706]/20 border-[#d97706] text-amber-300'
              : 'bg-[#201c18] border-[#2e2721] text-[#9e9083] hover:text-[#e4d8cc] hover:border-[#423932]'
          }`}
          title={isCompared ? 'In Dial-in Comparator' : 'Add to Compare'}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        <button
          onClick={() => onToggleBookmark(recipe.id)}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            isBookmarked
              ? 'bg-amber-500/20 border-amber-500 text-amber-400'
              : 'bg-[#201c18] border-[#2e2721] text-[#9e9083] hover:text-[#e4d8cc] hover:border-[#423932]'
          }`}
          title={isBookmarked ? 'Saved to Bookmarks' : 'Save Recipe'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};
