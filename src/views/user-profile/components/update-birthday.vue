<template>
  <div>
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择生日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="updateBirthdayFn"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script>
/*
  1. 传入的值为日期字符串， 而currentDate、日期选择器需要接收的值是Date()数据对象
  2. 所以在初始化默认值时，需要将父组件传递过来的参数，转化为日期对象
  通过new Date(日期字符串) => 将日期字符串转化为Date数据类型
  3. 在提交时，接口希望得到的是一个年-月-日的字符串，但是我们日期选择器中所获取到的数据是一个Date数据类型
  4. 时间格式化 - 使用时间处理插件（dayjs，moment） => 我们使用dayjs
  //  dayjs(需要处理的时间).format('YYYY-MM-DD')
*/
import dayjs from 'dayjs'
import { updateUserProfileAPI } from '../../../api/index.js'
export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      /*
        new Date中设置的月份是0-11， 对应1-12月，在真实表现时，需要对当前月份+-1
      */
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(), // 时间选择器的最大值需要设置为当前日期
      currentDate: new Date(this.value)
    }
  },
  mounted () {
    console.log(new Date(this.value), new Date(2021, 0, 17))
  },
  methods: {
    // 提交日期更新
    async updateBirthdayFn () {
      // 时间格式化
      // 创建临时变量来接受格式化后的日期
      const tempDay = dayjs(this.currentDate).format('YYYY-MM-DD')
      // 加载中
      this.$toast.loading({
        duration: 0, // 持续展示加载状态弹框的毫秒数， 当设置为0时，表示持续加载，需要主动关闭
        message: '加载中...', // 加载提示文本
        forbidClick: true // 是否禁用背景点击
      })
      try {
        // 2. 提交接口
        await updateUserProfileAPI({
          birthday: tempDay
        })

        // 2.1 更新视图数据
        this.$emit('input', tempDay)

        // 3. 并关闭弹框
        this.$emit('close')

        // 4. 提示成功
        this.$toast.success('修改成功')
      } catch (error) {
        this.$toast.fail('修改失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
