<template>
  <div class="d-flex justify-content-center align-items-center login-container">
    <form class="login-form text-center" @submit.prevent="handleLogin">
      <div style="margin-bottom: 10px;">
        <h1 class="mb-4 font-weight-light">登录</h1>
      </div>
      <div class="form-group">
        <input v-model="username" type="text" class="form-control rounded-pill form-control-lg" placeholder="用户名"
          required />
      </div>
      <div class="form-group">
        <input v-model="password" type="password" class="form-control rounded-pill form-control-lg" placeholder="密码"
          required />
      </div>
      <div class="forgot-link">
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="remember" />
          <label for="remember" class="form-check-label">记住密码</label>
        </div>
        <div>
          <a href="#" class="text-muted">忘记密码?</a>
        </div>
      </div>
      <button type="submit" class="btn btn-custom btn-block rounded-pill">登录</button>
      <div>
        <p class="mt-3 font-weight-normal">
          你还没有账号?
          <a href="#" class="text-primary">
            <strong>注册</strong>
          </a>
        </p>
      </div>
    </form>
  </div>
</template>

<script>


export default {
  name: 'Login',
  data() {
    return {
      username: null,
      password: null,
    };
  },
  methods: {
    handleLogin() {
      // 假设登录验证成功后设置登录状态
      if (this.username === 'admin' && this.password === 'admin123') {
        localStorage.setItem('isLoggedIn', true); // 设置登录状态
        this.$router.push({ name: 'tle' }); // 登录成功后跳转到tle页面
      } else {
        alert('用户名或密码错误');
      }
    }
  }
};
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap'); */

.forgot-link {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 5px;
}



body {
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  background: #f5f5f5;
  color: #666;
}

.login-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background: #eee;
  background-image: url('../../public/bg.png');
}

.login-form {
  text-align: center;
  margin: auto;
  width: 400px;
  padding: 20px;
  max-width: 100%;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

input.form-control {
  font-size: 16px;
  height: 20px;
  padding: 10px 20px;
  border-radius: 4px;
}

input::placeholder {
  color: #aaa;
}

.form-check-label {
  font-size: 14px;
  color: #666;
}

.text-muted {
  font-size: 14px;
}

.btn-custom {
  background: #723dbe;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  height: 48px;
  width: 60%;
  margin-bottom: 5px;
  border: none;
}

.btn-custom:hover {
  background: #54229d;
  color: #fff;
}

p {
  font-size: 14px;
  color: #666;
}

p a {
  color: #723dbe;
}

p a:hover {
  text-decoration: underline;
}
</style>
