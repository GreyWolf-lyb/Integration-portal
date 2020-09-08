<template>
  <el-main class="main">
    <el-col :span='24'>
      <ifr :item="item"></ifr>
    </el-col>
  </el-main>
</template>

<script>
import { mapGetters } from 'vuex'
import ifr from '@/components/iframe/iframe'

export default {
  name: 'iframe',
  components: {
    ifr,

  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
     
  },
  data() {
    return {
      item: {
        // http://139.9.228.68:54321/flow/index.html#
       url: 'https://www.baidu.com/',
       isScroll: false
      }
    }
  },
  methods: {
   
  }
}
</script>

<style lang="scss" scoped>
  .main{
    height:100%;
  }

</style>
