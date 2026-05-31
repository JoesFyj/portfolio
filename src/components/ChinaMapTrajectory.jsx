import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

// 默认城市坐标（lng, lat）
const DEFAULT_CITIES = [
  { name: '兰州', lng: 103.73, lat: 36.03 },
  { name: '天水', lng: 105.72, lat: 34.58 },
  { name: '西安', lng: 108.95, lat: 34.27 },
  { name: '成都', lng: 104.07, lat: 30.57 },
  { name: '重庆', lng: 106.55, lat: 29.57 },
  { name: '北京', lng: 116.40, lat: 39.90 },
  { name: '上海', lng: 121.47, lat: 31.23 },
]

// 默认路线
const DEFAULT_ROUTES = [
  { from: '兰州', to: '天水', date: '2025-09', distance: 340 },
  { from: '天水', to: '西安', date: '2025-12', distance: 400 },
]

export default function ChinaMapTrajectory({ theme, config = {} }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)

  const isDark = theme === 'dark'

  // 从配置中取数据，回退到默认值
  const cities = config.cities?.length ? config.cities : DEFAULT_CITIES
  const routes = config.routes?.length ? config.routes : DEFAULT_ROUTES

  useEffect(() => {
    let disposed = false

    const init = async () => {
      try {
        const resp = await fetch('/china.json')
        const geoJson = await resp.json()
        if (disposed) return

        echarts.registerMap('china', geoJson)

        const chart = echarts.init(containerRef.current, isDark ? undefined : undefined, {
          renderer: 'canvas',
        })
        chartRef.current = chart

        // 构建路线数据
        const routeLines = routes.map(r => {
          const fromCity = cities.find(c => c.name === r.from)
          const toCity = cities.find(c => c.name === r.to)
          return {
            coords: fromCity && toCity
              ? [[fromCity.lng, fromCity.lat], [toCity.lng, toCity.lat]]
              : [],
            ...r,
          }
        }).filter(r => r.coords.length === 2)

        // 路线经过的城市名
        const routeCityNames = new Set()
        routes.forEach(r => {
          routeCityNames.add(r.from)
          routeCityNames.add(r.to)
        })

        const mapBg = isDark ? '#0D1117' : '#FAF9F6'
        const borderColor = isDark ? '#238636' : '#2D6A4F'
        const areaColor = isDark ? '#161B22' : '#F4F2EE'
        const labelColor = isDark ? '#8B949E' : '#6B6860'
        const accent = '#2D6A4F'
        const routeColor = isDark ? '#52B788' : '#2D6A4F'

        const option = {
          backgroundColor: mapBg,
          tooltip: {
            trigger: 'item',
            backgroundColor: isDark ? '#21262D' : '#fff',
            borderColor: isDark ? '#30363D' : '#E8E5DF',
            textStyle: { color: isDark ? '#E6EDF3' : '#1C1C1E', fontSize: 12 },
            formatter: (params) => {
              if (params.seriesType === 'lines' && params.data) {
                return `${params.data.from} → ${params.data.to}<br/>📅 ${params.data.date}<br/>🏃 ${params.data.distance}km`
              }
              if (params.seriesType === 'scatter' && params.data) {
                const city = params.data
                const hasRoute = routeCityNames.has(city.name)
                return `<b>${city.name}</b>${hasRoute ? '<br/>✅ 已打卡' : '<br/>⏳ 待解锁'}`
              }
              return params.name || ''
            },
          },
          geo: {
            map: 'china',
            roam: false,
            zoom: 1.2,
            center: [104.5, 36],
            aspectScale: 0.85,
            label: { show: false },
            itemStyle: {
              areaColor: areaColor,
              borderColor: isDark ? '#30363D' : '#D8D4CD',
              borderWidth: 1,
              shadowBlur: 0,
            },
            emphasis: {
              disabled: true,
            },
            regions: [],
          },
          series: [
            // 路线轨迹线
            {
              type: 'lines',
              coordinateSystem: 'geo',
              polyline: false,
              data: routeLines,
              lineStyle: {
                color: routeColor,
                width: 2.5,
                opacity: 0.9,
                curveness: 0.15,
                type: 'dashed',
              },
              effect: {
                show: true,
                period: 4,
                trailLength: 0.15,
                symbol: 'circle',
                symbolSize: 6,
                color: accent,
              },
              zlevel: 2,
            },
            // 未打卡城市（灰色）
            {
              type: 'scatter',
              coordinateSystem: 'geo',
              data: cities
                .filter(c => !routeCityNames.has(c.name))
                .map(c => ({
                  name: c.name,
                  value: [c.lng, c.lat],
                })),
              symbol: 'pin',
              symbolSize: 28,
              itemStyle: {
                color: isDark ? '#21262D' : '#E8E5DF',
                borderColor: isDark ? '#484F58' : '#C0BEB8',
                borderWidth: 2,
              },
              label: {
                show: true,
                formatter: '{b}',
                position: 'right',
                distance: 5,
                fontSize: 11,
                color: isDark ? '#484F58' : '#B0AEA8',
              },
              emphasis: {
                scale: 1.2,
              },
              zlevel: 1,
            },
            // 已打卡城市（绿色高亮）
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: cities
                .filter(c => routeCityNames.has(c.name))
                .map(c => ({
                  name: c.name,
                  value: [c.lng, c.lat],
                })),
              symbol: 'pin',
              symbolSize: 32,
              showEffectOn: 'render',
              rippleEffect: {
                brushType: 'stroke',
                scale: 2.5,
                period: 3,
                color: accent,
              },
              itemStyle: {
                color: accent,
              },
              label: {
                show: true,
                formatter: '{b}',
                position: 'right',
                distance: 5,
                fontSize: 12,
                color: isDark ? '#E6EDF3' : '#1C1C1E',
                fontWeight: 'bold',
              },
              emphasis: {
                scale: 1.5,
              },
              zlevel: 3,
            },
            // 路线信息标注（飞行线中间）
            {
              type: 'scatter',
              coordinateSystem: 'geo',
              data: routeLines.map(r => {
                const midLng = (r.coords[0][0] + r.coords[1][0]) / 2
                const midLat = (r.coords[0][1] + r.coords[1][1]) / 2
                return {
                  name: `${r.from}→${r.to}`,
                  value: [midLng, midLat],
                  date: r.date,
                  distance: r.distance,
                }
              }),
              symbolSize: 0,
              label: {
                show: true,
                formatter: (p) => `${p.data.date}\n${p.data.distance}km`,
                position: 'top',
                fontSize: 10,
                color: routeColor,
                backgroundColor: isDark ? 'rgba(13,17,23,0.85)' : 'rgba(250,249,246,0.85)',
                borderColor: isDark ? '#30363D' : '#E8E5DF',
                borderWidth: 0.5,
                borderType: 'solid',
                borderRadius: 4,
                padding: [4, 8],
              },
              zlevel: 2,
            },
          ],
        }

        chart.setOption(option)

        // 响应式
        const handleResize = () => chart?.resize()
        window.addEventListener('resize', handleResize)

        return () => {
          window.removeEventListener('resize', handleResize)
          chart.dispose()
        }
      } catch (err) {
        console.error('ChinaMapTrajectory init error:', err)
      }
    }

    init()

    return () => {
      disposed = true
      chartRef.current?.dispose()
    }
  }, [isDark, cities, routes])

  // 统计数据
  const routeCityNames = new Set()
  routes.forEach(r => {
    routeCityNames.add(r.from)
    routeCityNames.add(r.to)
  })
  const totalDistance = routes.reduce((sum, r) => sum + (r.distance || 0), 0)
  const coveredCities = routeCityNames.size

  const textColor = isDark ? '#E6EDF3' : '#1C1C1E'
  const mutedColor = isDark ? '#8B949E' : '#6B6860'
  const accent = '#2D6A4F'

  return (
    <div>
      {/* 地图区域 */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '420px' }}
      />

      {/* 统计栏 */}
      <div
        className="grid grid-cols-3 gap-4 px-6 pb-5"
        style={{ borderTop: `1px solid ${isDark ? '#30363D' : '#E8E5DF'}` }}
      >
        {[
          { label: '覆盖城市', value: `${coveredCities}个` },
          { label: '跑步轨迹', value: `${routes.length}条` },
          { label: '累计里程', value: `${totalDistance}km` },
        ].map(stat => (
          <div key={stat.label} className="text-center pt-4">
            <div className="font-bold text-lg" style={{ color: accent }}>{stat.value}</div>
            <div className="text-xs mt-1" style={{ color: mutedColor }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}