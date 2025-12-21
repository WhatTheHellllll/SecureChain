export default [

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/authentication/LoginView.vue'),
    meta: { hideLayout: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/authentication/RegisterView.vue'),
    meta: { hideLayout: true }
  }
  
];