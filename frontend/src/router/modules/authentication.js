export default [

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.view.vue'),
    meta: { hideLayout: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register.view.vue'),
    meta: { hideLayout: true }
  }
  
];