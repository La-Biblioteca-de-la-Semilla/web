<script setup lang="ts">

import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import ImageSelectorModal from '@/components/modals/ImageSelectorModal.vue'
import { useToasterStore } from '@/stores/toaster'

const toaster = useToasterStore()
const userStore = useUsersStore()
const { user } = storeToRefs(userStore)

function onImageChanged(image: string) {
  if (user.value) {
    user.value.image = image
  }
}

function onSave() {
  userStore.save().then(() => {
    toaster.success({ text: 'Tu perfil se ha actualizado correctamente' })
  }).catch((reason) => {
    console.log(reason)
    toaster.error({ text: 'Ha ocurrido un error al guardar tu perfil' })
  })
}

</script>

<template>
  <div class="container pt-5 mb-5">
    <button class="btn btn-primary float-end" v-if="user" @click="onSave">Guardar</button>
    <h1>Editar perfil</h1>
    <h2 class="mt-5 mb-2">Avatar</h2>
    <div class="row" v-if="user">
      <div class="col-auto">
        <img class="img-fluid object-fit-cover img-profile" :src="user.image" alt="" />
      </div>
      <div class="col-auto">
        <b>Actualiza tu foto de perfil</b>
        <br />
        <button class="btn btn-light my-1"
                data-bs-toggle="modal"
                data-bs-target="#profileImageSelectorModal">Cambiar imagen
        </button>
        <br />
        <small class="text-muted">Lo ideal es una foto cuadrada, aunque podrás recortarla durante el proceso.</small>
      </div>
    </div>

    <h2 class="mt-5 mb-2">Datos</h2>
    <div class="row" v-if="user">
      <div class="col">
        <div class="mb-3">
          <label for="displayNameInput" class="form-label">Nombre público</label>
          <input class="form-control" id="displayNameInput" placeholder="Nombre público" v-model="user.name">
        </div>
      </div>
    </div>

    <ImageSelectorModal id="profileImageSelectorModal" @finished="onImageChanged" />
  </div>
</template>

<style scoped>
.img-profile {
  width: 160px;
  height: 160px;
}
</style>