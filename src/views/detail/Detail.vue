<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type='3' @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/> <!-- 一般属性用'-'分割, 值和事件用驼峰 -->
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :commentInfo="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!--<toast :message="message" :show="show"/>-->
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
// import Toast from 'components/common/toast/Toast'

// import { debounce } from 'common/utils'
import { itemListenerMixin, backTopMixin } from 'common/mixin'
import { getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'

import { mapActions } from 'vuex'

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    Scroll
    // Toast
  },
  mixins: [itemListenerMixin, backTopMixin],
  data () {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      // itemImgListener: null
      themeTopYs: [],
      currentIndex: 0
      // message: '',
      // show: false
    }
  },
  created () {
    // 保存传入的iid
    this.iid = this.$route.params.iid
    // 根据iid获取详情数据
    getDetail(this.iid).then(res => {
      // console.log(res)
      const data = res.result
      this.topImages = data.itemInfo.topImages // 轮播图
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services) // 商品信息
      this.shop = new Shop(data.shopInfo) // 店铺信息
      this.detailInfo = data.detailInfo // 商品详细信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule) // 参数
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0] // 评论信息
      }
    })
    // 获取推荐数据
    getRecommend().then(res => {
      // console.log(res)
      this.recommends = res.data.list
    })
  },
  mounted () {
    /* mixin
    // 监听事件总线
    const refresh = debounce(this.$refs.scroll.refresh, 50)
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
     */
  },
  updated () {
  },
  destroyed () {
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad () { // 这里没做防抖, 是在DetailGoodsInfo.vue做了个判读
      this.$refs.scroll.refresh()

      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.param.$el.offsetTop - 44) // $el 代表组件的根标签
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
      this.themeTopYs.push(Number.MAX_VALUE)
      // console.log(this.themeTopYs)
    },
    titleClick (index) {
      // console.log(index)
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
    },
    contentScroll (position) {
      // console.log(position)
      const positionY = -position.y
      const length = this.themeTopYs.length
      // for (let i = 0; i < length; i++) {
      //   // console.log(i)
      //   if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
      //     // console.log(i)
      //     this.currentIndex = i
      //     // console.log(this.currentIndex)
      //     this.$refs.nav.currentIndex = this.currentIndex
      //   }
      // }
      for (let i = 0; i < length - 1; i++) {
        if ((this.currentIndex !== i) && (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      this.listenShowBackTop(position)
    },
    addToCart () {
      // console.log('---')
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // this.$store.commit('addCart', product)

      /*
      this.$store.dispatch('addCart', product).then(res => {
        console.log(res)
      })
      */
      this.addCart(product).then(res => {
        // console.log(res)
        // this.show = true
        // this.message = res
        // setTimeout(() => {
        //   this.show = false
        //   this.message = ''
        // }, 1500)
        this.$toast.show(res, 1500)
      })
    }
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 44px - 49px);
  }
</style>
