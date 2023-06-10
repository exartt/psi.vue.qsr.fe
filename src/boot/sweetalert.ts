import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  app.use(VueSweetalert2)
})
