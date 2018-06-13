<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"/> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){

    // var surveyNo = 'd94d5fa1a3b94b6282f62b1effde38fc' // 待查勘
    // var surveyNo = 'f56ba3ec73144126a868bfe5e8094702' // 查勘中
    // var surveyNo = '966a2d5cc89649b999def21a2d74a932' //取消
    // var surveyNo = this.$route.query.id;

    // this.$ajax.post('/customer_location/v1/getDetail',{
    //   surveyNo: surveyNo,
    // }).then( res =>{
    //   if(res.data.rescode == 200){
    //     if(res.data.data.status == '08'){ // 查勘结束
    //       this.$router.replace('/done?status=1')

    //     }else if(res.data.data.status == '11'){ // 已经取消查勘  

    //       this.$router.replace('/done?status=2')        
    //     }else{ // 06 新案件  07 查勘中
    //         this.$router.replace(`/case?id=${surveyNo}`)
    //     }
    //   }else{           
    //     this.$router.replace('/done?status=3')
    //   }
    // })
  }
}
</script>

<style>
html,body {
  margin: 0;
  padding: 0;
  height: 100%;  
}
#app {
  height: 100%;
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.done{
    /* height: 100vh; */
    text-align: center;
    line-height: 100vh;
}
</style>
