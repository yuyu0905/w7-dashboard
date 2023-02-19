<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">後台</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="navbar-nav">
          <router-link class="nav-link" to="/admin/products">產品列表</router-link>
          <router-link class="nav-link" to="/admin/orders">訂單列表</router-link>
          <router-link class="nav-link" to="/admin/coupons">優惠券</router-link>
          <a href="#" class="nav-link" @click.prevent="logout">登出</a>
        </div>
      </div>
    </div>
  </nav>
  <router-view v-if="checkSuccess"></router-view>
</template>

<script>
import Swal from 'sweetalert2'
const { VITE_API } = import.meta.env

export default {
  data () {
    return {
      checkSuccess: false
    }
  },
  methods: {
    checkLogin () {
      this.$http.post(`${VITE_API}/api/user/check`)
        .then(() => {
          // 驗證成功
          this.checkSuccess = true
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: err.response.data.message
          })
          this.$router.push('/')
        })
    },
    logout () {
      document.cookie = 'w7-token=;expires=;'
      Swal.fire({
        icon: 'success',
        title: '登出成功',
        showConfirmButton: false,
        timer: 1500
      })
      this.$router.push('/')
    }
  },
  mounted () {
    // 取出 cookie 的 token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)w7-token\s*=\s*([^;]*).*$)|^.*$/, '$1')
    // 加入 header
    this.$http.defaults.headers.common.Authorization = token
    if (token) {
      this.checkLogin()
    } else {
      Swal.fire({
        icon: 'error',
        title: '您尚未登入'
      })
      this.$router.push('/')
    }
  }
}
</script>
