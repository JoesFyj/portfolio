import { getConfig } from '../lib/siteConfig'

const cfg = getConfig()

export default function Vision({ theme }) {
  const isDark = theme === 'dark'

  return (
    <section className={`py-24 px-6 ${isDark ? 'bg-surface-dark' : 'bg-surface'}`}>
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-2 mb-10">
          <div className={`w-1 h-6 rounded-full ${isDark ? 'bg-accent-dark' : 'bg-accent'}`} />
          <h2 className={`text-3xl font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{cfg.vision.title}</h2>
        </div>

        {/* 终极愿景 */}
        <div className={`mb-6 p-5 rounded-2xl text-center ${isDark ? 'bg-bg-dark border border-accent-dark/20' : 'bg-bg border border-accent/20'}`}>
          <p className={`text-xs uppercase tracking-widest mb-3 ${isDark ? 'text-accent-dark' : 'text-accent'}`}>终极愿景</p>
          <p className={`text-lg font-semibold leading-relaxed ${isDark ? 'text-text-dark' : 'text-text'}`}>
            {cfg.about.finalVision}
          </p>
        </div>

        {/* 四个维度 */}
        <div className="grid grid-cols-2 gap-3">
          {cfg.vision.items.map(({ icon, label, desc }) => (
            <div key={label}
              className={`rounded-2xl p-5 border transition-all hover:border-accent/30 ${isDark ? 'bg-bg-dark border-border-dark' : 'bg-bg border-border'}`}>
              <div className="text-3xl mb-3">{icon}</div>
              <div className={`text-sm font-semibold mb-1 ${isDark ? 'text-text-dark' : 'text-text'}`}>{label}</div>
              <div className={`text-xs leading-relaxed ${isDark ? 'text-muted-dark' : 'text-muted'}`}>{desc}</div>
            </div>
          ))}
        </div>

        {/* 核心理念 */}
        <div className={`mt-10 p-6 rounded-2xl border ${isDark ? 'bg-bg-dark border-border-dark' : 'bg-bg border-border'}`}>
          <div className={`text-xs uppercase tracking-widest mb-3 text-center ${isDark ? 'text-accent-dark' : 'text-accent'}`}>核心理念</div>
          <div className="text-center">
            <p className={`text-base font-medium leading-relaxed ${isDark ? 'text-text-dark' : 'text-text'}`}>
              「{cfg.hero.tagline}」
            </p>
            <p className={`text-sm mt-2 ${isDark ? 'text-muted-dark' : 'text-muted'}`}>
              世界是公平的。不公平的是人。不去计较别人怎么对你，只管自己怎么做。
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
