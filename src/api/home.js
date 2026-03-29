// src/api/home.js
// 首页相关 API（当前为 mock，后续可直接替换为 request() 调用）

// 统一响应结构：{ code: 200, msg: 'success', data: ... }

const success = (data) =>
    Promise.resolve({
        code: 200,
        msg: 'success',
        data,
    })

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
        { id: 4, type: 'info', content: '系统数据同步完成', time: '今天 12:00' },
    ])
}