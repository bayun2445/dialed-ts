import React, { useState } from 'react';
import { BrewRecipe } from '../types/coffee';
import { X, BookOpen, Coffee, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Play } from 'lucide-react';

interface BeginnerGuideModalProps {
  onClose: () => void;
  onBrewRecipe: (recipe: BrewRecipe) => void;
  recipes: BrewRecipe[];
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({
  onClose,
  onBrewRecipe,
  recipes,
}) => {
  const [guideTab, setGuideTab] = useState<'v60' | 'aeropress' | 'mokapot' | 'grind'>('v60');

  const v60BeginnerRecipe = recipes.find((r) => r.id === 'v60-beginner-singlepour') || recipes[0];
  const aeropressRecipe = recipes.find((r) => r.id === 'aeropress-champion-inverted') || recipes[2];
  const mokapotRecipe = recipes.find((r) => r.id === 'mokapot-hoffmann-modern') || recipes[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#181513] border border-[#383029] rounded-2xl shadow-2xl overflow-hidden my-auto text-[#f2ebe2] max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2621] bg-[#141210] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#f5efe6]">
                Specialty Coffee Beginner Masterclass
              </h2>
              <p className="text-xs text-[#9d8f81]">
                Master the fundamental variables of V60, AeroPress, and Moka Pot.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#221d19] hover:bg-[#2c2621] text-[#b0a294] hover:text-[#f2ebe2] border border-[#362e27] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#26201b] bg-[#161311] overflow-x-auto shrink-0">
          <button
            onClick={() => setGuideTab('v60')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              guideTab === 'v60'
                ? 'bg-[#2e2620] text-amber-300 border border-[#483b31]'
                : 'text-[#9c8e80] hover:text-[#ded3c5]'
            }`}
          >
            Pour Over V60 Rules
          </button>

          <button
            onClick={() => setGuideTab('aeropress')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              guideTab === 'aeropress'
                ? 'bg-[#2e2620] text-amber-300 border border-[#483b31]'
                : 'text-[#9c8e80] hover:text-[#ded3c5]'
            }`}
          >
            AeroPress Mastery
          </button>

          <button
            onClick={() => setGuideTab('mokapot')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              guideTab === 'mokapot'
                ? 'bg-[#2e2620] text-amber-300 border border-[#483b31]'
                : 'text-[#9c8e80] hover:text-[#ded3c5]'
            }`}
          >
            Moka Pot Secrets
          </button>

          <button
            onClick={() => setGuideTab('grind')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              guideTab === 'grind'
                ? 'bg-[#2e2620] text-amber-300 border border-[#483b31]'
                : 'text-[#9c8e80] hover:text-[#ded3c5]'
            }`}
          >
            Dialing-in Grind & Taste
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* V60 Guide */}
          {guideTab === 'v60' && (
            <div className="space-y-5">
              <div className="bg-[#1c1815] border border-[#332a22] rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#f5efe6]">
                    Welcome to the V60 Journey!
                  </h3>
                  <p className="text-[#c7b9ab] mt-1 leading-relaxed">
                    The Hario V60 is celebrated worldwide because its 60-degree cone and spiral ribs provide unparalleled control over water flow, highlighting delicate florals, fruit sweetness, and acidity.
                  </p>
                </div>
                {v60BeginnerRecipe && (
                  <button
                    onClick={() => {
                      onBrewRecipe(v60BeginnerRecipe);
                      onClose();
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-400 to-[#d97706] text-[#181411] font-semibold rounded-lg shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Try Beginner V60</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-[#141210] border border-[#26201a] rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 text-sm">
                    Rule 1: The Golden Brew Ratio (1:16 to 1:17)
                  </div>
                  <p className="text-[#cfc2b3] leading-relaxed">
                    Start with <strong>15g of ground coffee</strong> to <strong>250g of hot water</strong> (a 1:16.7 ratio). If you want a heavier body, try 1:15 (20g coffee to 300g water). If you prefer light floral clarity, 1:17 is ideal.
                  </p>
                </div>

                <div className="p-3.5 bg-[#141210] border border-[#26201a] rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 text-sm">
                    Rule 2: Never Skip the Bloom (3x Dose, 45 Seconds)
                  </div>
                  <p className="text-[#cfc2b3] leading-relaxed">
                    Fresh coffee beans contain trapped carbon dioxide (CO2). When hot water hits them, CO2 bubbles erupt. If you pour all your water immediately, this escaping gas pushes water away, creating dry channels. Pour 45g of water first, gently swirl the brewer, and wait 45 seconds for the coffee bed to open up.
                  </p>
                </div>

                <div className="p-3.5 bg-[#141210] border border-[#26201a] rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 text-sm">
                    Rule 3: Water Flow & The Paper Filter Wall
                  </div>
                  <p className="text-[#cfc2b3] leading-relaxed">
                    Pour in smooth, steady spiral circles inside the inner 75% of the coffee bed. <strong>Never pour directly onto the white paper filter wall</strong>—water will simply slide down the paper directly into the carafe without touching any coffee (bypass)!
                  </p>
                </div>

                <div className="p-3.5 bg-[#141210] border border-[#26201a] rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 text-sm">
                    Rule 4: Aim for a Flat Bed, Not a Mud Pit
                  </div>
                  <p className="text-[#cfc2b3] leading-relaxed">
                    At the end of your final pour, give the brewer one gentle swirl and a light tap on the counter. The spent coffee bed should finish completely flat like wet beach sand. If it has a giant crater or muddy silt, reduce late-stage swirling.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AeroPress Guide */}
          {guideTab === 'aeropress' && (
            <div className="space-y-4">
              <div className="bg-[#1c1815] border border-[#332a22] rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#f5efe6]">
                    The Indestructible Brewer: AeroPress
                  </h3>
                  <p className="text-[#c7b9ab] mt-1 leading-relaxed">
                    AeroPress combines full immersion brewing with gentle pneumatic pressure. It is virtually impossible to make a bad cup once you master two secrets.
                  </p>
                </div>
                {aeropressRecipe && (
                  <button
                    onClick={() => {
                      onBrewRecipe(aeropressRecipe);
                      onClose();
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-400 to-[#d97706] text-[#181411] font-semibold rounded-lg shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Try AeroPress Recipe</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-[#141210] border border-[#26201a] rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 text-sm">
                    Secret 1: Water Temperature (80°C – 85°C)
                  </div>
                  <p className="text-[#cfc2b3] leading-relaxed">
                    Unlike V60 which thrives on 94°C+ for light roasts, AeroPress extraction is accelerated by immersion and pressure. Using 80°C–85°C yields astonishing natural berry sweetness without any harsh tanning or bitter dryness.
                  </p>
                </div>

                <div className="p-3.5 bg-[#141210] border border-[#26201a] rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 text-sm">
                    Secret 2: Stop Pressing at the Hiss!
                  </div>
                  <p className="text-[#cfc2b3] leading-relaxed">
                    When plunging, press down gently using just the weight of your forearm (around 30 seconds). The moment you hear the first audible air &ldquo;hiss&rdquo;, stop pressing! The final air blast pushes compressed bitter grounds into the cup.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Moka Pot Guide */}
          {guideTab === 'mokapot' && (
            <div className="space-y-4">
              <div className="bg-[#1c1815] border border-[#332a22] rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#f5efe6]">
                    Modern Specialty Moka Pot
                  </h3>
                  <p className="text-[#c7b9ab] mt-1 leading-relaxed">
                    Most people think Moka pots only make bitter, burnt sludge. By adopting the James Hoffmann method, you get velvety chocolate sweetness and rich crema.
                  </p>
                </div>
                {mokapotRecipe && (
                  <button
                    onClick={() => {
                      onBrewRecipe(mokapotRecipe);
                      onClose();
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-400 to-[#d97706] text-[#181411] font-semibold rounded-lg shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Try Moka Pot Recipe</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-[#141210] border border-[#26201a] rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 text-sm">
                    Rule 1: Always Start with Boiling Water in the Base
                  </div>
                  <p className="text-[#cfc2b3] leading-relaxed">
                    If you put cold water into the bottom chamber, the Moka pot sits on the stove for 5–7 minutes, roasting and baking your dry coffee grounds in the funnel before water even begins to boil! Always pre-boil water in a kettle and pour into the base up to below the valve.
                  </p>
                </div>

                <div className="p-3.5 bg-[#141210] border border-[#26201a] rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 text-sm">
                    Rule 2: NEVER Tamp the Coffee Basket
                  </div>
                  <p className="text-[#cfc2b3] leading-relaxed">
                    Moka pots are low-pressure systems (1.5 to 2 bars, compared to 9 bars in espresso machines). If you tamp the grounds, the water cannot permeate evenly, building excessive pressure and channeling steam through localized cracks. Just fill loose and level flush.
                  </p>
                </div>

                <div className="p-3.5 bg-[#141210] border border-[#26201a] rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 text-sm">
                    Rule 3: The Cold Water Quench
                  </div>
                  <p className="text-[#cfc2b3] leading-relaxed">
                    Keep the lid open on medium-low heat. The moment the honey-gold stream starts sputtering bubbles or turns pale yellow, remove from heat and immediately run the base under cold tap water. Sputtering steam creates metallic burnt ashiness!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dialing-in Grind & Taste */}
          {guideTab === 'grind' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#141210] border border-[#29221c] rounded-xl space-y-2">
                <h4 className="font-bold text-amber-300 text-sm">
                  The Simple Dial-in Rule: Sour vs Bitter
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-[#1e1915] border border-[#302721] rounded-lg space-y-1">
                    <span className="font-bold text-amber-400 block">Tastes SOUR or SHARP?</span>
                    <p className="text-[#cfc2b3]">
                      That is <strong>under-extraction</strong>. Water did not dissolve enough sugars.
                      <br />
                      <strong>Fix:</strong> Grind 1–2 clicks FINER, or increase water temperature by +2°C.
                    </p>
                  </div>

                  <div className="p-3 bg-[#1e1915] border border-[#302721] rounded-lg space-y-1">
                    <span className="font-bold text-rose-400 block">Tastes BITTER or DRY?</span>
                    <p className="text-[#cfc2b3]">
                      That is <strong>over-extraction</strong>. Heavy astringent plant tannins dissolved.
                      <br />
                      <strong>Fix:</strong> Grind 1–2 clicks COARSER, or decrease water temp by -2°C.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2d2621] bg-[#141210] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-[#181411] bg-gradient-to-r from-amber-400 to-[#d97706] rounded-lg"
          >
            Got it, Let's Brew!
          </button>
        </div>

      </div>
    </div>
  );
};
