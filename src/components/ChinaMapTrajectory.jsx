import { useEffect, useRef, useState } from 'react'

// 中国地图简化 SVG 路径（主要省份轮廓）
const CHINA_MAP_PATH = "M200,150 L250,140 L300,145 L350,160 L380,150 L400,170 L420,180 L450,175 L480,190 L500,185 L520,200 L540,210 L560,205 L580,220 L600,215 L620,230 L640,225 L660,240 L680,250 L700,245 L720,260 L740,270 L750,280 L740,300 L720,310 L700,320 L680,330 L650,340 L620,350 L580,360 L540,370 L500,380 L460,390 L420,400 L380,410 L340,420 L300,430 L260,440 L220,450 L180,460 L140,470 L100,480 L80,500 L60,520 L40,500 L20,480 L-20,450 L-40,420 L-30,380 L-10,350 L10,320 L40,290 L80,270 L120,250 L160,230 L200,210 L240,190 L260,180 Z"

// 城市坐标映射（简化，基于 SVG 坐标系）
const CITY_COORDINATES = {
  '兰州': { x: 280, y: 240, color: '#2D6A4F' },
  '天水': { x: 350, y: 280, color: '#40916C' },
  '西安': { x: 420, y: 260, color: '#52B788' },
  '成都': { x: 300, y: 320, color: '#74C69D' },
  '重庆': { x: 380, y: 340, color: '#B7E4C7' },
  '北京': { x: 520, y: 180, color: '#1B4332' },
  '上海': { x: 600, y: 300, color: '#081C15' },
}

