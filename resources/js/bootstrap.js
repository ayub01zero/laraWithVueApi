import axios from 'axios';
window.axios = axios;

const token = localStorage.getItem('ApiToken');
if (token) {
    window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;  
axios.defaults.withXSRFToken = true;



window.axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 || error.response?.status === 419) {
            if (localStorage.getItem('ApiToken')) {
                localStorage.removeItem('ApiToken');
                localStorage.removeItem('isLoggedIn');
                location.assign('/login');
            }
        }
        return Promise.reject(error);
    }
);
