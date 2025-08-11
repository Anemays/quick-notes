<template>
  <div class="login-page">
    <div class="login-container">
      <h1 class="title">Quick Notes - Login</h1>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div v-if="!isLogin" class="form-group">
          <label>Name:</label>
          <input v-model="nameInput" type="text" required />
        </div>

        <div class="form-group">
          <label>Email:</label>
          <input v-model="formData.email" type="email" required />
        </div>

        <div class="form-group">
          <label>Password:</label>
          <input v-model="formData.password" type="password" required />
        </div>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{ isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up' }}
        </button>

        <button type="button" @click="toggleMode" class="toggle-btn">
          {{ isLogin ? 'Need account? Sign Up' : 'Have account? Sign In' }}
        </button>
      </form>

      <router-link to="/" class="home-link">← Back to Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = ref({
  email: '',
  password: '',
});

const isLogin = ref(true);
const nameInput = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  console.log('🚀 Form submitted', {
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

    window.alert(`${isLogin.value ? 'Login' : 'Registration'} successful!`);

    // Redirect to home
    router.push('/');
  } catch (error: unknown) {
    console.error('❌ Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    window.alert(
      `${isLogin.value ? 'Login' : 'Registration'} failed: ${errorMessage}`,
    );
  } finally {
    isLoading.value = false;
  }
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  formData.value = { email: '', password: '' };
  nameInput.value = '';
  console.log('🔄 Mode toggled to:', isLogin.value ? 'login' : 'register');
};
</script>

<style scoped>
.login-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-container {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.title {
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #555;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  background: #667eea;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: #5a67d8;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  margin-top: 0.5rem;
}

.toggle-btn:hover {
  color: #5a67d8;
}

.home-link {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}

.home-link:hover {
  color: #333;
}
</style>
