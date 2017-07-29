/**
 * Created by wton on 2016/10/6.
 */
import * as Vue from "vue";
import * as VueRouter from "vue-router";
import myViews from "../views/index";
import app from '../App.vue'

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
            {path: '/home', component: myViews.home},
            {path: '/test', component: myViews.test},
            {path: "*", component: app}
        ]
    });
}
