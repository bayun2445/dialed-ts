import React, { useState } from 'react';
import { BrewRecipe } from '../types/coffee';
import { GRINDERS, EXTRACTION_COMPASS_DATA } from '../utils/grinderData';
import { 
  SlidersHorizontal, Compass, ArrowRightLeft, Scale, Thermometer, 
  Gauge, Clock, AlertTriangle, CheckCircle2, ChevronDown, Sparkles
} from 'lucide-react';

interface VariableComparatorProps {
  recipes: BrewRecipe[];
  comparedRecipes: BrewRecipe[];
  onSetComparedRecipes: (recipes: BrewRecipe[]) => void;
  onBrewRecipe: (recipe: BrewRecipe) => void;
}

export const VariableComparator: React.FC<VariableComparatorProps> = ({
  recipes,
  comparedRecipes,
  onSetComparedRecipes,
  onBrewRecipe,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'compare' | 'converter' | 'compass'>('compare');

  // Comparison selection
  const recipe1 = comparedRecipes[0] || recipes[0];
  const recipe2 = comparedRecipes[1] || recipes[1] || recipes[0];

  const handleSelectRecipe1 = (id: string) => {
    const found = recipes.find((r) => r.id === id);
    if (found) {
      onSetComparedRecipes([found, recipe2]);
    }
  };

  const handleSelectRecipe2 = (id: string) => {
    const found = recipes.find((r) => r.id === id);
    if (found) {
      onSetComparedRecipes([recipe1, found]);
    }
  };

  // Grinder Converter State
  const [selectedGrinderMethod, setSelectedGrinderMethod] = useState<'v60' | 'aeropress' | 'mokapot' | 'chemex' | 'frenchpress'>('v60');

  // Extraction Compass State
  const [selectedIssueId, setSelectedIssueId] = useState<string>('sour');
  const currentIssue = EXTRACTION_COMPASS_DATA.find((i) => i.id === selectedIssueId) || EXTRACTION_COMPASS_DATA[0];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8">
      {/* Sub-navigation tabs (functional buttons) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d2621] pb-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5efe6]">
            Extraction Lab & Variable Matrix
          </h2>
          <p className="text-xs text-[#a39486] mt-1">
            Analyze how grind size, water temperature, and brew ratios shift flavor balance.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#1a1714] border border-[#2b241e] rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('compare')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'compare'
                ? 'bg-[#2e2620] text-amber-200 border border-[#483b31] shadow-sm'
                : 'text-[#9c8e80] hover:text-[#ded3c5]'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Side-by-Side
          </button>

          <button
            onClick={() => setActiveSubTab('converter')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'converter'
                ? 'bg-[#2e2620] text-amber-200 border border-[#483b31] shadow-sm'
                : 'text-[#9c8e80] hover:text-[#ded3c5]'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            Grinder Click Guide
          </button>

          <button
            onClick={() => setActiveSubTab('compass')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'compass'
                ? 'bg-[#2e2620] text-amber-200 border border-[#483b31] shadow-sm'
                : 'text-[#9c8e80] hover:text-[#ded3c5]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Dial-in Compass
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Side-by-Side Comparison */}
      {activeSubTab === 'compare' && (
        <div className="space-y-6">
          {/* Selector headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#191512] border border-[#332b24] p-4 rounded-xl space-y-2">
              <label className="text-xs text-[#9c8e80] block font-medium">Recipe 1 to Compare</label>
              <div className="relative">
                <select
                  value={recipe1.id}
                  onChange={(e) => handleSelectRecipe1(e.target.value)}
                  className="w-full bg-[#221c18] border border-[#3d332b] rounded-lg px-3 py-2.5 text-xs text-[#f5efe6] font-semibold focus:outline-none focus:border-amber-500 appearance-none cursor-pointer pr-8"
                >
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.method.toUpperCase()}] {r.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#8a7d70] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="bg-[#191512] border border-[#332b24] p-4 rounded-xl space-y-2">
              <label className="text-xs text-[#9c8e80] block font-medium">Recipe 2 to Compare</label>
              <div className="relative">
                <select
                  value={recipe2.id}
                  onChange={(e) => handleSelectRecipe2(e.target.value)}
                  className="w-full bg-[#221c18] border border-[#3d332b] rounded-lg px-3 py-2.5 text-xs text-[#f5efe6] font-semibold focus:outline-none focus:border-amber-500 appearance-none cursor-pointer pr-8"
                >
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.method.toUpperCase()}] {r.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#8a7d70] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Comparison Table / Matrix */}
          <div className="bg-[#191512] border border-[#2d251f] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2d251f] bg-[#141210]">
                    <th className="py-4 px-5 text-[#8f8072] font-semibold w-1/4">Extraction Variable</th>
                    <th className="py-4 px-5 text-amber-300 font-semibold font-serif text-sm w-[37.5%] border-l border-[#241e19]">
                      {recipe1.title}
                    </th>
                    <th className="py-4 px-5 text-amber-300 font-semibold font-serif text-sm w-[37.5%] border-l border-[#241e19]">
                      {recipe2.title}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26201b]">
                  {/* Brewer Method */}
                  <tr>
                    <td className="py-3.5 px-5 text-[#9e9082] font-medium">Brewer / Method</td>
                    <td className="py-3.5 px-5 font-semibold text-[#ede3d7] border-l border-[#241e19]">
                      {recipe1.methodLabel} ({recipe1.method.toUpperCase()})
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-[#ede3d7] border-l border-[#241e19]">
                      {recipe2.methodLabel} ({recipe2.method.toUpperCase()})
                    </td>
                  </tr>

                  {/* Coffee Dose & Ratio */}
                  <tr>
                    <td className="py-3.5 px-5 text-[#9e9082] font-medium">Dose & Brew Ratio</td>
                    <td className="py-3.5 px-5 border-l border-[#241e19]">
                      <span className="font-mono font-semibold text-[#f5efe6] tabular-nums">{recipe1.doseGrams}g</span> coffee to{' '}
                      <span className="font-mono font-semibold text-[#f5efe6] tabular-nums">{recipe1.waterGrams}g</span> water
                      <div className="text-[11px] font-mono text-amber-400 mt-0.5">Ratio: {recipe1.ratio}</div>
                    </td>
                    <td className="py-3.5 px-5 border-l border-[#241e19]">
                      <span className="font-mono font-semibold text-[#f5efe6] tabular-nums">{recipe2.doseGrams}g</span> coffee to{' '}
                      <span className="font-mono font-semibold text-[#f5efe6] tabular-nums">{recipe2.waterGrams}g</span> water
                      <div className="text-[11px] font-mono text-amber-400 mt-0.5">Ratio: {recipe2.ratio}</div>
                    </td>
                  </tr>

                  {/* Water Temperature */}
                  <tr>
                    <td className="py-3.5 px-5 text-[#9e9082] font-medium">Water Temperature</td>
                    <td className="py-3.5 px-5 border-l border-[#241e19]">
                      <span className="font-mono font-semibold text-[#f5efe6] tabular-nums">{recipe1.waterTempC}°C</span>
                      <span className="text-[#8f8072] ml-1 font-mono tabular-nums">({recipe1.waterTempF}°F)</span>
                      <div className="text-[11px] text-[#9c8e80] mt-0.5">
                        {recipe1.waterTempC >= 94 ? 'High extraction energy for light roasts' : 'Gentle extraction to highlight sweetness'}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 border-l border-[#241e19]">
                      <span className="font-mono font-semibold text-[#f5efe6] tabular-nums">{recipe2.waterTempC}°C</span>
                      <span className="text-[#8f8072] ml-1 font-mono tabular-nums">({recipe2.waterTempF}°F)</span>
                      <div className="text-[11px] text-[#9c8e80] mt-0.5">
                        {recipe2.waterTempC >= 94 ? 'High extraction energy for light roasts' : 'Gentle extraction to highlight sweetness'}
                      </div>
                    </td>
                  </tr>

                  {/* Grind Size & Clicks */}
                  <tr>
                    <td className="py-3.5 px-5 text-[#9e9082] font-medium">Grind Size & Clicks</td>
                    <td className="py-3.5 px-5 border-l border-[#241e19]">
                      <div className="font-semibold text-amber-300">
                        {recipe1.grindSize.category} ({recipe1.grindSize.microns}μm)
                      </div>
                      <div className="text-[11px] text-[#b3a496] mt-1 space-y-0.5 font-mono">
                        {recipe1.grindSize.clicks.comandanteC40 && <div>Comandante: {recipe1.grindSize.clicks.comandanteC40}</div>}
                        {recipe1.grindSize.clicks.timemoreC2C3 && <div>Timemore: {recipe1.grindSize.clicks.timemoreC2C3}</div>}
                        {recipe1.grindSize.clicks.baratzaEncore && <div>Baratza: {recipe1.grindSize.clicks.baratzaEncore}</div>}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 border-l border-[#241e19]">
                      <div className="font-semibold text-amber-300">
                        {recipe2.grindSize.category} ({recipe2.grindSize.microns}μm)
                      </div>
                      <div className="text-[11px] text-[#b3a496] mt-1 space-y-0.5 font-mono">
                        {recipe2.grindSize.clicks.comandanteC40 && <div>Comandante: {recipe2.grindSize.clicks.comandanteC40}</div>}
                        {recipe2.grindSize.clicks.timemoreC2C3 && <div>Timemore: {recipe2.grindSize.clicks.timemoreC2C3}</div>}
                        {recipe2.grindSize.clicks.baratzaEncore && <div>Baratza: {recipe2.grindSize.clicks.baratzaEncore}</div>}
                      </div>
                    </td>
                  </tr>

                  {/* Contact Time & Stages */}
                  <tr>
                    <td className="py-3.5 px-5 text-[#9e9082] font-medium">Total Brew Time</td>
                    <td className="py-3.5 px-5 border-l border-[#241e19]">
                      <span className="font-mono font-semibold text-amber-300 tabular-nums">
                        {formatTime(recipe1.totalTargetTimeSec)}
                      </span>
                      <span className="text-[#8a7d71] ml-1">across {recipe1.steps.length} stages</span>
                    </td>
                    <td className="py-3.5 px-5 border-l border-[#241e19]">
                      <span className="font-mono font-semibold text-amber-300 tabular-nums">
                        {formatTime(recipe2.totalTargetTimeSec)}
                      </span>
                      <span className="text-[#8a7d71] ml-1">across {recipe2.steps.length} stages</span>
                    </td>
                  </tr>

                  {/* Pouring & Agitation Style */}
                  <tr>
                    <td className="py-3.5 px-5 text-[#9e9082] font-medium">Pour Strategy & Agitation</td>
                    <td className="py-3.5 px-5 text-[#d1c5b7] leading-relaxed border-l border-[#241e19]">
                      {recipe1.steps.find((s) => s.isBloom) ? 'Dedicated bloom with saturation swirl' : 'Direct immersion / fill'}.
                      {recipe1.steps.length > 3 ? ' Multi-pulse extraction for high sweetness.' : ' Single continuous pour for clean clarity.'}
                    </td>
                    <td className="py-3.5 px-5 text-[#d1c5b7] leading-relaxed border-l border-[#241e19]">
                      {recipe2.steps.find((s) => s.isBloom) ? 'Dedicated bloom with saturation swirl' : 'Direct immersion / fill'}.
                      {recipe2.steps.length > 3 ? ' Multi-pulse extraction for high sweetness.' : ' Single continuous pour for clean clarity.'}
                    </td>
                  </tr>

                  {/* Flavor Profile Separation */}
                  <tr>
                    <td className="py-3.5 px-5 text-[#9e9082] font-medium">Flavor Hallmarks</td>
                    <td className="py-3.5 px-5 border-l border-[#241e19]">
                      <div className="flex flex-wrap gap-1 text-[11px] text-[#e0d6cb]">
                        {recipe1.tastingNotes.join(' · ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 border-l border-[#241e19]">
                      <div className="flex flex-wrap gap-1 text-[11px] text-[#e0d6cb]">
                        {recipe2.tastingNotes.join(' · ')}
                      </div>
                    </td>
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="py-4 px-5 text-[#9e9082] font-medium">Try Recipe</td>
                    <td className="py-4 px-5 border-l border-[#241e19]">
                      <button
                        onClick={() => onBrewRecipe(recipe1)}
                        className="py-1.5 px-3 bg-[#2b241e] hover:bg-[#382f27] border border-[#45392f] text-amber-300 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Brew {recipe1.title.split(' ')[0]} Now
                      </button>
                    </td>
                    <td className="py-4 px-5 border-l border-[#241e19]">
                      <button
                        onClick={() => onBrewRecipe(recipe2)}
                        className="py-1.5 px-3 bg-[#2b241e] hover:bg-[#382f27] border border-[#45392f] text-amber-300 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Brew {recipe2.title.split(' ')[0]} Now
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Grinder Click Conversion Guide */}
      {activeSubTab === 'converter' && (
        <div className="space-y-6">
          {/* Method selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'v60', label: 'Hario V60' },
              { id: 'aeropress', label: 'AeroPress' },
              { id: 'mokapot', label: 'Moka Pot' },
              { id: 'chemex', label: 'Chemex' },
              { id: 'frenchpress', label: 'French Press' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedGrinderMethod(m.id as any)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  selectedGrinderMethod === m.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-[#1a1714] border-[#2e2620] text-[#9c8e80] hover:text-[#ded3c5]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Grinder Models Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GRINDERS.map((grinder) => (
              <div
                key={grinder.id}
                className="bg-[#191512] border border-[#2e2620] rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-[#f5efe6]">
                    {grinder.name}
                  </h4>
                  <span className="text-[10px] text-[#8a7d71] uppercase tracking-wider">
                    {grinder.type}
                  </span>
                </div>

                <div className="text-xs text-[#9c8e80]">
                  Burrs: <span className="text-[#ded3c5]">{grinder.burrSize}</span> · Step: ~{grinder.micronStep}μm
                </div>

                <div className="bg-[#12100e] border border-[#241e19] rounded-lg p-3">
                  <div className="text-[11px] text-[#8a7d71]">
                    Recommended {selectedGrinderMethod.toUpperCase()} Range:
                  </div>
                  <div className="font-mono text-base font-bold text-amber-300 mt-0.5">
                    {grinder.ranges[selectedGrinderMethod]}
                  </div>
                </div>

                <div className="text-[11px] text-[#7d7063] space-y-1">
                  <div>V60 Standard: {grinder.ranges.v60}</div>
                  <div>Aeropress: {grinder.ranges.aeropress}</div>
                  <div>Moka Pot: {grinder.ranges.mokapot}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Golden Rule of Grinders */}
          <div className="bg-[#1a1613] border border-[#3b3027] rounded-xl p-5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-[#c9bdaf] space-y-1 leading-relaxed">
              <span className="font-semibold text-[#f5efe6]">Grind Size Rule of Thumb: </span>
              <span>
                Every grinder has slight calibration variance based on zero-point calibration and burr wear. Use these numbers as your starting baseline. If your brew finishes sour, click 1–2 steps finer. If it finishes bitter or drying, click 1–2 steps coarser!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Coffee Extraction Compass (Troubleshooting) */}
      {activeSubTab === 'compass' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#f5efe6]">
              The Coffee Extraction Compass
            </h3>
            <p className="text-xs text-[#a39486] mt-1">
              Select your brew symptom below to diagnose under vs over-extraction and get exact remedies.
            </p>
          </div>

          {/* Issue Pills / Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {EXTRACTION_COMPASS_DATA.map((issue) => (
              <button
                key={issue.id}
                onClick={() => setSelectedIssueId(issue.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedIssueId === issue.id
                    ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/40 text-amber-200'
                    : 'bg-[#191512] border-[#2e2620] text-[#9c8e80] hover:text-[#ded3c5]'
                }`}
              >
                <div className="text-xs font-bold capitalize">{issue.tasteCategory.replace('_', ' ')}</div>
                <div className="text-[10px] text-[#7d7063] truncate mt-0.5">{issue.userExperience}</div>
              </button>
            ))}
          </div>

          {/* Active Diagnostic Breakdown Card */}
          <div className="bg-[#181512] border border-[#362e26] rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Header Symptom */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  Sensory Diagnostic
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f5efe6] mt-0.5">
                  &ldquo;{currentIssue.userExperience}&rdquo;
                </h3>
              </div>
            </div>

            {/* Diagnosis & SCA Science */}
            <div className="p-4 bg-[#141210] border border-[#2b241e] rounded-xl text-xs space-y-2">
              <div className="font-semibold text-amber-300">Underlying Extraction Physics:</div>
              <p className="text-[#d6cabf] leading-relaxed">
                {currentIssue.diagnosis}
              </p>
            </div>

            {/* Parameter Adjustment Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#1e1915] border border-[#332a22] rounded-xl">
                <div className="flex items-center gap-1 text-[11px] text-[#8e8072] mb-1">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  <span>Grind Adjustment</span>
                </div>
                <div className="font-bold text-sm text-[#f5efe6]">
                  {currentIssue.parameterAdjustments.grindSize}
                </div>
              </div>

              <div className="p-3 bg-[#1e1915] border border-[#332a22] rounded-xl">
                <div className="flex items-center gap-1 text-[11px] text-[#8e8072] mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Water Temp</span>
                </div>
                <div className="font-bold text-sm text-[#f5efe6]">
                  {currentIssue.parameterAdjustments.waterTemp}
                </div>
              </div>

              <div className="p-3 bg-[#1e1915] border border-[#332a22] rounded-xl sm:col-span-2">
                <div className="flex items-center gap-1 text-[11px] text-[#8e8072] mb-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Technique Tweak</span>
                </div>
                <div className="font-semibold text-xs text-[#ede3d7] leading-snug">
                  {currentIssue.parameterAdjustments.techniqueTweak}
                </div>
              </div>
            </div>

            {/* Actionable Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#ded3c5]">
                Exact Steps to Fix Your Next Brew
              </h4>
              <div className="space-y-2">
                {currentIssue.actionableSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-[#141210] border border-[#26201a] rounded-lg text-xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-[#ded3c5] leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
