import Vue from 'vue'
import Vuex from 'vuex'
import schedule from './schedule';
import user from './user';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        schedule,
        user
    }
})