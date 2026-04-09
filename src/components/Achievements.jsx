import { useState } from 'react'
import { getConfig } from '../lib/siteConfig'
import { Trophy, Award, Medal, Star, ChevronRight, ExternalLink } from 'lucide-react'

const cfg = getConfig()

const DEFAULT_ACHIEVEMENTS = [
  {
    id: 1,
    title: 'WaytoAGI AI训练营 · 第五期',
    subtitle: '优秀学员',
    date: '2026年4月',
    type: 'certificate',
    desc: '完成8课全部作业，系统掌握 OpenClaw Agent 搭建与自动化运营能力',
    link: 'https://waytoagi.feishu.cn/wiki/P8LFwR1deipZGlkfZyRcyz3rnQd',
    icon: '🏆',
  },
  {
    id: 2,
    title: '公众号「生活的小虾」',
    subtitle: '持续原创写作中',
    date: '2026年3月至今',
    type: 'media',
    desc: '以书为粮，以路为行，记录从陇山深处到梦想生活的每一步',
    link: '',
    icon: '📮',
  },
  {
    id: 3,
    title: '数字资产管理系统',
    subtitle: '自动化运营 v1.0 上线',
    date: '2026年4月',
    type: 'project',
    desc: '搭建完整内容创作链路：选题→文案→封面→分发→多维表→监控→ROI分析',
    link: 'https://portfolio-zhifuxia.vercel.app',
    icon: '🤖',
  },
  {
    id: 4,
    title: '「廿九岁五则」',
    subtitle: '人生准则',
    date: '2025年 — 30岁',
    type: 'milestone',
    desc: '自爱、敬父母、包容待妻、守梦想、真诚待友',
    link: '',
    icon: '✦',
  },
]

const TYPE_META = {
  certificate: { label: '证书', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800/40', icon: Trophy },
  media:       { label: '媒体', color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/20',   border: 'border-blue-200 dark:border-blue-800/40',   icon: Award },
  project:     { label: '项目', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800/40', icon: Star },
  milestone:   { label: '里程碑', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800/40', icon: Medal },
}

export default function Achievements({ theme }) {
  const isDark = theme === 'dark'
  const achievements = cfg.achievements?.length ? cfg.achievements : DEFAULT_ACHIEVEMENTS
  const [expanded, setExpanded] = useState(null)

  return (
    <section id="achievements" className={`py-24 px-6 ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-2 mb-2">
          <div className={`w-1 h-6 rounded-full ${isDark ? 'bg-accent-dark' : 'bg-accent'}`} />
          <span className={`text-xs uppercase tracking-widest font-medium ${isDark ? 'text-muted-dark' : 'text-muted'}`}>
            Achievements
          </span>
        </div>
        <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-text-dark' : 'text-text'}`}>
          走过的路
        </h2>

        <div className="relative">
          {/* 时间轴竖线 */}
          <div className={`absolute left-4 top-2 bottom-2 w-px ${isDark ? 'bg-border-dark' : 'bg-border'}`} />

          <div className="space-y-4 pl-10">
            {(achievements || []).map((item, i) => {
              const meta = TYPE_META[item.type] || TYPE_META.milestone
              const IconComp = meta.icon
              const isOpen = expanded === item.id

              return (
                <div key={item.id || i} className="relative">
                  {/* 时间轴圆点 */}
                  <div className={`absolute -left-6 top-3.5 w-3 h-3 rounded-full border-2 ${isDark ? 'bg-bg-dark border-accent-dark' : 'bg-bg border-accent'}`} />

                  <div className={`rounded-2xl border transition-all ${meta.border} ${meta.bg} ${isDark ? 'bg-surface-dark' : 'bg-surface'}`}>
                    <div
                      className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer"
                      onClick={() => setExpanded(isOpen ? null : item.id)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-sm font-semibold ${isDark ? 'text-text-dark' : 'text-text'}`}>
                              {item.title}
                            </h3>
                            <span className={`text-xs px-1.5 py-0.5 rounded border ${meta.bg} ${meta.color} ${meta.border}`}>
                              {meta.label}
                            </span>
                          </div>
                          <div className={`text-xs mt-0.5 ${isDark ? 'text-muted-dark' : 'text-muted'}`}>
                            {item.subtitle} · {item.date}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} className={`shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''} ${isDark ? 'text-muted-dark' : 'text-muted'}`} />
                    </div>

                    {isOpen && (
                      <div className={`px-5 pb-4 border-t ${isDark ? 'border-border-dark' : 'border-border'} pt-3`}>
                        <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-muted-dark' : 'text-muted'}`}>
                          {item.desc}
                        </p>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${isDark ? 'text-accent-dark hover:underline' : 'text-accent hover:underline'}`}
                          >
                            <ExternalLink size={11} />
                            查看详情
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 说明 */}
        <div className={`mt-8 p-4 rounded-xl text-xs leading-relaxed ${isDark ? 'bg-surface-dark text-muted-dark border-border-dark' : 'bg-surface text-muted border-border'}`}>
          数据来源：飞书多维表「数字资产库 · 公众号」+ OpenClaw 自动化记录 + 个人里程碑。
          随运营持续更新。
        </div>

      </div>
    </section>
  )
}
