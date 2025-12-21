export default [
  {
    path: '/products/list',
    name: 'products',
    component: () => import('@/views/products/ProductView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products/create',
    name: 'product-create',
    component: () => import('@/views/products/ProductCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products/edit/:id',
    name: 'product-edit',
    component: () => import('@/views/products/ProductEdit.vue'),
    meta: { requiresAuth: true }
  }
];