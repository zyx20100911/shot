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
                <el-button @click="dialogVisible = true" type="primary">添加用户</el-button>
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
                                :class="['bdbottom',i1=== 0 ? 'bdtop' : '']"
                                align="middle"
                                type="flex"
                                v-for="(item,i1) in props.row.children"

                        >
                            <!--tag显示-->
                            <el-col :span="5">
                                <el-tag closable @close="closeRoles(props.row.id,item.id)">
                                    {{item.authName}}
                                </el-tag>
                                <!--箭头小图标-->
                                <i class="el-icon-caret-right"></i>
                            </el-col>

                            <!--二级权限和三级权限区域-->
                            <el-col :span="19">
                                <!--二级权限渲染-->
                                <el-row :class="[i2 === 0 ? '' : 'bdtop']"
                                        v-for="(sonItem,i2) in item.children"
                                >
                                    <el-col :span="6">
                                        <el-tag closable type="success">
                                            {{sonItem.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!--三级权限渲染-->
                                    <el-col :span="13">
                                        <el-tag closable type="warning" v-for="sitem in sonItem.children">
                                            {{sitem.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>


                            </el-col>

                        </el-row>


                    </template>
                </el-table-column>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色说明" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot:default="scope">
                        <el-button @click="getRolesInfoById(scope.row.id)" size="mini" type="primary">编辑</el-button>
                        <el-button @click="delRoles(scope.row.id)" size="mini" type="danger">删除</el-button>
                        <el-button @click="showSetRightDialog(scope.row)" size="mini" type="warning">权限操作</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>


        <!--添加按钮的弹出框-->
        <el-dialog
                :visible.sync="dialogVisible"
                @close="addformClosed"
                title="添加角色"
                width="50%"
        >
            <!--弹出框内容表单-->
            <el-form :model="addform"
                     :rules="formRules"
                     label-width="100px"
                     ref="addformRef"

            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input style="width:80%" v-model="addform.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input style="width:80%" v-model="addform.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span class="dialog-footer" slot="footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button @click="addRole" type="primary">确 定</el-button>
  </span>
        </el-dialog>

        <!--编辑按钮的弹出框-->
        <el-dialog
                :visible.sync="editdialogVisible"
                @close="editformClosed"
                title="编辑角色"
                width="50%"
        >
            <!--弹出框内容表单-->
            <el-form :model="editform"
                     :rules="formRules"
                     label-width="100px"
                     ref="editformRef"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input style="width:80%" v-model="editform.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色说明" prop="roleDesc">
                    <el-input style="width:80%" v-model="editform.roleDesc"></el-input>
                </el-form-item>

            </el-form>
            <span class="dialog-footer" slot="footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button @click="editRoles" type="primary">确 定</el-button>
  </span>
        </el-dialog>

        <!--权限tree弹出框-->
        <el-dialog
                :visible.sync="setRightDialog"
                title="编辑角色"
                width="30%"
                @close="closeRightDialog"
        >
            <!--权限tree绑定数据渲染-->
            <el-tree
                    :data="rightsList"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :default-checked-keys="defaultKey"
                    :props="rightsProps">
            </el-tree>

            <el-button @click="setRightDialog = false">取 消</el-button>
            <el-button @click="changeRightDialog" type="primary">确 定</el-button>


        </el-dialog>
    </div>
</template>

<script>
    import {addRoles, changeRoles, delRoles, getRoles, getRolesById,delRolesRights,getRights} from "../../API/power";

    import breadcrumb from "../../components/common/breadcrumb";

    export default {
        name: "roles",
        components: {
            breadcrumb
        },
        data() {
            return {
                rolesList: [],//角色列表
                rightsList: [],//权限列表
                dialogVisible: false,
                editdialogVisible: false,
                setRightDialog: false,
                addform: {
                    roleName: '',
                    roleDesc: ''
                },
                editform: {},
                rightsProps: {//权限tree绑定二级三级所用
                    children: 'children',
                    label: 'authName'
                },
                defaultKey:[], //权限tree默认选中项的数组
                formRules: {
                    roleName: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ]
                }
            }

        },
        created() {
            this.getRolesList();
        },
        methods: {
            //获取权限列表
            getRolesList() {
                getRoles().then(res => {
                    if (res.meta.status !== 200) return this.$message.error('获取权限列表失败');
                   /* console.log(res);*/
                    this.rolesList = res.data
                }).catch(err => {
                    console.log(err);
                })
            },
            //添加弹出框关闭时清空内容重置
            addformClosed() {
                this.$refs.addformRef.resetFields();
            },
            //编辑弹出框关闭时清空内容重置（重置成根据ID获取该角色信息）
            editformClosed() {
                this.$refs.editformRef.resetFields();
            },
            //添加角色
            addRole() {
                //进行预校验
                this.$refs.addformRef.validate(valid => {
                    //如果校验结果valid为false，直接return，不执行下面的代码
                    if (!valid) return;
                    addRoles(this.addform).then(res => {
                        if (res.meta.status !== 201) return this.$message.error('添加权限失败');
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
            //删除角色
            delRoles(id) {
                let url = 'roles/' + id;
                this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delRoles(url).then(res => {
                        if (res.meta.status !== 200) return this.$message.error('删除失败');
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
            getRolesInfoById(id) {
                let url = 'roles/' + id;
                getRolesById(url).then(res => {
                    if (res.meta.status !== 200) return this.$message.error('获取角色信息失败');
                    this.editform = res.data;
                    console.log(res);
                    this.editdialogVisible = true;
                })

            },
            //提交编辑信息
            editRoles() {
                //预校验
                this.$refs.editformRef.validate(valid => {
                    if (!valid) return;//valid为false就是预校验不通过，直接return
                    let url = 'roles/' + this.editform.roleId;
                    changeRoles(url, this.editform.roleName, this.editform.roleDesc).then(res => {
                        if (res.meta.status !== 200) return this.$message.error('提交信息失败');
                        this.$message.success('编辑成功');
                        this.editdialogVisible = false;
                        this.getRolesList();
                    }).catch(err => {
                        console.log(err);
                    })
                })

            },
            //删除角色权限，tag删除
            closeRoles(roleId,rightId){
                let url ='roles/:'+roleId+'/rights/:'+rightId;

                this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delRolesRights(url).then(res => {
                        if (res.meta.status !== 200) return this.$message.error('取消权限失败');
                        this.getRolesList();

                    }).catch(err => {
                        console.log(err);
                    });
                    this.$message({
                        type:"success",
                        message:'取消权限成功'
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                })


            },
            //递归函数
            getLeafKeys(node,arr){
                if(!node.children){
                    return  arr.push(node.id);
                }
                node.children.forEach(item => this.getLeafKeys(item,arr))
            },
            //控制权限操作按钮
            showSetRightDialog(defaultKeys){
                let url = 'rights/tree';

                getRights(url).then(res => {
                    if(res.meta.status !== 200) return this.$message.error('获取用户权限失败');
                   this.rightsList = res.data;
                }).catch(err => {
                    console.log(err);
                });

                //使用for循环，缺点是固定数据结构，如果数据结构变化，就会出现问题
             /*
                for (let k of defaultKeys) {
                    for (let i of k.children) {
                        for (let r of i.children) {
                           this.defaultKey.push(r.id);

                        }
                    }
                }*/
                //使用递归函数，就不会出现这样的问题，但是递归写的比较绕
                this.getLeafKeys(defaultKeys,this.defaultKey);
                this.setRightDialog =true;

            },
            //关闭权限弹窗重置tree
            closeRightDialog(){
                this.defaultKey = [];//每次打开都清空上一次默认选中项;
            },
            //提交编辑后的权限
            changeRightDialog(){

            }

        }

    }
</script>

<style scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

</style>