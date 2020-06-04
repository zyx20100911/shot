<template>
    <div>
        <breadcrumb>
            <span slot="itemOne">权限管理</span>
            <span slot="itemTwo">权限列表</span>
        </breadcrumb>
    </div>
</template>

<script>
    import breadcrumb from "../../components/common/breadcrumb";
    export default {
        name: "right",
        components:{
            breadcrumb
        }
    }
</script>

<style scoped>

</style>