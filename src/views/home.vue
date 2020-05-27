<template>
<div>
  <button @click="logout">退出</button>
</div>
</template>

<script>
    export default {
        name: "home",
        methods:{
            logout(){
                window.sessionStorage.clear();
                this.$router.push('/login');
            }
        }
    }
</script>

<style scoped>

</style>