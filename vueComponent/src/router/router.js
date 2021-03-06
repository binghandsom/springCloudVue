/**
 * Created by wton on 2016/10/6.
 */
import Vue from "vue";
import VueRouter from "vue-router";
import myViews from "../views/index.js";

const app = () => import( '../App.vue');
Vue.use(VueRouter);

export function createRouter() {
    return new VueRouter({
        mode: 'history',
        scrollBehavior(to, from, savedPosition) {
            if (savedPosition) {
                return savedPosition
            } else {
                return {x: 0, y: 0}
            }
        },
        routes: [
            {
                path: '/home', component: myViews.home,
                children: [
                    {path: 'test', component: myViews.test},
                    {path: 'chat', component: myViews.chat},
                    {path: 'register', component: myViews.register}
                ]
            },
            {path: '/test', component: myViews.test},
            {path: "*", component: app}
        ]
    });
}
