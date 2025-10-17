<template>
  <a-menu
    class="sm:font-bold lg:w-9/12  lg:text-[0.9rem] lg:bg-base lg:px-24 lg:space-x-16 hidden sm:block lg:text-black  sm:px-12 sm:bg-base"
    mode="horizontal"
    :default-selected-keys="['1']"
    :style="{ lineHeight: '80px' }"
  >
    <a-menu-item key="1">
      <nuxt-link to="/" tag="li">
        HOME
      </nuxt-link>
    </a-menu-item>
    <a-menu-item key="2" class="relative sub_shop">
      SHOP<a-icon type="down" class="absolute leading-[78px] font-medium pl-[1px]" />
      <ul class="hidden absolute bg-[#fef5ef] item-menu_shop">
        <li @click="searchSubject(1)">
          Men
        </li>
        <li @click="searchSubject(0)">
          Woman
        </li>
      </ul>
    </a-menu-item>
    <a-menu-item key="3" class="relative sub_shop">
      PAGES<a-icon type="down" class="absolute leading-[78px] font-medium pl-[1px]" />
      <ul class="hidden absolute bg-[#fef5ef] item-menu_shop">
        <nuxt-link to="/cart" tag="li">
          View Cart
        </nuxt-link>
        <nuxt-link to="/wishlist" tag="li">
          View WishList
        </nuxt-link>
      </ul>
    </a-menu-item>
    <a-menu-item key="4">
      <nuxt-link to="/contact" tag="li">
        CONTACT
      </nuxt-link>
    </a-menu-item>
    <a-menu-item key="5">
      <nuxt-link to="/about" tag="li">
        ABOUT US
      </nuxt-link>
    </a-menu-item>
  </a-menu>
</template>
<script>
export default {
  methods: {
    searchSubject (value) {
      this.$router.replace({ path: '/search', query: { keyword: '', subject: value } })
    }
  }
}
</script>

<style lang="scss" scoped>
.ant-menu-horizontal{
    border-bottom:none ;
}
.ant-menu-horizontal > .ant-menu-item:hover,
.ant-menu-horizontal > .ant-menu-item-selected{
    color: #f79837;

}
.ant-menu-horizontal > .ant-menu-item:hover,
.ant-menu-horizontal > .ant-menu-item-selected,
.ant-menu-horizontal > .ant-menu-item, .ant-menu-horizontal > .ant-menu-submenu {
    border-bottom: none;
}

.sub_shop:hover{
    .item-menu_shop{
      @apply  animate-[flipInMenu_.5s_ease-in] block;
    }
}
.item-menu_shop{
  @apply leading-none mt-[-1px] w-44 bg-[#ffffff] ;
  li{
    @apply w-full px-8 py-4 text-black hover:text-yellow_hover transition-all ease-out duration-300;

  }
}
</style>
