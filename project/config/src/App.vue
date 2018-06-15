<template lang="pug">
  #app
    nav.left-menu(:class="isCollapse ? 'fixed':''")
      el-menu(:default-active="activeIndex",router,:collapse="isCollapse",background-color="#464C5B",text-color="#fff",active-text-color="#ffd04b")
        img(src="./assets/logo.png")
        el-submenu(index="1")
          template(slot="title")
            i.fa.fa-tachometer
            span 监控
          el-menu-item(index="/overview")
            i.fa.fa-bar-chart
            span 概览
        el-submenu(index="2")
          template(slot="title")
            i.fa.fa-desktop
            span 主机管理
          el-menu-item(index="/host/hosts")
            i.fa.fa-laptop
            span 主机列表
          el-menu-item(index="/host/groups")
            i.fa.fa-sitemap
            span 主机组
        el-submenu(index="3")
          template(slot="title")
            i.fa.fa-cubes
            span 集群管理
          el-menu-item(index="/cluster/host")
            i.fa.fa-cube
            span 集群列表
          el-menu-item(index="/cluster/service")
            i.fa.fa-server
            span 服务列表
        el-submenu(index="4")
          template(slot="title")
            i.el-icon-location
            span 系统配置
          el-menu-item(index="/system/user")
            i.fa.fa-id-card-o
            span 用户管理
          el-menu-item(index="/system/service")
            i.fa.fa-cog
            span 参数配置
    section.content(:class="isCollapse ? 'fixed':''")
      header.sf-top(:class="isCollapse ? 'fixed':''")
        el-row(type="flex",justify="space-between")
          el-col.title(:span="12")
            i.fa.fa-bars(@click="cSwitch")
          el-col.logout.text-right(:span="12")
            i(class="fa fa-user" aria-hidden="true" @click="checklogin")
            span {{userName}}
            i(class="fa fa-sign-out" aria-hidden="true" @click="userLogOut")
        el-row.path(type="flex",align="middle")
          el-col(:span="1")
            i(class="fa fa-home" aria-hidden="true")
          el-col(:span="23")
            el-breadcrumb(separator-class="el-icon-arrow-right")
              el-breadcrumb-item(v-for="(bread,i) in breads",:to="bread.path",:key="i") {{bread.title}}
      .sf-content
        transition(name="fade" mode="out-in")
          router-view(:key="key")
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
// import hello from './lib/webpack-numbers';

// console.log(hello);
export default {
  name: 'app',
  data() {
    return {
      isCollapse: false,
    };
  },
  // 同组件刷新
  computed: {
    key() {
      // console.log(this.$route);
      return this.$route.meta ? this.$route.meta.title + new Date() : this.$route + new Date();
    },
    ...mapGetters({
      userName: 'userName',
    }),
    activeIndex() {
      // if (this.$route.path.split('/')[1] === 'system') return this.$route.path;
      if (this.$route.path.split('/')[2]) {
        return `/${this.$route.path.split('/')[1]}/${this.$route.path.split('/')[2]}`;
      }
      return `/${this.$route.path.split('/')[1]}`;
    },
    breads() {
      const arr = [{ title: '首页', path: '/' }];
      this.$route.matched.forEach((v) => {
        if (!v.meta.title) return;
        arr.push({ title: v.meta.title, path: v.path });
      });
      return arr;
    },
  },
  methods: {
    ...mapActions([
      'userLogin', 'getRoles', 'userLogOut',
    ]),
    cSwitch() {
      this.isCollapse = !this.isCollapse;
    },
    // -手动登录
    checklogin() {
      window.location.href = 'http://10.203.12.64:8080/api/v1.0/users/cass/?index_url=http://10.202.107.13:8092/overview';
      // this.$axios.get('http://10.202.107.13:8080/api/v1.0/users').then((res) => {
      //   console.log(res, 5556);
      // });
    },
  },
  created() {
    this.userLogin();
  },
  mounted() {
    // this.$axios.get('/api/logout').then((res) => {
    //   console.log(res);
    // });
    // this.$axios.get('/test').then((res) => {
    //   console.log(res);
    // });
    // this.$axios.get('/back/users').then((res) => {
    //   console.log(res, 5556);
    // });
  },
};
</script>

<style lang="scss">
#app {
}
.Plogin{
    cursor: pointer;
}
.fa-minus {
  color: #999;
}
</style>
