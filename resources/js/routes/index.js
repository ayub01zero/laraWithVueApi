import { createRouter, createWebHistory } from 'vue-router';
import AuthenticatedLayout from '../layouts/Authenticated.vue';
import GuestLayout from '../layouts/Guest.vue';
import PostsIndex from '../components/posts/index.vue';
import PostsCreate from '../components/posts/create.vue';
import PostsEdit from '../components/posts/edit.vue';
import Login from '../components/Auth/login.vue';
import Register from '../components/Auth/register.vue';
import NotFound from '../components/notfound.vue';

// Authentication check
const isAuthenticated = () => {
    return JSON.parse(localStorage.getItem('loggedIn')) === true 
           && localStorage.getItem('ApiToken') !== null;
};

// Route meta creator
const createRouteMeta = (title, requiresAuth = true) => ({ title, requiresAuth });

// Routes configuration
const routes = [
    {
        path: '/',
        component: AuthenticatedLayout,
        children: [
            {
                path: '',
                redirect: { name: 'posts.index' }
            },
            {
                path: 'posts',
                name: 'posts.index',
                component: PostsIndex,
                meta: createRouteMeta('Posts')
            },
            {
                path: 'posts/create',
                name: 'posts.create',
                component: PostsCreate,
                meta: createRouteMeta('Add new post')
            },
            {
                path: 'posts/edit/:id',
                name: 'posts.edit',
                component: PostsEdit,
                meta: createRouteMeta('Edit post')
            }
        ]
    },
    {
        path: '/auth',
        component: GuestLayout,
        children: [
            { 
                path: 'login', 
                name: 'login', 
                component: Login,
                meta: createRouteMeta('Login', false)
            },
            { 
                path: 'register', 
                name: 'register', 
                component: Register,
                meta: createRouteMeta('Register', false)
            }
        ]
    },
    { 
        path: '/:pathMatch(.*)*', 
        name: 'not-found', 
        component: NotFound,
        meta: createRouteMeta('Not Found', false)
    }
];

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes
});

// Global navigation guard
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | Vue With Ayo`;
    
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next({ name: 'login' });
    } else if (['login', 'register'].includes(to.name) && isAuthenticated()) {
        next({ name: 'posts.index' });
    } else {
        next();
    }
});

export default router;