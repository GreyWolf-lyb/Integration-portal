<template>
  <div id="app">
    <keep-alive include="app-main">
      <router-view/>
    </keep-alive>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'app',
  computed: {
    ...mapState('user', ['token', 'info'])
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (this.token) {
        this.$store.dispatch('user/info')
      }
    }
  }
}
</script>

<style lang="scss">
</style>
