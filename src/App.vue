<template>
  <LoginPage v-if="!user" />
  <TodoList v-else :user="user"/>
  <button v-if="user" @click="handleClickLogout" type="button">Logout</button>
</template>

<script setup>
import LoginPage from './components/Login.vue';
import TodoList from './components/TodoList.vue';
import { ref, onMounted } from 'vue';
import { supabase } from './utils/supabase';

const user = ref(null);

const handleClickLogout = async () => {
  const res = await supabase.auth.signOut();
  user.value = null;
};

onMounted(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.value = session?.user ?? null;
  });
  
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null;
  });
});

</script>

<style scoped></style>
