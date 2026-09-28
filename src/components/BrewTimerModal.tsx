import React, { useState, useEffect, useRef } from 'react';
import { BrewRecipe, RecipeStep, BrewLogEntry } from '../types/coffee';
import { soundEngine } from '../utils/audio';
import { 
  Play, Pause, RotateCcw, SkipForward, SkipBack, Check, 
  Volume2, VolumeX, X, Scale, Thermometer, Droplets, ArrowRight,
  Sparkles, Coffee
} from 'lucide-react';

interface BrewTimerModalProps {
  recipe: BrewRecipe;
  onClose: () => void;
  onSaveBrewLog: (log: Omit<BrewLogEntry, 'id' | 'date'>) => void;
}

export const BrewTimerModal: React.FC<BrewTimerModalProps> = ({
  recipe,
  onClose,
  onSaveBrewLog,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [stepSecondsElapsed, setStepSecondsElapsed] = useState<number>(0);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Post-brew logging state
  const [sensoryBalance, setSensoryBalance] = useState<'sour_underextracted' | 'balanced_sweet' | 'bitter_overextracted'>('balanced_sweet');
  const [rating, setRating] = useState<number>(5);
  const [grinderSetting, setGrinderSetting] = useState<string>(
    recipe.grindSize.clicks.timemoreC2C3 
      ? `Timemore: ${recipe.grindSize.clicks.timemoreC2C3}` 
      : `${recipe.grindSize.category} (${recipe.grindSize.microns}μm)`
  );
  const [brewNotes, setBrewNotes] = useState<string>('');
  const [selectedTastingNotes, setSelectedTastingNotes] = useState<string[]>(recipe.tastingNotes);

  const timerRef = useRef<number | null>(null);

  const currentStep: RecipeStep = recipe.steps[currentStepIdx] || recipe.steps[0];
  const stepDuration = currentStep?.durationSeconds || 30;
  const stepTimeRemaining = Math.max(0, stepDuration - stepSecondsElapsed);

  // Audio mute toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  // Timer interval loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTotalSecondsElapsed((prev) => prev + 1);
        setStepSecondsElapsed((prev) => {
          const nextSec = prev + 1;
          const remaining = stepDuration - nextSec;

          // Sound cues for countdown
          if (remaining <= 3 && remaining > 0) {
            soundEngine.playCountdownTick(remaining);
          } else if (remaining === 0) {
            soundEngine.playCountdownTick(0);
          }

          // Step transition
          if (nextSec >= stepDuration) {
            if (currentStepIdx < recipe.steps.length - 1) {
              setCurrentStepIdx((idx) => idx + 1);
              soundEngine.playStepPing();
              return 0;
            } else {
              // Reached end of all steps
              setIsRunning(false);
              setIsCompleted(true);
              soundEngine.playCompletionChime();
              return stepDuration;
            }
          }
          return nextSec;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, currentStepIdx, stepDuration, recipe.steps.length]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIdx(0);
    setStepSecondsElapsed(0);
    setTotalSecondsElapsed(0);
    setIsCompleted(false);
  };

  const handleSkipNext = () => {
    if (currentStepIdx < recipe.steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
      setStepSecondsElapsed(0);
      soundEngine.playStepPing();
    } else {
      setIsRunning(false);
      setIsCompleted(true);
      soundEngine.playCompletionChime();
    }
  };

  const handleSkipPrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
      setStepSecondsElapsed(0);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSaveLog = () => {
    onSaveBrewLog({
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      method: recipe.method,
      doseGrams: recipe.doseGrams,
      waterGrams: recipe.waterGrams,
      waterTempC: recipe.waterTempC,
      grinderUsed: grinderSetting,
      grindSetting: grinderSetting,
      actualDrawdownSec: totalSecondsElapsed,
      sensoryBalance,
      overallRating: rating,
      notes: brewNotes,
      tastingNotesDetected: selectedTastingNotes,
    });
    onClose();
  };

  // Step progress percentage
  const stepProgressPercent = Math.min(100, Math.round((stepSecondsElapsed / stepDuration) * 100));
  const totalProgressPercent = Math.min(
    100, 
    Math.round((totalSecondsElapsed / Math.max(recipe.totalTargetTimeSec, 1)) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#181513] border border-[#383029] rounded-2xl shadow-2xl overflow-hidden my-auto text-[#f2ebe2]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2621] bg-[#141210]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#a19385]">
              <span className="font-semibold uppercase text-amber-400 tracking-wider text-[11px]">
                {recipe.methodLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span>{recipe.coffeeBean.name}</span>
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#f5efe6] truncate max-w-md">
              {recipe.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-[#221d19] hover:bg-[#2c2621] text-[#b0a294] hover:text-[#f2ebe2] border border-[#362e27] transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#221d19] hover:bg-[#2c2621] text-[#b0a294] hover:text-[#f2ebe2] border border-[#362e27] transition-colors cursor-pointer"
              title="Close Timer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Extraction Variables Quick Reference */}
        <div className="grid grid-cols-4 gap-2 px-6 py-3 bg-[#161311] border-b border-[#29221c] text-center text-xs">
          <div>
            <div className="text-[10px] text-[#8e8073]">Dose / Water</div>
            <div className="font-mono font-semibold text-[#ede3d7] tabular-nums">
              {recipe.doseGrams}g : {recipe.waterGrams}g
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#8e8073]">Target Temp</div>
            <div className="font-mono font-semibold text-[#ede3d7] tabular-nums">
              {recipe.waterTempC}°C ({recipe.waterTempF}°F)
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#8e8073]">Grind Setting</div>
            <div className="font-mono font-semibold text-[#ede3d7] truncate" title={recipe.grindSize.category}>
              {recipe.grindSize.category} ({recipe.grindSize.microns}μm)
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#8e8073]">Target Time</div>
            <div className="font-mono font-semibold text-amber-300 tabular-nums">
              {formatSeconds(recipe.totalTargetTimeSec)}
            </div>
          </div>
        </div>

        {/* Main Body: Active Timer or Completed View */}
        {!isCompleted ? (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Step Header & Timeline Tracker */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#a39486] mb-2">
                <span className="font-medium text-amber-400">
                  Step {currentStepIdx + 1} of {recipe.steps.length}: {currentStep.title}
                </span>
                <span className="font-mono tabular-nums">
                  Step remaining: {formatSeconds(stepTimeRemaining)}
                </span>
              </div>

              {/* Step Progress Bar */}
              <div className="w-full h-2 bg-[#25201b] rounded-full overflow-hidden border border-[#332a23]">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 rounded-full"
                  style={{ width: `${stepProgressPercent}%` }}
                />
              </div>

              {/* Multi-step pips */}
              <div className="flex items-center justify-between mt-2 gap-1.5">
                {recipe.steps.map((st, i) => (
                  <div
                    key={st.id}
                    onClick={() => {
                      setCurrentStepIdx(i);
                      setStepSecondsElapsed(0);
                    }}
                    className={`flex-1 h-1.5 rounded-full cursor-pointer transition-colors ${
                      i === currentStepIdx
                        ? 'bg-amber-400 ring-2 ring-amber-400/30'
                        : i < currentStepIdx
                        ? 'bg-[#6b5d51]'
                        : 'bg-[#29221d]'
                    }`}
                    title={`Step ${i + 1}: ${st.title}`}
                  />
                ))}
              </div>
            </div>

            {/* Giant Circular Digital Time Display & Target Water Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Left: Stopwatch */}
              <div className="flex flex-col items-center justify-center p-6 bg-[#13110f] border border-[#2b2520] rounded-2xl text-center">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#8a7d71] mb-1">
                  Total Elapsed Time
                </div>
                <div className="font-mono text-5xl sm:text-6xl font-extrabold text-[#f7efe6] tabular-nums tracking-tight">
                  {formatSeconds(totalSecondsElapsed)}
                </div>
                <div className="text-xs text-[#8f8174] mt-2 font-mono tabular-nums">
                  Target: {formatSeconds(recipe.totalTargetTimeSec)}
                </div>
              </div>

              {/* Right: Target Scale Water Weight */}
              <div className="p-6 bg-[#1f1a16] border border-[#382f27] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#b8ab9e]">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>Scale Target Weight</span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-300">
                    Step {currentStep.stepNumber} Target
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-4xl sm:text-5xl font-bold text-[#faf3eb] tabular-nums">
                    {currentStep.targetWaterGrams}
                  </span>
                  <span className="text-lg font-mono text-[#9e8f81]">grams</span>
                </div>

                {currentStep.flowRateRecommendation && (
                  <div className="flex items-center gap-2 text-xs text-amber-200/90 bg-[#29221c] px-3 py-1.5 rounded-lg border border-[#3f342a]">
                    <Droplets className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{currentStep.flowRateRecommendation}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Current Step Guidance & Technique Prompt */}
            <div className="bg-[#1b1714] border border-[#332b24] rounded-xl p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 font-mono font-bold text-sm">
                  {currentStep.stepNumber}
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#f5efe6]">
                    {currentStep.title}
                  </h4>
                  <p className="text-sm text-[#d4c8b9] mt-1 leading-relaxed">
                    {currentStep.instruction}
                  </p>
                </div>
              </div>
            </div>

            {/* Author Barista Advice for this recipe */}
            {recipe.authorTips && (
              <div className="text-xs text-[#a19385] bg-[#141210] p-3 rounded-lg border border-[#26201b] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#ded3c5]">Barista Secret: </span>
                  <span>{recipe.authorTips}</span>
                </div>
              </div>
            )}

            {/* Timer Controls: Big Play/Pause, Reset, Skip */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSkipPrev}
                disabled={currentStepIdx === 0}
                className="p-3 rounded-xl bg-[#221d19] hover:bg-[#2b241f] disabled:opacity-40 disabled:hover:bg-[#221d19] border border-[#382f27] text-[#c9bcad] hover:text-[#f5efe6] transition-colors cursor-pointer"
                title="Previous Step"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handleStartPause}
                className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-150 cursor-pointer shadow-lg active:scale-98 ${
                  isRunning
                    ? 'bg-[#3b322a] hover:bg-[#4a3f35] text-[#f7efe6] border border-[#54473c]'
                    : 'bg-gradient-to-r from-amber-400 to-[#d97706] hover:from-amber-300 hover:to-amber-500 text-[#181411]'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pause Timer</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>{totalSecondsElapsed === 0 ? 'Start Brewing' : 'Resume'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSkipNext}
                className="p-3 rounded-xl bg-[#221d19] hover:bg-[#2b241f] border border-[#382f27] text-[#c9bcad] hover:text-[#f5efe6] transition-colors cursor-pointer"
                title={currentStepIdx === recipe.steps.length - 1 ? 'Finish Brew' : 'Next Step'}
              >
                {currentStepIdx === recipe.steps.length - 1 ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <SkipForward className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-xl bg-[#221d19] hover:bg-[#2b241f] border border-[#382f27] text-[#8f8072] hover:text-[#ded3c5] transition-colors cursor-pointer ml-1"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Post-Brew Sensory Dial-in Logger View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#f7efe6]">
                Brew Complete!
              </h3>
              <p className="text-xs text-[#a99c8f]">
                Actual brew time: <span className="font-mono font-semibold text-amber-300">{formatSeconds(totalSecondsElapsed)}</span> (Target: {formatSeconds(recipe.totalTargetTimeSec)})
              </p>
            </div>

            {/* Sensory Balance Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#ded3c5] block">
                How did your cup taste? (Sensory Balance)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSensoryBalance('sour_underextracted')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    sensoryBalance === 'sour_underextracted'
                      ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500 text-amber-100'
                      : 'bg-[#1e1915] border-[#2f2721] text-[#9c8e80] hover:text-[#ded3c5]'
                  }`}
                >
                  <div className="text-xs font-bold text-amber-300">Under-Extracted / Sour</div>
                  <div className="text-[11px] text-[#b3a496] mt-0.5">Sharp, lemon-like, quick hollow finish. Needs finer grind or hotter water.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSensoryBalance('balanced_sweet')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    sensoryBalance === 'balanced_sweet'
                      ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500 text-emerald-100'
                      : 'bg-[#1e1915] border-[#2f2721] text-[#9c8e80] hover:text-[#ded3c5]'
                  }`}
                >
                  <div className="text-xs font-bold text-emerald-300">Dialed In & Sweet</div>
                  <div className="text-[11px] text-[#b3a496] mt-0.5">High sweetness, vibrant fruit acidity, silky body, long clean aftertaste!</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSensoryBalance('bitter_overextracted')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    sensoryBalance === 'bitter_overextracted'
                      ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500 text-rose-100'
                      : 'bg-[#1e1915] border-[#2f2721] text-[#9c8e80] hover:text-[#ded3c5]'
                  }`}
                >
                  <div className="text-xs font-bold text-rose-300">Over-Extracted / Bitter</div>
                  <div className="text-[11px] text-[#b3a496] mt-0.5">Astringent dry tongue, harsh bitterness, ashy or muddled finish. Grind coarser.</div>
                </button>
              </div>
            </div>

            {/* Overall Rating & Grinder Setting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#ded3c5] block mb-1.5">
                  Overall Score (1 - 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold text-sm cursor-pointer transition-colors ${
                        rating >= star
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-[#1b1714] border-[#2f2721] text-[#786b5e]'
                      }`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#ded3c5] block mb-1.5">
                  Grinder & Setting Used
                </label>
                <input
                  type="text"
                  value={grinderSetting}
                  onChange={(e) => setGrinderSetting(e.target.value)}
                  placeholder="e.g. Timemore C2 @ 14 clicks"
                  className="w-full bg-[#1b1714] border border-[#352c25] rounded-lg px-3 py-2 text-xs text-[#f2ebe2] focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Brew Notes */}
            <div>
              <label className="text-xs font-semibold text-[#ded3c5] block mb-1.5">
                Dial-in Observations & Next Brew Tweaks
              </label>
              <textarea
                value={brewNotes}
                onChange={(e) => setBrewNotes(e.target.value)}
                placeholder="e.g. Excellent peach sweetness! Bed drained in 3:18. Next time try 1 click coarser to see if floral aromatics open up even more."
                rows={3}
                className="w-full bg-[#1b1714] border border-[#352c25] rounded-lg p-3 text-xs text-[#f2ebe2] placeholder-[#7d7063] focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Actions: Save Log or Discard */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#29221c]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-[#9d8f81] hover:text-[#ede3d7] transition-colors cursor-pointer"
              >
                Close Without Saving
              </button>
              <button
                type="button"
                onClick={handleSaveLog}
                className="px-5 py-2.5 text-xs font-semibold text-[#181411] bg-gradient-to-r from-amber-400 to-[#d97706] hover:from-amber-300 hover:to-amber-500 rounded-lg shadow-sm transition-all cursor-pointer active:scale-98"
              >
                Save to Brew Journal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
