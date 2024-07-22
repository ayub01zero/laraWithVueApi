<template>
  <div>
    <Header :title="developer" :menuItems="menuItems"></Header>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '../components/Body/header.vue';
import Footer from '../components/Body/footer.vue';

const developer = ref('My App');
const menuItems = ref([
  { text: 'Home', link: '/posts' },
  { text: 'Create Post', link: { name: 'posts.create' } },
]);
</script>
