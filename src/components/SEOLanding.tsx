'use client';

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface FAQ {
  q: string;
  a: string;
}

interface Props {
  platformIcon: string;
  platformName: string;
  headline: string;
  subheadline: string;
  features: Feature[];
  faqs: FAQ[];
  ctaText: string;
}

export default function SEOLanding({ platformIcon, platformName, headline, subheadline, features, faqs, ctaText }: Props) {
  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100">
      <nav className="flex items-center justify-between max-w-5xl mx-auto px-4 py-4">
        <a href="/" className="text-sm font-bold text-indigo-400">SocialFlow</a>
        <div className="flex gap-4 text-xs text-slate-400">
          <a href="/templates" className="hover:text-slate-200 transition">模板库</a>
          <a href="/history" className="hover:text-slate-200 transition">历史</a>
        </div>
      </nav>

      <header className="text-center pt-16 pb-12 px-4">
        <span className="text-5xl mb-4 block">{platformIcon}</span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          {headline}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">{subheadline}</p>
        <a href="/"
          className="inline-block mt-8 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition shadow-lg shadow-indigo-500/20 text-sm">
          🔍 {ctaText}
        </a>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-center mb-8">核心功能</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="text-sm font-bold text-slate-200 mb-2">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-center mb-8">常见问题</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl group">
              <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-slate-200 list-none flex items-center justify-between">
                {faq.q}
                <span className="text-slate-500 group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="text-center py-16 px-4">
        <h2 className="text-2xl font-bold mb-3">立即开始检测</h2>
        <p className="text-slate-400 text-sm mb-6">免费 · 无需注册 · 即时结果</p>
        <a href="/"
          className="inline-block px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition shadow-lg shadow-indigo-500/20">
          免费检测 {platformName} 内容 →
        </a>
      </section>

      <footer className="text-center py-8 text-xs text-slate-600 border-t border-slate-800/50">
        SocialFlow v2.0 · Powered by MPChat · {platformName} 内容检测工具
      </footer>
    </div>
  );
}