export default function ChinaMapTrajectory({ theme, routes = [] }) {
  const isDark = theme === 'dark'
  const svgRef = useRef(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  
  const bg = isDark ? '#161B22' : '#FFFFFF'
  const mapColor = isDark ? '#30363D' : '#E8E5DF'
  const textColor = isDark ? '#E6EDF3' : '#1C1C1E'
  const accent = '#2D6A4F'
  
  // 如果没有传入路由数据，使用默认轨迹
  const defaultRoutes = [
    { from: '兰州', to: '天水', date: '2025-09', distance: 340 },
    { from: '天水', to: '西安', date: '2025-12', distance: 400 },
  ]
  
  const activeRoutes = routes.length > 0 ? routes : defaultRoutes
  
  // 动画效果
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 1) {
          clearInterval(timer)
          return 1
        }
        return prev + 0.02
      })
    }, 30)
    return () => clearInterval(timer)
  }, [])
  
  // 生成轨迹路径
  const generateRoutePath = () => {
    const points = []
    activeRoutes.forEach(route => {
      const from = CITY_COORDINATES[route.from]
      const to = CITY_COORDINATES[route.to]
      if (from && to) {
        points.push({ from, to, ...route })
      }
    })
    return points
  }
  
  const routePoints = generateRoutePath()
  
  // 计算贝塞尔曲线控制点
  const getControlPoint = (from, to) => {
    const mx = (from.x + to.x) / 2
    const my = (from.y + to.y) / 2
    // 向上弯曲
    const offset = -50
    return { x: mx, y: my + offset }
  }

  return (
    <div 
      className="rounded-2xl overflow-hidden"
      style={{ 
        background: bg,
        border: `1px solid ${isDark ? '#30363D' : '#E8E5DF'}`,
      }}
    >
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-4" style={{ color: textColor }}>
          跑步轨迹全景
        </h3>
        
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox="-50 100 800 450"
            className="w-full h-auto"
            style={{ background: isDark ? '#0D1117' : '#FAF9F6', borderRadius: '12px' }}
          >
            {/* 中国地图轮廓 */}
            <path
              d={CHINA_MAP_PATH}
              fill="none"
              stroke={mapColor}
              strokeWidth="2"
              opacity="0.3"
            />
            
            {/* 省份简化示意（几个主要区域） */}
            {/* 西北 */}
            <circle cx="280" cy="240" r="40" fill={mapColor} opacity="0.1" />
            {/* 华北 */}
            <circle cx="520" cy="180" r="50" fill={mapColor} opacity="0.1" />
            {/* 华东 */}
            <circle cx="600" cy="300" r="45" fill={mapColor} opacity="0.1" />
            {/* 西南 */}
            <circle cx="300" cy="320" r="55" fill={mapColor} opacity="0.1" />
            {/* 华南 */}
            <circle cx="450" cy="420" r="60" fill={mapColor} opacity="0.1" />
            
            {/* 轨迹路径 */}
            {routePoints.map((route, idx) => {
              const cp = getControlPoint(route.from, route.to)
              const pathId = `route-${idx}`
              
              return (
                <g key={idx}>
                  {/* 轨迹线 */}
                  <path
                    id={pathId}
                    d={`M ${route.from.x} ${route.from.y} Q ${cp.x} ${cp.y} ${route.to.x} ${route.to.y}`}
                    fill="none"
                    stroke={accent}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="8 4"
                    opacity="0.8"
                    style={{
                      strokeDashoffset: 1000 * (1 - animationProgress),
                      transition: 'stroke-dashoffset 0.5s ease',
                    }}
                  />
                  
                  {/* 方向箭头 */}
                  <circle r="4" fill={accent} opacity="0.6">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path={`M ${route.from.x} ${route.from.y} Q ${cp.x} ${cp.y} ${route.to.x} ${route.to.y}`}
                    />
                  </circle>
                </g>
              )
            })}
            
            {/* 城市标记点 */}
            {Object.entries(CITY_COORDINATES).map(([city, coord]) => {
              const hasRoute = routePoints.some(r => r.from === city || r.to === city)
              
              return (
                <g key={city}>
                  {/* 脉动效果 */}
                  {hasRoute && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="8"
                      fill={coord.color}
                      opacity="0.3"
                    >
                      <animate
                        attributeName="r"
                        values="8;12;8"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.3;0.1;0.3"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  
                  {/* 主标记点 */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="6"
                    fill={hasRoute ? coord.color : mapColor}
                    stroke={bg}
                    strokeWidth="2"
                    style={{ transition: 'fill 0.3s' }}
                  />
                  
                  {/* 城市标签 */}
                  <text
                    x={coord.x + 10}
                    y={coord.y + 5}
                    fontSize="12"
                    fill={textColor}
                    fontWeight={hasRoute ? 'bold' : 'normal'}
                  >
                    {city}
                  </text>
                </g>
              )
            })}
            
            {/* 轨迹标注 */}
            {routePoints.map((route, idx) => {
              const mx = (route.from.x + route.to.x) / 2
              const my = (route.from.y + route.to.y) / 2 - 20
              
              return (
                <g key={`label-${idx}`}>
                  <rect
                    x={mx - 40}
                    y={my - 10}
                    width="80"
                    height="20"
                    rx="4"
                    fill={accent}
                    opacity="0.9"
                  />
                  <text
                    x={mx}
                    y={my + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#fff"
                    fontWeight="bold"
                  >
                    {route.date}
                  </text>
                </g>
              )
            })}
          </svg>
          
          {/* 图例 */}
          <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: textColor }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5" style={{ background: accent, borderStyle: 'dashed' }} />
              <span>跑步轨迹</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: accent }} />
              <span>途径城市</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 轨迹统计 */}
      <div 
        className="grid grid-cols-3 gap-4 p-6 pt-0"
        style={{ borderTop: `1px solid ${isDark ? '#30363D' : '#E8E5DF'}` }}
      >
        {[
          { label: '轨迹覆盖', value: `${Object.keys(CITY_COORDINATES).length}个城市` },
          { label: '总里程', value: `${activeRoutes.reduce((sum, r) => sum + r.distance, 0)}km` },
          { label: '时间跨度', value: '6个月' },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <div className="font-bold text-lg" style={{ color: accent }}>{stat.value}</div>
            <div className="text-xs" style={{ color: textColor, opacity: 0.6 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
