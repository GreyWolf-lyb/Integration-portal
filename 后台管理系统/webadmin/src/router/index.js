import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
export const constantRoutes = [
    {
        path: '/404',
        component: () =>
            import('@/views/404'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/user',
        meta: { title: '系统管理', icon: 'example' },
        children: [
            {
                path: 'user',
                name: 'user',
                component: () =>
                    import('@/views/omMager/user/user'),
                meta: { title: '用户管理', icon: 'user' },
            },
            {
                path: 'comments',
                name: 'comments',
                component: () =>
                    import('@/views/omMager/comments/index'),
                meta: { title: '角色管理', icon: 'user' },
            },
            {
                path: '/roleList',
                component: () => import('@/views/omMager/comments/roleList'),
                meta: { title: '角色管理', icon: 'roleList' },
                children: [
                    {
                        path: '',
                        meta: { title: '权限分配', icon: 'roleList' }
                    }
                ]
            },
            {
                path: 'dept',
                name: 'dept',
                component: () =>
                    import('@/views/omMager/dept/dept'),
                meta: { title: '部门管理', icon: 'dataModel' }
            },
            {
                path: 'onlineUser',
                name: 'onlineUser',
                component: () =>
                    import('@/views/omMager/onlineUser/onlineUser'),
                meta: { title: '在线用户管理', icon: 'dataModel' }
            }
        ]
    },
    {
        path: '/log',
        component: Layout,
        redirect: '/log',
        meta: { title: '日志管理', icon: 'example' },
        children: [{
            path: '/log',
            name: 'log',
            component: () =>
                import('@/views/log/index'),
            meta: { title: '日志管理', icon: 'log' },
        }]
    },
    {
        path: '/resources',
        component: Layout,
        redirect: '/resources',
        meta: { title: '资源管理', icon: 'example' },
        children: [
            {
                path: '/fileView',
                name: 'fileView',
                component: () =>
                    import('@/views/resources/fileView/index'),
                meta: { title: '文件夹管理', icon: 'user' },
            },
            {
                path: '/repositoryView',
                component: () => import('@/views/resources/fileView/repositoryView'),
                meta: { title: '文件夹管理', icon: 'example' },
                children: [{
                    path: '',
                    meta: { title: '资源库管理', icon: 'user' },
                }]
            }
        ]
    },
    {
        path: '/application',
        component: Layout,
        redirect: '/application/register',
        meta: { title: '应用系统管理', icon: 'example' },
        children: [{
            path: '/register',
            name: 'register',
            component: () =>
                import('@/views/application/register/index'),
            meta: { title: '应用管理系统', icon: 'register' },
        },
        {
            path: '/toExamine',
            name: 'toExamine',
            component: () =>
                import('@/views/application/toExamine/index'),
            meta: { title: '待审核应用管理', icon: 'toExamine' },
        },
        {
            path: '/switch',
            name: 'switch',
            component: () =>
                import('@/views/application/switch/index'),
            meta: { title: '开关应用管理', icon: 'switch' },
        }
        ]
    },
    {
        path: '/columnView',
        component: Layout,
        redirect: '/columnView',
        meta: { title: '栏目管理', icon: 'example' },
        children: [{
            path: '/columnView',
            name: 'columnView',
            component: () =>
                import('@/views/resources/columnView/index'),
            meta: { title: '栏目管理', icon: 'user' },
        }]
    },
    {
        path: '/',
        component: Layout,
        redirect: '/articleView',
        meta: { title: '文章管理', icon: 'example' },
        children: [{
            path: 'articleView',
            name: 'articleView',
            component: () => import('@/views/resources/articleView/index'),
            meta: { title: '文章管理', icon: 'user' },
        },
        {
            path: 'addArticle',
            name: 'addArticle',
            component: () => import('@/views/resources/articleView/addArticle'),
            meta: { title: '添加', icon: 'user' },
        }
        ]
    },
    // {
    //     path: '/repositoryView',
    //     component: Layout,
    //     redirect: '/repositoryView',
    //     meta: { title: '资源库管理', icon: 'example' },
    //     children: [{
    //         path: '/repositoryView',
    //         name: 'repositoryView',
    //         component: () =>
    //             import('@/views/resources/fileView/repositoryView'),
    //         meta: { title: '资源管理', icon: 'user' },
    //     }]
    // },
    {
        path: 'external-link',
        component: Layout,
        children: [{
            path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
            meta: { title: 'External Link', icon: 'link' }
        }]
    },

    // 404 page must be placed at the end !!!
    // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
