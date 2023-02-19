<template>
    <VueLoading :active="isLoading"></VueLoading>
    <div class="container">
          <div class="text-end mt-4">
            <button class="btn btn-primary" @click="openModal('create')">
              建立新的優惠券
            </button>
          </div>
          <table class="table table-hover mt-4">
            <thead>
              <tr>
                <th width="120">名稱</th>
                <th>折扣百分比</th>
                <th width="120">
                  到期日
                </th>
                <th width="120">
                  是否啟用
                </th>
                <th width="120">
                  編輯
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="coupon in coupons" :key="coupon.id">
                <td>{{ coupon.title }}</td>
                <td> {{ `${coupon.percent} %`  }}</td>
                <td> {{ $dateFormat.date(coupon.due_date) }}</td>
                <td>
                  <span class="text-success" v-if="coupon.is_enabled">啟用</span>
                  <span v-else>未啟用</span>
                </td>
                <td>
                  <div class="btn-group">
                    <button type="button" class="btn btn-outline-primary btn-sm" @click="openModal('modify', coupon)">
                      編輯
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm" @click="openModal('delete', coupon)">
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 分頁元件 -->
          <PaginationComponent :pagination="pagination" @change-page="getCoupons"></PaginationComponent>
        </div>
        <!-- Modal -->
        <CouponModal ref="couponModal" :temp-coupon="tempCoupon" :operate-type="operateType"
          @save-coupon="saveCoupon"></CouponModal>
        <DelModal ref="delModal" :temp-item="tempCoupon" @delete-item="deleteCoupon"></DelModal>
        <!-- Modal -->
  </template>

<script>
import Swal from 'sweetalert2'
import PaginationComponent from '@/components/PaginationComponent.vue'
import CouponModal from '@/components/CouponModal.vue'
import DelModal from '@/components/DelModal.vue'
const { VITE_API, VITE_APIPATH } = import.meta.env

export default {
  data () {
    return {
      isLoading: false,
      coupons: [],
      operateType: '',
      tempCoupon: {},
      pagination: {},
      pageNum: 1
    }
  },
  methods: {
    getCoupons (pageNum = 1) { // 參數預設值
      this.isLoading = true
      this.pageNum = pageNum
      this.$http.get(`${VITE_API}/api/${VITE_APIPATH}/admin/coupons?page=${pageNum}`)
        .then(res => {
          this.coupons = res.data.coupons
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

    // 新增 & 修改 優惠券
    saveCoupon (coupon) {
      this.isLoading = true
      let api = `${VITE_API}/api/${VITE_APIPATH}/admin/coupon`

      if (this.operateType === 'modify') {
        api = `${VITE_API}/api/${VITE_APIPATH}/admin/coupon/${coupon.id}`
      }
      this.$http[this.operateType === 'create' ? 'post' : 'put'](`${api}`, { data: coupon })
        .then(res => {
          this.$refs.couponModal.hideModal()
          Swal.fire({
            icon: 'success',
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500
          })
          this.getCoupons(this.pageNum)
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

    // 刪除商品
    deleteCoupon () {
      this.isLoading = true
      this.$http.delete(`${VITE_API}/api/${VITE_APIPATH}/admin/coupon/${this.tempCoupon.id}`, { data: this.tempCoupon })
        .then(res => {
          this.$refs.delModal.hideModal()
          Swal.fire({
            icon: 'success',
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500
          })
          this.getCoupons(this.pageNum)
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

    openModal (operateType, coupon) {
      this.operateType = operateType
      if (operateType === 'create') {
        this.tempCoupon = {
          due_date: new Date().getTime() / 1000
        }
        this.$refs.couponModal.showModal()
      } else if (operateType === 'modify') {
        this.tempCoupon = {
          ...coupon
        }
        this.$refs.couponModal.showModal()
      } else if (operateType === 'delete') {
        this.tempCoupon = {
          ...coupon
        }
        this.$refs.delModal.showModal()
      }
    }
  },
  components: {
    PaginationComponent,
    CouponModal,
    DelModal
  },
  mounted () {
    this.getCoupons()
  }
}
</script>
