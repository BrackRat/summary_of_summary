
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        component: () => import('../pages/index.vue')
    },

]

const router = new createRouter({
    history: createWebHistory(),
    routes
})


export default router