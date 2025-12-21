import { createRouter, createWebHistory } from 'vue-router';
import authRoutes from './modules/authentication'; 
import productRoutes from './modules/product'; 
import adminRoutes from './modules/admin';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  ...authRoutes,   
  ...productRoutes,
  ...adminRoutes,

  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/products/list' 
  }
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
  const token = sessionStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // Get the user from sessionStorage
  const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

  if (to.meta.requiresAdmin) {
    // If no user OR user is not super_admin
    if (user.role !== 'super_admin') {
      return next('/'); // Kick them back to Home or Dashboard
    }
  }

  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  // if page is private AND user has no token -> Kick them to login
  if (authRequired && !token) {
    return next('/login');
  }
  else if ((to.name === 'login' || to.name === 'register') && token) {
    next('/products/list'); // Redirect them to dashboard
  }
  else {
    next();
  }
});

export default router;