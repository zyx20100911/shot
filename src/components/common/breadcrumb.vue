<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <slot name="itemOne"></slot>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <slot name="itemTwo"></slot>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        name: "breadcrumb"
    }
</script>

<style scoped>

</style>