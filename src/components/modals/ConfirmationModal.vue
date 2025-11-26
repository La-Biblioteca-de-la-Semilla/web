<script setup lang="ts">

const props = defineProps<{
  id: string
}>()

const emit = defineEmits(["confirmed"])


function onConfirm() {
  emit("confirmed")
}


</script>

<template>
  <div class="modal fade" :id="props.id" tabindex="-1" :aria-labelledby="props.id" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">¿Confirmas esta operación?</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Esta operación requiere tu aprobación explícita.
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
          <button class="btn btn-primary" type="button" data-bs-dismiss="modal" @click.prevent="onConfirm">Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>