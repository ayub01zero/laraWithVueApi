import { createApp } from 'vue';
import router from './routes/index'; 
import VueSweetalert2 from 'vue-sweetalert2'; 
import './bootstrap';
import 'flowbite';



createApp({})
    .use(VueSweetalert2) 
    .use(router) 
    .mount('#app');
