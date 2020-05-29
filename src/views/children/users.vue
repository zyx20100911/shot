<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图-->
        <el-card class="box-card">

            <el-row :gutter="5">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable
                              @clear="clearseach">
                        <el-button icon="el-icon-search" slot="append" @click="seach"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
             <!--列表-->
            <el-table
                    :data="userList"
                    border
                    style="width: 75%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机号"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="登录名"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="角色"
                        width="200">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="180">
                    <template v-slot:default="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template v-slot:default="scope">
                        <el-tooltip
                                :enterable="false"
                                class="item"
                                effect="dark"
                                content="编辑"
                                placement="top"
                               >
                        <el-button type="success"
                                   icon="el-icon-edit"
                                   size="mini"
                                   @click="editUser(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip :enterable="false" class="item" effect="dark" content="删除" placement="top">
                        <el-button type="danger" icon="el-icon-delete" @click="delUser(scope.row.id)"  size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--添加按钮的弹出框-->
        <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible"
                width="50%"
                @close="addformClosed"
                >
            <!--弹出框内容表单-->
            <el-form ref="addformRef"
                     :model="addform"
                     label-width="100px"
                    >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addform.username" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addform.password" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="addform.phone" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addform.email" style="width:80%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
        </el-dialog>

        <!--修改按钮弹出框-->
        <el-dialog
                title="添加用户"
                :visible.sync="editdialogVisible"
                width="50%"
                @close="editformClosed"
        >
            <!--弹出框内容表单-->
            <el-form ref="editformRef"
                     :model="editform"
                     label-width="100px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input disabled v-model="editform.username" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editform.mobile" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editform.email" style="width:80%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="changeUserInfo">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getHomeUsers,
            ChangeUserState,
            addUser,
            getUserById,
            changeUser,
            delUserById} from "../../API/home_user";

    export default {
        name: "users",
        data(){
            return {
                //获取用户列表请求参数对象
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10
                },
                userList:[],
                total:0,
                dialogVisible:false,
                editdialogVisible:false,
                addform:{
                    username:'',
                    password:'',
                    phone:'',
                    email:''

                },
                editform:{}
            }
        },
        created() {
           getHomeUsers(this.queryInfo).then(res => {
                this.userList = res.data.users;
                this.total =  res.data.total

                console.log(res);
            })
        },
        methods:{
            //切换每页显示的个数
            handleSizeChange(newsize){
                this.queryInfo.pagesize= newsize;
                getHomeUsers( this.queryInfo).then(res => {
                    this.userList = res.data.users;
                })

            },
            //点击数字和前后按钮切换每页数据
            handleCurrentChange(newpage){
                this.queryInfo.pagenum = newpage;
                getHomeUsers( this.queryInfo).then(res => {
                    this.userList = res.data.users;
                })
            },
            //点击切换用户状态
            userStateChange(userinfo){
                console.log(userinfo.type);
                var url = 'users/'+userinfo.id+'/state/'+userinfo.mg_state;
                ChangeUserState(url).then(res => {
                    console.log(res);
                    if(res.meta.status!==200)return userinfo.mg_state = !userinfo.mg_state;
                    this.$message.success('设置成功');
                }).catch(error => {
                    console.log(error);
                })
            },
            //搜索功能
            seach(){
                getHomeUsers(this.queryInfo).then(res => {
                    this.userList = res.data.users;
                })
            },
            //搜索框清空
            clearseach(){
                getHomeUsers(this.queryInfo).then(res => {
                    this.userList = res.data.users;
                })
            },
            //弹出框关闭时清空内容重置
            addformClosed(){
                this.$refs.addformRef.resetFields();
            },
            //添加用户
            addUser(){
                /*console.log(this.addform);*/
                  addUser(this.addform).then(res => {
                    if (res.meta.status !== 201) return this.$message.error('创建失败');
                    this.$message.success('添加用户成功');
                    //隐藏弹出框
                    this.dialogVisible = false;
                    //刷新列表
                      getHomeUsers(this.queryInfo).then(res => {
                          this.userList = res.data.users;
                      })

                  }).catch(error => {
                      console.log(error);
                  })
            },
            //点击编辑，根据ID查出用户信息，展示
            editUser(id){

               /* console.log(id);*/
                let url = 'users/'+id;
                getUserById(url).then(res => {
                   /* console.log(res);*/
                    if(res.meta.status !== 200) return this.$message.error('查询错误');
                    console.log(res);
                    this.editform = res.data

                    this.editdialogVisible = true;
                }).catch(error => {
                    console.log(error);
                })
            },
            //弹出框关闭时清空内容重置
            editformClosed(){
               this.$refs.editformRef.resetFields();
            },
            //提交编辑信息
            changeUserInfo(){
                let url = 'users/'+this.editform.id;
                changeUser(url,this.editform.email,this.editform.mobile).then(res => {
                    if(res.meta.status !== 200) return this.$message.error('编辑失败');
                    //提示成功
                    this.$message.success('编辑成功');
                    //隐藏弹框
                   this.editdialogVisible = false;
                    //刷新列表
                    getHomeUsers(this.queryInfo).then(res => {
                        this.userList = res.data.users;
                    })
                }).catch(err => {
                    console.log(err);
                })

            },
            //删除用户
            delUser(id){
                this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = 'users/'+id
                    delUserById(url).then(res => {
                      if(res.meta.status!==200)return this.$message.error('删除用户失败');
                        //刷新列表
                        getHomeUsers(this.queryInfo).then(res => {
                            this.userList = res.data.users;
                        })
                    }).catch(err => {
                        console.log(err);
                    });
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }

        }

    }
</script>

<style scoped>

</style>