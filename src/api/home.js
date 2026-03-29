// src/api/home.js
// 首页相关 API（当前为 mock，后续可直接替换为 request() 调用）

// 统一响应结构：{ code: 200, msg: 'success', data: ... }

import request from "@/utils/request.js";

/**
 * 获取首页最近动态
 * 后端接入后可替换为：
 * return request({ url: '/home/activities', method: 'get' })
 */
export function getActivities() {
    return request({
        url: '/statistics/activities',
        method: 'GET'
    })
}