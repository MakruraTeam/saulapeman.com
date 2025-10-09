<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { login } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth';

const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const loading = ref(false);
const errorMsg = ref<string | null>(null);

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

async function onSubmit() {
  errorMsg.value = null;
  loading.value = true;
  try {
    await login({
      username: username.value,
      password: password.value,
      rememberMe: rememberMe.value,
    });

    if (auth.getToken) {
      const redirect =
        (route.query.redirect as string) || '/admin-panel/desktop';
      router.push(redirect);
    }
  } catch (err: any) {
    errorMsg.value = err?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
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
                    v-model="username"
                    type="text"
                    class="form-control"
                    id="usernameInput"
                    placeholder="admin"
                    required
                    autocomplete="username"
                  />
                  <label for="usernameInput">Login</label>
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

                <button
                  type="submit"
                  class="btn btn-primary w-100"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Sign In
                </button>

                <p v-if="errorMsg" class="text-danger text-center mt-3 mb-0">
                  {{ errorMsg }}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
