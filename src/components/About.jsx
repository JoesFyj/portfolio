import { getConfig } from '../lib/siteConfig'
import { MapPin, BookOpen, Heart } from 'lucide-react'

const cfg = getConfig()

export default function About({ theme, lang }) {
  const isDark = theme === 'dark'
  const isZh = lang === 'zh'

  const content = {
    storyTitle: isZh ? '我是谁' : 'Who I Am',
    valuesTitle: isZh ? cfg.values.title : 'My Principles',
    skillsTitle: isZh ? '我能做什么' : 'What I Do',
    location: isZh ? '坐标' : 'Location',
    birth: isZh ? '生日' : 'Born',
    edu: isZh ? '学历' : 'Education',
  }

  return (
    <section id="about" className={`py-24 px-6 ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-2 mb-10">
          <div className={`w-1 h-6 rounded-full ${isDark ? 'bg-accent-dark' : 'bg-accent'}`} />
          <h2 className={`text-3xl font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{content.storyTitle}</h2>
        </div>

        {/* 故事 */}
        <div className="mb-10">
          {(isZh ? cfg.about.story : `
I come from the deep mountains of Gansu Province.

Growing up, I herded cattle, collected fertilizer, baked potatoes in the fields. The time with my grandmother still warms my heart.

My grandfather worked the land until he couldn't — collecting medicinal herbs to pay for my education. Even on his deathbed, he was thinking about earning money for his grandson's future. My mother, illiterate, cared for him for 30 years. Every night she sat beside me while I studied, the lamplight making her white hair stark against the dark.

I walked from the mountain fields to the city — Xi'an, where I earned my master's degree. I settled down, bought an apartment, got married.

At thirty, I understood something:

I don't want to sell my time for money anymore.

Eight hours a day to a company, trading my life for a salary that resets at the end of each month. That's not a path — that's a cycle.

The tools I use are AI. The method is self-media. The goal is to build digital assets that generate income without my direct involvement.

I'm walking this path now. I hope you'll join me.
          `).split('\n\n').map((para, i) => (
            <p key={i} className={`leading-relaxed mb-4 ${isDark ? 'text-muted-dark' : 'text-muted'}`}>{para}</p>
          ))}
        </div>

        {/* 基础信息 */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: BookOpen, label: content.birth, val: cfg.about.birthYear },
            { icon: MapPin, label: content.location, val: cfg.about.location },
            { icon: Heart, label: content.edu, val: cfg.about.education },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label}
              className={`rounded-xl p-4 border text-center ${isDark ? 'bg-surface-dark border-border-dark' : 'bg-surface border-border'}`}>
              <Icon size={14} className={isDark ? 'text-accent-dark mx-auto mb-1.5' : 'text-accent mx-auto mb-1.5'} />
              <div className={`text-xs ${isDark ? 'text-muted-dark' : 'text-muted'}`}>{label}</div>
              <div className={`text-sm font-medium mt-0.5 ${isDark ? 'text-text-dark' : 'text-text'}`}>{val}</div>
            </div>
          ))}
        </div>

        {/* 价值观 */}
        <div className="mb-10">
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-text-dark' : 'text-text'}`}>
            {content.valuesTitle}
          </h3>
          <div className="space-y-2">
            {cfg.values.items.map(({ label, desc }) => (
              <div key={label}
                className={`flex items-start gap-3 p-3 rounded-xl border ${isDark ? 'bg-surface-dark border-border-dark' : 'bg-surface border-border'}`}>
                <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isDark ? 'bg-accent-dark' : 'bg-accent'}`} />
                <div>
                  <div className={`text-sm font-medium ${isDark ? 'text-text-dark' : 'text-text'}`}>{label}</div>
                  <div className={`text-xs ${isDark ? 'text-muted-dark' : 'text-muted'}`}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 技能 */}
        <div>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-text-dark' : 'text-text'}`}>
            {content.skillsTitle}
          </h3>
          <div className="space-y-3">
            {cfg.skills.map(({ name, level }) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={isDark ? 'text-muted-dark' : 'text-muted'}>{name}</span>
                  <span className={isDark ? 'text-accent-dark' : 'text-accent'}>{level}%</span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-surface-dark' : 'bg-surface'}`}>
                  <div className={`h-full rounded-full ${isDark ? 'bg-accent-dark' : 'bg-accent'}`}
                    style={{ width: `${level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
