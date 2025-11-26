<script setup lang="ts">

import {onMounted} from "vue";
import {Modal} from "bootstrap"
import {useCookiesStore} from "@/stores/cookies";
let consentModal: Modal;

const store = useCookiesStore()

onMounted(() => {
  consentModal = new Modal(document.getElementById('consentModal') as Element, {})
  if ( store.isNotSet ) {
    consentModal.show()
  }
})

const accept = () => {
  store.acceptCookies()
  consentModal.hide()
}

const decline = () => {
  store.rejectCookies()
  consentModal.hide()
}

</script>

<template>
  <div class="modal fade" id="consentModal" tabindex="-1" aria-labelledby="consentModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="consentModalLabel">Aviso de cookies</h1>
        </div>
        <div class="modal-body">
          <p>Utilizamos cookies para mejorar su experiencia en nuestro sitio web, personalizar contenido y anuncios, y analizar nuestro tráfico. Al hacer clic en "Aceptar", usted acepta nuestra <RouterLink :to="{ name: 'cookies-policy' }">Política de cookies</RouterLink> y nuestra <RouterLink :to="{ name: 'privacy-policy' }">Política de privacidad</RouterLink>.</p>
          <p>
            <strong>Importante:</strong> Si decide rechazar las cookies, algunas funcionalidades del sitio web pueden no estar disponibles o no funcionar correctamente.
          </p>
          <div class="d-grid gap-2 mt-5">
            <button class="btn btn-outline-secondary" type="button" @click="decline">Rechazar</button>
            <button class="btn btn-primary" type="button" @click="accept">Aceptar y continuar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>