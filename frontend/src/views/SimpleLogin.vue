<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Quick Notes - Debug Login
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="!isLogin">
            <label for="name" class="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div class="mt-1">
              <input
                v-model="nameInput"
                id="name"
                name="name"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                v-model="formData.email"
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div class="mt-1">
              <input
                v-model="formData.password"
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ isLoading ? 'Loading...' : isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </div>

          <div class="text-center">
            <button
              type="button"
              @click="toggleMode"
              class="text-indigo-600 hover:text-indigo-500"
            >
              {{
                isLogin
                  ? 'Need an account? Sign up'
                  : 'Have an account? Sign in'
              }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="text-sm text-gray-600">
            Debug Info:
            <ul class="mt-2 space-y-1">
              <li>Mode: {{ isLogin ? 'Login' : 'Register' }}</li>
              <li>Email: {{ formData.email }}</li>
              <li>Password: {{ formData.password ? '[SET]' : '[EMPTY]' }}</li>
              <li v-if="!isLogin">Name: {{ nameInput || '[EMPTY]' }}</li>
              <li>Loading: {{ isLoading }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form data
const formData = ref({
  email: '',
  password: '',
});

// Form state
const isLogin = ref(true);
const nameInput = ref('');
const isLoading = ref(false);

// Simple submit handler
const handleSubmit = async () => {
  console.log('🚀 Simple form submitted', {
    isLogin: isLogin.value,
    formData: formData.value,
    nameInput: nameInput.value,
  });

  isLoading.value = true;

  try {
    const url = `http://localhost:3000/auth/${isLogin.value ? 'login' : 'register'}`;
    const body = isLogin.value
      ? { email: formData.value.email, password: formData.value.password }
      : {
          email: formData.value.email,
          password: formData.value.password,
          name: nameInput.value,
        };

    console.log('📡 Making request to:', url, 'with body:', body);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Success response:', data);

    console.log(
      `${isLogin.value ? 'Login' : 'Registration'} successful! Token: ${data.access_token.substring(0, 20)}...`,
    );

    // Redirect to home
    router.push('/');
  } catch (error: unknown) {
    console.error('❌ Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.log(
      `${isLogin.value ? 'Login' : 'Registration'} failed: ${errorMessage}`,
    );
  } finally {
    isLoading.value = false;
  }
};

// Toggle between login and register
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  formData.value = { email: '', password: '' };
  nameInput.value = '';
  console.log('🔄 Mode toggled to:', isLogin.value ? 'login' : 'register');
};
</script>
