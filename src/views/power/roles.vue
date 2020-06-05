<template>
    <div>
        <!--面包屑-->
        <breadcrumb>
            <span slot="itemOne">角色管理</span>
            <span slot="itemTwo">角色列表</span>
        </breadcrumb>

        <!--卡片内容-->
        <el-card>
            <el-row>
               <el-button type="primary">添加用户</el-button>
            </el-row>


            <el-table
                    :data="rolesList"
                    border
                    stripe
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-row
                                v-for="(item,i1) in props.row.children"
                                :class="['bdbottom',i1=== 0 ? 'bdtop' : '']"

                        >
                            <el-col :span="5">
                                <el-tag type="warning" closable>
                                    {{item.authName}}
                                </el-tag>
                            </el-col>
                            <el-col :span="19">
                                <el-row v-for="(sonItem,i2) in item.children"
                                        :class="[i2 === 0 ? '' : 'bdtop']"
                                >
                                    <el-col :span="6">
                                        <el-tag type="warning" closable>
                                            {{sonItem.authName}}
                                        </el-tag>
                                    </el-col>

                                    <el-col :span="13">
                                        <el-tag type="warning" closable v-for="sitem in sonItem.children">
                                            {{sitem.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>


                            </el-col>

                        </el-row>


                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色说明"></el-table-column>
                <el-table-column label="操作">
                    <el-button type="primary" size="mini">编辑</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
                    <el-button type="warning" size="mini">权限操作</el-button>
                </el-table-column>

            </el-table>
        </el-card>
    </div>
</template>

<script>
    import {getRoles} from "../../API/power";

    import breadcrumb from "../../components/common/breadcrumb";

    export default {
        name: "roles",
        components:{
            breadcrumb
        },
        data(){
            return {
                rolesList:[]
            }
        },
        created() {
            this.getRolesList();
        },
        methods:{
            getRolesList(){
                getRoles().then(res => {
                    if(res.meta.status !== 200) return this.$message.error('获取角色列表失败');
                    console.log(res);
                    this.rolesList = res.data
                }).catch(err => {
                    console.log(err);
                })
            }
        }

    }
</script>

<style scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
    }

</style>