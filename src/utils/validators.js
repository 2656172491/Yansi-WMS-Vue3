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
    {
      validator: (rule, value, callback) => {
        if (value === '' || value === null || value === undefined) {
          callback(new Error('请输入单价'))
        } else {
          const numValue = Number(value)
          if (isNaN(numValue) || numValue < 0) {
            callback(new Error('请输入有效的价格'))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur',
    },
  ],
  stock: [
    { required: true, message: '请输入初始库存', trigger: 'blur' },
  ],
}
