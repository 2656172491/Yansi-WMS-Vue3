import request from '@/utils/request'

/**
 * 用户登录
 */
export function login(data) {
    return request({
        url: '/auth/login',
        method: 'POST',
        data: new URLSearchParams(data),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

/**
 * 用户登出
 */
export function logout() {
    return request({
        url: '/auth/logout',
        method: 'POST'
    })
}

/**
 * 获取首页最近动态
 */
export function getActivities() {
    return request({
        url: '/statistics/activities',
        method: 'GET'
    })
}

/**
 * 获取物资列表
 */
export function getGoodsList(params = {}) {
    return request({
        url: '/goods',
        method: 'GET',
        params: params,
    })
}

/**
 * 统计概览数据（首页卡片）
 */
export function getOverview() {
    return request({
        url: '/statistics/overview',
        method: 'GET',
    })
}

/**
 * 出入库趋势数据
 */
export function getTrend(params={}) {
    return request({
        url: '/statistics/trends',
        method: 'GET',
        params: params,
    })
}