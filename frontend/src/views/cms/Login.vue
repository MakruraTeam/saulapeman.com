<script setup lang="ts">
import { ref } from 'vue';

const login = ref('');
const password = ref('');
const rememberMe = ref(false);

function onSubmit() {
  console.log('Login attempt:', {
    login: login.value,
    password: password.value,
    rememberMe: rememberMe.value,
  });
}
</script>

<template>
  <div
    class="d-flex align-items-center justify-content-center vh-100 w-100 bg-light"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <h3 class="text-center mb-4">Admin Panel</h3>

              <form @submit.prevent="onSubmit">
                <div class="form-floating mb-3">
                  <input
                    v-model="login"
                    type="text"
                    class="form-control"
                    id="loginInput"
                    placeholder="admin"
                    required
                    autocomplete="username"
                  />
                  <label for="loginInput">Login</label>
                </div>

                <div class="form-floating mb-4">
                  <input
                    v-model="password"
                    type="password"
                    class="form-control"
                    id="passwordInput"
                    placeholder="Password"
                    required
                    autocomplete="current-password"
                  />
                  <label for="passwordInput">Password</label>
                </div>

                <div class="form-check mb-4">
                  <input
                    v-model="rememberMe"
                    type="checkbox"
                    class="form-check-input"
                    id="rememberMeCheck"
                  />
                  <label class="form-check-label" for="rememberMeCheck">
                    Remember me
                  </label>
                </div>

                <button type="submit" class="btn btn-primary w-100">
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
