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
        url: '/inventory',
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
 * 分页查询出入库记录
 * 接口：GET /api/inventory/records
 * @param {{ page?: number, pageSize?: number, type?: number, goods_name?: string }} params
 *   - type: 1 入库 | 2 出库
 * @returns {Promise<{ records: object[], total: number, page: number, pageSize: number }>}
 *   - records[]: { id, goods_id, goods_name, type, quantity, before_quantity, after_quantity, operator, remark, create_time }
 */
export function getRecordList(params = {}) {
    return request({
        url: '/records',
        method: 'GET',
        params: params
    })
}

/**
 * 出入库数据更新
 * @param data 出入库数据
 * @returns {*}
 */
export function updateInventory(data) {
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

/**
 * 获取用户列表
 * @returns {*}
 */
export function getUsers(params = {}) {
    return request({
        url: '/user',
        method: 'GET',
        params: params
    })
}

/**
 * 根据角色id获取角色信息
 * @param id
 * @returns {*}
 */
export function getRoleById(id) {
    const url = '/roles/' + id
    return request({
        url: url,
        method: 'GET',
    })
}

/**
 * 根据用户id获取用户信息
 * @param id
 * @returns {*}
 */
export function getUserById(id) {
    const url = '/user/' + id;
    return request({
        url: url,
        method: 'GET',
    })
}

/**
 * 添加用户
 * @param data
 * @returns {*}
 */
export function addUser(data) {
    console.log(data)
    return request({
        url: '/user',
        method: 'POST',
        data: data
    })
}

/**
 * 更新用户信息
 * @param data
 * @returns {*}
 */
export function updateUser(data) {
    return request({
        url: '/user',
        method: 'PUT',
        data: data
    })
}

/**
 * 删除用户
 * @param id
 * @returns {*}
 */
export function deleteUser(id) {
    const url = '/user/' + id;
    return request({
        url: url,
        method: 'DELETE',
    })
}

/**
 * 修改用户状态
 * @param id
 * @param status
 * @returns {*}
 */
export function updateUserStatus(id,status) {
    const url = '/user/upStatus/' + id;
    return request({
        url: url,
        method: 'PUT',
        data: {status: status},
    })
}

/**
 * 获取用户管理数据卡片信息
 * @returns {*}
 */
export function getUserStats() {
    return request({
        url: '/user/stats',
        method: 'GET',
    })
}

/**
 * 获取角色列表
 * @returns {*}
 */
export function getRoleList(){
    return request({
        url: '/roles',
        method: 'GET',
    })
}

export function addRole(data) {
    return request({
        url: '/roles',
        method: 'POST',
        data: data
    })
}

export function updateRole(data) {
    const url = '/roles/' + data.id;
    return request({
        url: url,
        method: 'PUT',
        data: data
    })
}

export function deleteRole(id) {
    const url = '/roles/' + id;
    return request({
        url: url,
        method: 'DELETE',
    })
}

export function getRoleStats() {
    return request({
        url: '/roles/stats',
        method: 'GET',
    })
}

export function getWarehouseList(){
    return request({
        url: '/warehouses',
        method: 'GET',
    })
}

export function getWarehouseById(id){
    const url = '/warehouses/' + id;
    return request({
        url: url,
        method: 'GET',
    })
}

export function addWarehouse(data) {
    return request({
        url: '/warehouses',
        method: 'POST',
        data: data
    })
}

export function updateWarehouse(data) {
    const url = '/warehouses/' + data.id;
    return request({
        url: url,
        method: 'PUT',
        data: data
    })
}

export function deleteWarehouse(id) {
    const url = '/warehouses/' + id;
    return request({
        url: url,
        method: 'DELETE',
    })
}

export function getWarehouseStats() {
    return request({
        url: '/warehouses/stats',
        method: 'GET',
    })
}

export function getLoginLogList(){
    return request({
        url: 'logs/login',
        method: 'GET',
    })
}

export function getOperateLogList() {
    return request({
        url: 'logs/operate',
        method: 'GET',
    })
}

export function deleteGoods(id){
    const url = '/goods/' + id;
    return request({
        url: url,
        method: 'DELETE',
    })
}

export function getCategoryList(){
    return request({
        url: '/category',
        method: 'GET',
    })
}

export function addGoods(data){
    return request({
        url: '/goods',
        method: 'POST',
        data: data
    })
}

export function updateGoods(data){
    return request({
        url: '/goods',
        method: 'PUT',
        data: data
    })
}