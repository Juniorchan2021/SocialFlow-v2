'use client';

interface Section {
  title: string;
  content: string;
  items?: string[];
}

interface Props {
  icon: string;
  title: string;
  description: string;
  sections: Section[];
  relatedLinks: { label: string; href: string }[];
}

export default function GuidePage({ icon, title, description, sections, relatedLinks }: Props) {
  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100">
      <nav className="flex items-center justify-between max-w-4xl mx-auto px-4 py-4">
        <a href="/" className="text-sm font-bold text-indigo-400">SocialFlow</a>
        <div className="flex gap-4 text-xs text-slate-400">
          <a href="/templates" className="hover:text-slate-200 transition">模板库</a>
          <a href="/history" className="hover:text-slate-200 transition">历史</a>
        </div>
      </nav>

      <header className="max-w-3xl mx-auto px-4 pt-12 pb-8">
        <span className="text-4xl mb-4 block">{icon}</span>
        <h1 className="text-3xl font-bold mb-3">{title}</h1>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-20">
        <article className="space-y-8">
          {sections.map((sec, i) => (
            <section key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-slate-100 mb-3">{sec.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-3 whitespace-pre-line">{sec.content}</p>
              {sec.items && (
                <ul className="space-y-1.5">
                  {sec.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <div className="mt-12 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 text-center">
          <p className="text-sm text-slate-300 mb-4">用 SocialFlow 检测你的内容是否符合以上规则</p>
          <a href="/"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition">
            🔍 免费检测
          </a>
        </div>

        {relatedLinks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-bold text-slate-400 mb-3">相关指南</h3>
            <div className="flex flex-wrap gap-2">
              {relatedLinks.map((link, i) => (
                <a key={i} href={link.href}
                  className="px-4 py-2 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700 hover:border-indigo-500 hover:text-indigo-400 transition">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-xs text-slate-600 border-t border-slate-800/50">
        SocialFlow v2.0 · Powered by MPChat
      </footer>
    </div>
  );
}
