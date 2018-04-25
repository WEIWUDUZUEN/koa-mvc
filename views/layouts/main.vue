<template>
  <el-container id="app">
    <el-aside width="auto">
      <left-menu></left-menu>
    </el-aside>
    <el-container>
      <el-header>
        <main-header></main-header>
      </el-header>
      <el-main>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>
<script>
import LeftMenu from "components/layouts/LeftMenu";
import MainHeader from 'components/layouts/Header' 
import languageMap from "../locale/map";
export default {
    name: "app",
    components: {
        LeftMenu,
        MainHeader
    },
    data() {
        return {
            visible: false,
            language: this.locale || "zh-CN",
            languageList: languageMap.list
        };
    },
    computed: {
        appVersion() {
            return this.$store.state.app.version;
        }
    },
    mounted() {
        if (this.locale) return;
        this.visible = true;
    },
    methods: {
        settingLanguage() {
            this.$i18n.locale = this.language;
            this.visible = false;
        }
    }
};
</script>
<style>
html,
body,
#app {
    width: 100%;
    height: 100%;
}
.el-header,
.el-footer {
  padding: 0;
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 40px;
}
.el-aside {
    background-color: #ffffff;
    overflow: hidden;
}
.el-main {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 160px;
}
body > .el-container,
body > #app > .el-container {
    height: 100%;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}
.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}
</style>
