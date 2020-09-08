const schedule = {
    namespaced: true,
    state: {
        isSchedule: false, // 控制添加日程弹框
        id: '', //编辑日程id
    },
    mutations: {
        scheduleFrom(state, payload) {
            state.isSchedule = payload.flag;
            state.id = payload.id;
        }
    },
    actions: {
        scheduleFrom(action, payload) {
            action.commit('scheduleFrom', payload)
        }
    }
}

export default schedule;