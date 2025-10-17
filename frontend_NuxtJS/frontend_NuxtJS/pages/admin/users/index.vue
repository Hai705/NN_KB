<template>
  <div class="flex flex-col">
    <div>
      <nuxt-link to="/admin" class="text-black font-semibold text-lg">
        Admin
      </nuxt-link>
      <span class="text-grey_dark/60 font-semibold text-lg">
        / Users
      </span>
    </div>
    <hr class="text-[#ccc] mt-2">
    <!-- <TableUser /> -->
    <table-user class="mt-4" />
  </div>
</template>

<script>
import TableUser from '@/components/admin/users/TableUser.vue'
// import TableUser from '../../../components/admin/users/TableUser.vue'
export default {
  components: {
    TableUser
    // TableUser
  },
  layout: 'admin',
  middleware: ['auth']
}
</script>
