export default [
  {
    path: '/products',
    name: 'products',
    // Use Lazy Loading (better for performance)
    component: () => import('@/views/product.view.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products/create',
    name: 'product-create',
    component: () => import('@/views/product.create.view.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products/edit/:id',
    name: 'product-edit',
    component: () => import('@/views/product.edit.view.vue'),
    meta: { requiresAuth: true }
  }
];