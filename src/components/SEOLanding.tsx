'use client';

import { Sparkles } from 'lucide-react';

interface Feature { icon: string; title: string; desc: string; }
interface FAQ { q: string; a: string; }
interface Props { platformIcon: string; platformName: string; headline: string; subheadline: string; features: Feature[]; faqs: FAQ[]; ctaText: string; }

export default function SEOLanding({ platformIcon, platformName, headline, subheadline, features, faqs, ctaText }: Props) {
  return (
    <div className="min-h-screen">
      <header className="text-center pt-32 pb-16 px-4">
        <span className="text-6xl mb-6 block">{platformIcon}</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-[-0.04em] text-white leading-[1.1] max-w-3xl mx-auto mb-6">{headline}</h1>
        <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">{subheadline}</p>
        <a href="/" className="btn-primary inline-flex items-center gap-2 mt-10 px-8 py-4 text-sm">
          <Sparkles size={16} /> {ctaText}
        </a>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="section-label text-center mb-10">Core Features</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="glass-elevated p-6 group">
              <span className="text-2xl mb-4 block">{f.icon}</span>
              <h3 className="text-sm font-bold text-zinc-100 mb-2 tracking-tight">{f.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="section-label text-center mb-10">FAQ</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <details key={i} className="glass-elevated group">
              <summary className="px-6 py-4 cursor-pointer text-sm font-medium text-zinc-200 list-none flex items-center justify-between">
                {faq.q}
                <span className="text-zinc-600 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <div className="px-6 pb-5 text-xs text-zinc-500 leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="text-center py-20 px-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-4">Ready to check?</h2>
        <p className="text-zinc-500 text-sm mb-8">Free · No signup · Instant results</p>
        <a href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-sm">
          <Sparkles size={16} /> Free {platformName} Check →
        </a>
      </section>

      <footer className="text-center py-10 text-[11px] text-zinc-700 border-t border-white/[0.03]">
        SocialFlow v2.0 · Powered by MPChat · {platformName} Content Analyzer
      </footer>
    </div>
  );
}
