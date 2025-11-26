<script setup lang="ts">

import {useExchangeStore} from "@/stores/exchange";
import {storeToRefs} from "pinia";

const exchangeStore = useExchangeStore()
const {loading, matches} = storeToRefs(exchangeStore)
exchangeStore.fetchMatchingUsers();


</script>

<template>
  <section class="container">
    <h1 class="mb-4 pt-5">Zona de intercambio</h1>
    <small class="text-muted">
      Bienvenid@ a la zona de intercambio, también conocida como "el mercadillo". Aquí tienes una forma de intercambiar
      semillas con los demás usuarios de la biblioteca. Esta herramienta cruza los datos de las semillas que tienes y
      las que quieres, con las que tiene y quiere el resto de usuarios y te muestra la siguiente lista con los que mas
      puedes intercambiar:
    </small>
    <div class="text-center mt-3 mt-md-5" v-if="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div class="row mt-4" v-else-if="matches.length > 0">
      <div class="col-md-4 mb-3" v-for="(m, i) in matches" :key="i">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-auto">
                <img class="img-fluid rounded exchange-image" :src="m.image" alt="..."/>
              </div>
              <div class="col">
                <h5 class="card-title">{{ i + 1 }}. {{ m.name }}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">Coincidencias: {{ m.totalMatches }}</h6>
              </div>
            </div>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <i class="bi bi-arrow-left-square-fill text-primary"/>
              Me puede dar: <b>{{ m.wantHaveMatches }}</b>
            </li>
            <li class="list-group-item">
              <i class="bi bi-arrow-right-square-fill text-success"/>
              Le puedo dar: <b>{{ m.haveWantMatches }}</b>
            </li>
          </ul>
          <div class="card-body">
            <RouterLink :to="{name: 'user-detail', params: {id: m.id}}" class="card-link">Ver perfil</RouterLink>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center mt-5">
      <p class="fs-4">Sin resultados</p>
      <p class="text-muted "><i class="bi bi-exclamation-circle-fill"/> Para poder usar la zona de intercambio necesitas
        marcar
        algunas semillas como las que
        tienes o las que quieres en la
        <RouterLink :to="{name:'home'}">página principal</RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.exchange-image {
  width: 100%;
  height: 55px;
  object-fit: cover;
}
</style>