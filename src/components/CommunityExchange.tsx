import React, { useState } from 'react';
import { CommunityDiscussion, BrewMethod } from '../types/coffee';
import { 
  MessageSquare, ThumbsUp, Send, CheckCircle2, 
  HelpCircle, Coffee, Filter, Plus, Flame, Clock
} from 'lucide-react';

interface CommunityExchangeProps {
  discussions: CommunityDiscussion[];
  onAddDiscussion: (discussion: Omit<CommunityDiscussion, 'id' | 'createdAt' | 'upvotes' | 'replies'>) => void;
  onAddReply: (discussionId: string, content: string) => void;
  onToggleUpvoteDiscussion: (discussionId: string) => void;
  onToggleUpvoteReply: (discussionId: string, replyId: string) => void;
}

export const CommunityExchange: React.FC<CommunityExchangeProps> = ({
  discussions,
  onAddDiscussion,
  onAddReply,
  onToggleUpvoteDiscussion,
  onToggleUpvoteReply,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [isAskingQuestion, setIsAskingQuestion] = useState<boolean>(false);
  const [expandedDiscussionId, setExpandedDiscussionId] = useState<string | null>(discussions[0]?.id || null);

  // New question form state
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newMethod, setNewMethod] = useState<BrewMethod>('v60');
  const [newTags, setNewTags] = useState('V60 Beginner, Troubleshooting');
  const [newDose, setNewDose] = useState('15g');
  const [newWater, setNewWater] = useState('250g');
  const [newGrind, setNewGrind] = useState('Timemore C2 13 clicks');
  const [newTemp, setNewTemp] = useState('93°C');
  const [newTime, setNewTime] = useState('3:15 min');

  // Reply text state per discussion
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const filteredDiscussions = discussions.filter((d) => {
    if (selectedMethod === 'all') return true;
    return d.method === selectedMethod;
  });

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    onAddDiscussion({
      author: {
        name: 'You (Home Brewer)',
        handle: '@homebrewer',
        role: 'V60 Learner',
        avatarInitials: 'YOU',
        avatarColor: 'bg-amber-700',
      },
      method: newMethod,
      title: newTitle.trim(),
      body: newBody.trim(),
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      extractionDetails: {
        dose: newDose,
        water: newWater,
        grind: newGrind,
        temp: newTemp,
        totalTime: newTime,
      },
    });

    setNewTitle('');
    setNewBody('');
    setIsAskingQuestion(false);
  };

  const handleSendReply = (discussionId: string) => {
    const text = replyTextMap[discussionId];
    if (!text || !text.trim()) return;

    onAddReply(discussionId, text.trim());
    setReplyTextMap((prev) => ({ ...prev, [discussionId]: '' }));
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d2621] pb-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5efe6]">
            Coffee Lovers Exchange & Dial-in Advice
          </h2>
          <p className="text-xs text-[#a39486] mt-1">
            Exchange tips with fellow home baristas, troubleshoot stalled beds, and compare techniques.
          </p>
        </div>

        <button
          onClick={() => setIsAskingQuestion(!isAskingQuestion)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#181411] bg-gradient-to-r from-amber-400 to-[#d97706] hover:from-amber-300 hover:to-amber-500 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto active:scale-98"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Ask Question or Share Tip</span>
        </button>
      </div>

      {/* New Question Form Drawer / Modal */}
      {isAskingQuestion && (
        <form
          onSubmit={handlePostQuestion}
          className="bg-[#191512] border border-[#3e342c] rounded-2xl p-6 space-y-4 shadow-lg animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-[#2d251f] pb-3">
            <h3 className="font-serif text-base font-bold text-[#f5efe6] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Ask the Community for Dial-in Feedback
            </h3>
            <button
              type="button"
              onClick={() => setIsAskingQuestion(false)}
              className="text-xs text-[#8f8072] hover:text-[#ede3d7] cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#ded3c5] block mb-1">
                Brewing Method
              </label>
              <select
                value={newMethod}
                onChange={(e) => setNewMethod(e.target.value as BrewMethod)}
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

            <div>
              <label className="text-xs font-medium text-[#ded3c5] block mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="e.g. V60 Beginner, Muddy Bed, Water Temp"
                className="w-full bg-[#13110f] border border-[#332b24] rounded-lg px-3 py-2 text-xs text-[#ede3d7] focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#ded3c5] block mb-1">
              Title (What are you trying to troubleshoot or learn?)
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Why is my V60 bed muddy and water stalling at 4:30?"
              className="w-full bg-[#13110f] border border-[#332b24] rounded-lg px-3 py-2 text-xs text-[#ede3d7] focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#ded3c5] block mb-1">
              Detailed Description & What You Tasted
            </label>
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Describe your grinder, pouring method, how it tasted (sharp sour? bitter/dry?), and what happened during drawdown..."
              rows={3}
              className="w-full bg-[#13110f] border border-[#332b24] rounded-lg p-3 text-xs text-[#ede3d7] placeholder-[#7d7063] focus:outline-none focus:border-amber-500 resize-none"
              required
            />
          </div>

          {/* Quick extraction variables for accurate troubleshooting */}
          <div>
            <label className="text-[11px] font-semibold uppercase text-amber-400 block mb-2">
              Your Extraction Variables (Helps enthusiasts diagnose accurately)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <input
                type="text"
                value={newDose}
                onChange={(e) => setNewDose(e.target.value)}
                placeholder="Dose (15g)"
                className="bg-[#13110f] border border-[#332b24] rounded-lg px-2.5 py-1.5 text-xs text-[#ede3d7]"
              />
              <input
                type="text"
                value={newWater}
                onChange={(e) => setNewWater(e.target.value)}
                placeholder="Water (250g)"
                className="bg-[#13110f] border border-[#332b24] rounded-lg px-2.5 py-1.5 text-xs text-[#ede3d7]"
              />
              <input
                type="text"
                value={newGrind}
                onChange={(e) => setNewGrind(e.target.value)}
                placeholder="Grind setting"
                className="bg-[#13110f] border border-[#332b24] rounded-lg px-2.5 py-1.5 text-xs text-[#ede3d7]"
              />
              <input
                type="text"
                value={newTemp}
                onChange={(e) => setNewTemp(e.target.value)}
                placeholder="Temp (93°C)"
                className="bg-[#13110f] border border-[#332b24] rounded-lg px-2.5 py-1.5 text-xs text-[#ede3d7]"
              />
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="Brew time"
                className="bg-[#13110f] border border-[#332b24] rounded-lg px-2.5 py-1.5 text-xs text-[#ede3d7]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-[#181411] bg-gradient-to-r from-amber-400 to-[#d97706] hover:from-amber-300 hover:to-amber-500 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Post to Community
            </button>
          </div>
        </form>
      )}

      {/* Filter by Brew Method */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Discussions' },
          { id: 'v60', label: 'Hario V60' },
          { id: 'aeropress', label: 'AeroPress' },
          { id: 'mokapot', label: 'Moka Pot' },
          { id: 'chemex', label: 'Chemex' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedMethod(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedMethod === tab.id
                ? 'bg-[#2b241e] text-amber-200 border border-[#483b31]'
                : 'text-[#9c8e80] hover:text-[#ded3c5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Community Threads List */}
      <div className="space-y-4">
        {filteredDiscussions.map((disc) => {
          const isExpanded = expandedDiscussionId === disc.id;

          return (
            <div
              key={disc.id}
              className="bg-[#191512] border border-[#2e2620] hover:border-[#42372e] rounded-xl p-5 sm:p-6 transition-all shadow-sm space-y-4"
            >
              {/* Thread Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-[#8f8072]">
                    <span className="font-semibold uppercase tracking-wider text-amber-400 text-[10px]">
                      {disc.method.toUpperCase()}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{disc.author.name}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#a89c8f]">{disc.author.role}</span>
                    <span aria-hidden="true">·</span>
                    <span>{disc.createdAt}</span>
                  </div>

                  <h3
                    onClick={() => setExpandedDiscussionId(isExpanded ? null : disc.id)}
                    className="font-serif text-lg sm:text-xl font-bold text-[#f5efe6] hover:text-amber-200 transition-colors cursor-pointer leading-snug"
                  >
                    {disc.title}
                  </h3>
                </div>

                {/* Upvote button */}
                <button
                  onClick={() => onToggleUpvoteDiscussion(disc.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer shrink-0 ${
                    disc.userUpvoted
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-[#141210] border-[#29221c] text-[#8e8072] hover:text-[#ded3c5]'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${disc.userUpvoted ? 'fill-current' : ''}`} />
                  <span className="font-mono text-[11px] font-semibold mt-0.5 tabular-nums">
                    {disc.upvotes}
                  </span>
                </button>
              </div>

              {/* Thread Body */}
              <p className="text-xs text-[#cfc2b3] leading-relaxed whitespace-pre-line">
                {disc.body}
              </p>

              {/* Extraction Variables Badge Row if provided */}
              {disc.extractionDetails && (
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#a39587] bg-[#141210] p-2.5 rounded-lg border border-[#241e18]">
                  <span>Dose: <strong className="text-[#ded3c5]">{disc.extractionDetails.dose}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Water: <strong className="text-[#ded3c5]">{disc.extractionDetails.water}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Grind: <strong className="text-[#ded3c5]">{disc.extractionDetails.grind}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Temp: <strong className="text-[#ded3c5]">{disc.extractionDetails.temp}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Time: <strong className="text-amber-300">{disc.extractionDetails.totalTime}</strong></span>
                </div>
              )}

              {/* Unboxed Tags */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs text-[#8a7d71]">
                <span className="text-[10px] text-[#6b6055]">Topics:</span>
                {disc.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    <span>{tag}</span>
                    {idx < disc.tags.length - 1 && (
                      <span aria-hidden="true" className="text-[#453a31]">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Reply toggle & count */}
              <div className="border-t border-[#26201b] pt-3 flex items-center justify-between text-xs">
                <button
                  onClick={() => setExpandedDiscussionId(isExpanded ? null : disc.id)}
                  className="flex items-center gap-1.5 font-medium text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>
                    {disc.replies.length} {disc.replies.length === 1 ? 'Expert Tip' : 'Enthusiast Tips'}
                  </span>
                </button>
              </div>

              {/* Expanded Replies Section */}
              {isExpanded && (
                <div className="space-y-4 pt-2 border-t border-[#26201b]">
                  {disc.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-xl text-xs space-y-2 border transition-colors ${
                        reply.isAcceptedTip
                          ? 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/20'
                          : 'bg-[#141210] border-[#29221c]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full ${reply.author.avatarColor} flex items-center justify-center text-[9px] font-bold text-amber-100`}>
                            {reply.author.avatarInitials}
                          </div>
                          <span className="font-semibold text-[#ded3c5]">{reply.author.name}</span>
                          <span className="text-[10px] text-[#8a7d71]">({reply.author.role})</span>
                          {reply.isAcceptedTip && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              Accepted Barista Solution
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => onToggleUpvoteReply(disc.id, reply.id)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border cursor-pointer ${
                            reply.userUpvoted
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-[#1c1815] border-[#2d251f] text-[#8e8072] hover:text-[#ded3c5]'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span className="font-mono tabular-nums">{reply.upvotes}</span>
                        </button>
                      </div>

                      <p className="text-[#cfc2b3] leading-relaxed whitespace-pre-line pl-7">
                        {reply.content}
                      </p>
                    </div>
                  ))}

                  {/* Add Reply Input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={replyTextMap[disc.id] || ''}
                      onChange={(e) =>
                        setReplyTextMap({ ...replyTextMap, [disc.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendReply(disc.id);
                      }}
                      placeholder="Share your dial-in tip, grind adjustment or technique..."
                      className="flex-1 bg-[#13110f] border border-[#302721] rounded-lg px-3 py-2 text-xs text-[#ede3d7] placeholder-[#7d7063] focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendReply(disc.id)}
                      className="p-2 bg-[#2d251f] hover:bg-[#3d332a] text-amber-300 rounded-lg border border-[#45392f] transition-colors cursor-pointer"
                      title="Send Tip"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
