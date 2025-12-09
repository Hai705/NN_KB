<template>
  <div id="components-table-demo-size" class="table-item-orderad">
    <a-table :columns="columns" :data-source="itemOrder.items" size="middle" :row-key="record => record._id">
      <template slot="product" slot-scope="text, record">
        <div>
          <img :src="record.product.images[0]" alt="photo" class="w-16">
        </div>
      </template>
      <template slot="detail" slot-scope="text, record">
        <div class="flex sm:flex-row flex-col justify-between">
          <div class="flex flex-col text-black text-[1rem]">
            <p class="text-blue sm:text-xl font-medium">
              {{ record.product.name }}
            </p>
            <p>Size: {{ record.size }}</p>
            <p>Số lượng: x{{ record.quantity }}</p>
          </div>
          <div class="sm:pr-36 leading-7 text-black text-[1rem] font-medium ">
            <p>Giá: ${{ record.price }}</p>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="grid sm:grid-cols-3 grid-cols-1 gap-4 text-[1rem]">
          <!-- PHẦN HIỂN THỊ TRẠNG THÁI (Đã sửa logic) -->
          <div>
            <!-- Trường hợp 1: Đã hủy -->
            <span v-if="itemOrder.cancel" class="bg-grey_dark text-white rounded-sm text-[0.8rem] px-1">
              Đơn hàng đã bị hủy
            </span>
            <!-- Trường hợp 2: Chờ xác nhận (Chưa hủy + Chưa thanh toán) -->
            <span v-else-if="!itemOrder.status" class="bg-yellow_hover text-white rounded-sm text-[0.8rem] px-1">
              Chờ xác nhận
            </span>
            <!-- Trường hợp 3: Thành công -->
            <span v-else class="bg-green text-white rounded-sm text-[0.8rem] px-1">
              Giao hàng thành công
            </span>
          </div>

          <div class="flex sm:justify-center sm:pl-10">
            <p class="font-medium sm:py-2 sm:px-3 py-1 px-2 ">
              Tổng tiền: ${{ itemOrder.totalPrice + itemOrder.items.length }}
            </p>
          </div>

          <!-- PHẦN NÚT BẤM -->
          <div class="flex sm:justify-end">
            <button v-if="comfirm" class="text-black font-medium text-[1rem] bg-blue rounded-full sm:py-2 sm:px-3 py-1 px-2 hover:opacity-80 mr-2" @click="acceptStatus(itemOrder._id)">
              Accept orders
            </button>

            <!-- Chỉ hiện nút Hủy khi: Chưa thanh toán VÀ Chưa hủy -->
            <button v-if="!itemOrder.status && !itemOrder.cancel" class="text-black font-medium text-[1rem] bg-red rounded-full sm:py-2 sm:px-3 py-1 px-2 hover:opacity-80" @click="canceled(itemOrder._id)">
              Hủy đơn hàng
            </button>

            <!-- Hiện nút disabled nếu đã hủy -->
            <button v-if="itemOrder.cancel" class="text-white font-medium text-[1rem] bg-grey_dark rounded-full sm:py-2 sm:px-3 py-1 px-2" disabled>
              Đã hủy
            </button>
          </div>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: 'SHOP: ANDSHOP',
    dataIndex: 'product',
    scopedSlots: { customRender: 'product' }
  },
  {
    dataIndex: 'detail',
    scopedSlots: { customRender: 'detail' }
  }
]

export default {
  props: ['itemOrder', 'comfirm'],
  data () {
    return {
      columns
    }
  },
  methods: {
    async canceled (_id) {
      try {
        console.log('_id order: ', _id)
        const cancelData = {
          orderId: _id,
          cancel: true
        }
        await this.$api.order.cancelOrder(cancelData)
        this.$toast.success('Hủy đơn hàng thành công', { timeout: 1500 })
        // Reload lại trang để cập nhật giao diện
        window.location.reload()
      } catch (error) {
        this.$toast.error('System Error', { timeout: 1500 })
        console.log(error)
      }
    },
    async acceptStatus (orderId) {
      try {
        console.log('orderID: ', orderId)
        const dataStatus = {
          orderId,
          status: true
        }
        await this.$api.order.acceptStatus(dataStatus)
        this.$toast.success('Order approved successfully', { timeout: 1500 })
      } catch (error) {
        this.$toast.error('System Error', { timeout: 1500 })
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
#components-table-demo-size h4 {
  margin-bottom: 16px;
}
.table-item-orderad {
  .ant-table-thead > tr > th {
    @apply bg-white;
  }
  .ant-table-column-title {
    @apply sm:text-xl text-black font-medium text-lg;
  }
  .ant-table-pagination {
    @apply hidden;
  }
  .ant-table-row {
    @apply bg-[#fafafa];
  }
  .ant-table-footer {
    @apply bg-white;
  }
  .ant-table-row > td:first-child {
    @apply sm:w-52;
  }
}
</style>
