import { createApp } from 'vue';
import './assets/style.css';
import FontAwesomeIcon from './utils/icons';
import App from './App.vue';

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
