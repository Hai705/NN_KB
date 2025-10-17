<template>
  <div class="flex flex-col space-y-4">
    <div class="grid sm:grid-cols-12 gap-8 bg-[#ffffff] drop-shadow-lg sm:p-8 p-4 grid-cols-1 rounded-xl">
      <nuxt-link
        class="sm:col-span-3 relative cursor-pointer"
        tag="div"
        :to="{
          name:'product_detail-id',
          params: {
            id: product._id
          }
        }"
      >
        <img :src="product.images[0]" alt="photo">
        <div class="top-0 absolute left-0 bg-[#00D100] m-4 rounded-sm  text-white">
          <p class="px-1 py-[2px] font-medium">
            Sold: {{ product.sold }}
          </p>
        </div>
      </nuxt-link>

      <div class="sm:col-span-9 sm:space-y-4 space-x-2">
        <nuxt-link
          tag="h2"
          :to="{
            name:'product_detail-id',
            params: {
              id: product._id
            }
          }"
          class="text-black font-medium text-2xl cursor-pointer"
        >
          {{ product.name }} <span class="text-black text-[1rem]"><i class="far fa-eye ml-2" /> {{ product.view }} views</span>
        </nuxt-link>

        <p class="text-black font-medium text-[1rem]">
          <a-rate v-model="rating" disabled allow-half />   (Rating {{ product.rating }}/5)
        </p>
        <p class="font-medium text-[1rem]">
          {{ product.description }}
        </p>
        <p class="text-2xl font-semibold text-orange">
          ${{ product.price }}
        </p>
        <div class="flex cursor-pointer" @click="saveToFavorite(product._id)">
          <i class="fa-regular hover_item fa-heart lg:text-xl text-lg text-black transition-all hover:text-orange" />
          <p class="text-black font-medium text-[1rem] ml-2">
            Add To Wishlist
          </p>
        </div>
        <div class="flex cursor-pointer" @click="showQuickView">
          <i class="fa-solid fa-expand hover_item lg:text-xl text-lg text-black transition-all hover:text-orange" />
          <p class="text-black font-medium text-[1rem] ml-2">
            Quick views
          </p>
        </div>
        <button class="bg-black text-white font-medium w-36 py-[10px] px-2 transition-all hover:opacity-80" @click="addToCart(product._id)">
          ADD TO CART
        </button>
      </div>
    </div>
    <quick-view ref="quickModal" :product="product" />
  </div>
</template>

<script>
import QuickView from '@/components/modal/QuickView.vue'
export default {
  components: {
    QuickView
  },
  props: ['product'],
  data () {
    return {
      rating: this.roundHaft(this.product.rating)
    }
  },
  computed: {
    isUserLogged () {
      return this.$store.getters.isUserLoggedIn
    }
  },
  methods: {
    async addToCart (productId) {
      if (this.isUserLogged) {
        try {
          const token = localStorage.getItem('token')
          const userData = await this.$api.auth.secret(token)
          // const dataCart = await this.$api.cart.getCarts(userData.data._id)
          const cart = {
            user: userData.data._id,
            product: productId,
            size: 'L',
            quantity: 1
          }
          await this.$api.cart.addToCart(cart)
          this.$toast.success('Add cart successfully', { timeout: 1500 })
          this.$store.dispatch('dataCart')
        } catch (error) {
          console.log(error)
        }
      } else {
        this.$store.commit('showLoginModal', true)
      }
    },
    async saveToFavorite (id) {
      if (this.isUserLogged) {
        try {
          const token = localStorage.getItem('token')
          const userData = await this.$api.auth.secret(token)
          const wishlist = {
            userId: userData.data._id,
            productId: id
          }
          await this.$api.wishlist.addWishList(wishlist)
          this.$toast.success('Add wishlist successfully', { timeout: 1500 })
          this.$store.dispatch('dataWishlist')
        } catch (error) {
          console.log(error)
        }
      } else {
        this.$store.commit('showLoginModal', true)
      }
    },
    showQuickView () {
      this.$refs.quickModal.showModal()
    },
    roundHaft (num) {
      return Math.round(num * 2) / 2
    }
  }
}
</script>
