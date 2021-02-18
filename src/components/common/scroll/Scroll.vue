<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scroll: null
    }
  },
  mounted () {
    // 创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      observeDOM: true,
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })
    // 监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', position => {
        // console.log(position)
        this.$emit('scroll', position)
      })
    }
    // 监听上拉加载更多事件
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        // console.log('监听到滚动到底部')
        this.$emit('pullingUp')
      })
    }
  },
  methods: {
    // 在固定毫秒内, 滚动到固定位置
    scrollTo (x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    // 重置上拉加载更多
    finishPullUp () {
      this.scroll && this.scroll.finishPullUp()
    },
    // 重新计算可滚动区域的长度
    refresh () {
      // console.log('------')
      this.scroll && this.scroll.refresh()
    },
    // 获取目前滚动到的Y坐标
    getScrollY () {
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>

<style scoped>

</style>
