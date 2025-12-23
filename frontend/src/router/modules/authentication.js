export default [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/authentication/LoginView.vue"),
    meta: { layout: "auth" },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/authentication/RegisterView.vue"),
    meta: { layout: "auth" },
  },
];
