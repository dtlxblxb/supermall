<template>
  <div id="home">
    <!-- 导航栏 -->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <TabControl :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl1" class="tab-control" v-show="isTabFixed"/>

    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <!-- 轮播图 -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <!-- 推荐 -->
      <recommend-view :recommends="recommends"/>
      <!-- 特色 -->
      <FeatureView/>
      <!-- 选项卡 这里两个class都行不通(由于BetterScroll) -->
      <!-- <TabControl class="tab-control" :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl" :class="{fixed: isTabFixed}"/> -->
      <TabControl :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl2"/>
      <!-- 商品展示 -->
      <GoodsList :goods="showGoods"/>
    </scroll>

    <!-- 回到顶部 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/> <!-- 监听组件点击 -->
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'

import { getHomeMultidata, getHomeGoods } from 'network/home'
// import { debounce } from 'common/utils'
import { itemListenerMixin, backTopMixin } from 'common/mixin'

export default {
  name: 'Home',
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMixin, backTopMixin],
  data () {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: 'pop',
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
      // itemImgListener: null
    }
  },
  computed: {
    showGoods () {
      return this.goods[this.currentType].list
    }
  },
  destroyed () {
    console.log('home destroyed')
  },
  activated () {
    // console.log('activated')
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0) // 滚动到Y值
  },
  deactivated () {
    // console.log('deactivated')
    this.saveY = this.$refs.scroll.getScrollY() // 保存Y值
    this.$bus.$off('itemImageLoad', this.itemImgListener) // 取消全局事件的监听
  },
  created () {
    // 请求多个数据
    this.getHomeMultidata()
    // 请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted () {
    /* mixin
    // 监听事件总线(监听GoodsListItem中图片加载完成)
    const refresh = debounce(this.$refs.scroll.refresh, 50) // 注意refresh后面不能加小括号(代表传入函数返回值), 这里是要传入一个函数, 然后返回一个函数
    this.itemImgListener = () => { // 保存监听的事件
      // console.log('-------')
      // this.$refs.scroll.refresh()
      refresh() // 这里就是调用这个返回的函数
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    // 获取tabControl的offsetTop
    // console.log(this.$refs.tabControl.offsetTop) // undefined
    // console.log(this.$refs.tabControl.$el) // 所有组件都要一个$el属性, 可以获得组件中的元素
    // console.log(this.$refs.tabControl.$el.offsetTop) // 由于图片还没有完全加载完成, 所以数据不正确
    // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
     */
  },
  methods: {
    /**
     * 事件监听相关的方法
     */
    tabClick (index) { // 监听TabControl点击
      switch (index) {
        case 0 :
          this.currentType = 'pop'
          break
        case 1 :
          this.currentType = 'new'
          break
        case 2 :
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    contentScroll (position) { // 监听滚动位置
      // console.log(position)
      // 判断BackTop是否显示
      this.listenShowBackTop(position)
      // 决定TabControl是否吸顶(position: fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop
    },
    loadMore () {
      // console.log('上拉加载更多')
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad () { // 监听轮播图加载完成
      // console.log(this.$refs.tabControl.$el.offsetTop)
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata () {
      getHomeMultidata().then(res => {
        // console.log(res)
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods (type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        // console.log(res)
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: white;
    /* 在使用浏览器原生滚动时, 为了让导航不跟随下面一起滚动
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
    */
  }
  /*吸顶效果, 但使用BetterScroll后不起作用了
  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }
  */
  /* 计算滚动区域方法一
  .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  }
   */
  /*计算滚动区域方法一*/
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /*由于BetterScroll这个方法行不通
  .fixed {
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
  }
  */
  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
