<script setup lang="ts">
import {RouterLink} from 'vue-router'
</script>

<template>
  <footer
      class="bg-body py-3 px-5 border-top d-print-none">
    <div class="container d-flex flex-wrap justify-content-between align-items-center">
      <p class="col-md-auto mb-0 text-muted">© 2024 La Biblioteca de la Semilla</p>
      <ul class="nav col-md-auto justify-content-end">
        <li class="nav-item">
          <RouterLink class="nav-link px-2 text-muted" :to="{ name: 'home' }">Inicio</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link px-2 text-muted" :to="{ name: 'cookies-policy' }">Política de cookies</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link px-2 text-muted" :to="{ name: 'privacy-policy' }">Política de privacidad
          </RouterLink>
        </li>
      </ul>
    </div>
  </footer>

</template>
