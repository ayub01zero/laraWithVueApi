import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';


const user = reactive({ name: '', email: '' });

export default function useAuth() {
    const processing = ref(false);
    const validationErrors = ref({});
    const router = useRouter();
    const loginForm = reactive({ email: '', password: '', remember: false });
    const registerForm = reactive({ name: '', email: '', password: '' });

    const isLoggedIn = computed(() => localStorage.getItem('ApiToken') !== null);

    const handleErrors = (error) => {
        if (error.response?.status === 422) {
            validationErrors.value = error.response.data.errors;
        } else {
            console.error(error.response?.data.message || error.message);
        }
    };

    const submitLogin = async () => {
        if (processing.value) return;

        processing.value = true;
        validationErrors.value = {};

        try {
            await axios.get('/sanctum/csrf-cookie');
            const { data } = await axios.post('/api/login', loginForm);
            const token = data.token;

            localStorage.setItem('ApiToken', token);
            await loginUser(data);
        } catch (error) {
            handleErrors(error);
        } finally {
            processing.value = false;
        }
    };

    const submitRegister = async () => {
        if (processing.value) return;

        processing.value = true;
        validationErrors.value = {};

        try {
            await axios.post('/api/register', registerForm);
            await router.push({ name: 'login' });
        } catch (error) {
            handleErrors(error);
        } finally {
            processing.value = false;
        }
    };

    const loginUser = async (data) => {
        user.name = data.name || data.user?.name || '';
        user.email = data.email || data.user?.email || '';
        localStorage.setItem('loggedIn', JSON.stringify(true));
        await router.push({ name: 'posts.index' });
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

    const logout = async () => {
        if (processing.value) return;

        processing.value = true;

        try {
            await axios.post('/api/logout');
            localStorage.removeItem('ApiToken');
            localStorage.removeItem('loggedIn');
            delete axios.defaults.headers.common['Authorization'];
            await router.push({ name: 'login' });
        } catch (error) {
            console.error(error.response?.statusText || error.message);
        } finally {
            processing.value = false;
        }
    };

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
