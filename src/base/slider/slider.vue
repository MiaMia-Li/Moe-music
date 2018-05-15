<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>

      </slot>
    </div>
    <div class="dots">
      <span class="dot"
            v-for="(item,index) in dots"
            :key="index"
            :class="{active:currentPageIndex===index}"></span>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import {addClass} from '../../common/js/dom'

export default{
  name: 'slider',
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },

  props: {
    // 设置循坏
    loop: {
      type: Boolean,
      default: true
    },
    // 自动播放
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 间隔调用
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth () {
      this.children = this.$refs.sliderGroup.children // 获取slidergroup的每个子元素

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth // 获取父元素视口宽度

      for (let i = 0; i < this.children.length; i++) { // 设置每个轮播图的宽度
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth // 累加计算父元素的总宽度
      }

      // 如果是循环播放并且是首次初始化时，需要再加上头尾两个重复图片的宽度。
      // 而当浏览器调整大小的时候，父元素中的子元素已经包含了首位重复图片的元素，因此不需要进行宽度的增加。

      if (this.loop) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _initSlider () { // 初始化
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 滚动方向
        scrollY: false,
        momentum: false, // 当快速滑动时是否开启滑动惯性
        snap: { // 为slider组件使用
          loop: this.loop, // 是否无缝循环轮播
          threshold: 0.3, // 用手指滑动时页面可切换的阀值，大于这个阀值时可以滑动到下一页
          speed: 400 // 轮播图切换的动画时间
        },
        click: true // 是否派发click事件
      })

      this.slider.on('scrollEnd', () => { // 派发scrollEnd事件,获取当前页currentPageIndex
        let pageIndex = this.slider.getCurrentPage().pageX // 获取索引
        // console.log(pageIndex)
        this.currentPageIndex = pageIndex // 赋值给当前currentPageIndex

        if (this.autoPlay) { // 判断如果是自动轮播
          this._play()
        }
      })
    },
    _play () {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
