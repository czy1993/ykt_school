<template>
  <div class="week-timetable">
    <div class="week_timetable-header">
      <h4>本周录像</h4>
      <el-button type="text" @click="$router.push('/1/course')" >全部录像</el-button>
    </div>
    <div class="week_timetable-center" v-if="videoData.length > 0">
      <div v-for="(item,index) in videoData" :key="index">
        <img :src="require(`@/assets/kc_img/${item.imgUrl}.jpg`)" alt />
        <h4>{{item.name}}</h4>
        <p>录制日期：{{item.date}}</p>
        <p>录制时长：{{item.time}}</p>
        <p>录制编号：{{item.id}}</p>
      </div>
    </div>
    <div class="week_timetable-center" v-else>
      <div class="no-week">
       <img :src="require(`@/assets/image/wucopy.png`)" alt />
       <p>暂无录像</p>
      </div>
    </div>
  </div>
</template>
<script>
import { weekVideo } from '@/api/teacher.js'
export default {
  data(){
    return{
      videoData:[] 
    }
  },
  created(){
     this.get_weekVideo()
  },
  methods:{
    get_weekVideo(){
      weekVideo().then( res => {
        if( res.code == 200){
          this.videoData = res.data;
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.week-timetable {
  .week_timetable-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .week_timetable-center{
      div{
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: 4px;
          border: 1px solid #eceef1;
          border-radius: 3px;
          font-size: 13px;
          margin-bottom: 10px;
          img{
              height: 140px;
          }
          h4{
              margin: 8px;
          }
          p{
              margin: 5px;
          }
      }
      .no-week{
        justify-items: center;
        align-items: center;
        p{
          color: #bfbfbf;
          padding: 10px;
          font-weight: 700;
        }
        img{
              height: 130px;
          }
      }
  }
}
</style>
