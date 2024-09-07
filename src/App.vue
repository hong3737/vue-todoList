<!-- js -->
<script setup>
import { ref } from 'vue';

const count = ref(0);
const inputValue = ref('');
const todoList = ref([
  { text: 'react', done: false },
  { text: 'vue', done: true },
  { text: 'vercle', done: false },
]);
console.log(todoList);

const printInputValue = () => {
  console.log(inputValue.value);
};
const handleChange = (event) => {
  const nextValue = event.target.value;
  inputValue.value = nextValue;
};
const handleClickAddButton = () => {
  const text = inputValue.value
  todoList.value.push({
    text: text, done: false
  });
};
const handleClickDelButton = (index) => {
  todoList.value.splice(index, 1);
};

/* count +- 예제
  const 증가 = () => {
    count.value++;
  };
  const 감소 = () => {
    count.value--;
  };
*/
</script>

<!-- html -->
<template>
  <p>Message is: {{ todoList }}</p>
  <h4>TODO LIST</h4>

  <!-- <div>
    <div>COUNT : {{ count }}</div>
    <button @click="증가;">+</button>
    <button @click="감소;">-</button>
  </div> -->

  <input v-model="inputValue" />
  <button @click="handleClickAddButton">확인</button>

  <!-- v-model말고 다른 방법
    <p>Message is: {{ inputValue }}</p> 
    <input :value="inputValue" @change="handleChange" />
    <button @click="printInputValue">확인</button> 
  -->

  <ul class="todo-item">
    <li v-for="(item, index) in todoList">
      <input type="checkbox" v-model="item.done" />
      <span :class="{ 'done-item': item.done }">{{ item.text }}</span>
      <div>
        <!-- <button @click="handleClickUpdButton('index')">수정</button> -->
        <button @click="handleClickDelButton('index')">삭제</button>
      </div>
    </li>
  </ul>
</template>

<!-- css -->
<style scoped>
.todo-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid gray;
}
ul {
  display: flex;
  flex-direction: column;
  list-style: none;
}
ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 400px;
}
.done-item {
  text-decoration: line-through;
}
</style>
