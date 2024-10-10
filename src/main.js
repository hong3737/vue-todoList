import { createApp } from 'vue';
import './assets/style.css';
import FontAwesomeIcon from './utils/icons';
import App from './App.vue';
import draggable from "@/vuedraggable";

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('draggable', draggable)
  .mount('#app');
