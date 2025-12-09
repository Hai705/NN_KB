<template>
  <div>
    <a-modal
      v-model="visible"
      title="Thông tin thanh toán"
      :footer="null"
      class="modal_order"
      width="{1000}"
      @ok="handleOk"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :colon="false"
      >
        <div class="grid sm:grid-cols-2 gap-6 grid-cols-1 max-h-[70vh] overflow-y-auto">
          <!-- CỘT TRÁI -->
          <div>
            <a-form-model-item ref="fullName" label="Họ Tên" prop="fullName">
              <a-input
                v-model="form.fullName"
                @blur="() => { $refs.fullName.onFieldBlur() }"
              />
            </a-form-model-item>

            <a-form-model-item ref="phoneNumber" label="Số điện thoại" prop="phoneNumber">
              <a-input
                v-model="form.phoneNumber"
                @blur="() => { $refs.phoneNumber.onFieldBlur() }"
              />
            </a-form-model-item>

            <a-form-model-item label="Địa chỉ giao hàng" prop="deliveryAddress">
              <a-input v-model="form.deliveryAddress" type="textarea" />
            </a-form-model-item>

            <!-- PHƯƠNG THỨC THANH TOÁN -->
            <a-form-model-item label="Phương thức thanh toán" prop="paymentMethod">
              <a-radio-group v-model="form.paymentMethod" class="w-full">
                <div class="flex flex-col space-y-2 mt-2">
                  <a-radio value="COD" class="flex items-center">
                    <span class="font-medium">Thanh toán khi nhận hàng (COD)</span>
                  </a-radio>
                  <a-radio value="ONLINE" class="flex items-center">
                    <span class="font-medium">Thanh toán Online / Chuyển khoản (MoMo)</span>
                  </a-radio>
                </div>
              </a-radio-group>
            </a-form-model-item>
          </div>

          <!-- CỘT PHẢI -->
          <div class="flex justify-between mt-4">
            <div class="text-[1rem] font-medium text-black space-y-7">
              <p>Số lượng:</p>
              <p>Tổng tiền:</p>
              <p>Phí vận chuyển:</p>
              <p>Giảm giá:</p>
              <p>Số tiền phải trả: </p>
            </div>
            <div class="text-black font-medium flex flex-col items-end space-y-7 pr-4 text-[1rem]">
              <p> {{ totalCart.item }} Item / {{ totalCart.numberProduct }} Product</p>
              <p>${{ totalCart.total }}</p>
              <p>${{ totalCart.fee }}</p>
              <p>$0</p>
              <p class="text-xl text-red font-bold">
                ${{ totalCart.intoMoney }}
              </p>
            </div>
          </div>
        </div>

        <a-form-model-item>
          <div class="flex justify-center btn_order my-5">
            <a-button
              class="bg-green h-10 px-7 hover:opacity-90 text-black font-medium mt-4"
              :loading="loading"
              @click="onSubmit"
            >
              {{ form.paymentMethod === 'ONLINE' ? 'Thanh toán ngay' : 'Đặt hàng' }}
            </a-button>
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { isValidUserName, isValidPhone } from '@/assets/validators.js'

export default {
  props: {
    totalCart: {
      type: Object,
      default: () => {}
    },
    cartId: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false,
      loading: false,
      form: {
        fullName: '',
        phoneNumber: '',
        deliveryAddress: '',
        paymentMethod: 'COD'
      },
      rules: {
        fullName: [{
          required: true,
          trigger: 'blur',
          validator (rule, value, callback) {
            if (isValidUserName(value)) {
              callback()
            } else {
              callback(new Error('Tên không hợp lệ'))
            }
          }
        }],
        deliveryAddress: [{ required: true, message: 'Mời nhập địa chỉ', trigger: 'blur' }],
        paymentMethod: [{ required: true, message: 'Vui lòng chọn phương thức thanh toán', trigger: 'change' }],
        phoneNumber: [{
          required: true,
          trigger: 'blur',
          min: 9,
          validator (rule, value, callback) {
            if (isValidPhone(value)) {
              callback()
            } else {
              callback(new Error('Số điện thoại không hợp lệ'))
            }
          }
        }]
      }
    }
  },
  methods: {
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      this.visible = false
    },
    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.submitOrder()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submitOrder () {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const userData = await this.$api.auth.secret(token)

        const infoOrder = {
          ...this.form,
          user: userData.data._id
        }

        const cartItem = this.cartId.map(item => ({
          cartId: item._id,
          product: item.product._id,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price
        }))

        // 1. Tạo đơn hàng vào DB trước
        const response = await this.$api.order.createOrder({ infoOrder, cartItem })

        // 2. Kiểm tra phương thức thanh toán
        if (this.form.paymentMethod === 'ONLINE') {
          // Lấy ID đơn hàng vừa tạo để gửi sang MoMo
          const newOrderId = response.data._id || response.data.orderId || ('ORDER_' + new Date().getTime())

          // --- QUY ĐỔI TIỀN ---
          // Nhân với 25000 để đổi USD sang VND (để tránh lỗi < 1000đ của MoMo)
          // Math.floor để đảm bảo là số nguyên
          const amountInVND = Math.floor(this.totalCart.intoMoney * 25000)

          // Gọi API Backend Node.js
          const momoRes = await this.$axios.post('/payment/momo', {
            amount: amountInVND, // Gửi số tiền VNĐ
            orderId: newOrderId // Gửi mã đơn hàng
          })

          // Nếu Backend trả về link, chuyển hướng người dùng
          if (momoRes.data && momoRes.data.payUrl) {
            window.location.href = momoRes.data.payUrl
            return // Dừng hàm tại đây để trình duyệt chuyển trang
          } else {
            this.$toast.error('Không thể kết nối cổng thanh toán')
          }
        } else {
          // Xử lý khi chọn COD (Tiền mặt)
          this.$toast.success('Đặt hàng thành công!', { timeout: 1500 })
          this.$store.dispatch('dataCart')
          this.visible = false
          this.$router.push('/order')
        }
      } catch (error) {
        console.error(error)
        this.$toast.error('Có lỗi xảy ra, vui lòng thử lại', { timeout: 1500 })
      } finally {
        // Chỉ tắt loading nếu không phải là chuyển hướng Online
        if (this.form.paymentMethod !== 'ONLINE') {
          this.loading = false
        }
      }
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
      this.form.paymentMethod = 'COD'
    }
  }
}
</script>

<style lang="scss">
.btn_order {
  .ant-btn:hover, .ant-btn:focus {
    @apply bg-green/90 text-black border-green transition-all;
  }
}
.modal_order {
  .ant-modal {
    @apply sm:w-2/3 w-full;
  }
  .ant-modal-header {
    @apply bg-orange font-semibold;
    .ant-modal-title {
      @apply text-lg;
    }
  }
  .ant-form-item-label {
    @apply text-grey_dark font-medium;
  }
  .ant-form-item {
    @apply mb-2;
  }
}
</style>
