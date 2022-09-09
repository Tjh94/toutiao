<template>
  <div>
    <van-picker
      title="标题"
      show-toolbar
      :default-index="defaultIndex"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updateUserProfileAPI } from '../../../api/index.js'
export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      defaultIndex: this.value // 开启弹框时的默认选中项
    }
  },
  // columns列表数组中，男女能否交互位置 ['男', '女'] =》 ['女', '男']？？？ 能 1 不能 2
  // 不必交换，因为更具目前的索引可以直接当做参数值来传递给后端
  methods: {
    async onConfirm (value, index) {
      // value 当前选中的 columns 数组中的值, index 当前选中的索引
      // 加载中
      this.$toast.loading({
        duration: 0, // 持续展示加载状态弹框的毫秒数， 当设置为0时，表示持续加载，需要主动关闭
        message: '加载中...', // 加载提示文本
        forbidClick: true // 是否禁用背景点击
      })
      try {
        // 2. 提交接口
        await updateUserProfileAPI({
          gender: index
        })

        // 2.1 更新视图数据
        this.$emit('input', index)

        // 3. 并关闭弹框
        this.$emit('close')

        // 4. 提示成功
        this.$toast.success('修改成功')
      } catch (error) {
        this.$toast.fail('修改失败')
      }
    },
    onChange (picker, value, index) {
      this.$toast(`当前值：${value}, 当前索引：${index}`)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
