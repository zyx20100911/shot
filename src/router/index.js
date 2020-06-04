import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from "../views/home";
import users from '../views/user/users'
import welcome from "../views/welcome";
import rights from "../views/power/rights";
import roles from "../views/power/roles";


Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: login
    },
    {
        path: '/home',
        component: home,
        redirect: '/home/welcome',
        children: [{
            path: 'users',
            component: users
        },{
            path: 'rights',
            component: rights
        },{
            path: 'roles',
            component: roles
        }
        , {
            path: 'welcome',
            component: welcome
        }]
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

//挂载路由守卫
router.beforeEach((to, from, next) => {
    //如果to登录页面，直接放行
    if (to.path === '/login') return next();
    //获取储存在浏览器sessionStorage里的token，赋值给tokenStr
    const tokenStr = window.sessionStorage.getItem('token');
    //如果没有tokenstr，那么返回next（）函数去登录页面
    if (!tokenStr) return next('/login');
    //如果有token直接进行下一步
    next()

})

export default router
