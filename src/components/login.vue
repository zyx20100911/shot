<template>
    <div class="login_container">

      <div class="login_box">
          <el-form :rules="loginFormRules" ref="loginFormRef" label-width="80px" class="login_form" :model="loginForm">
              <el-form-item label="用户名" prop="username">
                  <el-input v-model="loginForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="userpassword">
                  <el-input type="password" v-model="loginForm.userpassword"></el-input>
              </el-form-item>
              <el-form-item class="btns">
                  <el-button type="primary" plain @click="login">登录</el-button>
                  <el-button type="primary" plain @click="reset">重置</el-button>
              </el-form-item>
          </el-form>
      </div>
    </div>
</template>

<script>
   import {getLogin} from '../API/login'


   export default {
        name: "login",
        data(){
           return{
               loginForm:{
                   username:'admin',
                   userpassword:'123456'
               },
               loginFormRules:{
                   username:[
                       { required: true, message: '请输入用户名', trigger: 'blur' },
                       { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                   ],
                   userpassword:[
                       { required: true, message: '请输入密码', trigger: 'blur' },
                       { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                   ]
               }
           }
        },
        methods:{
            reset(){
                this.$refs.loginFormRef.resetFields()
            },
            login(){
                this.$refs.loginFormRef.validate(valid => {
                    if(!valid) return;
                   /*const logins = this.$http.post('login',this.loginForm)
                    console.log(logins);*/
                    getLogin(this.loginForm.username,this.loginForm.userpassword).then(res => {
                       if(res.meta.status!==200){
                          this.$message({
                              message:'登录失败',
                              type:"warning"
                          })
                       }else{
                           this.$message({
                               message:'登录成功',
                               type:"success"
                           })
                           //登录成功后，窗口未关闭期间存储token，把token记录在sessionstorage中，验证权限的时候保证登录
                           window.sessionStorage.setItem('token',res.data.token);
                           this.$router.push('/home');
                       }

                    })
                })
            }
        }
    }
</script>

<style scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
        display: flex;
        justify-content: center; /* 水平居中 */
        align-items: center;     /* 垂直居中 */
    }
    .login_box{
        width: 450px;
        height: 250px;
        background-color: #ffffff;
        border-radius: 15px;
        position: absolute;
    }
    .login_form{
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
</style>