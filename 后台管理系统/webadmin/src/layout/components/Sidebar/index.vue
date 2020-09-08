<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" />
    <SidebarItem  ref="ChildTree"></SidebarItem>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './navMenu'
import variables from '@/styles/variables.scss'
import { PermissionFindAll } from '@/api/user'
import { sessionStorageGet } from '@/utils/storage'

export default {
  components: { SidebarItem, Logo },
  computed: {
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    }
  },
  methods: {
    async getMenuData () {
      let that = this
      let menu = []
      let parameters = { userId: sessionStorageGet('id') }
      const response = await PermissionFindAll(parameters)
      let Data = response.data.data
      if (response.data.code === 1) {
        Data.map(function(v, k){
          let sub = []
          v.childs.map(function(v1){
            sub.push({id:v1.entity.id, index: v1.entity.route,title: v1.entity.name})
          })
          if(v.entity.name === '首页'){
            menu.push({id:v.entity.id,icon:v.entity.icon, index: v.entity.route,title: v.entity.name})
          }else{
            menu.push({id:v.entity.id,icon:v.entity.icon, index: v.entity.route,title: v.entity.name,subs:sub})
          }
        })
      }
    }
  },
}
</script>
