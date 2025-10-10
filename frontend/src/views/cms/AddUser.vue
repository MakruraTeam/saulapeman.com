<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/services/auth/auth.service';
import type { RegisterPayload } from '@/models/auth.model';

const router = useRouter();

const username = ref('');
const password = ref('');
const repeatPassword = ref('');
const loading = ref(false);
const errorMsg = ref<string | null>(null);
const successMsg = ref<string | null>(null);

async function onSubmit() {
  errorMsg.value = null;
  successMsg.value = null;

  const payload: RegisterPayload = {
    username: username.value.trim(),
    password: password.value,
    repeatPassword: repeatPassword.value,
  };

  loading.value = true;
  try {
    await register(payload);
    successMsg.value = `User "${payload.username}" has been created successfully.`;
    username.value = '';
    password.value = '';
    repeatPassword.value = '';
    router.push({ name: 'user-list' });
  } catch (err: any) {
    errorMsg.value = err?.message || 'Registration failed.';
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: 'admin-desktop' });
}
</script>

<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
        <div class="card shadow">
          <div class="card-body p-4">
            <h3 class="text-center mb-4">Add User</h3>

            <form @submit.prevent="onSubmit">
              <div class="form-floating mb-3">
                <input
                  v-model="username"
                  type="text"
                  class="form-control"
                  id="usernameInput"
                  placeholder="username"
                  required
                  autocomplete="username"
                />
                <label for="usernameInput">Username</label>
              </div>

              <div class="form-floating mb-3">
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  id="passwordInput"
                  placeholder="Password"
                  required
                  autocomplete="new-password"
                />
                <label for="passwordInput">Password</label>
              </div>

              <div class="form-floating mb-4">
                <input
                  v-model="repeatPassword"
                  type="password"
                  class="form-control"
                  id="repeatPasswordInput"
                  placeholder="Repeat password"
                  required
                  autocomplete="new-password"
                />
                <label for="repeatPasswordInput">Repeat Password</label>
              </div>

              <div class="d-flex gap-2">
                <button
                  type="button"
                  class="btn btn-outline-secondary w-100"
                  @click="goBack"
                  :disabled="loading"
                >
                  Back
                </button>
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
                  Create User
                </button>
              </div>

              <p v-if="errorMsg" class="text-danger text-center mt-3 mb-0">
                {{ errorMsg }}
              </p>
              <p v-if="successMsg" class="text-success text-center mt-3 mb-0">
                {{ successMsg }}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>
