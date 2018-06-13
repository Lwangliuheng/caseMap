<template>
    <div class="done">{{msg}}</div>
</template>
<script>
export default {
    data(){
        return {
            msg: '查勘已经结束'
        }
    },
    mounted(){
        if(this.$route.query.status == 2){
            this.msg = '查勘已取消'
        }else if(this.$route.query.status == 3){
            this.msg = '参数不正确'
        }else if(this.$route.query.status == 4){
            this.msg = '您还未开启定位服务'
        }
    }
}
</script>
<style scoped>
    .done{
        height: 100vh;
        text-align: center;
        line-height: 100vh;
    }
</style>

