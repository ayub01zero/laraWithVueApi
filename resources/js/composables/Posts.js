import { ref, inject } from 'vue' 
import { useRouter } from 'vue-router'
import axios from 'axios'

export default function usePosts() {
    const posts = ref({})
    const post = ref({})
    const router = useRouter()
    const validationErrors = ref({})
    const isLoading = ref(false)
    const swal = inject('$swal')

    // Get all posts with pagination
    const getPosts = async (page = 1) => {
        isLoading.value = true;
        try {
            const response = await axios.get('/api/posts?page=' + page);
            posts.value = response.data;
        } catch (error) {
            console.error('Error fetching posts:', error.response?.data.message || error.message);
        } finally {
            isLoading.value = false;
        }
    };

    // Store a new post
    const storePost = async (post) => {
        if (isLoading.value) return;

        isLoading.value = true
        validationErrors.value = {}

        let serializedPost = new FormData()
        for (let item in post) {
            if (post.hasOwnProperty(item)) {
                serializedPost.append(item, post[item])
            }
        }

        try {
            await axios.post('/api/posts', serializedPost);
            router.push({ name: 'posts.index' })
            swal({
                icon: 'success',
                title: 'Post saved successfully'
            })
        } catch (error) {
            if (error.response?.data) {
                validationErrors.value = error.response.data.errors
            }
        } finally {
            isLoading.value = false
        }
    }

    // Get a single post by ID
    const getPost = async (id) => {
        isLoading.value = true
        try {
            const response = await axios.get(`/api/posts/${id}`);
            post.value = response.data;
        } catch (error) {
            console.error('Error fetching post:', error.response?.data.message || error.message);
        } finally {
            isLoading.value = false
        }
    }

    // Update a post by ID
    const updatePost = async (post) => {
        if (isLoading.value) return;

        isLoading.value = true
        validationErrors.value = {}

        try {
            await axios.put(`/api/posts/${post.id}`, post);
            router.push({ name: 'posts.index' })
            swal({
                icon: 'success',
                title: 'Post updated successfully'
            })
        } catch (error) {
            if (error.response?.data) {
                validationErrors.value = error.response.data.errors
            }
        } finally {
            isLoading.value = false
        }
    }

    // Delete a post by ID
    const deletePost = async (id) => {
        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#ef4444',
            timer: 20000,
            timerProgressBar: true,
            reverseButtons: true
        })
        .then(async result => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/posts/${id}`);
                    getPosts();
                    router.push({ name: 'posts.index' })
                    swal({
                        icon: 'success',
                        title: 'Post deleted successfully'
                    })
                } catch (error) {
                    swal({
                        icon: 'error',
                        title: 'Something went wrong'
                    })
                }
            }
        })
    }

    const searchPosts = async (searchQuery) => {
        isLoading.value = true;
        try {
            const response = await axios.get(`/api/posts?search=${searchQuery}`);
            posts.value = response.data;
        } catch (error) {
            console.error('Error searching posts:', error.response?.data.message || error.message);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        posts,
        post,
        getPosts,
        getPost,
        storePost,
        updatePost,
        deletePost,
        validationErrors,
        isLoading,
        searchPosts
    }
}
