<template>
    <div>
        <breadcrumb>
            <span slot="itemOne">权限管理</span>
            <span slot="itemTwo">权限列表</span>
        </breadcrumb>
        <!--卡片内容-->
        <el-card>
            <!--列表展示-->
            <el-table
                    border
                    stripe
                    :data="rightsList"
            >
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="authName" label="权限名称" ></el-table-column>
                <el-table-column prop="path" label="权限路径" ></el-table-column>
                <el-table-column  label="权限等级" >
                    <template v-slot:default="scope">
                        <el-tag v-if="scope.row.level==='0'">一级权限</el-tag>
                        <el-tag v-else-if="scope.row.level==='1'" type="success">二级权限</el-tag>
                        <el-tag v-else type="warning">三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    import {getRights} from "../../API/power";

    import breadcrumb from "../../components/common/breadcrumb";
    export default {
        name: "right",
        components:{
            //面包屑组件
            breadcrumb
        },
        data(){
            return {
                rightsList:[]
            }
        },
        created() {
            this.getRightsList();
        },
        methods:{
            getRightsList(){
                getRights().then(res => {
                    this.rightsList = res.data
                })
            }
        }

    }
</script>

<style scoped>

</style>