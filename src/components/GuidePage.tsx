'use client';

import { Sparkles } from 'lucide-react';
import { useLang } from '@/lib/lang-context';

interface Section { title: string; content: string; items?: string[]; }
interface GuideContent { title: string; description: string; sections: Section[]; }
interface RelatedLink { labelZh: string; labelEn: string; href: string; }

interface Props {
  icon: string;
  zh: GuideContent;
  en: GuideContent;
  relatedLinks: RelatedLink[];
}

export default function GuidePage({ icon, zh, en, relatedLinks }: Props) {
  const { lang, t } = useLang();
  const data = lang === 'zh' ? zh : en;

  return (
    <div className="min-h-screen">
      <header className="max-w-3xl mx-auto px-4 pt-28 pb-10">
        <span className="text-4xl mb-4 block">{icon}</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">{data.title}</h1>
        <p className="text-zinc-500 text-sm leading-relaxed">{data.description}</p>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-20">
        <article className="space-y-4">
          {data.sections.map((sec, i) => (
            <section key={i} className="glass-elevated p-6">
              <h2 className="text-base font-bold text-zinc-100 mb-3 tracking-tight">{sec.title}</h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-3 whitespace-pre-line">{sec.content}</p>
              {sec.items && (
                <ul className="space-y-1.5">{sec.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-[11px] text-zinc-500"><span className="text-violet-400 mt-0.5 shrink-0">•</span><span>{item}</span></li>
                ))}</ul>
              )}
            </section>
          ))}
        </article>

        <div className="mt-12 glass-elevated p-8 text-center">
          <p className="text-sm text-zinc-400 mb-4">{t('用 SocialFlow 检测你的内容是否符合以上规则', 'Check your content with SocialFlow')}</p>
          <a href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm"><Sparkles size={14} /> {t('免费检测', 'Free Check')}</a>
        </div>

        {relatedLinks.length > 0 && (
          <div className="mt-8">
            <span className="section-label mb-3 block">{t('相关指南', 'Related')}</span>
            <div className="flex flex-wrap gap-2">{relatedLinks.map((link, i) => (
              <a key={i} href={link.href} className="btn-ghost px-4 py-2 text-xs">{lang === 'zh' ? link.labelZh : link.labelEn}</a>
            ))}</div>
          </div>
        )}
      </main>

      <footer className="text-center py-10 text-[11px] text-zinc-700 border-t border-white/[0.03]">SocialFlow v2.0 · Powered by MPChat</footer>
    </div>
  );
}
