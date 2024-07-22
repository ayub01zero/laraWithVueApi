<template>
    <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new post</h2>
            <form @submit.prevent="savePost">
                <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div class="sm:col-span-2">
                        <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Post Title</label>
                        <input v-model="post.title" type="text" id="title" name="title" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type post title" >
                        <span v-if="validationErrors.title" class="text-red-600 text-sm mt-1">{{ validationErrors.title[0] }}</span>
                    </div>
                    <div class="sm:col-span-2">
                        <label for="content" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Post Content</label>
                        <input v-model="post.content" type="text" id="content" name="content" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type post content" >
                        <span v-if="validationErrors.content" class="text-red-600 text-sm mt-1">{{ validationErrors.content[0] }}</span>
                    </div>
                    <div class="sm:col-span-2">
                        <label for="image" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Post Image</label>
                        <input type="file" @change="handleImageUpload" id="image" name="image" accept="image/*" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                        <span v-if="validationErrors.image" class="text-red-600 text-sm mt-1">{{ validationErrors.image[0] }}</span>
                    </div>
                </div>
                <button type="submit" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                    Add Post
                </button>
            </form>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import usePosts from '../../composables/Posts';

const { storePost, validationErrors } = usePosts();
const post = ref({
    title: '',
    content: '',
    image: null
});

const handleImageUpload = (event) => {
    post.value.image = event.target.files[0];
};

const savePost = async () => {
    await storePost(post.value);
    post.value.title = '';
    post.value.content = '';
    post.value.image = null;
};
</script>