<template>
  <div class="update-name">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="编辑昵称"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- 多行文本输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="message"
        rows="3"
        autosize
        type="textarea"
        maxlength="10"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
/*
  当设置好编辑功能后，发现
  1. 个人信息页面并没有实时更新
  2. 再次打开弹框输入框没有进行同步
  3. 点击确认时，没有成功弹框提示
*/
import { updateUserProfileAPI } from '../../../api/index.js'
export default {
  name: 'UpdateName',
  props: {
    value: { // 接收 父组件的v-model指令传递进来的值
      type: String,
      default: ''
    }
  },
  data () {
    return {
      message: this.value
    }
  },
  methods: {
    // 确认修改昵称
    async onConfirm () {
      // 加载中
      this.$toast.loading({
        duration: 0, // 持续展示加载状态弹框的毫秒数， 当设置为0时，表示持续加载，需要主动关闭
        message: '加载中...', // 加载提示文本
        forbidClick: true // 是否禁用背景点击
      })
      try {
        // 1. 判空验证
        if (this.message.trim().length === 0) {
          this.$toast('昵称不能为空')
          return
        }
        // 2. 提交接口
        await updateUserProfileAPI({
          name: this.message
        })

        // 2.1 更新视图数据
        this.$emit('input', this.message)

        // 3. 清空输入框,并关闭弹框
        this.message = ''
        this.$emit('close')

        // 4. 提示成功
        this.$toast.success('修改成功')
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status === 409) {
          this.$toast.fail('用户名已存在')
        } else {
        // 5. 提示失败
          this.$toast.fail('修改失败')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .update-name {
    .van-nav-bar {
    background-color: #fff;
      :deep(.van-nav-bar__title) {
        color: #000;
      }
    }

    .field-wrap {
      padding: 20px;
    }
  }
</style>
