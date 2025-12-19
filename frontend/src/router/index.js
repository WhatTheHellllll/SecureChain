import { createRouter, createWebHistory } from 'vue-router';
import authRoutes from './modules/authentication'; 
import productRoutes from './modules/product'; 
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  ...authRoutes,   
  ...productRoutes,
    

  //#region 
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
  //#endregion
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// THE SECURITY GUARD
router.beforeEach((to, from, next) => {
  //  Check if the page requires authentication and has a token in LocalStorage (use some incase of nested routes)
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !token) {
      next('/login');
  }
  else if ((to.name === 'login' || to.name === 'register') && token) {
    next('/products'); // Redirect them to dashboard
  }
  else {
    next();
  }
});

export default router;