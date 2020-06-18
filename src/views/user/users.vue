<template>
    <div>
        <!--面包屑组件-->
        <breadcrumb>
            <span slot="itemOne">用户管理</span>
            <span slot="itemTwo">用户列表</span>
        </breadcrumb>

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
                    style="width: 100%">
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
                        <!--tip,悬浮显示的提示-->
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

                        <el-tooltip :enterable="false" class="item" effect="dark" content="分配角色" placement="top">
                            <el-button type="warning"
                                       icon="el-icon-user"
                                       size="mini"
                                       @click="showUserRoles(scope.row)"></el-button>
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
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addform.mobile" style="width:80%"></el-input>
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
                     :rules="editformRules"
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

        <!--分配权限弹出框-->
        <el-dialog
                title="分配角色"
                :visible.sync="RolesDialogVisible"
                width="30%"
                ref="rolesRef"
        >
            <p>当前用户：{{userInfo.username}}</p>
            <p>当前角色：{{userInfo.role_name}}</p>
            <p>选择角色：
            <el-select v-model="SelectDefaultValue" placeholder="请选择">
                <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                </el-option>
            </el-select>
            </p>

            <span slot="footer" class="dialog-footer">
    <el-button @click="RolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="changeUserRoles">确 定</el-button>
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
            delUserById,setUserRoles} from "../../API/home_user";
    import {getRoles} from "../../API/power";

    import breadcrumb from "../../components/common/breadcrumb";

    export default {
        name: "users",
        components:{
            breadcrumb
        },
        data(){
            //自定义规则验证表单-手机号验证
            let checkMobile = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                }
                //验证手机号
                var myMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (myMobile.test(value)){
                   /* this.$refs.editformRef.validateField('mobile');*/
                    callback();
                }else {
                    return callback(new Error('手机号格式错误'));
                }


            }
            //自定义规则验证表单-邮箱验证
            let checkEmail = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('邮箱不能为空'));
                }
                //验证手机号
                var myEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if (myEmail.test(value)){
                   /* this.$refs.editformRef.validateField('email');*/
                    callback();
                }else {
                    return callback(new Error('邮箱格式错误'));
                }


            }
            return {
                //获取用户列表请求参数对象
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:5
                },
                userInfo:{},//接收用户权限
                userList:[],
                total:0,
                //控制弹出框是否显示
                dialogVisible:false,
                editdialogVisible:false,
                RolesDialogVisible:false,//分配权限弹出框控制是否显示
                addform:{
                    username:'',
                    password:'',
                    mobile:'',
                    email:''

                },
                editform:{},
                editformRules:{
                    mobile:[
                        { validator: checkMobile,trigger:'blur'}
                    ],
                    email:[
                        { validator: checkEmail, trigger:'blur'}
                    ]

                },
                SelectDefaultValue:'',
                rolesList:[]

            }
        },
        created() {
           this.getList();
        },
        methods:{
            getList(){
                getHomeUsers(this.queryInfo).then(res => {
                    this.userList = res.data.users;
                    this.total =  res.data.total;
                })
            },

            //点击切换用户状态
            userStateChange(userinfo){
                var url = 'users/'+userinfo.id+'/state/'+userinfo.mg_state;
                ChangeUserState(url).then(res => {
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
                      this.getList();

                  }).catch(error => {
                      console.log(error);
                  })
            },
            //点击编辑，根据ID查出用户信息，展示
            editUser(id){
                let url = 'users/'+id;
                getUserById(url).then(res => {
                   /* console.log(res);*/
                    if(res.meta.status !== 200) return this.$message.error('查询错误');
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
                this.$refs.editformRef.validate(valid=>{
                    //如果预校验失败则直接return，不提交
                    if(!valid) return;
                    let url = 'users/'+this.editform.id;
                    changeUser(url,this.editform.email,this.editform.mobile).then(res => {
                        if(res.meta.status !== 200) return this.$message.error('编辑失败');
                        //提示成功
                        this.$message.success('编辑成功');
                        //刷新列表
                        this.getList();
                        //隐藏弹框
                        this.editdialogVisible = false;

                    }).catch(err => {
                        console.log(err);
                    })
                });




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

                        //记录总页数,
                        //此时已经实现删除操作，所以total的值需要减1，Math.ceil是向上取整，保证始终大于等于1
                        const totalPage = Math.ceil((this.total - 1) / this.queryInfo.pagesize)

                        //记录当前页码
                        //记住删除最后一条数据时当前码是最后一页
                        const pagenum = this.queryInfo.pagenum > totalPage ? totalPage : this.queryInfo.pagenum

                        //实现跳转
                        this.queryInfo.pagenum = pagenum < 1 ? 1 : pagenum
                        // 重新渲染（后面方法改为你的方法名）
                        this.getList();
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
            },
            //切换每页显示的个数
            handleSizeChange(newsize){
                this.queryInfo.pagesize= newsize;
                this.getList();

            },
            //点击数字和前后按钮切换每页数据
            handleCurrentChange(newpage){
                this.queryInfo.pagenum = newpage;
                this.getList();
            },
            //显示分配权限弹出框
            showUserRoles(userInfo){
                this.RolesDialogVisible = true;
                this.userInfo = userInfo;
                getRoles().then(res => {
                    if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
                   this.rolesList = res.data;
                })


            },
            //提交编辑后的用户角色
            changeUserRoles(){
                if(!this.SelectDefaultValue){
                    return this.$message.error('请选择角色');
                }
 /*               console.log(this.userInfo.id);
                console.log(this.SelectDefaultValue);
*/

                let url = 'users/'+this.userInfo.id+'/role';
                setUserRoles(url,this.SelectDefaultValue).then(res => {
                    console.log(res);
                })

            },

        }

    }
</script>

<style scoped>

</style>