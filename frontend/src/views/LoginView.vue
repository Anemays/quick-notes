<template>
  <div
    class="fixed inset-0 flex items-center justify-center"
    style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    "
  >
    <div
      class="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md mx-4"
      style="backdrop-filter: blur(10px) !important"
    >
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ isLogin ? 'Welcome Back' : 'Create Account' }}
        </h1>
        <p class="text-gray-600">
          {{ isLogin ? 'Sign in to your account' : 'Join us today' }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Name field for registration -->
        <div v-if="!isLogin">
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name
          </label>
          <input
            id="name"
            v-model="nameInput"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your full name"
          />
        </div>

        <!-- Email -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your email"
          />
        </div>

        <!-- Password -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your password"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <span
            v-if="authStore.isLoading"
            class="flex items-center justify-center"
          >
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isLogin ? 'Signing In...' : 'Creating Account...' }}
          </span>
          <span v-else>
            {{ isLogin ? 'Sign In' : 'Create Account' }}
          </span>
        </button>

        <!-- Toggle between login/register -->
        <div class="text-center pt-4">
          <span class="text-gray-600">
            {{
              isLogin ? "Don't have an account?" : 'Already have an account?'
            }}
          </span>
          <button
            type="button"
            @click="isLogin = !isLogin"
            class="ml-2 text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
          >
            {{ isLogin ? 'Sign Up' : 'Sign In' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMessage } from 'naive-ui';

const router = useRouter();
const authStore = useAuthStore();
const message = useMessage();

const formData = ref({
  email: '',
  password: '',
});

const isLogin = ref(true);
const nameInput = ref('');

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await authStore.login(formData.value.email, formData.value.password);
      message.success('Welcome back! Login successful 🎉');
      router.push('/notes');
    } else {
      await authStore.register(
        formData.value.email,
        formData.value.password,
        nameInput.value,
      );
      message.success('Account created successfully! Welcome aboard 🚀');
      router.push('/notes');
    }
  } catch (error: any) {
    console.error('Authentication error:', error);
    message.error(
      isLogin.value
        ? 'Login failed. Please check your credentials and try again.'
        : 'Registration failed. Please try again with different details.',
    );
  }
};
</script>
