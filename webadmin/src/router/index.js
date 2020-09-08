import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import Synopsis from '@/views/synopsis'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    // mode: 'history',
    routes: [{
            path: '/synopsis',
            name: 'synopsis',
            meta: {},
            component: Synopsis,
        },
        {
            path: '/',
            name: 'home',
            component: Home,
            redirect: '/index',
            children: [
                // 首页
                {
                    path: '/index',
                    meta: {
                        title: '首页',
                        name: '首页',
                        icon: require("@/assets/homeSvg/left/导航首页.svg")
                    },
                    component: () =>
                        import ('@/views/main'),
                    children: [{
                        path: '/',
                        meta: {
                            title: '首页',
                            name: '首页',
                            isFlag: true
                        },
                        component: () =>
                            import ('@/views/homePage')
                    }]

                },
                // 我的办事
                {
                    path: '/business',
                    meta: {
                        title: '我的办事',
                        name: '我的办事',
                        icon: require("@/assets/homeSvg/left/我的办事.svg")
                    },
                    component: () =>
                        import ('@/views/main'),
                    children: [{
                            path: '/business/todo',
                            meta: {
                                title: '我的办事',
                                name: '待办事项',
                                isFlag: true
                            },
                            component: () =>
                                import ('@/views/toDo')
                        },
                        {
                            path: '/business/already',
                            meta: {
                                title: '我的办事',
                                name: '已办事项',
                                isFlag: true
                            },
                            component: () =>
                                import ('@/views/task/already')
                        },
                        {
                            path: '/business/waitForMatter',
                            meta: {
                                title: '我的办事',
                                name: '待阅事项',
                                isFlag: true
                            },
                            component: () =>
                                import ('@/views/read/waitFor')
                        },
                        {
                            path: '/business/complete',
                            meta: {
                                title: '我的办事',
                                name: '已阅事项',
                                isFlag: true
                            },
                            component: () =>
                                import ('@/views/read/complete')
                        }
                    ]
                },
                // 数据驾驶舱
                {
                    path: '/datacockpit',
                    meta: {
                        title: '数据驾驶舱',
                        name: '数据驾驶舱',
                        icon: require("@/assets/homeSvg/left/数据驾驶舱.svg")
                    },
                    component: () =>
                        import ('@/views/main'),
                    children: [{
                        path: '/datacockpit/cockpit',
                        meta: {
                            title: '数据驾驶舱',
                            name: '驾驶舱',
                            isFlag: true
                        },
                        component: () =>
                            import ('@/views/cockpit')
                    }]
                },
                // 通讯录
                {
                    path: '/mailList',
                    meta: {
                        title: '通讯录',
                        name: '通讯录',
                        icon: require("@/assets/homeSvg/left/通讯录.svg")
                    },
                    component: () =>
                        import ('@/views/main'),
                    children: [{
                        path: '/mailList/see',
                        meta: {
                            title: '通讯录',
                            name: '通讯录查看',
                            isFlag: true
                        },
                        component: () =>
                            import ('@/views/mailList')
                    }]
                },
                // 日程管理
                {
                    path: '/schedule',
                    meta: {
                        title: '日程管理',
                        name: '日程管理',
                        icon: require("@/assets/homeSvg/left/日程管理.svg")
                    },
                    component: () =>
                        import ('@/views/main'),
                    children: [{
                        path: '/schedule/mine',
                        meta: {
                            title: '日程管理',
                            name: '我的日程',
                            isFlag: true
                        },
                        component: () =>
                            import ('@/views/schedule')
                    }]
                },
                // 信息中心
                {
                    path: '/information',
                    meta: {
                        title: '信息中心',
                        name: '信息中心',
                        icon: require("@/assets/homeSvg/left/最新信息.svg")
                    },
                    component: () =>
                        import ('@/views/main'),
                    children: [{
                            path: '/information/station',
                            meta: {
                                title: '信息中心',
                                name: '新闻动态',
                                isFlag: true
                            },
                            component: () =>
                                import ('@/views/information/station')
                        }, {
                            path: '/information/notice',
                            meta: {
                                title: '信息中心',
                                name: '通知公告',
                                isFlag: true
                            },
                            component: () =>
                                import ('@/views/information/notice')
                        }, {
                            path: '/information/remind',
                            meta: {
                                title: '信息中心',
                                name: '消息提醒',
                                isFlag: true
                            },
                            component: () =>
                                import ('@/views/information/remind')
                        },
                        {
                            path: '/information/details',
                            meta: {
                                title: '信息中心',
                                name: '详情',
                                isFlag: false
                            },
                            component: () =>
                                import ('@/views/information/details')
                        }
                    ]
                },
                // 个人信息
                {
                    path: '/personal',
                    meta: {
                        title: '个人信息',
                        name: '个人信息',
                        icon: require("@/assets/homeSvg/left/个人信息.svg")
                    },
                    component: () =>
                        import ('@/views/main'),
                    children: [{
                            path: '/personal/information',
                            meta: {
                                title: '个人信息',
                                name: '个人信息',
                                isFlag: true
                            },
                            component: () =>
                                import ('@/views/personal/information')
                        },
                        {
                            path: '/personal/password',
                            meta: {
                                title: '个人信息',
                                name: '修改密码',
                                isFlag: true
                            },
                            component: () =>
                                import ('@/views/personal/password')
                        }
                    ]
                }
            ]
        }
    ]
})