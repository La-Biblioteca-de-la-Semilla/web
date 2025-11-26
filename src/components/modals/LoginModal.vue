<script setup lang="ts">
import { useUsersStore } from "@/stores/users";
import {useRouter} from "vue-router";


const router = useRouter()
const store = useUsersStore()

const signInWithGoogle = () => {
  store.signInWithGoogle().then(() => {
    router.push("/")
  }).finally(() => {
    const element = document.getElementById('closeLoginModalButton')
    if (element) element.click()
  })
}
</script>

<template>
  <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="loginModalLabel">Iniciar sesión</h1>
          <button id="closeLoginModalButton" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Al continuar, aceptas nuestro <a href="#">Acuerdo de usuario</a> y confirmas que has entendido la <a href="#">Política de privacidad</a>.
          <div class="d-grid gap-2 mt-5">
            <button class="btn btn-primary" type="button" @click="signInWithGoogle"><i class="bi bi-google me-1"></i> Iniciar sesión con Google</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>