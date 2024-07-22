import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default function useAuth() {
    const router = useRouter();
    const user = reactive({ name: '', email: '' });
    const processing = ref(false);
    const validationErrors = ref({});
    const loginForm = reactive({ email: '', password: '', remember: false });
    const registerForm = reactive({ name: '', email: '', password: '' });

    const isLoggedIn = computed(() => !!localStorage.getItem('ApiToken'));

    const handleRequest = async (requestFn) => {
        if (processing.value) return;

        processing.value = true;
        validationErrors.value = {};

        try {
            return await requestFn();
        } catch (error) {
            if (error.response?.status === 422) {
                validationErrors.value = error.response.data.errors;
            } else {
                console.error(error.response?.data.message || error.message);
            }
        } finally {
            processing.value = false;
        }
    };

    const submitLogin = () => handleRequest(async () => {
        await axios.get('/sanctum/csrf-cookie');
        const { data } = await axios.post('/api/login', loginForm);
        localStorage.setItem('ApiToken', data.token);
        await loginUser(data);
    });

    const submitRegister = () => handleRequest(async () => {
        await axios.post('/api/register', registerForm);
        router.push({ name: 'login' });
    });

    const loginUser = async (data) => {
        Object.assign(user, {
            name: data.name || data.user?.name || '',
            email: data.email || data.user?.email || ''
        });
        localStorage.setItem('loggedIn', 'true');
        router.push({ name: 'posts.index' });
    };

    const getUser = () => {
        const token = localStorage.getItem('ApiToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get('/api/user')
                .then(response => loginUser(response.data))
                .catch(error => console.error(error.response?.data.message || error.message));
        }
    };

    const logout = () => handleRequest(async () => {
        await axios.post('/api/logout');
        localStorage.removeItem('ApiToken');
        localStorage.removeItem('loggedIn');
        delete axios.defaults.headers.common['Authorization'];
        router.push({ name: 'login' });
    });

    return {
        loginForm,
        registerForm,
        validationErrors,
        processing,
        submitLogin,
        submitRegister,
        user,
        getUser,
        logout,
        isLoggedIn,
    };
}