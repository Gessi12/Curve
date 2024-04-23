
import { createRouter, createWebHistory } from 'vue-router';
import WETH from '../WethStake.vue';
import Contract from '../Contract.vue';
import Crv from "../Crv.vue"
import Ve from "../Ve.vue";
import USDT from "../Usdt.vue";
import Main from "../Main.vue";
import Swap from "../Swap.vue";

const routes = [
  { path: '/weth', component: WETH },
  { path: '/contract', component: Contract },
  { path: '/ve', component: Ve },
  { path: '/Usdt', component: USDT },
  { path: '/crv', component: Crv },
  { path: '/swap', component: Swap },
  {path: "/", component:Main}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
