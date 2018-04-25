<template>
    <el-menu default-active="1-4-1"
        class="left-menu"
        :router="true"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose">
        <el-menu-item index="0"
            :class="['watch-button', {actived: isCollapse}]"
            @click="isCollapse = !isCollapse">
            {{isCollapse ? '收起' : '展开'}}
        </el-menu-item>
        <el-menu-item :route="{path: '/'}"
            index="1">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">概况</span>
        </el-menu-item>
        <el-submenu index="2"
            popper-class="left-menu-submenu">
            <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">导航一</span>
            </template>
            <el-menu-item-group
                class="left-menu-group">
                <span slot="title">分组一</span>
                <el-menu-item :route="{path: '/home'}"
                    index="2-1">首页</el-menu-item>
                <el-menu-item :route="{path: '/home/category'}"
                    index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
                <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
                <span slot="title">选项4</span>
                <el-menu-item index="2-4-1">选项1</el-menu-item>
            </el-submenu>
        </el-submenu>
        <el-menu-item index="3">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
        </el-menu-item>
        <el-menu-item index="4" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="5">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
        </el-menu-item>
    </el-menu>
</template>
<script>
export default {
    data() {
        return {
            isCollapse: true
        };
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
};
</script>
<style lang="postcss">
.left-menu {
    .watch-button {
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 12px;
        color: #888888;
        &.actived {
            color: forestgreen;
        }
    }
    &.el-menu--collapse {
        height: 100%;
        min-height: 400px;
    }
    &:not(.el-menu--collapse) {
        width: 140px;
        height: 100%;
        min-height: 400px;
    }
    .el-submenu .el-menu-item {
        min-width: 140px;
    }
    .el-menu--collapse .el-submenu {
        width: 100%;
        box-sizing: border-box;
    }
    .el-submenu__title {
        height: 36px;
        line-height: 36px;
    }
}
.left-menu .el-menu .el-submenu,
.left-menu .el-submenu.is-active,
.left-menu-submenu .el-submenu .el-menu-item  {
    min-width: 30px;
}
.left-menu-submenu .el-menu--popup {
    min-width: 80px;
    .el-submenu__icon-arrow {
        right: 10px;
    }
}
</style>