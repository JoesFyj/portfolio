import { getConfig } from '../lib/siteConfig'
import { ExternalLink, CheckCircle } from 'lucide-react'

export default function Courses({ lang }) {
  const cfg = getConfig()
  const isZh = lang === 'zh'

  return (
    <section id="courses" className="py-24 px-6" style={{ background: '#111110' }}>
      <div className="max-w-3xl mx-auto">

        {/* 标题 */}
        <div className="mb-16">
          <span className="section-label">
            <span className="text-2xl font-bold" style={{ color: '#2C2C2A' }}>01</span>
            Courses
          </span>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold"
            style={{ color: '#FAFAF8' }}
          >
            {isZh ? '学习之旅' : 'Learning Journey'}
          </h2>
          <div className="accent-bar mt-4" />
        </div>

        {/* 课程卡片 */}
        <div className="grid gap-4 md:grid-cols-2 mb-10">
          {(cfg.courses || []).map(course => (
            <div key={course.id} className="card-dark p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {course.free && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{ borderColor: '#D97706', color: '#D97706', background: 'rgba(217,119,6,0.1)' }}
                      >
                        免费
                      </span>
                    )}
                    <span className="text-xs" style={{ color: '#8B8B87' }}>{course.year}</span>
                  </div>
                  <h3 className="text-base font-semibold" style={{ color: '#D97706' }}>
                    {course.title}
                  </h3>
                </div>
                {course.url && (
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:border-amber-600"
                    style={{
                      background: 'rgba(217,119,6,0.1)',
                      borderColor: 'rgba(217,119,6,0.3)',
                      color: '#D97706',
                    }}
                  >
                    <ExternalLink size={11} />
                    访问
                  </a>
                )}
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#8B8B87' }}>
                {course.description}
              </p>
              <div className="flex items-center gap-4 text-xs" style={{ color: '#8B8B87' }}>
                <span>{course.duration}</span>
                <span className="flex items-center gap-1">
                  <CheckCircle size={10} style={{ color: '#D97706' }} />
                  可获结业证书
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 私域群 */}
        <div className="card-dark p-8 text-center max-w-xl mx-auto mb-6">
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>
            私域社群
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#FAFAF8' }}>
            {cfg.privateGroup?.title}
          </h3>
          <p className="text-sm mb-6" style={{ color: '#8B8B87' }}>
            {cfg.privateGroup?.desc}
          </p>
          {(cfg.privateGroup?.qrCodeBase64 || cfg.privateGroup?.qrCodeUrl) ? (
            <img
              src={cfg.privateGroup.qrCodeBase64 || cfg.privateGroup.qrCodeUrl}
              alt="群二维码"
              className="w-48 h-48 mx-auto rounded-2xl object-cover"
              style={{ border: '1px solid #2C2C2A' }}
            />
          ) : (
            <div
              className="w-48 h-48 mx-auto rounded-2xl border border-dashed flex items-center justify-center"
              style={{ borderColor: '#2C2C2A' }}
            >
              <span className="text-xs" style={{ color: '#8B8B87' }}>群二维码</span>
            </div>
          )}
          <p className="text-xs mt-4" style={{ color: '#8B8B87' }}>
            扫码添加微信，备注「AI」，拉你入群
          </p>
        </div>

        {/* 联系方式 */}
        <div className="card-dark p-6 max-w-xl mx-auto">
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#D97706' }}>
            联系方式
          </div>
          <div className="space-y-2">
            {[
              { label: '邮箱', val: cfg.contact?.email },
              { label: '微信', val: cfg.contact?.wechat },
              { label: '飞书', val: cfg.contact?.feishu },
            ].map(({ label, val }) => val ? (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs w-10 shrink-0" style={{ color: '#8B8B87' }}>{label}</span>
                <span className="text-sm" style={{ color: '#FAFAF8' }}>{val}</span>
              </div>
            ) : null)}
          </div>
        </div>

      </div>
    </section>
  )
}
