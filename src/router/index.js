import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    // {
    //     path: '/',
    //     name: 'map',
    //     component: () => import('@/views/IndexMap'),
    // },
    {
        path: '/',
        name: 'tle',
        component: () => import('@/views/tle'),
    },
    // {
    //     path: '/tle',
    //     name: 'tle',
    //     component: () => import('@/views/tle'),
    // },
    {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/index'),
    },
    {
        path: '/pmap',
        name: 'pmap',
        component: () => import('@/views/pMap'),
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
