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

/**
 * 根据商品id获取库存数量
 * @param id 商品id
 * @returns {*}
 */
export function getQuantityById(id) {
    return request({
        url: 'inventory',
        method: 'GET',
        params: {
            goodId:id,
        }
    })
}

/**
 * 根据商品id获取商品名称
 * @param id 商品id
 * @returns {*}
 */
export function getGoodById(id){
    const url = "goods/"+id
    return request({
        url: url,
        method: 'GET'
    })
}

/**
 * 出入库数据更新
 * @param data 出入库数据
 * @returns {*}
 */
export function updateGoods(data) {
    console.log(data.id)
    const url = '/goods/' + data.id

    return request({
        url: url,
        method: "PUT",
        data: {
            goodsId: data.id,
            type: data.type,
            quantity: data.quantity,
            remark: data.remark,
            warehouseId: 1
        }
    })
}