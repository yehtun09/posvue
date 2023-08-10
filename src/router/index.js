import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


import store from '@/store'
import axios from 'axios'
// localStorage.setItem("api", "https://admin.pkhitzone.com");
// localStorage.setItem("api", "http://posvone.test");
const routes = [
  {
    path: '/customer-api',
    name: "customerApi",
    meta: {
      middleware: "apiCheck"
    },
    component: () => import("../views/CustomerApiView.vue")
  }
  ,
  {
    path: '/',
    name: 'home',
    meta: {
      middleware: "auth"
    },
    component: HomeView
  },

  {
    path: '/login',
    name: 'login',
    meta: {
      middleware: "none"
    },
    component: () => import('../views/Auth/LoginView.vue')
  },

  {
    path: '/admin',
    name: 'admin',
    redirect: {
      name: "product-warehouse"
    },
    meta: {
      middleware: "auth"
    },
    children: [
      {
        path: "product-warehouse",
        name: "product-warehouse",
        component: () => import("../views/Auth/ProductWarehouseView.vue")
      },
      {
        path: "order",
        name: "admin-order",
        component: () => import("../views/Auth/OrderView.vue")
      },
      {
        path: "expense",
        name: "admin-expense",
        component: () => import("../views/Auth/ExpenseView.vue")
      },
      {
        path: "income",
        name: "admin-income",
        component: () => import("../views/Auth/IncomeView.vue")
      },
    ]
  },

  {
    path: '/summary',
    name: 'summary',
    meta: {
      middleware: "auth"
    },
    component: () => import('../views/SummaryView.vue')
  },
]

const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  // history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // redirect to login if not auth
  if (to.meta.middleware == "auth" && !store.state.auth.authenticated) {
    localStorage.getItem("api") == null && next({ name: "customerApi" });
    next({ name: "login" });
  }

  if (store.state.auth.authenticated && to.name == 'login') {
    next({ name: "home" });
  }

  if (to.meta.middleware == "apiCheck") {
    localStorage.getItem("api") && next({ name: "login" });
  }

  if (to.name == "login") {
    if (localStorage.getItem("api") == null) {
      next({ name: "customerApi" });
    }
  };

  next();
})

export default router
