<template>
  <div class="container">
    <main class="main-page">
      <h3>最新文章</h3>
      <hr>
      <div v-for="post in recentPosts" class="archive-post" :key="post.path + ':recent'">
        <span v-text="dayjs(post.frontmatter.date).format('YYYY/MM/DD')" class="archive-post-date"></span>
        <router-link
          class="nav-link"
          :to="post.path"
        >{{ post.title }}</router-link>
      </div>
      <div class="archive-post">
        <router-link
          class="nav-link"
          to="/post"
        >更多文章...</router-link>
      </div>
      <h3>我的作品</h3>
      <hr>
      <ul>
        <li><a href="https://hitao123.github.io/hui/" target="_blank">hui 移动端组件库</a></li>
      </ul>
    </main>
    <aside class="aside-page">
      <h3>最新 github 文章</h3>
      <hr>
      <ul class="friend-link">
        <li v-for="issueItem in issueData">
          <a :href="issueItem && issueItem.html_url">{{ issueItem.title }}</a>
        </li>
      </ul>
      <div class="archive-post">
        <router-link
          class="nav-link"
          to="/post"
        >更多文章...</router-link>
      </div>
      <hr>
      <h3>找到我</h3>
      <ul>
        <li>微信(Billow)</li>
        <li><a href="https://www.zhihu.com/people/hua-hai-tao-25">知乎</a></li>
        <li><a href="https://juejin.im/user/5981f02951882534f866f4f6">掘金</a></li>
        <li><a href="https://github.com/hitao123">github</a></li>
      </ul>
    </aside>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import axios from 'axios'

const request = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 4000,
  headers: {
    accept: 'application/json',
    Authorization: 'token 2e670bd612e4a9250f23d7ae6124cbd0800ceec1'
  }
})

export default {
  // components: { QR, Bar },
    data () {
      return {
        dayjs,
        data: []
      }
    },
    computed: {
      hotPosts () {
        return this.$site.pages
          .filter(page => page.title && page.frontmatter.date && page.frontmatter.hot)
          .sort((x, y) => dayjs(y.frontmatter.hot) - dayjs(x.frontmatter.hot))
          .slice(0, 10)
      },
      recentPosts () {
        console.log(this.$site.pages, '🐱')
        return this.$site.pages
          .filter(page => page.title && page.frontmatter.date)
          .sort((x, y) => dayjs(y.frontmatter.date) - dayjs(x.frontmatter.date))
          .slice(0, 10)
      },
      issueData() {
        return this.data && this.data.slice(0, 10);
      }
    },
    created() {
      // https://api.github.com/repos/hitao123/hitao123.github.io/issues
      request.get('/repos/hitao123/hitao123.github.io/issues').then(res => {
        this.data = res.data;
      });
    }
}
</script>