-- ============================================
-- 心路历程统一记录表 (三模块合一)
-- ============================================
CREATE TABLE IF NOT EXISTS journey_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module TEXT NOT NULL CHECK (module IN ('exercise', 'reading', 'social')),
  title TEXT NOT NULL,                      -- 标题（跑完主题/书名/复盘标题）
  cover_images TEXT[] DEFAULT '{}',         -- 封面图片URL数组
  content TEXT NOT NULL,                     -- 正文/感受
  record_date DATE NOT NULL,                 -- 记录日期
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE journey_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read journey_records" ON journey_records FOR SELECT USING (true);
CREATE POLICY "Auth write journey_records" ON journey_records FOR ALL USING (auth.role() = 'authenticated');
CREATE TRIGGER journey_records_updated_at BEFORE UPDATE ON journey_records FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_journey_records_module ON journey_records(module);
CREATE INDEX IF NOT EXISTS idx_journey_records_date ON journey_records(record_date DESC);

-- Storage bucket for journey images
INSERT INTO storage.buckets (id, name, public) VALUES ('journey-images', 'journey-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 小福分享舍 - Supabase 数据库建表脚本
-- ====================================================

-- 1. 作品表
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,                    -- 作品名称
  slug TEXT NOT NULL UNIQUE,             -- URL友好标识
  cover TEXT,                            -- 封面图URL
  description TEXT NOT NULL,             -- 一句话介绍 (50字内)
  full_description TEXT,                 -- 完整介绍
  category TEXT NOT NULL DEFAULT '其他',  -- 分类
  tags TEXT[] DEFAULT '{}',              -- 技术标签
  demo_url TEXT,                         -- 在线演示链接
  github_url TEXT,                       -- GitHub链接
  article_url TEXT,                      -- 相关文章链接
  video_url TEXT,                        -- 介绍视频链接
  status TEXT NOT NULL DEFAULT 'wip' CHECK (status IN ('live', 'beta', 'wip', 'archived')),
  featured BOOLEAN DEFAULT FALSE,        -- 是否精选
  sort_order INT DEFAULT 0,             -- 排序权重 (越大越靠前)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 心路历程-读书
CREATE TABLE IF NOT EXISTS journey_reading (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,                   -- 书名
  author TEXT,                           -- 作者
  cover TEXT,                            -- 封面图
  category TEXT DEFAULT '认知',           -- 分类：财富/认知/技术/文学
  status TEXT DEFAULT '在读' CHECK (status IN ('想读', '在读', '已读')),
  rating INT CHECK (rating BETWEEN 1 AND 5),  -- 评分
  short_review TEXT,                     -- 短评
  started_at DATE,                       -- 开始读日期
  finished_at DATE,                      -- 读完日期
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 心路历程-锻炼
CREATE TABLE IF NOT EXISTS journey_fitness (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT '跑步',     -- 类型：跑步/力量/骑行/其他
  duration_min INT,                      -- 时长(分钟)
  distance_km NUMERIC(5,2),             -- 距离(km)
  calories INT,                          -- 消耗卡路里
  notes TEXT,                            -- 备注
  date DATE NOT NULL DEFAULT CURRENT_DATE, -- 日期
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 心路历程-里程碑
CREATE TABLE IF NOT EXISTS journey_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,                   -- 里程碑标题
  description TEXT,                      -- 描述
  category TEXT NOT NULL DEFAULT '自媒体' CHECK (category IN ('读书', '锻炼', '自媒体', '人生')),
  date DATE NOT NULL,                    -- 日期
  icon TEXT DEFAULT '🎯',                -- 图标emoji
  image_url TEXT,                        -- 配图
  is_highlighted BOOLEAN DEFAULT FALSE,  -- 是否高亮
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 心路历程-自媒体数据
CREATE TABLE IF NOT EXISTS journey_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('抖音', '公众号', '小红书', 'Twitter')),
  followers INT DEFAULT 0,              -- 粉丝数
  content_count INT DEFAULT 0,          -- 内容数
  avg_views INT DEFAULT 0,              -- 平均阅读/播放
  best_views INT DEFAULT 0,             -- 最佳阅读/播放
  notes TEXT,                            -- 备注
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 站点配置 (动态配置)
CREATE TABLE IF NOT EXISTS site_config (
  id INT DEFAULT 1 PRIMARY KEY,
  hero_title TEXT DEFAULT '山里人的财商课',
  hero_subtitle TEXT DEFAULT '用AI给自己造一条自由的路',
  hero_slogan TEXT DEFAULT '少工作，多赚钱，以书为粮，以路为行',
  hero_avatar TEXT,
  about_text TEXT,
  reading_goal INT DEFAULT 52,          -- 年度读书目标
  fitness_goal INT DEFAULT 200,         -- 年度锻炼次数目标
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_journey_reading_status ON journey_reading(status);
CREATE INDEX IF NOT EXISTS idx_journey_fitness_date ON journey_fitness(date);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_date ON journey_milestones(date);
CREATE INDEX IF NOT EXISTS idx_journey_media_platform_date ON journey_media(platform, recorded_at);

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reading_updated_at BEFORE UPDATE ON journey_reading FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER fitness_updated_at BEFORE UPDATE ON journey_fitness FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER milestones_updated_at BEFORE UPDATE ON journey_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 初始站点配置
INSERT INTO site_config (id, hero_title, hero_subtitle, hero_slogan, about_text)
VALUES (1, '山里人的财商课', '用AI给自己造一条自由的路', '少工作，多赚钱，以书为粮，以路为行', '从甘肃深山走出来的普通人，用AI给自己造一条自由的路。分享关于赚钱、成长和适应时代的真实思考。')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Row Level Security (RLS) - 公开读取，需认证写入
-- ============================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_reading ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_fitness ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- 公开读取
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read reading" ON journey_reading FOR SELECT USING (true);
CREATE POLICY "Public read fitness" ON journey_fitness FOR SELECT USING (true);
CREATE POLICY "Public read milestones" ON journey_milestones FOR SELECT USING (true);
CREATE POLICY "Public read media" ON journey_media FOR SELECT USING (true);
CREATE POLICY "Public read config" ON site_config FOR SELECT USING (true);

-- 认证用户可写入 (通过Supabase Auth登录)
CREATE POLICY "Auth write projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write reading" ON journey_reading FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write fitness" ON journey_fitness FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write milestones" ON journey_milestones FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write media" ON journey_media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write config" ON site_config FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 内容运营系统 - 多Agent流水线数据表
-- ============================================

-- 1. 选题库
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,                   -- 选题标题
  angle TEXT,                            -- 选题角度
  source TEXT DEFAULT 'manual',          -- 来源: manual/hot/ai
  heat INT DEFAULT 0,                    -- 热度值
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'done')),
  reason TEXT,                           -- 推荐理由
  tags TEXT[] DEFAULT '{}',              -- 标签
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 文案库
CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  title TEXT NOT NULL,                   -- 文案标题
  content TEXT NOT NULL,                 -- 正文
  score NUMERIC(3,1),                    -- 评审评分 0-10
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewing', 'approved', 'rejected', 'published')),
  feedback TEXT,                         -- 评审反馈
  tags TEXT[] DEFAULT '{}',              -- 关键词标签
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 发布记录
CREATE TABLE IF NOT EXISTS publications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('wechat', 'douyin', 'xiaohongshu', 'twitter')),
  url TEXT,                              -- 发布链接
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
  error_log TEXT,                        -- 错误日志
  stats JSONB DEFAULT '{}',              -- 数据: {views, likes, shares, comments}
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 运营复盘
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  publication_id UUID REFERENCES publications(id) ON DELETE CASCADE,
  script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,
  overall_score NUMERIC(3,1),            -- 综合评分
  hook_score NUMERIC(3,1),               -- 开头钩子
  structure_score NUMERIC(3,1),          -- 结构
  data_score NUMERIC(3,1),               -- 数据硬度
  fluff_score NUMERIC(3,1),              -- 空话排查
  retention_score NUMERIC(3,1),          -- 留存
  analysis TEXT,                         -- 分析总结
  next_plan TEXT,                        -- 下次计划
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_topics_status ON topics(status);
CREATE INDEX IF NOT EXISTS idx_topics_priority ON topics(priority);
CREATE INDEX IF NOT EXISTS idx_scripts_status ON scripts(status);
CREATE INDEX IF NOT EXISTS idx_scripts_score ON scripts(score);
CREATE INDEX IF NOT EXISTS idx_publications_platform ON publications(platform);
CREATE INDEX IF NOT EXISTS idx_publications_published_at ON publications(published_at DESC);

-- 触发器
CREATE TRIGGER topics_updated_at BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER scripts_updated_at BEFORE UPDATE ON scripts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Public read scripts" ON scripts FOR SELECT USING (true);
CREATE POLICY "Public read publications" ON publications FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

CREATE POLICY "Auth write topics" ON topics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write scripts" ON scripts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write publications" ON publications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');
