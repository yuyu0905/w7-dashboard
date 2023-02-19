<template>
  <VueLoading :active="isLoading"></VueLoading>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <h1 class="h3 mb-3 font-weight-normal text-center">
        請先登入
      </h1>
      <div class="col-8">
        <form id="form" @submit.prevent="login">
          <div class="form-floating mb-3">
            <input type="email" class="form-control" id="username"
              placeholder="name@example.com" required autofocus v-model="user.username">
            <label for="username">Email address</label>
          </div>
          <div class="form-floating">
            <input type="password" class="form-control" id="password"
              placeholder="Password" required v-model="user.password">
            <label for="password">Password</label>
          </div>
          <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
            登入
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
const { VITE_API } = import.meta.env
export default {
  data () {
    return {
      isLoading: false,
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      this.isLoading = true
      this.$http.post(`${VITE_API}/admin/signin`, this.user)
        .then(res => {
          const { token, expired, message } = res.data
          // 加入 cookie
          document.cookie = `w7-token=${token}; expires=${expired}`
          // 加入 header
          this.$http.defaults.headers.common.Authorization = token
          Swal.fire({
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500
          })
          this.$router.push('/admin/products')
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
    }
  }
}
</script>
