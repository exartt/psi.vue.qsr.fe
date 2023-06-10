import { ComponentCustomProperties } from 'vue'
import Swal from 'sweetalert2'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $swal: typeof Swal;
  }
}
