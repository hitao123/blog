const homePlugin = require('./plugin');


module.exports = {
    title: 'Billow\'s Blog',
    description: 'Record the life',
    head: [
      ['link', { rel: 'icon', href: `/logo.png` }],
      ['meta', { name: 'theme-color', content: '#3eaf7c' }],
      ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
      ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
      ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
    ],
    themeConfig: {
        nav: [
          { text: '主页', link: '/' },
          { text: '存档', link: '/archive/' },
          { text: '前端', link: '/front-end/' },
          { text: '后端', link: '/back-end/' },
          { text: '其他技术', link: '/other/' },
          { text: '笔记', link: '/notebook/' },
          { text: '读书笔记', link: '/reading/' },
          { text: '生活', link: '/life/' },
          { text: '关于我', link: '/about/' }
        ],
        sidebar: {
          '/archive/': [
            {
                title: '历史文章',  // 必要的
                collapsable: true,
                path: '/archive/',
                children: [
                  '2017/summary/',
                  '2018/summary/',
                  '2019/summary/',
                  '2020/noCov/',
                  '2020/summary/'
                ]
            }
          ]
        },
        lastUpdated: 'Last Updated'
    },
    plugins: [
      ['@vuepress/back-to-top', true],
      // ['@vuepress/medium-zoom', true],
      ['@vuepress/google-analytics', {
        ga: 'UA-99976359-1'
      }],
      ['container', {
        type: 'vue',
        before: '<pre class="vue-container"><code>',
        after: '</code></pre>'
      }],
      ['container', {
        type: 'upgrade',
        before: info => `<UpgradePath title="${info}">`,
        after: '</UpgradePath>'
      }],
      ['flowchart'],
      homePlugin
    ]
    // configureWebpack: (config) => {
    //   config.devServer = {
    //     proxy: {
    //       '/user': {
    //         "target": "https://api.github.com",
    //         "changeOrigin": true
    //       },
    //       '/login': {
    //         "target": "https://api.github.com",
    //         "changeOrigin": true
    //       }
    //     }
    //   }
    // }
}