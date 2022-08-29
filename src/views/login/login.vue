<template>
  <!-- 每一个组件都有自己跟标签的类名 -->
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />

    <!-- 登录 -->
    <van-form @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="用户名"
        label="用户名"
        placeholder="请输入用户名"
        left-icon="music-o"
        :rules="[{ required: true, message: '请填写用户名' }]"
      >
        <template #left-icon>
          <i class="toutiao toutiao-shouji"></i>
        </template>
      </van-field>

      <van-field
        v-model="user.codeSms"
        type="password"
        name="验证码"
        label="验证码"
        placeholder="请输入验证码"
        :rules="[{ required: true, message: '请填写验证码' }]"
      >
        <template #left-icon>
          <i class="toutiao toutiao-yanzhengma"></i>
        </template>
        <template #button>
          <van-button round size="small" type="default" class="send-sms-btn"
            >获取验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit" class="submitBtn"
          >登录</van-button
        >
      </div>
    </van-form>
    <span>默认账号密码： 13911111111 密码： 246810</span>
  </div>
</template>

<script>
import { loginAPI } from '../../api/index.js'
export default {
  name: 'LoginIndex',
  data () {
    return {

      // 在一个from表单中，或者是想管理多个表单变量时，建议放在一个对象里面
      user: {
        mobile: '',
        codeSms: ''
      }
    }
  },
  methods: {
    async onSubmit () {
      try {
        const res = await loginAPI({
          mobile: this.user.mobile,
          code: this.user.codeSms
        })
        console.log('登录成功', res)
      } catch (error) {
        if (error.response.status === 400) {
          console.log('手机号或验证码输入错误', error)
        } else {
          console.log('登录失败，网络异常', error)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
/*
    场景： 如果css样式设置后在页面上不生效时
    1. 看一下控制台中设置的样式是否被划掉（被覆盖），如果覆盖了，考虑样式优先级
    2. 观察复合选择器是否书写正确
    3. 因为我们修改的时第三方组件的样式，可能会导致样式无法影响，可以使用 样式穿透 -/deep/ :deep(类名)
  */
.login-container {
  .van-field__left-icon {
    color: black;
  }
  .submitBtn {
    background-color: #6db4fb;
    border: none;
  }
  .toutiao {
    font-size: 38px;
  }
  .send-sms-btn {
    background-color: #ededed;
    color: #666;
  }
}
</style>
