// const moment = require('moment');

module.exports = {
  "title": "佳成",
  "description": "生命太短，没有时间留给遗憾，若不是终点，请微笑一直向前。",
  "base": "/",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/logo.jfif"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  /* 主题配置文件 */
  "themeConfig": {
    /* 导航栏配置 */
    "nav": [
      {
        "text": "主页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "时间轴",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "GitHub",
        "link": "https://github.com/option-star",
        "icon": "reco-github"
      }
    ],
    "type": "blog", // 风格
    /* 博客设置 */
    "blogConfig": {
      "category": {
        "location": 2, // 导航栏菜单中所占位置
        "text": "分类"
      },
      "tag": {
        "location": 3, // 导航栏菜单中所占位置
        "text": "标签"
      }
    },
    "friendLink": [
      // {
      //   "title": "午后南杂",
      //   "desc": "Enjoy when you can, and endure when you must.",
      //   "email": "1156743527@qq.com",
      //   "link": "https://www.recoluan.com"
      // },
    ],
    "logo": "/logo.jfif", // 自定义logo设置
    "search": true, // 搜索设置
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "佳成", // 作者
    "authorAvatar": "/avatar.png", // 作者头像
    "record": "远方有你伴余生", // 备案号
    "startYear": "2021", // 项目开始时间
    "subSidebar": 'auto' // 自动生成子侧边栏
  },
  "markdown": {
    "lineNumbers": true // 是否显示代码行数
  },
  /* 插件 */
  plugins: [
    ["@vuepress-reco/vuepress-plugin-pagation"],
    ["vuepress-plugin-boxx"],
    ["vuepress-plugin-nuggets-style-copy", {
      copyText: "复制代码",
      tip: {
        content: "复制成功!"
      }
    }],
    ['@vuepress/active-header-links', {
      sidebarLinkSelector: '.sidebar-link',
      headerAnchorSelector: '.header-anchor'
    }],
    ["vuepress-plugin-auto-sidebar", {
      collapse: {
        open: true
      }
    }],
    [
      /* 看板娘 */
      'vuepress-plugin-helper-live2d', {
        // 是否开启控制台日志打印(default: false)
        log: false,
        live2d: {
          // 是否启用(关闭请设置为false)(default: true)
          enable: true,
          // 模型名称(default: hibiki)>>>取值请参考：
          // https://github.com/JoeyBling/hexo-theme-yilia-plus/wiki/live2d%E6%A8%A1%E5%9E%8B%E5%8C%85%E5%B1%95%E7%A4%BA
          model: 'wanko',
          display: {
            position: "right", // 显示位置：left/right(default: 'right')
            width: 250, // 模型的长度(default: 135)
            height: 300, // 模型的高度(default: 300)
            hOffset: 65, //  水平偏移(default: 65)
            vOffset: 0, //  垂直偏移(default: 0)
          },
          mobile: {
            show: false // 是否在移动设备上显示(default: false)
          },
          react: {
            opacity: 0.8 // 模型透明度(default: 0.8)
          }
        }
      }
    ],
    [
      /* 拼音路由插件 */
      'permalink-pinyin', {
        lowercase: true, // Converted into lowercase, default: true
        separator: '-' // Separator of the slug, default: '-'
      }
    ],


  ]
}