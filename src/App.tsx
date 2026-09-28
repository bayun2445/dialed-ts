import React, { useState, useEffect } from 'react';
import { BrewRecipe, RecipeComment, BrewLogEntry, CommunityDiscussion } from './types/coffee';
import { INITIAL_RECIPES, INITIAL_COMMENTS, INITIAL_DISCUSSIONS } from './data/recipes';
import { Header } from './components/Header';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { BrewTimerModal } from './components/BrewTimerModal';
import { VariableComparator } from './components/VariableComparator';
import { CommunityExchange } from './components/CommunityExchange';
import { BrewJournal } from './components/BrewJournal';
import { RecipeBuilderModal } from './components/RecipeBuilderModal';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';
import { 
  Coffee, Search, Filter, Sparkles, BookOpen, Clock, 
  Compass, MessageSquare, ArrowRight, Flame, Layers
} from 'lucide-react';

export default function App() {
  // Navigation & active view
  const [activeTab, setActiveTab] = useState<'recipes' | 'timer' | 'comparator' | 'community' | 'journal'>('recipes');

  // Recipes state with localStorage persistence
  const [recipes, setRecipes] = useState<BrewRecipe[]>(() => {
    try {
      const saved = localStorage.getItem('dialed_recipes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_RECIPES;
  });

  // Comments state
  const [commentsMap, setCommentsMap] = useState<Record<string, RecipeComment[]>>(() => {
    try {
      const saved = localStorage.getItem('dialed_comments');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COMMENTS;
  });

  // Community discussions state
  const [discussions, setDiscussions] = useState<CommunityDiscussion[]>(() => {
    try {
      const saved = localStorage.getItem('dialed_discussions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DISCUSSIONS;
  });

  // Brew logs state
  const [brewLogs, setBrewLogs] = useState<BrewLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('dialed_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'initial-log-1',
        recipeId: 'v60-hoffmann-1cup',
        recipeTitle: "James Hoffmann's Ultimate 1-Cup V60",
        method: 'v60',
        date: 'Yesterday',
        doseGrams: 15,
        waterGrams: 250,
        waterTempC: 94,
        grinderUsed: 'Timemore C2',
        grindSetting: '13 clicks',
        actualDrawdownSec: 198,
        sensoryBalance: 'balanced_sweet',
        overallRating: 5,
        notes: 'Bright peach and jasmine tea notes! Flat bed at the end with zero channeling.',
        tastingNotesDetected: ['Jasmine Floral', 'White Peach'],
      },
    ];
  });

  // Bookmarked and Liked IDs
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dialed_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['v60-hoffmann-1cup', 'mokapot-hoffmann-modern'];
  });

  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Compared recipes (up to 2)
  const [comparedRecipes, setComparedRecipes] = useState<BrewRecipe[]>([
    recipes[0] || INITIAL_RECIPES[0],
    recipes[1] || INITIAL_RECIPES[1],
  ]);

  // Modal states
  const [selectedRecipeForDetail, setSelectedRecipeForDetail] = useState<BrewRecipe | null>(null);
  const [activeTimerRecipe, setActiveTimerRecipe] = useState<BrewRecipe | null>(null);
  const [isCreateRecipeOpen, setIsCreateRecipeOpen] = useState<boolean>(false);
  const [isBeginnerGuideOpen, setIsBeginnerGuideOpen] = useState<boolean>(false);

  // Filter & Search states
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dialed_recipes', JSON.stringify(recipes));
      localStorage.setItem('dialed_comments', JSON.stringify(commentsMap));
      localStorage.setItem('dialed_discussions', JSON.stringify(discussions));
      localStorage.setItem('dialed_logs', JSON.stringify(brewLogs));
      localStorage.setItem('dialed_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {}
  }, [recipes, commentsMap, discussions, brewLogs, bookmarkedIds]);

  // Handlers
  const handleToggleLike = (recipeId: string) => {
    setLikedIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const handleToggleBookmark = (recipeId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const handleAddToCompare = (recipe: BrewRecipe) => {
    if (comparedRecipes.some((r) => r.id === recipe.id)) {
      setActiveTab('comparator');
      return;
    }
    setComparedRecipes([comparedRecipes[1] || comparedRecipes[0], recipe]);
    setActiveTab('comparator');
  };

  const handleStartBrew = (recipe: BrewRecipe) => {
    setActiveTimerRecipe(recipe);
  };

  const handleSaveBrewLog = (newLog: Omit<BrewLogEntry, 'id' | 'date'>) => {
    const entry: BrewLogEntry = {
      ...newLog,
      id: `log-${Date.now()}`,
      date: 'Today',
    };
    setBrewLogs([entry, ...brewLogs]);
  };

  const handleCreateRecipe = (newRecipe: BrewRecipe) => {
    setRecipes([newRecipe, ...recipes]);
  };

  const handleAddComment = (recipeId: string, content: string, tweakVar?: string, tweakVal?: string) => {
    const newComment: RecipeComment = {
      id: `comment-${Date.now()}`,
      recipeId,
      author: {
        name: 'You (Coffee Lover)',
        handle: '@coffeelover',
        role: 'Home Brewer',
        avatarInitials: 'YOU',
        avatarColor: 'bg-amber-800',
      },
      content,
      createdAt: 'Just now',
      likes: 0,
      variableTweak: tweakVar && tweakVal ? { variable: tweakVar, suggestion: tweakVal } : undefined,
    };

    setCommentsMap((prev) => ({
      ...prev,
      [recipeId]: [...(prev[recipeId] || []), newComment],
    }));

    setRecipes((prev) =>
      prev.map((r) => (r.id === recipeId ? { ...r, commentsCount: r.commentsCount + 1 } : r))
    );
  };

  const handleToggleCommentLike = (recipeId: string, commentId: string) => {
    setCommentsMap((prev) => {
      const list = prev[recipeId] || [];
      const updated = list.map((c) => {
        if (c.id === commentId) {
          const wasVoted = c.userVoted;
          return {
            ...c,
            likes: wasVoted ? c.likes - 1 : c.likes + 1,
            userVoted: !wasVoted,
          };
        }
        return c;
      });
      return { ...prev, [recipeId]: updated };
    });
  };

  // Community handlers
  const handleAddDiscussion = (
    disc: Omit<CommunityDiscussion, 'id' | 'createdAt' | 'upvotes' | 'replies'>
  ) => {
    const newDisc: CommunityDiscussion = {
      ...disc,
      id: `disc-${Date.now()}`,
      createdAt: 'Just now',
      upvotes: 1,
      replies: [],
    };
    setDiscussions([newDisc, ...discussions]);
  };

  const handleAddReply = (discussionId: string, content: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === discussionId) {
          return {
            ...d,
            replies: [
              ...d.replies,
              {
                id: `reply-${Date.now()}`,
                author: {
                  name: 'You (Home Brewer)',
                  handle: '@homebrewer',
                  role: 'Enthusiast',
                  avatarInitials: 'YOU',
                  avatarColor: 'bg-amber-700',
                },
                content,
                createdAt: 'Just now',
                upvotes: 0,
              },
            ],
          };
        }
        return d;
      })
    );
  };

  const handleToggleUpvoteDiscussion = (discussionId: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === discussionId) {
          const wasUpvoted = d.userUpvoted;
          return {
            ...d,
            upvotes: wasUpvoted ? d.upvotes - 1 : d.upvotes + 1,
            userUpvoted: !wasUpvoted,
          };
        }
        return d;
      })
    );
  };

  const handleToggleUpvoteReply = (discussionId: string, replyId: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === discussionId) {
          return {
            ...d,
            replies: d.replies.map((r) => {
              if (r.id === replyId) {
                const wasUpvoted = r.userUpvoted;
                return {
                  ...r,
                  upvotes: wasUpvoted ? r.upvotes - 1 : r.upvotes + 1,
                  userUpvoted: !wasUpvoted,
                };
              }
              return r;
            }),
          };
        }
        return d;
      })
    );
  };

  // Filtered recipes
  const filteredRecipes = recipes.filter((r) => {
    if (methodFilter !== 'all' && r.method !== methodFilter) return false;
    if (difficultyFilter !== 'all' && r.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchBean = r.coffeeBean.name.toLowerCase().includes(q);
      const matchOrigin = r.coffeeBean.origin.toLowerCase().includes(q);
      const matchRoaster = r.coffeeBean.roaster?.toLowerCase().includes(q);
      const matchNotes = r.tastingNotes.some((n) => n.toLowerCase().includes(q));
      if (!matchTitle && !matchBean && !matchOrigin && !matchRoaster && !matchNotes) return false;
    }
    return true;
  });

  const savedRecipesList = recipes.filter((r) => bookmarkedIds.includes(r.id));

  return (
    <div className="min-h-screen bg-[#12100e] text-[#f4efe8] flex flex-col selection:bg-[#d97706]/30 selection:text-white">
      {/* Top Bar Contract Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateRecipe={() => setIsCreateRecipeOpen(true)}
        onOpenBeginnerGuide={() => setIsBeginnerGuideOpen(true)}
        savedCount={bookmarkedIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        
        {/* TAB 1: RECIPES FEED */}
        {activeTab === 'recipes' && (
          <div className="space-y-8">
            
            {/* Hero Section: Editorial Craftsmanship */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e1915] via-[#181412] to-[#12100e] border border-[#332b24] p-6 sm:p-10 shadow-lg">
              <div className="max-w-3xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Specialty Coffee Community & Extraction Lab</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efe6] tracking-tight leading-tight text-balance">
                  Master the Pour Over V60, AeroPress & Moka Pot.
                </h1>

                <p className="text-sm sm:text-base text-[#c9bea7] leading-relaxed">
                  Log your brew parameters, compare extraction variables like grind size and water temperature, exchange dial-in tips with passionate enthusiasts, and brew with our interactive step-by-step timer.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsBeginnerGuideOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#181411] bg-gradient-to-r from-amber-400 to-[#d97706] hover:from-amber-300 hover:to-amber-500 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Beginner V60 Masterclass</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('comparator')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#ede3d7] bg-[#221c18] hover:bg-[#2c241f] border border-[#3d3229] rounded-xl transition-colors cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>Compare Variables & Grinders</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('community')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#ede3d7] bg-[#221c18] hover:bg-[#2c241f] border border-[#3d3229] rounded-xl transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span>Troubleshooting & Tips</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Bar & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#181412] p-4 rounded-xl border border-[#2b241e]">
              
              {/* Method Filter Buttons (Functional Buttons, Anti-slop clean state) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: 'all', label: 'All Brewers' },
                  { id: 'v60', label: 'Hario V60' },
                  { id: 'aeropress', label: 'AeroPress' },
                  { id: 'mokapot', label: 'Moka Pot' },
                  { id: 'chemex', label: 'Chemex' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setMethodFilter(btn.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      methodFilter === btn.id
                        ? 'bg-[#2b241e] text-amber-300 border border-[#483b31] shadow-sm'
                        : 'text-[#9c8e80] hover:text-[#ded3c5]'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-3.5 h-3.5 text-[#827467] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bean, origin, notes..."
                    className="w-full bg-[#13110f] border border-[#302721] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#ede3d7] placeholder-[#7d7063] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="bg-[#13110f] border border-[#302721] rounded-lg px-2.5 py-1.5 text-xs text-[#ede3d7] focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner Friendly</option>
                  <option value="intermediate">Intermediate</option>
                </select>
              </div>
            </div>

            {/* Recipes Grid */}
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-16 bg-[#161311] border border-[#26201b] rounded-2xl p-8 space-y-3">
                <Coffee className="w-10 h-10 text-[#61554a] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#ded3c5]">
                  No recipes found matching your filters
                </h3>
                <p className="text-xs text-[#8a7d71] max-w-sm mx-auto">
                  Try clearing your search query or selecting &ldquo;All Brewers&rdquo; above.
                </p>
                <button
                  onClick={() => {
                    setMethodFilter('all');
                    setSearchQuery('');
                    setDifficultyFilter('all');
                  }}
                  className="px-4 py-2 bg-[#221c18] hover:bg-[#2c241f] text-xs font-semibold text-amber-300 rounded-lg border border-[#3b3027]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onBrew={handleStartBrew}
                    onSelect={(r) => setSelectedRecipeForDetail(r)}
                    onToggleLike={handleToggleLike}
                    onToggleBookmark={handleToggleBookmark}
                    onAddToCompare={handleAddToCompare}
                    isLiked={likedIds.includes(recipe.id)}
                    isBookmarked={bookmarkedIds.includes(recipe.id)}
                    isCompared={comparedRecipes.some((c) => c.id === recipe.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BREW TIMER LAUNCHER & ACTIVE VIEW */}
        {activeTab === 'timer' && (
          <div className="space-y-6">
            <div className="border-b border-[#2d2621] pb-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5efe6]">
                Interactive Brew Timer
              </h2>
              <p className="text-xs text-[#a39486] mt-1">
                Select any recipe below to launch the step-by-step guidance timer with real-time target grams, countdown, and audio cues.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recipes.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#191512] border border-[#2e2620] hover:border-[#42372e] rounded-xl p-5 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider mb-1">
                      {r.methodLabel} · {r.steps.length} Pour Stages
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#f5efe6]">
                      {r.title}
                    </h3>
                    <p className="text-xs text-[#9d8f81] line-clamp-2 mt-1">
                      {r.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#26201b]">
                    <div className="flex items-center justify-between text-xs font-mono text-[#ded3c5]">
                      <span>{r.doseGrams}g : {r.waterGrams}g</span>
                      <span className="text-amber-300">{Math.floor(r.totalTargetTimeSec / 60)}m {r.totalTargetTimeSec % 60}s</span>
                    </div>

                    <button
                      onClick={() => handleStartBrew(r)}
                      className="w-full py-2 px-3 text-xs font-semibold text-[#181411] bg-gradient-to-r from-amber-400 to-[#d97706] hover:from-amber-300 hover:to-amber-500 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 fill-current" />
                      <span>Launch Timer for this Recipe</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VARIABLE COMPARATOR & DIAL-IN MATRIX */}
        {activeTab === 'comparator' && (
          <VariableComparator
            recipes={recipes}
            comparedRecipes={comparedRecipes}
            onSetComparedRecipes={setComparedRecipes}
            onBrewRecipe={handleStartBrew}
          />
        )}

        {/* TAB 4: COMMUNITY TIPS & Q&A */}
        {activeTab === 'community' && (
          <CommunityExchange
            discussions={discussions}
            onAddDiscussion={handleAddDiscussion}
            onAddReply={handleAddReply}
            onToggleUpvoteDiscussion={handleToggleUpvoteDiscussion}
            onToggleUpvoteReply={handleToggleUpvoteReply}
          />
        )}

        {/* TAB 5: BREW JOURNAL & SAVED */}
        {activeTab === 'journal' && (
          <BrewJournal
            logs={brewLogs}
            savedRecipes={savedRecipesList}
            onBrewRecipe={handleStartBrew}
            recipes={recipes}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#241e19] bg-[#141210] py-6 px-4 text-center text-xs text-[#827467] space-y-2">
        <div className="flex items-center justify-center gap-4 text-xs font-medium">
          <button onClick={() => setActiveTab('recipes')} className="hover:text-[#ede3d7] transition-colors">Recipes</button>
          <span>·</span>
          <button onClick={() => setActiveTab('timer')} className="hover:text-[#ede3d7] transition-colors">Brew Timer</button>
          <span>·</span>
          <button onClick={() => setActiveTab('comparator')} className="hover:text-[#ede3d7] transition-colors">Extraction Matrix</button>
          <span>·</span>
          <button onClick={() => setActiveTab('community')} className="hover:text-[#ede3d7] transition-colors">Community</button>
          <span>·</span>
          <button onClick={() => setIsBeginnerGuideOpen(true)} className="hover:text-amber-300 transition-colors">Beginner Guide</button>
        </div>
        <p className="text-[11px] text-[#6b5f54]">
          Dialed Specialty Coffee Community. Dedicated to sweet, balanced, and channeling-free extractions.
        </p>
      </footer>

      {/* MODALS */}
      {/* 1. Interactive Brew Timer Modal */}
      {activeTimerRecipe && (
        <BrewTimerModal
          recipe={activeTimerRecipe}
          onClose={() => setActiveTimerRecipe(null)}
          onSaveBrewLog={handleSaveBrewLog}
        />
      )}

      {/* 2. Recipe Detail Modal */}
      {selectedRecipeForDetail && (
        <RecipeDetailModal
          recipe={selectedRecipeForDetail}
          comments={commentsMap[selectedRecipeForDetail.id] || []}
          onClose={() => setSelectedRecipeForDetail(null)}
          onBrew={handleStartBrew}
          onAddToCompare={handleAddToCompare}
          onAddComment={handleAddComment}
          onToggleCommentLike={handleToggleCommentLike}
        />
      )}

      {/* 3. Recipe Builder / Logger Modal */}
      {isCreateRecipeOpen && (
        <RecipeBuilderModal
          onClose={() => setIsCreateRecipeOpen(false)}
          onSaveRecipe={handleCreateRecipe}
        />
      )}

      {/* 4. Beginner Guide Modal */}
      {isBeginnerGuideOpen && (
        <BeginnerGuideModal
          onClose={() => setIsBeginnerGuideOpen(false)}
          onBrewRecipe={handleStartBrew}
          recipes={recipes}
        />
      )}
    </div>
  );
}
