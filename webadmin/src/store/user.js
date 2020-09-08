import {get, post } from '../service'
const user = {
    namespaced: true,
    state: {
        info: {},
        token: sessionStorage.getItem('token') || ''
    },
    mutations: {
        loginInfo(state, payload) {
            state.info = payload
        },
        loginToken(state, token) {
            state.info = token
        }
    },
    actions: {
        login({ dispatch, commit }, payload) {
            return post('/integration_manage/webadmin/user/ssoSignIn', { ssoToken: payload }).then((res) => {
                if (res.code === 1) {
                    sessionStorage.setItem("token", res.data.token);
                    sessionStorage.setItem("id", res.data.id);
                    sessionStorage.setItem("name", res.data.name);
                    return dispatch('info')
                } else {
                    return Promise.reject(res)
                }
            })
        },
        async info({ commit, dispatch }, body) {
            const userInfo = await get('/integration_manage/webadmin/user/findById', body)
            commit('loginInfo', userInfo.data)
        }
    }
}
export default user;