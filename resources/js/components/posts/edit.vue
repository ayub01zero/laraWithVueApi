<template>
    <section class="bg-white dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Edit Post</h2>
        <form @submit.prevent="handleSubmit">
          <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div class="sm:col-span-2">
              <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Post Title</label>
              <input 
                v-model="post.title" 
                type="text" 
                id="title" 
                name="title" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                placeholder="Enter post title"
              >
              <span v-if="validationErrors.title" class="text-red-600 text-sm mt-1">{{ validationErrors.title[0] }}</span>
            </div>
            <div class="sm:col-span-2">
              <label for="content" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Post Content</label>
              <textarea 
                v-model="post.content" 
                id="content" 
                name="content" 
                rows="4" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                placeholder="Enter post content"
              ></textarea>
              <span v-if="validationErrors.content" class="text-red-600 text-sm mt-1">{{ validationErrors.content[0] }}</span>
            </div>
            <div class="sm:col-span-2">
              <label for="image" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Post Image</label>
              <input 
                type="file" 
                id="image" 
                name="image" 
                @change="handleImageChange" 
                accept="image/*"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
              <span v-if="validationErrors.image" class="text-red-600 text-sm mt-1">{{ validationErrors.image[0] }}</span>
            </div>
          </div>
          <div class="mt-4">
            <img 
              v-if="imagePreview" 
              :src="imagePreview" 
              alt="Post image" 
              class="w-32 h-32 object-cover rounded"
            >
            <span v-else-if="post.image" class="text-sm text-gray-500">Current image: {{ post.image }}</span>
            <span v-else class="text-sm text-gray-500">No image</span>
          </div>
          <button 
            type="submit" 
            :disabled="isLoading" 
            class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            <span v-if="isLoading" class="mr-2">
              <svg class="animate-spin h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20 12a8 8 0 01-8 8v4c6.627 0 12-5.373 12-12h-4zm-2-5.291A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3-7.938l-3 2.647z"></path>
              </svg>
            </span>
            Update Post
          </button>
        </form>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import usePosts from '../../composables/Posts';
  
  const { post, getPost, updatePost, validationErrors, isLoading } = usePosts();
  const route = useRoute();
  const imagePreview = ref(null);
  
  onMounted(async () => {
    const postId = route.params.id;
    await getPost(postId);
  });
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target.result;
      };
      reader.readAsDataURL(file);
      post.value.image = file;
    }
  };
  
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', post.value.title);
      formData.append('content', post.value.content);
      if (post.value.image instanceof File) {
        formData.append('image', post.value.image);
      }
      await updatePost(formData, post.value.id);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  
  // Reset image preview when post changes
  watch(() => post.value, (newPost) => {
    if (newPost && newPost.image && !(newPost.image instanceof File)) {
      imagePreview.value = newPost.image;
    } else {
      imagePreview.value = null;
    }
  }, { immediate: true });
  </script>