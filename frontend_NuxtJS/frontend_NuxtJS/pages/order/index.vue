<template>
  <div class="flex flex-col">
    <header class="banner_single mb-10">
      <div class="flex justify-center absolute items-center w-full flex-col">
        <h2 class="text-white text-3xl font-semibold">
          Shop
        </h2>
        <span class="text-orange text-lg">
          <nuxt-link tag="span" class="text-white text-lg cursor-pointer" to="/">
            Trang chủ
          </nuxt-link>
          / Đặt hàng
        </span>
      </div>
    </header>

    <tab-order ref="tabOrderRef" />
  </div>
</template>

<script>
import TabOrder from '@/components/order/TabOrder.vue'

export default {
  components: {
    TabOrder
  },
  middleware: ['user'],

  async mounted () {
    await this.handleMomoCallback()
  },
  methods: {
    async handleMomoCallback () {
      // 1. Lấy tham số trả về từ URL
      const { resultCode, orderId, message } = this.$route.query

      // Nếu không có resultCode thì là vào trang bình thường -> Thoát
      // SỬA LỖI Ở ĐÂY: Thêm dấu ngoặc nhọn {}
      if (resultCode === undefined || resultCode === null) {
        return
      }

      // 2. Kiểm tra kết quả
      if (resultCode === '0') {
        // --- THÀNH CÔNG ---
        this.$toast.success('Thanh toán MoMo thành công! Đơn hàng đang được xử lý.', { duration: 3000 })
      } else {
        // --- THẤT BẠI ---
        this.$toast.error('Thanh toán thất bại: ' + (decodeURIComponent(message) || 'Giao dịch bị hủy'))

        if (orderId) {
          try {
            // Gọi API Backend để hủy đơn hàng vừa tạo & hoàn tồn kho
            await this.$axios.post('/orders/cancel-momo', { orderId })
            console.log('Đã tự động hủy đơn hàng lỗi:', orderId)
          } catch (error) {
            console.error('Lỗi khi gọi API hủy đơn:', error)
          }
        }
      }

      // 3. Xóa các tham số rác trên URL
      this.$router.replace({ query: null })

      // Reload lại trang sau 2s nếu thất bại để cập nhật trạng thái hủy
      if (resultCode !== '0') {
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    }
  }
}
</script>

<style lang="scss">
.banner_single {
  background-image: url('@/static/banner/banner_single.png');
  position: relative;
  background-repeat: no-repeat;
  background-size: cover cover;
  padding: 100px 0 140px 0;
  width: 100%;
}
</style>
