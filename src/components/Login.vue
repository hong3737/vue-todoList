<template>
  <div class="login-page">
    <h1 class="app-title">Todo App</h1>
    <button @click="signInWithGoogle" class="btn-login google">
      <font-awesome-icon :icon="['fab', 'google']" />
      Sign in with Google
    </button>
    <button @click="signInWithGithub" class="btn-login github">
      <font-awesome-icon :icon="['fab', 'github']" />
      Sign in with GitHub
    </button>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '../utils/supabase';

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
async function signInWithGithub() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error signing in with Github:', error);
    alert('Error signing in with Github. Please try again.');
  }
}
</script>

<style scoped></style>