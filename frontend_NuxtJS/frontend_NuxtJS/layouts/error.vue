<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <!-- <a-button type="primary">
        Trở về trang chủ
      </a-button> -->
      <nuxt-link to="/" tag="button" class="bg-blue text-white px-3 py-2 rounded-md hover:opacity-90">
        Trở về trang chủ
      </nuxt-link>
    </template>
  </a-result>
</template>
<script>
export default {
  layout: 'empty',
  data () {
    return {}
  }
}
</script>
