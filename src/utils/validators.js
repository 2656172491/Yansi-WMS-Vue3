// ── 通用验证函数 ──────────────────────────────────────────────────

/** 邮箱验证 */
export const validateEmail = (rule, value, callback) => {
  if (!value) return callback()
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  reg.test(value) ? callback() : callback(new Error('请输入有效的邮箱地址'))
}

/** 手机号验证（中国大陆） */
export const validatePhone = (rule, value, callback) => {
  if (!value) return callback()
  const reg = /^1[3-9]\d{9}$/
  reg.test(value) ? callback() : callback(new Error('请输入有效的手机号码'))
}

/** 身份证验证（18位） */
export const validateIdCard = (rule, value, callback) => {
  if (!value) return callback()
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  reg.test(value) ? callback() : callback(new Error('请输入有效的身份证号码'))
}

/** 正数（非负数）验证 */
export const validateNonNegativeNumber = (rule, value, callback) => {
  if (value === '' || value === null || value === undefined) return callback()
  const num = Number(value)
  if (isNaN(num) || num < 0) {
    callback(new Error('请输入有效的非负数值'))
  } else {
    callback()
  }
}

// ── 表单规则集合 ──────────────────────────────────────────────────

/** 商品表单验证规则 */
export const productRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  sku: [
    { required: true, message: '请输入SKU编号', trigger: 'blur' },
  ],
  category: [
    { required: true, message: '请选择商品分类', trigger: 'change' },
  ],
  price: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { validator: validateNonNegativeNumber, trigger: 'blur' },
  ],
  stock: [
    { required: true, message: '请输入初始库存', trigger: 'blur' },
  ],
}

/** 登录表单验证规则 */
export const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
}
