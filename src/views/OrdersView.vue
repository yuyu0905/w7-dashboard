<template>
    <VueLoading :active="isLoading"></VueLoading>
    <div class="container">
        <div class="mt-4">
            <table class="table align-middle">
                <thead>
                  <tr>
                    <th>購買時間</th>
                    <th>Email</th>
                    <th>購買款項</th>
                    <th>應付金額</th>
                    <th>是否付款</th>
                    <th>編輯</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in orders" :key="order.id" :class="{ 'text-secondary': !order.is_paid }">
                    <td>{{ $dateFormat.date(order.create_at) }}</td>
                    <td>{{ order.user.email }}</td>
                    <td>
                      <ul class="list-unstyled">
                        <li v-for="(product) in order.products" :key="product.id">
                          {{ product.product.title }} 數量：{{ product.qty }}
                          {{ product.product.unit }}
                        </li>
                      </ul>
                    </td>
                    <td class="text-end">{{ order.total }}</td>
                    <td>
                      <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" :id="order.id"
                          v-model="order.is_paid" @change="updatePaid(order)">
                        <label class="form-check-label" :for="order.id">
                          <span v-if="order.is_paid">已付款</span>
                          <span v-else>未付款</span>
                        </label>
                      </div>
                    </td>
                    <td>
                      <div class="btn-group">
                        <button type="button" class="btn btn-outline-primary btn-sm" @click="openModal('view', order)">
                          檢視
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm" @click="openModal('delete', order)">
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
            </table>
            <!-- 分頁元件 -->
            <PaginationComponent :pagination="pagination" @change-page="getOrders"></PaginationComponent>
        </div>
        <!-- Modal -->
        <OrderModal ref="orderModal" :temp-order="tempOrder" @update-paid="updatePaid"></OrderModal>
        <DelModal ref="delModal" :temp-item="tempOrder" @delete-item="deleteOrder"></DelModal>
        <!-- Modal -->
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import PaginationComponent from '@/components/PaginationComponent.vue'
import OrderModal from '@/components/OrderModal.vue'
import DelModal from '@/components/DelModal.vue'
const { VITE_API, VITE_APIPATH } = import.meta.env
export default {
  data () {
    return {
      isLoading: false,
      orders: [],
      operateType: '',
      tempOrder: {},
      pagination: {},
      pageNum: 1
    }
  },
  methods: {
    // 訂單列表
    getOrders (pageNum = 1) {
      this.isLoading = true
      this.pageNum = pageNum
      this.$http.get(`${VITE_API}/api/${VITE_APIPATH}/admin/orders?page=${pageNum}`)
        .then(res => {
          this.orders = res.data.orders
          this.pagination = res.data.pagination
          this.isLoading = false
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: err.response.data.message,
            showConfirmButton: false,
            timer: 1500
          })
          this.isLoading = false
        })
    },

    // 更新付款狀態
    updatePaid (order) {
      this.isLoading = true
      this.$http.put(`${VITE_API}/api/${VITE_APIPATH}/admin/order/${order.id}`, { data: { is_paid: order.is_paid } })
        .then(res => {
          this.$refs.orderModal.hideModal()
          Swal.fire({
            icon: 'success',
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500
          })
          this.getOrders(this.pageNum)
          this.isLoading = false
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: err.response.data.message,
            showConfirmButton: false,
            timer: 1500
          })
          this.isLoading = false
        })
    },

    // 刪除訂單
    deleteOrder () {
      this.isLoading = true
      this.$http.delete(`${VITE_API}/api/${VITE_APIPATH}/admin/order/${this.tempOrder.id}`, { data: this.tempOrder })
        .then(res => {
          this.$refs.delModal.hideModal()
          Swal.fire({
            icon: 'success',
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500
          })
          this.getOrders(this.pageNum)
          this.isLoading = false
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: err.response.data.message,
            showConfirmButton: false,
            timer: 1500
          })
          this.isLoading = false
        })
    },

    openModal (operateType, order) {
      this.operateType = operateType
      if (operateType === 'view') {
        this.tempOrder = {
          ...order
        }
        this.$refs.orderModal.showModal()
      } else if (operateType === 'delete') {
        this.tempOrder = {
          ...order
        }
        this.$refs.delModal.showModal()
      }
    }
  },
  components: {
    PaginationComponent,
    OrderModal,
    DelModal
  },
  mounted () {
    this.getOrders()
  }
}
</script>
