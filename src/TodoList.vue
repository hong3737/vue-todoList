<template>
  <div class="container">
    <h1>{{ user?.user_metadata?.name || 'Guest' }}'s' Todo List</h1>
    <div class="input-container">
      <input
        v-model="newTodo"
        type="text"
        placeholder="새로운 할 일을 입력하세요"
      />
      <button @click="addTodo">추가하기</button>
      <button @click="removeTodoAll">완료된 할 일 모두 삭제</button>
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
          <button @click="removeTodo(todo.id)" class="btn-delete">삭제</button>
          <button
            @click="startEdit(todo)"
            v-if="!todo.isEditing"
            class="btn-edit"
          >
            수정
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from './utils/supabase';
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

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.input-container {
  margin-bottom: 20px;
}

input[type='text'] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.todo-item {
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-right: 10px;
}

.todo-item input[type='checkbox'] {
  margin-right: 10px;
}

.todo-item span {
  flex-grow: 1;
}

.completed {
  text-decoration: line-through;
}

.edit-input {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.todo-actions button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete {
  background-color: #ff4d4d;
  color: white;
}

.btn-edit {
  background-color: #4d94ff;
  color: white;
}
</style>
<!-- 
<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from './utils/supabase';

const todos = ref([]);

async function getTodos() {
  const { data, error } = await supabase.from('todos').select();
  todos.value = data;
}

onMounted(async () => {
  await getTodos();
});
</script>

<template>
  <button @click="getTodos">데이터 가져오기</button>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <input type="checkbox" :checked="todo.done" />
      {{ todo.text }}
    </li>
  </ul>
</template> -->
