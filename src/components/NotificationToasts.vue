<script setup lang="ts">

import {useToasterStore} from "@/stores/toaster";

const toaster = useToasterStore()

const classMap = {
  success: 'text-bg-success',
  error: 'text-bg-danger',
  info: 'text-bg-info',
  warning: 'text-bg-warning',
}

const iconMap = {
  success: 'bi bi-check-circle',
  error: 'bi bi-x-circle',
  info: 'bi bi-info-circle',
  warning: 'bi bi-exclamation-triangle',
}

const titleMap = {
  success: 'Éxito',
  error: 'Error',
  info: 'Información',
  warning: 'Atención',
}

</script>

<template>
  <Teleport to="body">
    <div v-if="toaster.toasts.length" class="toast-container position-fixed bottom-0 end-0 p-3">
      <div class="toast align-items-center show" role="alert" aria-live="assertive" aria-atomic="true"
           v-for="toast in toaster.toasts" :key="toast.id">
        <div class="toast-header" :class="classMap[toast.status]">
          <i class="me-2" :class="iconMap[toast.status]"></i>
          <strong class="me-auto">{{ titleMap[toast.status] }}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ toast.text }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

</style>