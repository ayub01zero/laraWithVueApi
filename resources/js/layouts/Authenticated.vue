<template>

    <div>
        <Header></Header>
      <router-view></router-view>
        <Footer></Footer>
    </div>

</template>

<script setup>

import Header from '../components/Body/header.vue';
import Footer from '../components/Body/footer.vue';


</script>