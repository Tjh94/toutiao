<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="个人信息"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 个人信息（单元格） -->
    <van-cell title="头像" is-link class="photo-cell" @click="openImageUpdate">
      <template #default>
        <van-image
          class="avatar"
          round
          fit="cover"
          :src="user.photo"
        />
      </template>
    </van-cell>
    <van-cell title="昵称" is-link :value="user.name"  @click="isUpdateNameShow = true"/>
    <van-cell title="性别" is-link :value="user.gender === 0 ? '男' : '女'" @click="isUpdateGenderShow = true" />
    <van-cell title="生日" is-link :value="user.birthday" @click="isUpdateBirthdayShow = true" />

    <!-- 上传图片控件 -->
    <!-- 上传控件有一个change事件，该事件的触发时机是这个控件中的内容 发生改变 时触发 -->
    <input type="file" hidden ref="file" @change="onFileChange"/>

    <!-- 昵称编辑弹框 -->
    <!-- 复制完成其他页面功能模块后 - 从上往下阅读每一个属性，判断该属性是否在当前功能中所需要，如果需要则进行特色化（变成当前组件的名称或变量）,如果判断不必要则进行删除 -->
    <van-popup
      class="update-name-popup"
      v-model="isUpdateNameShow"
      position="bottom"
      style="height: 100%"
    >
      <update-name v-if="isUpdateNameShow" v-model="user.name" @close="isUpdateNameShow = false"></update-name>
    </van-popup>

    <!-- 性别编辑弹框 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <update-gender v-if="isUpdateGenderShow" v-model="user.gender" @close="isUpdateGenderShow = false"></update-gender>
    </van-popup>

    <!-- 生日编辑弹框 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <update-birthday v-if="isUpdateBirthdayShow" v-model="user.birthday" @close="isUpdateBirthdayShow = false"></update-birthday>
    </van-popup>

    <!-- 头像预览弹框 -->
    <van-popup
      v-model="isUpdateImageShow"
      position="bottom"
      style="height: 100%"
    >
      <update-photo
        :image="image"
        v-if="isUpdateImageShow"
        @close="isUpdateImageShow = false"
        @update-photo="user.photo = $event"
      ></update-photo>
    </van-popup>
  </div>
</template>

<script>
/*
  目标1： 生产个人信息页面并跳转
  1. 创建user-prefile组件
  2. 在router规则数组中设置对应路由
  3. my.vue中的编辑信息按钮上实现路由跳转
*/

/*
  目标：制作昵称， 性别， 生日功能
  1. 都需要用到van-popup弹出层
  2. 昵称使用表单提交的规范化3步骤就能完成
  3. 性别使用van-picker组件实现，注意ui组件与实际数据的管理，培养你们阅读文档的能力
  4. 生日使用van-datetime-picker组件实现，和性别相似，数据较复杂
*/

/*
  1. 在写这3个功能时，你有没有封装组件？ -  不封装 => 不封装的理由就是组件中的内容非常简单，而且并不会被复用
  ↑ - 在今天的课堂上，我们为了练习组件的传参和一些组件封装时的必要思想， 所以我们要封装组件
  2. 你在写这3个功能时，阅读ui框架文档，你发现了什么？ => 选择器组件的使用方式几乎相同，除了对数据处理的逻辑有略微差异
  ↑ - 以后工作中不一定每次都用的是vant组件库，但是只要是组件只要是某一相似的功能，他们的结构，数据处理，组件业务逻辑几乎是一样的
*/

/*
  目标1： 昵称编辑
  1. 点击昵称单元格打开昵称编辑弹框
  2. 在编辑昵称输入框中具有初始化时为当前昵称内容，并且有一定的字数限制
  3. 点击确认 提交昵称并关闭弹框
  4. 点击取消，则直接关闭弹框
*/

/*
  目标2： 性别编辑
  1. 点击性别单元格打开性别编辑弹框
  2. 在编辑性别选择框中具有初始化时为当前性别内容
  3. 点击确认 提交性别并关闭弹框, 有成功弹框提示, 个人信息页面实时更新性别
  4. 点击取消，则直接关闭弹框
  5. 再次打开弹框输入框进行性别同步
*/

/*
  目标3： 生日编辑
  1. 点击生日单元格打开生日编辑弹框
  2. 在编辑生日选择框中具有初始化时为当前生日内容
  2.5 需要设置日期选择器选择的时间区间 （最大时间应该是当前日期）
  3. 点击确认 提交生日并关闭弹框, 有成功弹框提示, 个人信息页面实时更新生日
  3.5 需要使用dayjs插件，将时间选择器中返回的数据改成接口所需要的数据结构
  4. 点击取消，则直接关闭弹框
  5. 再次打开弹框输入框进行生日同步
*/

/*
  目标4：头像上传
  - 图片上传
  1. 图片的上传
  1.1 图片上传一定有一个input标签支持，它拥有一个属性叫做type="file"
  1.2 该input仅作为上传图片的工具，并不会展示到页面上 => hidden属性
  1.3 通过获取dom元素（ref & $refs），然后通过代码触发.click事件
  2. 图片的预览
  2.1 将图片对象转化为blob数据
  2.2 该blob数据传递给子组件时，用String数据类型来接收

  - 图片剪裁
  1. 初始化cropperjs 裁剪插件
  2. 当点击确认时，将图片裁剪，并发送给后端
  3. 当上传成功后，关闭弹框并且头像更新
*/
import { getUserProfileAPI } from '../../api/index.js'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  data () {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false, // 昵称编辑弹框状态
      isUpdateGenderShow: false, // 性别编辑弹框状态
      isUpdateBirthdayShow: false, // 生日编辑弹框状态
      isUpdateImageShow: false, // 头像预览弹框状态
      image: '' // 图片预览的图片地址
    }
  },

  created () {
    // 获取用户基本信息
    this.loadProfile()
  },

  methods: {
    // 获取用户基本信息
    async loadProfile () {
      try {
        const res = await getUserProfileAPI()
        this.user = res.data.data
        console.log(res)
      } catch (error) {
        console.log(error)
        this.$toast('数据获取失败')
      }
    },

    // 开启上传图片
    openImageUpdate () {
      /*
        dom元素的 onclick 是设置dom元素的点击事件
        dom元素的 click 是触发这个dom元素的点击事件
      */
      this.$refs.file.click()
    },

    // 上传控件中图片发生变化时触发
    onFileChange (value) {
      // value change事件所提供的默认形参并不是图片本身，而是当前上传change事件的方法
      // 通过dom元素的属性来获取当前的图片
      const file = this.$refs.file.files[0]
      console.log(file)

      // 基于文件对象获取blob数据
      this.image = window.URL.createObjectURL(file)

      // 当连续上传两个相同的图片时，会无法触发change事件，如果遇到了这种情况，那么将input框中的内容清空即可
      this.$refs.file.value = ''

      // 展示预览图片的弹框
      this.isUpdateImageShow = true
    }
  }
}
</script>

<style lang="less" scoped>
  .user-profile {
    .page-nav-bar {
      // /deep/
      :deep(.van-icon-arrow-left) {
        color: #fff;
      }
    }

    .avatar {
      width: 60px;
      height: 60px;
    }

    .photo-cell {
      display: flex;
      align-items: center;
      .van-cell__value {
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
      }
    }

    .van-popup {
      background-color: #f2f2f2;
    }
  }
</style>
