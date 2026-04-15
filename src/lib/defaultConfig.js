export const DEFAULT_CONFIG = {

  // ==================== 站点基础信息 ====================
  site: {
    title: '小福老师',
    subtitle: 'AI探索者 · 西工大硕士',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    avatarBase64: '',
  },

  // ==================== Hero ====================
  hero: {
    tagline: '少工作，多赚钱，以书为粮，以路为行',
    sub: '从甘肃深山到西安城，用AI把自己变成一家公司。提示词工程、智能体搭建、AI+自媒体——让机器打工，你当老板。',
  },

  // Hero 打字机文字
  heroTyping: {
    zh: [
      '少工作，多赚钱，以书为粮，以路为行',
      '从甘肃深山到西安城，用AI把自己变成一家公司',
      '提示词工程 · 智能体搭建 · AI自媒体',
    ],
    en: [
      'Less Working More Earning — Books As Food Roads As Path',
      'From Gansu mountains to Xi\'an city, building a company with AI',
      'Prompt Engineering · AI Agents · AI Self-Media',
    ],
  },

  // ==================== 01 我从哪里来 ====================
  homeAbout: {
    title: '我从哪里来',
    // 左信息卡片
    labels: [
      { label: '出生地', val: '甘肃·陇山' },
      { label: '学历',   val: '西安工业大学·硕士' },
      { label: '现居',   val: '西安' },
    ],
    // 正文段落，\n\n 分割
    story: `我来自甘肃深山。

小时候放牛、捡粪、烧土豆，和外婆在一起的日子现在想起来还是暖的。爷爷瘫痪前一直在干活，挖药供我读书。临终前还惦记"挖药给孙子挣娶媳妇的钱"。母亲不识字，照顾爷爷三十年，每晚坐在缝纫机前陪我看书，灯光下头发白得刺眼。

我从田埂走到书桌——西安工业大学，硕士毕业。在城市里扎下根，买了房，结了婚。

三十岁这年，我想明白一件事：不想再靠时间赚钱了。8小时卖给公司，换一份工资，月底归零。这不是路，这是圈。

这条路的工具是AI。方式是自媒体。方法是持续输出，积累数字资产。

我不是技术天才，我只是一个会用工具的普通人。希望你也在路上。`,
  },

  // ==================== 03 我的能力 ====================
  homeCapabilities: {
    title: '我有哪些能力',
    items: [
      { title: 'AI智能体',    subtitle: 'Agent搭建与工作流设计' },
      { title: '提示词工程',  subtitle: 'Prompt优化与框架设计' },
      { title: 'AI写作',      subtitle: '公众号与自媒体文案' },
      { title: '自动化运营',  subtitle: 'RPA与业务流程自动化' },
      { title: '自媒体',      subtitle: '内容创作与账号运营' },
      { title: '智能体培训',  subtitle: 'AI工具使用与教学' },
    ],
  },


  // ==================== 04 我的作品 ====================
  homePortfolio: {
    title: '我在写什么',
    subtitle: '公众号持续更新中',
    ctaText: '扫码关注公众号',
  },

  works: [
    {
      id: 1,
      title: '被AI控住的三年，没人告诉的真相',
      description: '从2023年追AI智能体到vibe coding，三年后回头看，发现自己被困住了。各方都在利用焦虑赚钱，真正清醒的方式是：看谁在赚钱、分清革命还是优化、等三个月冷静。',
      tags: ['AI反思', '真相', '焦虑'],
      year: '2026',
      url: 'https://fcn0qrzcss9t.feishu.cn/wiki/QZuuw5jRdilOagkgul5cizdHn9g',
    },
    {
      id: 2,
      title: '付费几千后我发现AI+自媒体根本不是学出来的',
      description: '买了四门课，收藏了无数干货，结果连第一条视频都没拍出来。真相是：自媒体不是"学"出来的，是"干"出来的。拍了100条烂视频之后，才知道哪条有人看。',
      tags: ['自媒体', '行动派', '真相'],
      year: '2026',
      url: 'https://fcn0qrzcss9t.feishu.cn/wiki/HuMgw3Nk7iK52QkdoCVco5SNnds',
    },
    {
      id: 3,
      title: '放下那个较劲的自己',
      description: '读于东来故事有感。人这辈子最好的活法：吃饱饭，爱对人，睡好觉，别较劲。开悟从来不是得到了什么，而是放下了什么。放下那个较劲的自己，你就赢了。',
      tags: ['人生观', '于东来', '处世智慧'],
      year: '2026',
      url: 'https://fcn0qrzcss9t.feishu.cn/wiki/N5JpwkOLUi2GeDkZFNEc8Fgnnlg',
    },
    {
      id: 4,
      title: '三十岁，我开始羡慕那些无聊的人',
      description: '有能力选择过一种简单生活的那种无聊，不是躺平，是清醒。',
      tags: ['自我认知', '自由职业', '放下较劲'],
      year: '2026',
      url: '',
    },
  ],

  // ==================== 05 成长轨迹 ====================
  homeTimeline: {
    title: '我走了多远',
    nodes: [
      { year: '小学', label: '甘肃深山',       insight: '放牛、捡粪、烧土豆，世界很大，我在山里' },
      { year: '初中', label: '走出大山',       insight: '第一次离开家，开始知道读书是出路' },
      { year: '高中', label: '西安',           insight: '拼命读书，成绩是山里孩子的全部骄傲' },
      { year: '大学', label: '西安工业大学',   insight: '第一次坐火车，第一次进图书馆' },
      { year: '毕业', label: '第一份工作',     insight: '进了公司，发现8小时卖给公司，月底归零' },
      { year: '2025', label: 'WaytoAGI 第四期', insight: 'vibe coding 方向，优秀学员毕业',
        url: 'https://waytoagi.feishu.cn/wiki/P8LFwR1deipZGlkfZyRcyz3rnQd' },
      { year: '2026', label: 'WaytoAGI 第五期', insight: 'OpenClaw 方向，系统掌握 Agent 搭建',
        url: 'https://waytoagi.feishu.cn/wiki/P8LFwR1deipZGlkfZyRcyz3rnQd' },
      { year: '现在', label: '持续行动中',     insight: '不想再卖时间了，用AI把自己变成一家公司' },
    ],
  },

  // ==================== 06 我的其他 ====================
  homeOther: {
    title: '我的其他',
    items: [
      { label: '座右铭',     value: '少工作，多赚钱，以书为粮，以路为行' },
      { label: '喜欢的作家', value: '刘震云 · 史铁生' },
      { label: '喜欢的明星', value: '邓超' },
      { label: '喜欢宠物',   value: '狗' },
    ],
  },

  // ==================== 07 找到我 ====================
  homeConnect: {
    title: '找到我',
    subtitle: 'AI探索路上，一起走',
    description: '关注公众号，生活的小虾。回复「AI」入群，与同路人一起成长。',
    wechat:   '',
    wechatQr: '',
    gzh:      '生活的小虾',
    gzhQr:    '',
    jike:     '',
    twitter:  '',
    douyin:   '',
  },

  // ==================== 04 答题了解我 ====================
  homeQuiz: {
    title: '答题了解我',
    subtitle: '几道题，读懂一个人',
    questions: [
      {
        question: '小福老师小时候在哪里长大？',
        options: [
          { label: '西安城里', reveal: '不是哦，是甘肃深山，放牛捡粪烧土豆的那种。' },
          { label: '甘肃深山', reveal: '对！甘肃陇山，外婆陪着他长大，那是世界上最温暖的地方。' },
          { label: '兰州', reveal: '不是兰州，是甘肃更深的山里。' },
          { label: '不知道', reveal: '甘肃深山放牛娃，这是他最真实的起点。' },
        ],
      },
      {
        question: '他靠什么走出了大山？',
        options: [
          { label: '做生意', reveal: '' },
          { label: '读书', reveal: '是的。爷爷挖药供他读书，母亲陪他坐到缝纫机旁点灯看书。这是他唯一的路。' },
          { label: '当兵', reveal: '' },
          { label: '运气好', reveal: '' },
        ],
      },
      {
        question: '他现在主要在做什么？',
        options: [
          { label: '上班打工', reveal: '' },
          { label: 'AI + 自媒体', reveal: '对！提示词工程、智能体搭建、AI自媒体。他不想再把8小时卖给公司了。' },
          { label: '卖课', reveal: '' },
          { label: '写代码', reveal: '' },
        ],
      },
      {
        question: '他最相信的一句话？',
        options: [
          { label: '读书是改变命运的唯一渠道', reveal: '这是他的底层信仰。从深山到硕士，全靠读书。' },
          { label: '人脉决定命运', reveal: '' },
          { label: '风口比努力重要', reveal: '' },
          { label: '选择比努力重要', reveal: '' },
        ],
      },
      {
        question: '他现在最想戒掉什么？',
        options: [
          { label: '懒惰', reveal: '' },
          { label: '较劲', reveal: '「吃饱饭，爱对人，睡好觉，别较劲。」这是他最近悟到的。' },
          { label: '焦虑', reveal: '' },
          { label: '手机', reveal: '' },
        ],
      },
      {
        question: '如果只能选一个，你觉得他更像哪种人？',
        options: [
          { label: '野心家', reveal: '' },
          { label: '理想主义者', reveal: '' },
          { label: '行动派', reveal: '他不算野心家，更像一个愿意把AI用起来的行动派。拍了100条烂视频，才知道哪条有人看。' },
          { label: '悲观者', reveal: '' },
        ],
      },
    ],
  },

  // ==================== Footer ====================
  footer: {
    tagline:   '以书为粮，以路为行。',
    copyright: '© 2026 生活的小虾 · 小福老师',
  },

  // ==================== 作品中心 Hub ====================

  // 课程 / 学习之旅
  courses: [
    {
      id: 'placeholder',
      title: '课程内容',
      platform: '',
      free: false,
      year: '',
      description: '暂未开放',
      certificate: '',
      duration: '',
      url: '',
      isPlaceholder: true,
    },
  ],

  // 成就
  achievements: [
    {
      id: 1,
      title: 'WaytoAGI 第四期 vibe coding 训练营',
      subtitle: '优秀学员',
      date: '2025年',
      type: 'certificate',
      desc: 'vibe coding 方向，优秀学员毕业',
      link: '',
      icon: '🏆',
    },
    {
      id: 2,
      title: 'WaytoAGI 第五期 OpenClaw 训练营',
      subtitle: '学员',
      date: '2026年4月',
      type: 'certificate',
      desc: '完成全部8课作业，系统掌握 Agent 搭建与自动化运营',
      link: 'https://waytoagi.feishu.cn/wiki/P8LFwR1deipZGlkfZyRcyz3rnQd',
      icon: '🏆',
    },
    {
      id: 3,
      title: '智能体高级工程师',
      subtitle: '认证',
      date: '2026年',
      type: 'certificate',
      desc: 'AI智能体系统设计与搭建能力认证',
      link: '',
      icon: '🤖',
    },
    {
      id: 4,
      title: 'AI智能体讲师',
      subtitle: '讲师',
      date: '2026年',
      type: 'project',
      desc: '分享AI智能体搭建与自媒体运营经验',
      link: '',
      icon: '🎙️',
    },
    {
      id: 5,
      title: '公众号「生活的小虾」',
      subtitle: '持续原创写作中',
      date: '2026年3月至今',
      type: 'media',
      desc: '以书为粮，以路为行，记录从陇山深处到梦想生活的每一步',
      link: '',
      icon: '📮',
    },
  ],

  // 联系方式
  contact: {
    email: '',
    wechat: '',
    feishu: '',
    qrCodeBase64: '',
    qrCodeUrl: '',
  },

  // 私域群
  privateGroup: {
    title: '加入我的私域群',
    desc: 'AI探索路上，一起走。扫码入群，互相陪伴。',
    qrCodeBase64: '',
    qrCodeUrl: '',
  },

  // 管理员密码
  adminPassword: 'xiaofu2026',
}
