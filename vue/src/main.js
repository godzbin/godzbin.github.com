import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Element from 'element-ui'
// import './assets/css/public.scss'
// import 'element-ui/lib/theme-default/index.css'


Vue.config.debug = true;
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Element);
import index from "./pages/index.vue"
import secondcomponent from './component/secondcomponent.vue'


const router = new VueRouter({
	mode: "history",
	base: __dirname,
	routes: [{
		path: "",
		component: index
	}, {
		path: "/index",
		component: index
	}, {
		path: "/second",
		component: secondcomponent
	}]
})



const app = new Vue({
	router,
	render: h => h(App)
}).$mount('#app')