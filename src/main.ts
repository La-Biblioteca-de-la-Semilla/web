import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueGtag from 'vue-gtag'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Tooltip} from "bootstrap";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueGtag, {
    appName: "La biblioteca de la semilla",
    pageTrackerEnabled: true,
    config: { id: "G-QDSHES51KL"}
}, router)

app.directive('tooltip', {
    mounted: (el, binding) => {
        new Tooltip(el, {
            placement: 'top',
            title: binding.value
        });
    }})

app.mount('#app')

