<template>
  <div class="flex flex-col w-full justify-center ">
    <div>
      <nuxt-link to="/admin" class="text-black font-semibold text-lg">
        Admin
      </nuxt-link>
      <nuxt-link to="/admin/products" class="text-black font-semibold text-lg">
        / Products
      </nuxt-link>
      <span class="text-grey_dark/60 font-semibold text-lg">
        / Add Product
      </span>
    </div>
    <hr class="text-[#ccc] mt-2 pb-3">
    <ProductsVue class="mt-2" />
  </div>
</template>
<script>
import ProductsVue from '@/components/admin/products/AddProduct'
export default {
  components: {
    ProductsVue
  },
  layout: 'admin',
  middleware: ['auth']
}
</script>
