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
               <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
            </el-row>


            <el-table
                    :data="rolesList"
                    border
                    stripe
            >
                <!--添加展开列-->
                <el-table-column type="expand">
                    <!--展开列点击后的展开内容-->
                    <template slot-scope="props">
                        <!--一级权限渲染-->
                        <el-row
                                type="flex"
                                align="middle"
                                v-for="(item,i1) in props.row.children"
                                :class="['bdbottom',i1=== 0 ? 'bdtop' : '']"

                        >
                            <!--tag显示-->
                            <el-col :span="5">
                                <el-tag  closable>
                                    {{item.authName}}
                                </el-tag>
                                <!--箭头小图标-->
                                <i class="el-icon-caret-right"></i>
                            </el-col>

                            <!--二级权限和三级权限区域-->
                            <el-col :span="19">
                                <!--二级权限渲染-->
                                <el-row v-for="(sonItem,i2) in item.children"
                                        :class="[i2 === 0 ? '' : 'bdtop']"
                                >
                                    <el-col :span="6">
                                        <el-tag type="success" closable>
                                            {{sonItem.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!--三级权限渲染-->
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
                    <template v-slot:default="scope">
                    <el-button type="primary" size="mini" @click="getRolesInfoById(scope.row.id)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="delRoles(scope.row.id)">删除</el-button>
                    <el-button type="warning" size="mini">权限操作</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>



        <!--添加按钮的弹出框-->
        <el-dialog
                title="添加角色"
                :visible.sync="dialogVisible"
                width="50%"
                @close="addformClosed"
        >
            <!--弹出框内容表单-->
            <el-form ref="addformRef"
                     :model="addform"
                     label-width="100px"
                     :rules="formRules"

            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addform.roleName" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addform.roleDesc" style="width:80%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
        </el-dialog>

        <!--编辑按钮的弹出框-->
        <el-dialog
                title="编辑角色"
                :visible.sync="editdialogVisible"
                width="50%"
                @close="editformClosed"
        >
            <!--弹出框内容表单-->
            <el-form ref="editformRef"
                     :model="editform"
                     label-width="100px"
                     :rules="formRules"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input  v-model="editform.roleName" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label="角色说明" prop="roleDesc">
                    <el-input v-model="editform.roleDesc" style="width:80%"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoles">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getRoles,
        addRoles,
        delRoles,
        getRolesById,
        changeRoles
    } from "../../API/power";

    import breadcrumb from "../../components/common/breadcrumb";
    import {delUserById} from "../../API/home_user";

    export default {
        name: "roles",
        components:{
            breadcrumb
        },
        data(){
            return {
                rolesList : [],
                dialogVisible : false,
                editdialogVisible :false,
                addform : {
                    roleName:'',
                    roleDesc:''
                },
                editform:{},
                formRules :{
                    roleName: [
                        { required: true, message: '请输入活动名称', trigger: 'blur'},
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ]
                }
            }

        },
        created() {
            this.getRolesList();
        },
        methods:{
            //获取权限列表
            getRolesList(){
                getRoles().then(res => {
                    if(res.meta.status !== 200) return this.$message.error('获取权限列表失败');
                    console.log(res);
                    this.rolesList = res.data
                }).catch(err => {
                    console.log(err);
                })
            },
            //添加弹出框关闭时清空内容重置
            addformClosed(){
                this.$refs.addformRef.resetFields();
            },
            //编辑弹出框关闭时清空内容重置（重置成根据ID获取该角色信息）
            editformClosed(){
                this.$refs.editformRef.resetFields();
            },
            //添加权限
            addRole(){
                //进行预校验
                this.$refs.addformRef.validate(valid =>{
                    //如果校验结果valid为false，直接return，不执行下面的代码
                    if(!valid)return;
                addRoles(this.addform).then(res => {
                    if(res.meta.status !== 201) return this.$message.error('添加权限失败');
                    //提示添加成功
                    this.$message.success('添加成功');
                    //隐藏弹出框
                    this.dialogVisible = false;
                    //刷新列表
                    this.getRolesList()
                }).catch(err => {
                    console.log(err);
                })
                })
            },
            //删除权限
            delRoles(id){
                let url = 'roles/'+id;
                this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delRoles(url).then(res => {
                        if(res.meta.status!==200)return this.$message.error('删除失败');
                        // 重新渲染
                        this.getRolesList();
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
            //根据ID查询角色信息
            getRolesInfoById(id){
                let url = 'roles/'+id;
                getRolesById(url).then(res => {
                    if(res.meta.status !== 200) return this.$message.error('获取角色信息失败');
                    this.editform = res.data;
                    this.editdialogVisible = true;
                })

            },
            //提交编辑信息
            editRoles(){
                //预校验
                this.$refs.editformRef.validate(valid => {
                    if(!valid) return;//valid为false就是预校验不通过，直接return
                    let url = 'roles/'+this.editform.roleId;
                    changeRoles(url,this.editform.roleName,this.editform.roleDesc).then(res => {
                        if(res.meta.status !== 200) return this.$message.error('提交信息失败');
                        this.$message.success('编辑成功');
                        this.editdialogVisible = false;
                        this.getRolesList();
                    }).catch(err => {
                        console.log(err);
                    })
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