<template>
  <div class="login-page">
    <h1 class="app-title">Todo App</h1>
    <button @click="signInWithGoogle" class="btn-login google">
      Sign in with Google
    </button>
  </div>
</template>

<script setup lang="ts">
import { supabase } from './utils/supabase';

async function signInWithGoogle() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    alert('Error signing in with Google. Please try again.');
  }
}
</script>

<style scoped>
</style>