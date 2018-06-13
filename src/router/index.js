import Vue from 'vue'
import Router from 'vue-router'
import location from '@/components/location'
import done from "@/components/done"

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/:id",
      name: "location",
      component: location
    },
    {
      path: "/:done",
      name: "done",
      component: done
    }
  ]
});
