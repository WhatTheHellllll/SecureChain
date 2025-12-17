import { createRouter, createWebHistory } from 'vue-router';
import ProductView from '../views/product.view.vue';
import ProductCreateView from '../views/product.create.view.vue';
import ProductEditView from '../views/product.edit.view.vue';

// 1. Define your routes
const routes = [
  {
    path: '/',
    redirect: '/products'
  },
  {
    path: '/products',
    name: 'products',
    component: ProductView
  },
  {
    path: '/products/create',
    name: 'product-create',
    component: ProductCreateView
  },
  {
    path: '/products/edit/:id', 
    name: 'product-edit',
    component: ProductEditView
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/user.view.vue') // Lazy load example
  }
  // ,
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   // This component will have its OWN <RouterView> inside it for the sub-pages
  //   component: () => import('../views/AdminLayout.vue'), 
  //   children: [
  //     {
  //       // Matches /admin/dashboard
  //       path: 'dashboard', 
  //       component: () => import('../views/admin/Dashboard.vue')
  //     },
  //     {
  //       // Matches /admin/settings
  //       path: 'settings', 
  //       component: () => import('../views/admin/Settings.vue')
  //     }
  //   ]
  // }
];

// 2. Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;