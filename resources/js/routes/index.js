import { createRouter, createWebHistory } from 'vue-router';
import AuthenticatedLayout from '../layouts/Authenticated.vue';
import GuestLayout from '../layouts/Guest.vue';
import PostsIndex from '../components/posts/index.vue';
import PostsCreate from '../components/posts/create.vue';
import PostsEdit from '../components/posts/edit.vue';
import Login from '../components/Auth/login.vue';
import Register from '../components/Auth/register.vue';
import NotFound from '../components/notfound.vue';

// Function to check if user is authenticated
const isAuthenticated = () => {
    const loggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    const apiToken = localStorage.getItem('ApiToken');
    return loggedIn === true && apiToken !== null;
};

// Authentication guard
const authGuard = (to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next('/auth/login'); 
    } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated()) {
        next('/posts'); 
    } else {
        next(); //
    }
};

// Define your routes
const routes = [
    {
        path: '/',
        redirect: { name: 'posts.index' },
        component: AuthenticatedLayout,
        beforeEnter: authGuard,
        children: [
            {
                path: 'posts',
                name: 'posts.index',
                component: PostsIndex,
                meta: { title: 'Posts', requiresAuth: true }
            },
            {
                path: 'posts/create',
                name: 'posts.create',
                component: PostsCreate,
                meta: { title: 'Add new post', requiresAuth: true }
            },
            {
                path: 'posts/edit/:id',
                name: 'posts.edit',
                component: PostsEdit,
                meta: { title: 'Edit post', requiresAuth: true }
            }
        ]
    },
    {
        path: '/auth',
        component: GuestLayout,
        beforeEnter: authGuard,
        children: [
            { path: 'login', name: 'login', component: Login },
            { path: 'register', name: 'register', component: Register }
        ]
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
