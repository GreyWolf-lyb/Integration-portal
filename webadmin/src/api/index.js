import { post, get, put, DELETE } from '../service'

const install = function (Vue, options) {
    // 登录
    Vue.prototype.getLogin = function (body) {
        return get('/integration_manage/webadmin/user/signIn', body)
    },
        // 退出登录
        Vue.prototype.signOutLogin = function (body) {
            return get('/integration_manage/webadmin/user/signOut', body)
        },
        // 获取用户信息
        Vue.prototype.userInfo = function (body) {
            return get('/integration_manage/webadmin/user/findById', body)
        },
        // 修改资料
        Vue.prototype.userEdit = function (body) {
            return put('/integration_manage/webadmin/user/updateUser', body)
        },
        // 修改密码
        Vue.prototype.passeordEdit = function (body) {
            return put('/integration_manage/webadmin/user/updatePassword', body)
        },
        // 文件上传
        Vue.prototype.uploadFile = function (body) {
            return post('/integration_manage/service/base/file/uploadFile', body)
        },
        // cms
        Vue.prototype.article = function (body) {
            return get('/integration_manage/webadmin/cms/art/findAll', body)
        },
        // 导航接口
        Vue.prototype.navListData = function (body) {
            return get('/integration_manage/webadmin/application/findAll', body)
        },
        // 布局接口
        Vue.prototype.TemplateLayout = function (body) {
            return put('/integration_manage/webadmin/user/updateTemplate', body)
        },
        // 模板接口
        Vue.prototype.TemplateStyleLayout = function (body) {
            return put('/integration_manage/webadmin/user/updateModule', body)
        },
        // 文章详情
        Vue.prototype.articleFindById = function (body) {
            return get('/integration_manage/webadmin/cms/art/findById', body)
        },
        // 友情链接
        Vue.prototype.friendship = function (body) {
            return get('/integration_manage/webadmin/cms/art/findAll', body)
        },

        // 通讯录列表
        Vue.prototype.getMailList = function (body) {
            return get('/integration_manage/webadmin/user/findAll', body)
        },
        // 组织树结构
        Vue.prototype.treeDepartment = function (body) {
            return get('/integration_manage/webadmin/group/findAll', body)
        },

        // 日程接口
        // 添加日程
        Vue.prototype.scheduleAdd = function (body) {
            return post('/integration_manage/service/schedule/insert', body)
        },
        // 编辑日程
        Vue.prototype.scheduleEdit = function (body) {

            return put('/integration_manage/service/schedule/update', body)
        },
        // 日程详情
        Vue.prototype.scheduleDetails = function (body) {
            return get('/integration_manage/service/schedule/findById', body)
        },
        // 获取日程列表
        Vue.prototype.scheduleList = function (body) {
            return get('/integration_manage/service/schedule/findAll', body)
        },
        // 删除日程
        Vue.prototype.scheduleDelete = function (body) {
            return DELETE('/integration_manage/service/schedule/delete?id=' + body)
        },
        // 日程完成状态
        Vue.prototype.scheduleComplete = function (body) {
            return get('/integration_manage/service/schedule/complete', body)
        },
        // 查询某天日程
        Vue.prototype.queryTime = function (body) {
            return get('/integration_manage/service/schedule/findByTime', body)
        },

        // 添加任务
        Vue.prototype.taskAdd = function (body) {
            return post('/integration_manage/service/task/insert', body)
        },
        // 任务列表
        Vue.prototype.taskList = function (body) {
            return get('/integration_manage/service/task/findAll', body)
        },
        // 编辑任务
        Vue.prototype.taskEdit = function (body) {
            return put('/integration_manage/service/task/update', body)
        },
        // 删除任务
        Vue.prototype.taskDelete = function (body) {
            return DELETE('/integration_manage/service/task/delete', body)
        },
        // 任务总数量
        Vue.prototype.taskNum = function (body) {
            return get('/integration_manage/service/task/findNum', body)
        },

        // 消息提醒
        // 获取消息列表
        Vue.prototype.messageList = function (body) {
            return get('/integration_manage/service/message/findAll', body)
        },
        // 添加消息
        Vue.prototype.messageAdd = function (body) {
            return post('/integration_manage/service/message/insert', body)
        },
        // 删除消息
        Vue.prototype.messageDelete = function (body) {
            return DELETE('/integration_manage/service/message/delete', body)
        },
        // 编辑消息任务
        Vue.prototype.messageEdit = function (body) {
            return put('/integration_manage/service/message/update', body)
        },
        // 编辑消息任务
        Vue.prototype.messageDetails = function (body) {
            return get('/integration_manage/service/message/findById', body)
        },

        // 数据驾驶舱
        // // 查询节点
        // Vue.prototype.findAllNodes = function (body) {
        //     return get('/tangshan/webadmin/share/findAllNodes', body)
        // },
        // // 查询系统信息CPU/内存/硬盘
        // Vue.prototype.findSystemInfo = function (body) {
        //     return get('/tangshan/webadmin/share/utilization', body)
        // },
        // // 累计活跃用户数
        // Vue.prototype.findUserActive = function (body) {
        //     return get('/tangshan/webadmin/share/totalUserNum', body)
        // },
        // // 系统访问量
        // Vue.prototype.getSystemVisit = function (body) {
        //     return get('/tangshan/webadmin/share/getSystemVisit', body)
        // },
        // // 系统在线人数
        // Vue.prototype.getLoginNum = function (body) {
        //     return get(`/tangshan/webadmin/share/getLoginNum`, body)
        // },
        // 待阅任务完成情况
        Vue.prototype.findTaskState = function (body) {
            return post('/integration_manage/service/dashboard/findTaskState', body)
        },
        // 待办数量排名
        Vue.prototype.findTaskTop = function (body) {
            return post('/integration_manage/service/dashboard/findTaskTop', body)
        }
}
export default install;