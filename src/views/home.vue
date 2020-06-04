<template>
    <el-container class="home-container">
        <!--头部区域-->
        <el-header>
            <div>
                <img alt="" src="../assets/logo.png">
                <span>XXXXX系统</span>
            </div>
            <el-button @click="logout" type="info">退出</el-button>
        </el-header>
        <!--主体区域-->
        <el-container>
            <!--侧边栏-->
            <el-aside width="200px">
                <el-menu
                        :default-active="$route.path"
                        :unique-opened="true"
                        active-text-color="#409EFF"
                        background-color="#495567"
                        router
                        text-color="#fff">
                    <el-submenu :index="''+item.id" :key="item.id" v-for="(item,index) in list">
                        <template slot="title">
                            <i :class="listIcon[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>

                        <el-menu-item :index="'/home/'+menuItem.path" v-for="(menuItem,index) in item.children">
                            <i class="el-icon-menu"></i>
                            <span slot="title">{{menuItem.authName}}</span>
                        </el-menu-item>

                    </el-submenu>

                </el-menu>
            </el-aside>
            <!--主体内容-->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
  import {getHomeAsideList} from '@/API/home_Aside'

  export default {
        name: "home",
        data() {
            return {
                list: [],
                //用于导航列表图标显示
                listIcon: {
                    '125': 'el-icon-user',
                    '103': 'el-icon-s-tools',
                    '101': 'el-icon-goods',
                    '102': 'el-icon-s-order',
                    '145': 'el-icon-s-data',
                }
            }
        },
        created() {
            getHomeAsideList().then(res => {
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.list = res.data;
                console.log(this.list);
                /* this.$message.success("请求成功")*/

            }).catch(error => {
                console.log(error);
            })


        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
            }
        }
    }
</script>

<style scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #546163;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 0;
    }

    .el-header > div {
        font-size: 18px;
        color: white;
        display: flex;
        align-items: center;
    }

    .el-header > div > img {
        width: 60px;
        height: 50px;
        padding-right: 5px;
    }

    .el-aside {
        background-color: #495567;
    }

    .el-main {
        background-color: #fff;
    }

    .el-menu {
        border: 0px;
    }
</style>