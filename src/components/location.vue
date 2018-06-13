<template>
<div style="height:100%">
  <div v-if="!msg"  style="height:100%">
    <div id="allmap"></div>
    <div class="btn" @click='uploadPosition' v-if="!isLocation">我在这里</div>
    <!-- <div>客服电话</div> -->
    <!-- <a href="tel:18811626366" class="tel">客服</a> -->
  </div>
  <div class="done" v-else>{{msg}}</div>  
</div>
</template>

<script>
var timer;
export default {
  name: 'HelloWorld',
  data () {
    return {
      isLocation: true,
      map: '', // map 实例
      riderLng: '',  // 骑手位置
      riderLat: '',
      tips: '',
      msg: '', // 如果取消
      isOver: false,
      currentPoint: { // 当前位置
        lng: '',
        lat: ''
      } 
    }
  },

  mounted(){
    // 百度地图API功能
    var that = this;
    this.map = new BMap.Map("allmap");

    this.getInfo().then( res1 =>{
      if(res1.status == '08'){ // 查勘结束
        clearInterval(timer);
        this.msg = '查勘已结束';

      }else if(res1.status == '11'){ // 已经取消查勘  
        clearInterval(timer);
        this.msg = '查勘已取消';   

      }else {
        // 如果定位了
        if(this.isLocation){

          // 获取用户位置
          this.currentPoint.lng = res1.lng;
          this.currentPoint.lat = res1.lat;

          var marker = new BMap.Marker(this.currentPoint);
          that.map.addOverlay(marker);
          // marker.enableDragging();
          marker.setTop(true);

          that.map.centerAndZoom(new BMap.Point(res1.lng, res1.lat), 16);

          // 把 骑手的经纬度赋值
          if(res1.surveyorLng){
            
            this.riderLng = res1.surveyorLng;
            this.riderLat = res1.surveyorLat;
  
            // this.riderLng = 116.415776;
            // this.riderLat = 39.908262;

            this.drivingRoute()            
          }

          // 每10秒获取一次骑手位置
          timer = setInterval( () => {
            that.getInfo().then( res => {

              if(res.status == '08'){ // 查勘结束
                clearInterval(timer);
                this.msg = '查勘已结束';

              }else if(res.status == '11'){ // 已经取消查勘  
                clearInterval(timer);
                this.msg = '查勘已取消';     
              }else {
                // 把 骑手的经纬度赋值
                this.riderLng = res.surveyorLng;
                this.riderLat = res.surveyorLat;

                // this.riderLng = 116.415776;
                // this.riderLat = 39.908262;

                // 如果骑手接单了
                if(this.riderLng){
                  // 先清空之前的覆盖物
                  this.map.clearOverlays(); 

                  var marker = new BMap.Marker(this.currentPoint);
                  this.map.addOverlay(marker);
                  // marker.enableDragging();
                  marker.setTop(true);

                  this.drivingRoute()
                  // this.map.centerAndZoom(new BMap.Point(res.lng, res.lat), 16);
                }
              }
            })
          },10000) // 10秒刷新一次
            
        }else { //如果没有定位，刷新不执行
          // 获取当前位置
          this.getPosition().then( res => {

            // 获取用户位置
            this.currentPoint.lng = res.lng;
            this.currentPoint.lat = res.lat;
              
            that.map.centerAndZoom(new BMap.Point(res.lng, res.lat), 19);
          })
        }
      }
    })
  },
  methods: {
    // 调取接口
    getInfo(){
      const that = this;
      return new Promise( (resolve,reject) => {

        that.$ajax.post('/customer_location/v1/getDetail',{
            surveyNo: that.$route.query.id
          }).then( res =>{
            if(res.data.rescode == 200){
              if(res.data.data.isUploaded == '0'){ // 未上传
                  that.isLocation = false;
              }else {
                  that.isLocation = true;
              }
              resolve(res.data.data);

            }else {
              reject(res);
              alert(res.data.resdes);
              
            }
        })
      })
    },

    // 查勘员驾车路线规划
    drivingRoute (){
      var that = this;

      // 驾车路线，计算时间距离
      var searchComplete = function (results){
        if (transit.getStatus() != 0){
          return ;
        }

        var plan = results.getPlan(0);
        var content = `查勘员距您${plan.getDistance(true)}<br/>
                      预计${plan.getDuration(true)}后到达`;
        if(!that.tips){
          that.tips = content;
        }
      // console.log('aaaaa');

        // 地图覆盖物
        that.addOverlays(results,that.tips);
      }


      // 实例化一个DrivingRoute类
      var transit = new BMap.DrivingRoute(that.map, {
        renderOptions: {map: that.map},
        onSearchComplete: searchComplete,
        onPolylinesSet:function(routes) { 
            var searchRoute = routes[0].getPolyline();//导航路线
            // console.log('路线',routes)
            // searchRoute.z.strokeColor = 'rgba(0,0,0,0)';
            // searchRoute.z.strokeStyle = 'dashed';
            // searchRoute.z.rd = 1;
            that.map.removeOverlay(searchRoute); 
        }, 
        onMarkersSet:function(routes) {
            that.map.removeOverlay(routes[0].marker); //删除起点
            that.map.removeOverlay(routes[1].marker);//删除终点
        }
      });

      transit.search(new BMap.Point(this.riderLng, this.riderLat), new BMap.Point(that.currentPoint.lng, that.currentPoint.lat));

    },
    
    // 添加覆盖物
    addOverlays (results,tips){
      // 自行添加起点和终点
      var start = results.getStart();
      var end = results.getEnd();
      this.addStart(start.point, tips);
      this.addEnd(end.point);
    },

        // 添加起点覆盖物
    addStart(point, tips){
      //创建骑手
      var pt = new BMap.Point(this.riderLng, this.riderLat);
      var myIcon = new BMap.Icon("/caseMap/static/rider.png", new BMap.Size(50,47));
      var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
      this.map.addOverlay(marker2);              // 将标注添加到地图中

      var label = new BMap.Label(tips,{offset:new BMap.Size(-30,-40)});
	    marker2.setLabel(label);
    },

    // 添加终点覆盖物
    addEnd(point, title){
        // this.map.addOverlay(new BMap.Marker(point, {
        //     title: title,
        //     icon: new BMap.Icon('red.png', new BMap.Size(38, 41), {
        //         anchor: new BMap.Size(4, 36)
        //     })
        //   })
        // );

    },

    // 获取当前位置
    getPosition (){
        var that = this;
        var map = this.map;
        return new Promise((resolve,reject) => {
              var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
              // 如果获取成功
              if(this.getStatus() == 0){
                console.log(r.point)
                var mk = new BMap.Marker(r.point);  
                map.addOverlay(mk);  

                resolve(r.point);
                //将地图中心移动到可视区中点  
                // map.panTo(r.point);  
                var centerPixel = map.pointToOverlayPixel(map.getCenter());  
                //通过设置地图的中心点，使定位点显示在手机上部分区域  
                map.setCenter(map.overlayPixelToPoint({x:centerPixel.x,y:centerPixel.y}));  
                map.addEventListener('dragend',function(){  

                    //获得移动之后地图中心点的像素位置  
                    var pixel = map.pointToOverlayPixel(map.getCenter());  
                    //获得定位图标所在位置在地图上的地理位置，实际上定位图标的像素位置就在地图中心像素位置相应的偏移量处  
                    var Point = map.overlayPixelToPoint({x:pixel.x,y:pixel.y});  
                    console.log(Point)
                    // 保存位置
                    that.currentPoint.lat = Point.lat;
                    that.currentPoint.lng = Point.lng;
                    // 新点实例
                    var mkn = new BMap.Marker(Point);  
                    // 清除之前的点
                    map.clearOverlays();
                    // 标记新点到地图上
                    map.addOverlay(mkn);  
                    
                });  
              }
              else {
                reject(this.getStatus())
                alert('failed'+this.getStatus());
              }        
            })
        })
    },

    // 上传位置
    uploadPosition(){
 
      console.log(this.currentPoint)

      this.$ajax.post('/customer_location/v1/setLocation',{
          surveyNo: this.$route.query.id,
          lng: this.currentPoint.lng,
          lat: this.currentPoint.lat
        }).then( res => {
          if(res.data.rescode == 200){
            // that.$router.replace('/'+that.$route.params.id);
            window.location.reload();
          }else{
            alert(res.data.resdes)
          }
      })


    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#allmap {
  position: relative;
  width: 100vw;
  height: 100%;
  margin: 0;
  padding: 0;
}
.btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 50px;
  background: green;
  color: #fff;
  line-height: 50px;
  border-radius: 10px;
  font-size: 24px;
}
.tel {
  display: block;
  position: absolute;
  padding: 5px 10px;
  bottom: 80px;
  right: 10px;
  font-size: 20px;
  background: #fff;
  border-radius: 7px;
}
</style>
