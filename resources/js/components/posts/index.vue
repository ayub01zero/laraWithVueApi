<template>
    <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
        <!-- Search bar -->
        <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 pb-4">
          <div class="w-full md:w-1/2">
            <form @submit.prevent="handleSearch" class="flex items-center">
              <label for="simple-search" class="sr-only">Search</label>
              <div class="relative w-full">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input 
                  v-model="searchQuery"
                  type="text" 
                  id="simple-search" 
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                  placeholder="Search" 
                  required
                >
              </div>
            </form>
          </div>
        </div>
  
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th v-for="header in tableHeaders" :key="header" scope="col" class="px-4 py-3">{{ header }}</th>
              </tr>
            </thead>
            <tbody v-if="posts.data?.length">
              <tr v-for="post in posts.data" :key="post.id" class="border-b dark:border-gray-700">
                <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ post.id }}</th>
                <td class="px-4 py-3">
                  <img v-if="post.image" :src="post.image" alt="Post image" class="w-16 h-16 object-cover rounded">
                  <span v-else>No image</span>
                </td>
                <td class="px-4 py-3">{{ post.title }}</td>
                <td class="px-4 py-3">{{ post.content }}</td>
                <td class="px-4 py-3 flex items-center justify-end space-x-2">
                  <button @click="editPost(post.id)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600">Edit</button>
                  <button @click="deletePostHandler(post.id)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600">Delete</button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td :colspan="tableHeaders.length" class="px-4 py-3 text-center text-gray-500 dark:text-gray-400">No posts found.</td>
              </tr>
            </tbody>
          </table>
          <TailwindPagination :data="posts" @pagination-change-page="getPosts" />
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { TailwindPagination } from 'laravel-vue-pagination'; 
  import useAuth from '../../composables/Authentication';
  import usePosts from '../../composables/Posts';
  
  const { user, getUser, isLoggedIn } = useAuth();
  const { posts, getPosts, deletePost } = usePosts(); // Remove searchPosts
  const router = useRouter();
  
  const searchQuery = ref('');
  const currentPage = ref(1);
  const tableHeaders = ['ID', 'Image', 'Title', 'Content', 'Actions'];
  
  onMounted(async () => {
    if (isLoggedIn.value) await getUser();
    await getPosts(currentPage.value, searchQuery.value);
  });
  
  const debouncedSearch = debounce((query) => {
    getPosts(1, query); // Reset to first page when searching
  }, 300);
  
  watch(searchQuery, debouncedSearch);
  
  const handleSearch = () => debouncedSearch(searchQuery.value);
  
  const editPost = (id) => router.push({ name: 'posts.edit', params: { id } });
  
  const deletePostHandler = async (id) => {
    await deletePost(id);
    await getPosts(currentPage.value, searchQuery.value);
  };
  
  function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
  </script>
