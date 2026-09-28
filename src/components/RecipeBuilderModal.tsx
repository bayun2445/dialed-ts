import React, { useState } from 'react';
import { BrewRecipe, BrewMethod, RoastLevel, ProcessMethod, RecipeStep } from '../types/coffee';
import { X, Plus, Trash2, Scale, Thermometer, Clock, Sparkles } from 'lucide-react';

interface RecipeBuilderModalProps {
  onClose: () => void;
  onSaveRecipe: (recipe: BrewRecipe) => void;
}

export const RecipeBuilderModal: React.FC<RecipeBuilderModalProps> = ({
  onClose,
  onSaveRecipe,
}) => {
  const [method, setMethod] = useState<BrewMethod>('v60');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [beanName, setBeanName] = useState('');
  const [origin, setOrigin] = useState('');
  const [roastLevel, setRoastLevel] = useState<RoastLevel>('light');
  const [process, setProcess] = useState<ProcessMethod>('Washed');
  
  const [doseGrams, setDoseGrams] = useState<number>(15);
  const [waterGrams, setWaterGrams] = useState<number>(250);
  const [waterTempC, setWaterTempC] = useState<number>(93);
  
  const [grindCategory, setGrindCategory] = useState<'Fine' | 'Medium-Fine' | 'Medium' | 'Medium-Coarse' | 'Coarse'>('Medium-Fine');
  const [grindMicrons, setGrindMicrons] = useState<number>(600);
  const [timemoreClicks, setTimemoreClicks] = useState<string>('13 clicks');
  const [comandanteClicks, setComandanteClicks] = useState<string>('18 clicks');
  const [authorTips, setAuthorTips] = useState('');
  const [tastingNotesInput, setTastingNotesInput] = useState('Peach, Jasmine, Citrus');

  // Step builder
  const [steps, setSteps] = useState<RecipeStep[]>([
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Bloom & Saturation',
      instruction: 'Pour 45g of water in 10s. Swirl gently to saturate all grounds.',
      targetWaterGrams: 45,
      durationSeconds: 45,
      isBloom: true,
      flowRateRecommendation: '4.5 g/s steady stream',
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Main Pour to Target',
      instruction: 'Pour continuously in concentric circles up to 250g total by 1:30. Let drain completely.',
      targetWaterGrams: 250,
      durationSeconds: 135,
      flowRateRecommendation: '3.5 g/s gentle spiral',
    },
  ]);

  // Compute brew ratio automatically
  const ratio = doseGrams > 0 ? `1:${(waterGrams / doseGrams).toFixed(1)}` : '1:16.7';
  const totalTimeSec = steps.reduce((acc, curr) => acc + curr.durationSeconds, 0);

  const handleAddStep = () => {
    const nextNum = steps.length + 1;
    setSteps([
      ...steps,
      {
        id: `step-${Date.now()}`,
        stepNumber: nextNum,
        title: `Pour Stage ${nextNum}`,
        instruction: 'Pour in steady spirals.',
        targetWaterGrams: waterGrams,
        durationSeconds: 30,
        flowRateRecommendation: '4.0 g/s spiral',
      },
    ]);
  };

  const handleRemoveStep = (idx: number) => {
    if (steps.length <= 1) return;
    const next = steps.filter((_, i) => i !== idx).map((st, i) => ({
      ...st,
      stepNumber: i + 1,
    }));
    setSteps(next);
  };

  const handleUpdateStep = (idx: number, field: keyof RecipeStep, value: any) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], [field]: value };
    setSteps(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRecipe: BrewRecipe = {
      id: `recipe-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `Custom ${method.toUpperCase()} brew recipe`,
      author: {
        name: 'You (Craft Brewer)',
        handle: '@craftbrewer',
        role: 'Community Enthusiast',
        avatarInitials: 'YOU',
        avatarColor: 'bg-amber-800',
        experienceLevel: 'Enthusiast',
      },
      method,
      methodLabel: method === 'v60' ? 'Hario V60' : method === 'aeropress' ? 'AeroPress' : method === 'mokapot' ? 'Moka Pot' : method.toUpperCase(),
      coffeeBean: {
        name: beanName.trim() || 'Single Origin Coffee',
        origin: origin.trim() || 'Specialty Lot',
        process,
        roastLevel,
      },
      doseGrams,
      waterGrams,
      ratio,
      waterTempC,
      waterTempF: Math.round(waterTempC * 1.8 + 32),
      grindSize: {
        category: grindCategory,
        microns: grindMicrons,
        clicks: {
          timemoreC2C3: timemoreClicks,
          comandanteC40: comandanteClicks,
        },
        visualDescriptor: `${grindCategory} consistency`,
      },
      filterType: method === 'aeropress' ? 'Aeropress Paper Filter' : 'Rinsed Paper Filter',
      totalTargetTimeSec: totalTimeSec,
      difficulty: 'Beginner',
      steps,
      tastingNotes: tastingNotesInput.split(',').map((n) => n.trim()).filter(Boolean),
      authorTips: authorTips.trim(),
      likesCount: 1,
      bookmarksCount: 0,
      forksCount: 0,
      commentsCount: 0,
      createdAt: 'Just now',
    };

    onSaveRecipe(newRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#181513] border border-[#383029] rounded-2xl shadow-2xl overflow-hidden my-auto text-[#f2ebe2] max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2621] bg-[#141210] shrink-0">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#f5efe6]">
              Create & Log Brew Recipe
            </h2>
            <p className="text-xs text-[#9d8f81] mt-0.5">
              Define your extraction variables, step timings, and tasting profile.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#221d19] hover:bg-[#2c2621] text-[#b0a294] hover:text-[#f2ebe2] border border-[#362e27] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Method & Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#ded3c5] block mb-1">
                Brew Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as BrewMethod)}
                className="w-full bg-[#13110f] border border-[#332b24] rounded-lg px-3 py-2 text-xs text-[#ede3d7] focus:outline-none focus:border-amber-500"
              >
                <option value="v60">Hario V60</option>
                <option value="aeropress">AeroPress</option>
                <option value="mokapot">Moka Pot</option>
                <option value="kalita">Kalita Wave</option>
                <option value="chemex">Chemex</option>
                <option value="frenchpress">French Press</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#ded3c5] block mb-1">
                Recipe Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Morning V60 Sweetness Dial-in"
                className="w-full bg-[#13110f] border border-[#332b24] rounded-lg px-3 py-2 text-xs text-[#ede3d7] focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#ded3c5] block mb-1">
              Short Description / Target Profile
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. High sweetness and bright floral clarity with minimal agitation"
              className="w-full bg-[#13110f] border border-[#332b24] rounded-lg px-3 py-2 text-xs text-[#ede3d7] focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Coffee Bean Details */}
          <div className="p-4 bg-[#141210] border border-[#26201a] rounded-xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
              Coffee Bean Specs
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#8e8174] block mb-1">Bean Name</label>
                <input
                  type="text"
                  value={beanName}
                  onChange={(e) => setBeanName(e.target.value)}
                  placeholder="e.g. Chelchele Washed"
                  className="w-full bg-[#1b1714] border border-[#302721] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8e8174] block mb-1">Origin / Region</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Yirgacheffe, Ethiopia"
                  className="w-full bg-[#1b1714] border border-[#302721] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8e8174] block mb-1">Roast Level</label>
                <select
                  value={roastLevel}
                  onChange={(e) => setRoastLevel(e.target.value as RoastLevel)}
                  className="w-full bg-[#1b1714] border border-[#302721] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7]"
                >
                  <option value="light">Light Roast</option>
                  <option value="medium-light">Medium-Light</option>
                  <option value="medium">Medium Roast</option>
                  <option value="medium-dark">Medium-Dark</option>
                  <option value="dark">Dark Roast</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#8e8174] block mb-1">Processing</label>
                <select
                  value={process}
                  onChange={(e) => setProcess(e.target.value as ProcessMethod)}
                  className="w-full bg-[#1b1714] border border-[#302721] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7]"
                >
                  <option value="Washed">Washed Process</option>
                  <option value="Natural">Natural / Dry Process</option>
                  <option value="Honey">Honey Process</option>
                  <option value="Anaerobic / Experimental">Anaerobic / Fermented</option>
                </select>
              </div>
            </div>
          </div>

          {/* Extraction Variables Bar */}
          <div className="p-4 bg-[#141210] border border-[#26201a] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Extraction Core Variables
              </span>
              <span className="font-mono text-xs font-bold text-amber-300">
                Auto Ratio: {ratio}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-[#8e8174] block mb-1">Coffee Dose (g)</label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  step="0.5"
                  value={doseGrams}
                  onChange={(e) => setDoseGrams(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#1b1714] border border-[#302721] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8e8174] block mb-1">Total Water (g)</label>
                <input
                  type="number"
                  min="50"
                  max="1000"
                  step="5"
                  value={waterGrams}
                  onChange={(e) => setWaterGrams(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#1b1714] border border-[#302721] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8e8174] block mb-1">Water Temp (°C)</label>
                <input
                  type="number"
                  min="70"
                  max="100"
                  value={waterTempC}
                  onChange={(e) => setWaterTempC(parseInt(e.target.value) || 93)}
                  className="w-full bg-[#1b1714] border border-[#302721] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8e8174] block mb-1">Grind Category</label>
                <select
                  value={grindCategory}
                  onChange={(e) => setGrindCategory(e.target.value as any)}
                  className="w-full bg-[#1b1714] border border-[#302721] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7]"
                >
                  <option value="Fine">Fine (Moka / Aero)</option>
                  <option value="Medium-Fine">Medium-Fine (V60)</option>
                  <option value="Medium">Medium (V60 / Kalita)</option>
                  <option value="Medium-Coarse">Medium-Coarse (Chemex)</option>
                  <option value="Coarse">Coarse (French / 4:6)</option>
                </select>
              </div>
            </div>

            {/* Grinder Click suggestions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-[#8e8174] block mb-1">Timemore C2/C3 Clicks</label>
                <input
                  type="text"
                  value={timemoreClicks}
                  onChange={(e) => setTimemoreClicks(e.target.value)}
                  placeholder="e.g. 13-14 clicks"
                  className="w-full bg-[#1b1714] border border-[#302721] rounded-lg px-3 py-1 text-xs text-[#ede3d7]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#8e8174] block mb-1">Comandante C40 Clicks</label>
                <input
                  type="text"
                  value={comandanteClicks}
                  onChange={(e) => setComandanteClicks(e.target.value)}
                  placeholder="e.g. 18-20 clicks"
                  className="w-full bg-[#1b1714] border border-[#302721] rounded-lg px-3 py-1 text-xs text-[#ede3d7]"
                />
              </div>
            </div>
          </div>

          {/* Pour Stages Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Step-by-Step Pour Stages
                </span>
                <span className="text-[11px] text-[#8a7d71] ml-2">
                  (Total target time: {Math.floor(totalTimeSec / 60)}m {totalTimeSec % 60}s)
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stage</span>
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((st, idx) => (
                <div
                  key={st.id}
                  className="p-3 bg-[#141210] border border-[#2b241e] rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">
                      Stage {st.stepNumber}
                    </span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-rose-400 hover:text-rose-300 cursor-pointer p-1"
                        title="Remove Stage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                      placeholder="Stage Title (e.g. Bloom)"
                      className="bg-[#1b1714] border border-[#332b24] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7]"
                    />
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={st.targetWaterGrams}
                        onChange={(e) => handleUpdateStep(idx, 'targetWaterGrams', parseFloat(e.target.value) || 0)}
                        placeholder="Target g"
                        className="w-full bg-[#1b1714] border border-[#332b24] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7] font-mono"
                      />
                      <span className="text-[11px] text-[#8e8174]">g</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={st.durationSeconds}
                        onChange={(e) => handleUpdateStep(idx, 'durationSeconds', parseInt(e.target.value) || 0)}
                        placeholder="Duration s"
                        className="w-full bg-[#1b1714] border border-[#332b24] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7] font-mono"
                      />
                      <span className="text-[11px] text-[#8e8174]">sec</span>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={st.instruction}
                    onChange={(e) => handleUpdateStep(idx, 'instruction', e.target.value)}
                    placeholder="Instructions for this step (e.g. Gentle spiral outward from center)"
                    className="w-full bg-[#1b1714] border border-[#332b24] rounded-lg px-3 py-1.5 text-xs text-[#ede3d7]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tasting Notes & Barista Tips */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#ded3c5] block mb-1">
                Tasting Notes (comma-separated)
              </label>
              <input
                type="text"
                value={tastingNotesInput}
                onChange={(e) => setTastingNotesInput(e.target.value)}
                placeholder="e.g. Bergamot, Peach, Jasmine, Honey"
                className="w-full bg-[#13110f] border border-[#332b24] rounded-lg px-3 py-2 text-xs text-[#ede3d7]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#ded3c5] block mb-1">
                Barista Tips / Dial-in Secrets
              </label>
              <textarea
                value={authorTips}
                onChange={(e) => setAuthorTips(e.target.value)}
                placeholder="e.g. Swirl gently in the bloom to prevent channeling; do not agitate too heavily in the late pour."
                rows={2}
                className="w-full bg-[#13110f] border border-[#332b24] rounded-lg p-3 text-xs text-[#ede3d7] placeholder-[#7d7063] resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#29221c]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#9d8f81] hover:text-[#ede3d7] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-[#181411] bg-gradient-to-r from-amber-400 to-[#d97706] hover:from-amber-300 hover:to-amber-500 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Publish Recipe to Community
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
