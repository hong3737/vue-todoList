<template>
  <div class="container">
    <h1>{{ user?.user_metadata?.name || 'Guest' }}'s' Todo List</h1>
    <div class="input-container">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Enter a new todo"
      />
      <button @click="addTodo">Add</button>
      <button @click="removeTodoAll">Delete all completed todos</button>
    </div>
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="currentTab = tab"
        :class="{ active: currentTab === tab }"
        class="tab-button"
      >
        {{ tab }}
      </button>
    </div>
    <ul>
      <li v-for="todo in filteredTodos" :key="todo.id">
        <div class="todo-item">
          <input type="checkbox" @change="toggleTodo(todo.id)" :checked="todo.done"/>
          <input
            v-if="todo.isEditing"
            v-model="todo.text"
            @blur="finishEdit(todo)"
            @keyup.enter="finishEdit(todo)"
            type="text"
            class="edit-input"
          />
          <span
            v-else
            @dblclick="startEdit(todo)"
            :class="{ completed: todo.done }"
          >
            {{ todo.text }}
          </span>
        </div>
        <div class="todo-actions">
          <button @click="removeTodo(todo.id)" class="btn-delete">Delete</button>
          <button
            @click="startEdit(todo)"
            v-if="!todo.isEditing"
            class="btn-edit"
          >
            Edit
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '../utils/supabase';
defineProps({
  user: Object
})
interface Todo {
  id: number;
  text: string;
  done: boolean;
  isEditing: boolean;
}

const newTodo = ref('');
const todos = ref<Todo[]>([]);

const addTodo = async () => {
  if (newTodo.value.trim()) {
    const newValue = newTodo.value;
    await supabase.from('todos').insert({
      text: newValue,
    });
    await getTodos();
    newTodo.value = '';
  }
};

const removeTodo = async (id: number) => {
  await supabase.from('todos').delete().eq('id', id);
  await getTodos();
};

const removeTodoAll = async () => {
  await supabase.from('todos').delete().eq('done', true);
  await getTodos();
};

const startEdit = (todo: Todo) => {
  todo.isEditing = true;
};

const finishEdit = async (todo: Todo) => {
  todo.isEditing = false;
  const newText = todo.text.trim();
  console.log({ newText, id: todo.id });
  await supabase.from('todos').update({ text: newText }).eq('id', todo.id);
  await getTodos();
};

const toggleTodo = async (id: number) => {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) {
    const { error } = await supabase
      .from('todos')
      .update({ done: !todo.done })
      .eq('id', id);

    if (error) {
      console.error('Error toggling todo:', error);
    } else {
      todo.done = !todo.done;
    }
    await getTodos();
  }
}

async function getTodos() {
  const { data, error } = await supabase.from('todos').select();
  todos.value = data ?? [];
}

const tabs = ['ALL', 'TODO', 'DONE'];
const currentTab = ref('ALL');

const filteredTodos = computed(() => {
  switch (currentTab.value) {
    case 'TODO':
      return todos.value.filter((todo) => !todo.done);
    case 'DONE':
      return todos.value.filter((todo) => todo.done);
    default:
      return todos.value;
  }
});

onMounted(async () => {
  await getTodos();
});
</script>
