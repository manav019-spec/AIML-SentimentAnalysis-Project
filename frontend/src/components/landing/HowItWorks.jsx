import React from 'react';
import { Sparkles, Brain, CheckCircle2, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export const HowItWorks = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/[0.06]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Sentiment Logic (Matching Screenshot 5) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sentiment Logic</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
            How Comment Sentiment <br />Analysis Works
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            We fetch up to 500 recent comments directly from the YouTube API for the analyzed video. 
            Our multi-layer classification engine parses sarcasm, technical terminology, and emoji nuances 
            to classify each response as Positive, Neutral, or Negative.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#121820] border border-white/10 flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Instant NLP Scoring</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Calculates individual confidence scores from 0.0 to 1.0 per comment.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121820] border border-white/10 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Spam & Bot Filtering</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Cleans repetitive promotional spam to protect analytical accuracy.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Core Use Cases (Matching Screenshot 5) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Core Use Cases</h3>
            <span className="text-xs text-emerald-400 font-medium">Built for creators & brands</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#121820] border border-white/10 hover:border-emerald-500/30 transition-all space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h4 className="text-xs font-bold text-white">Audience Reception</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gauge reception instantly after uploading a new or experimental video format.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121820] border border-white/10 hover:border-emerald-500/30 transition-all space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h4 className="text-xs font-bold text-white">Competitor Benchmarking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze competitor uploads to see what their audiences complain about or appreciate.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121820] border border-white/10 hover:border-emerald-500/30 transition-all space-y-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h4 className="text-xs font-bold text-white">Detect Technical Issues</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Catch audio sync glitches, broken links in description, or missing code snippets immediately.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121820] border border-white/10 hover:border-emerald-500/30 transition-all space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h4 className="text-xs font-bold text-white">Trend Tracking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track how sentiment changes from upload day to 30 days later as broader audiences discover it.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
