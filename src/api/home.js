// src/api/home.js
// 首页相关 API（当前为 mock，后续可直接替换为 request() 调用）

// 统一响应结构：{ code: 200, msg: 'success', data: ... }
import {Download, Goods, List, Upload} from "@element-plus/icons-vue";

const success = (data) =>
    Promise.resolve({
        code: 200,
        msg: 'success',
        data,
    })

/**
 * 获取首页概览数据
 * 后端接入后可替换为：
 * return request({ url: '/home/overview', method: 'get' })
 */
export function getOverview() {
    return success({
        totalGoods: 120,
        todayInbound: 8,
        todayOutbound: 5,
        warningCount: 3,
    })
}

/**
 * 获取首页快捷入口
 * 后端接入后可替换为：
 * return request({ url: '/home/quick-links', method: 'get' })
 */
export function getQuickLinks() {
    return success([
        {
            title: '物资列表',
            desc: '查看全部物资信息',
            path: '/goods/list',
            icon: Goods,
        },
        {
            title: '入库管理',
            desc: '登记入库记录',
            path: '/inventory/inbound',
            icon: Download,
        },
        {
            title: '出库管理',
            desc: '处理出库业务',
            path: '/inventory/outbound',
            icon: Upload,
        },
        {
            title: '库存盘点',
            desc: '进行库存核对',
            path: '/inventory/stock-check',
            icon: List,
        },
    ])
}

/**
 * 获取首页预警信息
 * 后端接入后可替换为：
 * return request({ url: '/home/alerts', method: 'get' })
 */
export function getAlerts() {
    return success([
        { id: 1, label: '预警', type: 'danger', title: 'A区货架库存不足', time: '10 分钟前' },
        { id: 2, label: '提醒', type: 'warning', title: 'B类物资即将临期', time: '1 小时前' },
        { id: 3, label: '通知', type: 'success', title: '今日盘点任务已完成', time: '今天 09:20' },        { id: 1, label: '预警', type: 'danger', title: 'A区货架库存不足', time: '10 分钟前' },
        { id: 2, label: '提醒', type: 'warning', title: 'B类物资即将临期', time: '1 小时前' },
        { id: 3, label: '通知', type: 'success', title: '今日盘点任务已完成', time: '今天 09:20' },        { id: 1, label: '预警', type: 'danger', title: 'A区货架库存不足', time: '10 分钟前' },
        { id: 2, label: '提醒', type: 'warning', title: 'B类物资即将临期', time: '1 小时前' },
        { id: 3, label: '通知', type: 'success', title: '今日盘点任务已完成', time: '今天 09:20' },        { id: 1, label: '预警', type: 'danger', title: 'A区货架库存不足', time: '10 分钟前' },
        { id: 2, label: '提醒', type: 'warning', title: 'B类物资即将临期', time: '1 小时前' },
        { id: 3, label: '通知', type: 'success', title: '今日盘点任务已完成', time: '今天 09:20' },        { id: 1, label: '预警', type: 'danger', title: 'A区货架库存不足', time: '10 分钟前' },
        { id: 2, label: '提醒', type: 'warning', title: 'B类物资即将临期', time: '1 小时前' },
        { id: 3, label: '通知', type: 'success', title: '今日盘点任务已完成', time: '今天 09:20' },
    ])
}

/**
 * 获取首页最近动态
 * 后端接入后可替换为：
 * return request({ url: '/home/activities', method: 'get' })
 */
export function getActivities() {
    return success([
        { id: 1, type: 'primary', content: '管理员完成了 12 条入库记录', time: '今天 09:30' },
        { id: 2, type: 'success', content: '出库申请已审核通过', time: '今天 10:05' },
        { id: 3, type: 'warning', content: '发现 3 条库存预警信息', time: '今天 11:10' },
        { id: 4, type: 'info', content: '系统数据同步完成', time: '今天 12:00' },        { id: 1, type: 'primary', content: '管理员完成了 12 条入库记录', time: '今天 09:30' },
        { id: 2, type: 'success', content: '出库申请已审核通过', time: '今天 10:05' },
        { id: 3, type: 'warning', content: '发现 3 条库存预警信息', time: '今天 11:10' },
        { id: 4, type: 'info', content: '系统数据同步完成', time: '今天 12:00' },        { id: 1, type: 'primary', content: '管理员完成了 12 条入库记录', time: '今天 09:30' },
        { id: 2, type: 'success', content: '出库申请已审核通过', time: '今天 10:05' },
        { id: 3, type: 'warning', content: '发现 3 条库存预警信息', time: '今天 11:10' },
        { id: 4, type: 'info', content: '系统数据同步完成', time: '今天 12:00' },        { id: 1, type: 'primary', content: '管理员完成了 12 条入库记录', time: '今天 09:30' },
        { id: 2, type: 'success', content: '出库申请已审核通过', time: '今天 10:05' },
        { id: 3, type: 'warning', content: '发现 3 条库存预警信息', time: '今天 11:10' },
        { id: 4, type: 'info', content: '系统数据同步完成', time: '今天 12:00' },        { id: 1, type: 'primary', content: '管理员完成了 12 条入库记录', time: '今天 09:30' },
        { id: 2, type: 'success', content: '出库申请已审核通过', time: '今天 10:05' },
        { id: 3, type: 'warning', content: '发现 3 条库存预警信息', time: '今天 11:10' },
        { id: 4, type: 'info', content: '系统数据同步完成', time: '今天 12:00' },        { id: 1, type: 'primary', content: '管理员完成了 12 条入库记录', time: '今天 09:30' },
        { id: 2, type: 'success', content: '出库申请已审核通过', time: '今天 10:05' },
        { id: 3, type: 'warning', content: '发现 3 条库存预警信息', time: '今天 11:10' },
        { id: 4, type: 'info', content: '系统数据同步完成', time: '今天 12:00' },
    ])
}