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

    const api = axios.create({
        baseURL: '/api',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })

    const handleApiError = (error, customErrorMessage) => {
        console.error(customErrorMessage, error.response?.data.message || error.message)
        if (error.response?.data?.errors) {
            validationErrors.value = error.response.data.errors
        }
        swal({
            icon: 'error',
            title: 'An error occurred',
            text: customErrorMessage
        })
    }

    const getPosts = async (page = 1, searchQuery = '') => {
        isLoading.value = true
        try {
            const response = await api.get(`/posts?page=${page}&search=${searchQuery}`)
            posts.value = response.data
        } catch (error) {
            handleApiError(error, 'Error fetching posts')
        } finally {
            isLoading.value = false
        }
    }

    const storePost = async (postData) => {
        if (isLoading.value) return

        isLoading.value = true
        validationErrors.value = {}

        const formData = new FormData()
        Object.keys(postData).forEach(key => formData.append(key, postData[key]))

        try {
            await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            router.push({ name: 'posts.index' })
            swal({
                icon: 'success',
                title: 'Post saved successfully'
            })
        } catch (error) {
            handleApiError(error, 'Error saving post')
        } finally {
            isLoading.value = false
        }
    }

    const getPost = async (id) => {
        isLoading.value = true
        try {
            const response = await api.get(`/posts/${id}`)
            post.value = response.data.data
        } catch (error) {
            handleApiError(error, 'Error fetching post')
        } finally {
            isLoading.value = false
        }
    }

    const updatePost = async (formData, id) => {
        if (isLoading.value) return

        isLoading.value = true
        validationErrors.value = {}

        try {
            const response = await api.post(`/update/post/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            post.value = response.data.data
            router.push({ name: 'posts.index' })
            swal({
                icon: 'success',
                title: 'Post updated successfully'
            })
        } catch (error) {
            handleApiError(error, 'Error updating post')
        } finally {
            isLoading.value = false
        }
    }

    const deletePost = async (id) => {
        const result = await swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#ef4444',
            timer: 20000,
            timerProgressBar: true,
            reverseButtons: true
        })

        if (result.isConfirmed) {
            try {
                await api.delete(`/posts/${id}`)
                await getPosts()
                swal({
                    icon: 'success',
                    title: 'Post deleted successfully'
                })
            } catch (error) {
                handleApiError(error, 'Error deleting post')
            }
        }
    }

    return {
        posts,
        post,
        getPosts,
        getPost,
        storePost,
        updatePost,
        deletePost,
        validationErrors,
        isLoading
    }
}