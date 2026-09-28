import React, { useState } from 'react';
import { BrewRecipe, RecipeComment } from '../types/coffee';
import { 
  X, Play, SlidersHorizontal, Scale, Thermometer, 
  Gauge, Clock, Heart, MessageSquare, Send, Sparkles, User
} from 'lucide-react';

interface RecipeDetailModalProps {
  recipe: BrewRecipe;
  comments: RecipeComment[];
  onClose: () => void;
  onBrew: (recipe: BrewRecipe) => void;
  onAddToCompare: (recipe: BrewRecipe) => void;
  onAddComment: (recipeId: string, content: string, tweakVar?: string, tweakVal?: string) => void;
  onToggleCommentLike: (recipeId: string, commentId: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  comments,
  onClose,
  onBrew,
  onAddToCompare,
  onAddComment,
  onToggleCommentLike,
}) => {
  const [newComment, setNewComment] = useState('');
  const [tweakVar, setTweakVar] = useState('');
  const [tweakVal, setTweakVal] = useState('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(
      recipe.id,
      newComment.trim(),
      tweakVar.trim() || undefined,
      tweakVal.trim() || undefined
    );

    setNewComment('');
    setTweakVar('');
    setTweakVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#181513] border border-[#383029] rounded-2xl shadow-2xl overflow-hidden my-auto text-[#f2ebe2] max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#2d2621] bg-[#141210] shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#9d8f81] mb-1">
              <span className="font-semibold uppercase tracking-wider text-amber-400 text-[11px]">
                {recipe.methodLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span>{recipe.coffeeBean.process}</span>
              <span aria-hidden="true">·</span>
              <span>{recipe.difficulty}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#f5efe6]">
              {recipe.title}
            </h2>
            <p className="text-xs text-[#a89c90] mt-1 leading-relaxed">
              {recipe.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#221d19] hover:bg-[#2c2621] text-[#b0a294] hover:text-[#f2ebe2] border border-[#362e27] transition-colors cursor-pointer shrink-0 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Key Extraction Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#141210] rounded-xl border border-[#28221d] text-center">
            <div>
              <div className="text-[11px] text-[#8e8174] mb-0.5">Dose & Yield</div>
              <div className="font-mono text-sm font-bold text-[#f5efe6] tabular-nums">
                {recipe.doseGrams}g : {recipe.waterGrams}g
              </div>
              <div className="text-[10px] font-mono text-amber-400">Ratio {recipe.ratio}</div>
            </div>

            <div>
              <div className="text-[11px] text-[#8e8174] mb-0.5">Water Temp</div>
              <div className="font-mono text-sm font-bold text-[#f5efe6] tabular-nums">
                {recipe.waterTempC}°C
              </div>
              <div className="text-[10px] font-mono text-[#a59789]">{recipe.waterTempF}°F</div>
            </div>

            <div>
              <div className="text-[11px] text-[#8e8174] mb-0.5">Grind Particle</div>
              <div className="font-mono text-sm font-bold text-[#f5efe6]">
                {recipe.grindSize.category}
              </div>
              <div className="text-[10px] font-mono text-[#a59789]">{recipe.grindSize.microns}μm</div>
            </div>

            <div>
              <div className="text-[11px] text-[#8e8174] mb-0.5">Target Time</div>
              <div className="font-mono text-sm font-bold text-amber-300 tabular-nums">
                {formatTime(recipe.totalTargetTimeSec)}
              </div>
              <div className="text-[10px] text-[#a59789]">{recipe.steps.length} Pour Stages</div>
            </div>
          </div>

          {/* Bean Specs & Filter */}
          <div className="bg-[#1e1915] border border-[#2e2620] rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#ded3c5]">
              Coffee Bean Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#8a7d71] block text-[10px]">Bean Name</span>
                <span className="font-semibold text-[#f5efe6]">{recipe.coffeeBean.name}</span>
              </div>
              <div>
                <span className="text-[#8a7d71] block text-[10px]">Origin</span>
                <span className="text-[#ded3c5]">{recipe.coffeeBean.origin}</span>
              </div>
              <div>
                <span className="text-[#8a7d71] block text-[10px]">Roast Level</span>
                <span className="capitalize text-[#ded3c5]">{recipe.coffeeBean.roastLevel}</span>
              </div>
              <div>
                <span className="text-[#8a7d71] block text-[10px]">Filter Paper</span>
                <span className="text-[#ded3c5] truncate block" title={recipe.filterType}>{recipe.filterType}</span>
              </div>
            </div>
          </div>

          {/* Grinder Click Calibration Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#ded3c5]">
              Grinder Click Guide
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {recipe.grindSize.clicks.comandanteC40 && (
                <div className="p-2.5 bg-[#141210] border border-[#29221c] rounded-lg">
                  <span className="text-[10px] text-[#8a7d71] block">Comandante C40</span>
                  <span className="font-mono font-bold text-amber-300">{recipe.grindSize.clicks.comandanteC40}</span>
                </div>
              )}
              {recipe.grindSize.clicks.timemoreC2C3 && (
                <div className="p-2.5 bg-[#141210] border border-[#29221c] rounded-lg">
                  <span className="text-[10px] text-[#8a7d71] block">Timemore C2 / C3</span>
                  <span className="font-mono font-bold text-amber-300">{recipe.grindSize.clicks.timemoreC2C3}</span>
                </div>
              )}
              {recipe.grindSize.clicks.baratzaEncore && (
                <div className="p-2.5 bg-[#141210] border border-[#29221c] rounded-lg">
                  <span className="text-[10px] text-[#8a7d71] block">Baratza Encore</span>
                  <span className="font-mono font-bold text-amber-300">{recipe.grindSize.clicks.baratzaEncore}</span>
                </div>
              )}
              {recipe.grindSize.clicks.fellowOdeGen2 && (
                <div className="p-2.5 bg-[#141210] border border-[#29221c] rounded-lg">
                  <span className="text-[10px] text-[#8a7d71] block">Fellow Ode Gen 2</span>
                  <span className="font-mono font-bold text-amber-300">{recipe.grindSize.clicks.fellowOdeGen2}</span>
                </div>
              )}
              {recipe.grindSize.clicks.oneZpressoJx && (
                <div className="p-2.5 bg-[#141210] border border-[#29221c] rounded-lg">
                  <span className="text-[10px] text-[#8a7d71] block">1Zpresso JX</span>
                  <span className="font-mono font-bold text-amber-300">{recipe.grindSize.clicks.oneZpressoJx}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step-by-Step Pour Stages */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#ded3c5]">
              Step-by-Step Brewing Stages ({recipe.steps.length} Steps)
            </h4>
            <div className="space-y-2.5">
              {recipe.steps.map((st) => (
                <div
                  key={st.id}
                  className="p-3.5 bg-[#191512] border border-[#2b241e] rounded-xl flex items-start gap-3.5 text-xs"
                >
                  <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 font-mono font-bold text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    {st.stepNumber}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#f5efe6]">{st.title}</span>
                      <div className="flex items-center gap-2 font-mono text-amber-400">
                        <span>Target: {st.targetWaterGrams}g</span>
                        <span aria-hidden="true" className="text-[#52453a]">·</span>
                        <span>{formatTime(st.durationSeconds)}</span>
                      </div>
                    </div>
                    <p className="text-[#cfc2b3] leading-relaxed">{st.instruction}</p>
                    {st.flowRateRecommendation && (
                      <div className="text-[11px] text-[#a89c8f] font-mono mt-0.5">
                        Rate: {st.flowRateRecommendation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Barista Tips */}
          {recipe.authorTips && (
            <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Barista Technique Advice:
              </div>
              <p className="text-[#e2d7cc] leading-relaxed">{recipe.authorTips}</p>
            </div>
          )}

          {/* Community Feedback & Variable Tweaks */}
          <div className="border-t border-[#29221c] pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#ded3c5] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                Community Feedback ({comments.length})
              </h4>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-3.5 bg-[#141210] border border-[#26201a] rounded-xl text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full ${comm.author.avatarColor} text-[9px] font-bold text-amber-100 flex items-center justify-center`}>
                        {comm.author.avatarInitials}
                      </div>
                      <span className="font-semibold text-[#ede3d7]">{comm.author.name}</span>
                      <span className="text-[10px] text-[#8a7d71]">({comm.author.role})</span>
                    </div>

                    <button
                      onClick={() => onToggleCommentLike(recipe.id, comm.id)}
                      className={`flex items-center gap-1 text-[11px] font-mono cursor-pointer transition-colors ${
                        comm.userVoted ? 'text-rose-400' : 'text-[#8a7d71] hover:text-rose-300'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${comm.userVoted ? 'fill-current' : ''}`} />
                      <span>{comm.likes}</span>
                    </button>
                  </div>

                  {comm.variableTweak && (
                    <div className="text-[11px] font-mono text-amber-300 bg-[#1e1915] px-2 py-0.5 rounded border border-[#332a22] inline-block">
                      Tweak: {comm.variableTweak.variable} → {comm.variableTweak.suggestion}
                    </div>
                  )}

                  <p className="text-[#cfc2b3] leading-relaxed pl-7">{comm.content}</p>
                </div>
              ))}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handlePostComment} className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={tweakVar}
                  onChange={(e) => setTweakVar(e.target.value)}
                  placeholder="Variable tweak (e.g. Grind, Temp)"
                  className="bg-[#141210] border border-[#332b24] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7] placeholder-[#7d7063] focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  value={tweakVal}
                  onChange={(e) => setTweakVal(e.target.value)}
                  placeholder="Suggestion (e.g. 1 click finer for natural)"
                  className="bg-[#141210] border border-[#332b24] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7] placeholder-[#7d7063] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add feedback, drawdown notes, or taste observations..."
                  className="flex-1 bg-[#141210] border border-[#332b24] rounded-lg px-3 py-2 text-xs text-[#ede3d7] placeholder-[#7d7063] focus:outline-none focus:border-amber-500"
                  required
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#2d251f] hover:bg-[#3d332a] text-amber-300 rounded-lg border border-[#45392f] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Comment
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2d2621] bg-[#141210] shrink-0">
          <button
            onClick={() => {
              onAddToCompare(recipe);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#201c18] hover:bg-[#2b241e] border border-[#382f27] text-xs font-medium text-[#ded3c5] rounded-lg transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Add to Compare</span>
          </button>

          <button
            onClick={() => {
              onBrew(recipe);
              onClose();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#181411] bg-gradient-to-r from-amber-400 to-[#d97706] hover:from-amber-300 hover:to-amber-500 rounded-lg shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Interactive Brew Timer</span>
          </button>
        </div>

      </div>
    </div>
  );
};
