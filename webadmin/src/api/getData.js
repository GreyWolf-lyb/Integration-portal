import { get } from '../service/request';

const install = function (Vue, options) {
    // 查询节点
    Vue.prototype.findAllNodes = function (body) {
        return get('/tangshan/webadmin/share/findAllNodes', body)
    },
        // 查询系统信息CPU/内存/硬盘
        Vue.prototype.findSystemInfo = function (body) {
            return get('/tangshan/webadmin/share/utilization', body)
        },
        // 累计活跃用户数
        Vue.prototype.findUserActive = function (body) {
            return get('/tangshan/webadmin/share/totalUserNum', body)
        },
        // 系统访问量
        Vue.prototype.getSystemVisit = function (body) {
            return get('/tangshan/webadmin/share/getSystemVisit', body)
        },
        // 系统在线人数
        Vue.prototype.getLoginNum = function (body) {
            return get(`/tangshan/webadmin/share/getLoginNum`, body)
        }
}

export default install;