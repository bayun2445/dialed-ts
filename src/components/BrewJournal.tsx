import React, { useState } from 'react';
import { BrewLogEntry, BrewRecipe } from '../types/coffee';
import { 
  BookMarked, Star, Clock, Scale, Thermometer, 
  Gauge, Play, ArrowRight, CheckCircle2, AlertCircle, HeartCrack
} from 'lucide-react';

interface BrewJournalProps {
  logs: BrewLogEntry[];
  savedRecipes: BrewRecipe[];
  onBrewRecipe: (recipe: BrewRecipe) => void;
  recipes: BrewRecipe[];
}

export const BrewJournal: React.FC<BrewJournalProps> = ({
  logs,
  savedRecipes,
  onBrewRecipe,
  recipes,
}) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'saved'>('logs');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const balancedCount = logs.filter((l) => l.sensoryBalance === 'balanced_sweet').length;
  const dialedInRate = logs.length > 0 ? Math.round((balancedCount / logs.length) * 100) : 100;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d2621] pb-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5efe6]">
            Your Specialty Brew Journal & Saved Recipes
          </h2>
          <p className="text-xs text-[#a39486] mt-1">
            Track your extraction progress over time, dial-in consistency, and saved community recipes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#1a1714] border border-[#2b241e] rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-[#2e2620] text-amber-200 border border-[#483b31] shadow-sm'
                : 'text-[#9c8e80] hover:text-[#ded3c5]'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            Brew History ({logs.length})
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-[#2e2620] text-amber-200 border border-[#483b31] shadow-sm'
                : 'text-[#9c8e80] hover:text-[#ded3c5]'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Saved Recipes ({savedRecipes.length})
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#181512] border border-[#2b241e] rounded-xl space-y-1">
          <div className="text-[11px] text-[#8e8174]">Total Brews Logged</div>
          <div className="font-mono text-2xl font-bold text-[#f5efe6] tabular-nums">
            {logs.length}
          </div>
          <div className="text-[10px] text-[#7d7063]">Across V60, Aeropress & Moka Pot</div>
        </div>

        <div className="p-4 bg-[#181512] border border-[#2b241e] rounded-xl space-y-1">
          <div className="text-[11px] text-[#8e8174]">Dialed-In Sweet Spot Rate</div>
          <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {dialedInRate}%
          </div>
          <div className="text-[10px] text-[#7d7063]">{balancedCount} of {logs.length} brews tasted balanced & sweet</div>
        </div>

        <div className="p-4 bg-[#181512] border border-[#2b241e] rounded-xl space-y-1">
          <div className="text-[11px] text-[#8e8174]">Saved Favorites</div>
          <div className="font-mono text-2xl font-bold text-amber-300 tabular-nums">
            {savedRecipes.length}
          </div>
          <div className="text-[10px] text-[#7d7063]">Bookmarked for daily morning rituals</div>
        </div>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'logs' ? (
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-16 bg-[#161311] border border-[#26201b] rounded-2xl p-8 space-y-3">
              <BookMarked className="w-10 h-10 text-[#61554a] mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#ded3c5]">
                No brew logs recorded yet
              </h3>
              <p className="text-xs text-[#8a7d71] max-w-sm mx-auto">
                Start brewing any recipe with the interactive timer! When you finish, you can rate the cup balance and log your grinder clicks.
              </p>
            </div>
          ) : (
            logs.map((log) => {
              const matchedRecipe = recipes.find((r) => r.id === log.recipeId);

              return (
                <div
                  key={log.id}
                  className="bg-[#191512] border border-[#2e2620] hover:border-[#3d332a] rounded-xl p-5 space-y-3 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#8e8072] mb-1">
                        <span className="font-semibold uppercase tracking-wider text-amber-400 text-[10px]">
                          {log.method.toUpperCase()}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{log.date}</span>
                      </div>
                      <h4 className="font-serif text-base sm:text-lg font-bold text-[#f5efe6]">
                        {log.recipeTitle}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {log.sensoryBalance === 'balanced_sweet' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Balanced & Sweet
                        </span>
                      )}
                      {log.sensoryBalance === 'sour_underextracted' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/30 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Under-Extracted (Sour)
                        </span>
                      )}
                      {log.sensoryBalance === 'bitter_overextracted' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/30 border border-rose-500/30 px-2.5 py-1 rounded-lg">
                          <HeartCrack className="w-3.5 h-3.5" />
                          Over-Extracted (Bitter)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Variables Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[#141210] p-3 rounded-lg border border-[#26201a]">
                    <div>
                      <span className="text-[10px] text-[#7d7063] block">Dose / Water</span>
                      <span className="font-mono font-semibold text-[#ded3c5]">
                        {log.doseGrams}g : {log.waterGrams}g
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#7d7063] block">Water Temp</span>
                      <span className="font-mono font-semibold text-[#ded3c5]">
                        {log.waterTempC}°C
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#7d7063] block">Grind Used</span>
                      <span className="font-mono font-semibold text-[#ded3c5] truncate block">
                        {log.grindSetting}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#7d7063] block">Actual Drawdown</span>
                      <span className="font-mono font-semibold text-amber-300">
                        {formatTime(log.actualDrawdownSec)}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  {log.notes && (
                    <p className="text-xs text-[#c4b6a7] leading-relaxed italic bg-[#171411] p-2.5 rounded border border-[#241e18]">
                      &ldquo;{log.notes}&rdquo;
                    </p>
                  )}

                  {/* Re-brew Action */}
                  {matchedRecipe && (
                    <div className="flex items-center justify-end pt-1">
                      <button
                        onClick={() => onBrewRecipe(matchedRecipe)}
                        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Re-Brew This Setup</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Saved Recipes Tab */
        <div className="space-y-4">
          {savedRecipes.length === 0 ? (
            <div className="text-center py-16 bg-[#161311] border border-[#26201b] rounded-2xl p-8 space-y-3">
              <Star className="w-10 h-10 text-[#61554a] mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#ded3c5]">
                No bookmarked recipes yet
              </h3>
              <p className="text-xs text-[#8a7d71] max-w-sm mx-auto">
                Browse community recipes and tap the bookmark icon on any card to save it here for fast access.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedRecipes.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#191512] border border-[#2e2620] rounded-xl p-5 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold mb-1">
                      {r.methodLabel} · {r.coffeeBean.name}
                    </div>
                    <h4 className="font-serif text-base font-bold text-[#f5efe6]">
                      {r.title}
                    </h4>
                    <p className="text-xs text-[#9d8f81] mt-1 line-clamp-2">
                      {r.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#26201a]">
                    <div className="text-xs font-mono text-[#ded3c5]">
                      {r.doseGrams}g : {r.waterGrams}g ({r.ratio})
                    </div>

                    <button
                      onClick={() => onBrewRecipe(r)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#181411] bg-gradient-to-r from-amber-400 to-[#d97706] hover:from-amber-300 hover:to-amber-500 rounded-lg cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Brew Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
