<template>
  <div class="update-photo">
    <img ref="img" class="avatar" :src="image">
    <div class="toolbar">
      <span class="cancal" @click="$emit('close')">取消</span>
      <span class="confirm" @click="onConfirm">完成</span>
    </div>
  </div>
</template>

<script>
/*
  前端裁剪图片的标准流程
  1. 初始化cropper
  2. 触发cropper实例的getCroppedCanvas().toBlob(), 获取剪裁后的图片blob对象
  3. 在调用上传接口之前，需要将blob放到formData数据结构中(.append(key, value))
  4. 可以通过后端返回的图片链接渲染到页面上
*/
// 按需引入样式表和剪裁的内置方法
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

import { updateUserPhotoAPI } from '../../../api/index.js'
export default {
  name: 'UpdatePhoto',
  props: {
    image: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      cropper: null
    }
  },

  mounted () {
    // 初始化剪裁功能CropperJs
    this.initCropper()
  },
  methods: {
    // 初始化CropperJs
    initCropper () {
      // 1. 获取页面图片dom元素
      const image = this.$refs.img
      // 2. 初始化裁剪 config
      this.cropper = new Cropper(image, {
        viewMode: 1, // 定义裁剪模式，0：裁剪框可以扩展到画布外， 1,2,3会将裁剪框限制在画布内
        dragMode: 'move', // 拖动模式 move: 移动画布
        aspectRatio: 1, // 截图比例, 1:1可以简写为1
        autoCropArea: 1, // 自动截图区
        cropBoxMovable: false, // 截图区域是否可以移动
        cropBoxResizable: false, // 截图区的缩放功能
        background: false, // 是否显示默认背景
        movable: true // 背景图片是否可以移动，默认true
        // crop (event) { // 当移动图片是会返回的各种数据（今天的案例中不需要使用）
        //   console.log('x轴:', event.detail.x)
        //   console.log('y轴:', event.detail.y)
        //   console.log('长度:', event.detail.width)
        //   console.log('宽度:', event.detail.height)
        //   console.log('旋转角:', event.detail.rotate)
        //   console.log('滚动x轴距离:', event.detail.scaleX)
        //   console.log('滚动y轴距离:', event.detail.scaleY)
        // }
      })
    },

    // 点击确认上传头像
    onConfirm () {
      // 方案一: 传递crop方法中的数据给后端，让后端来实现剪裁
      // 方案二: 前端使用cropperjs内置的裁剪方法，来实现图片剪裁，将剪裁好的图片上传到后端
      // 通过 this.cropper.getCroppedCanvas().toBlob() 方法来获取剪裁区域的图像内容
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        // 获取到了blob对象，将该对象通过接口传递给后端即可
        // 上传方法
        this.updateUserPhoto(blob)
      })
    },

    // 调用接口上传裁剪图片
    async updateUserPhoto (blob) {
      // 图片上传 、 文件上传的标准模式是上传什么东西？？？？ formData数据结构包裹才可以上传文件
      console.log(blob)
      try {
        // 如果接口请求是发送文件，那么需要用FormData对象进行数据传输
        const formData = new FormData()

        // 将获取到的文件blob对象唇乳formData中
        // formData.append('key属性值 - 后端接口要求的参数名', 'value值 - 文件blob')
        formData.append('photo', blob)

        // 调用接口传递参数
        const res = await updateUserPhotoAPI(formData)

        // 提示成功
        this.$toast.success('更新成功')
        /* 成功后关闭弹框 、 更新头像 */
        // 触发父组件自定义事件， 让父组件修改用户的头像
        this.$emit('update-photo', res.data.data.photo)
        // 关闭弹出层
        this.$emit('close')
      } catch (error) {
        console.log(error)
        this.$toast.fail('更新成功')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.update-photo {
  background-color: black;
  height: 100%;

  .avatar {
    max-width: 100%;
    display: block;
  }

  .toolbar {
    // 盒子本身在页面上的位置
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    // 盒子内部元素的排列结构
    color: #fff;
    font-size: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
  }
}
</style>
