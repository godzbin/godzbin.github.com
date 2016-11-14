import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Element from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'


Vue.config.debug = true;
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Element);
const First = {
	template : "<div><h2>我是第1个子页面</h2></div>"
}
import secondcomponent from './component/secondcomponent.vue'


const router = new VueRouter({
	mode: "history",
	base: __dirname,
	routes: [
		{
			path : "/first",
			component: First
		},
		{
			path: "/second",
			component: secondcomponent
		}
	]
})



 const app = new Vue({
 	router,
 	render: h => h(App)
 }).$mount('#app')

// new Vue({
//   el: '#app',
//   render: h => h(App)
// })
