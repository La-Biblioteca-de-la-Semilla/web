<script setup lang="ts">
import {useSeedStore} from '@/stores/seed'
import {storeToRefs} from 'pinia'
import TagCheckButton from "@/components/TagCheckButton.vue";
import {TAGS} from "@/model/Tag"
import SowingSessionSelector from "@/components/SowingSessionSelector.vue";
import {useUsersStore} from "@/stores/users";
import {BOTANICAL_FAMILIES} from "@/model/Seed";

const seedStore = useSeedStore()
const {filters, order, getSentOnValues} = storeToRefs(seedStore)

const userStore = useUsersStore()
const {user} = storeToRefs(userStore)

</script>

<template>
  <div class="card card-body">
    <h5>Filtros</h5>
    <div class="row">
      <div class="col-md-auto me-3">
        <h6 class="mt-3">Siembra</h6>
        <SowingSessionSelector v-model="filters.sowing"/>
      </div>
      <div class="col-md-auto me-3">
        <h6 class="mt-3">Familia</h6>
        <select class="form-select" id="botanicalFamily" aria-label="Botanical family select" v-model="filters.family">
          <option selected :value="null">No aplicar filtro</option>
          <option v-for="(value, key) in BOTANICAL_FAMILIES" :key="key" :value="key">
            {{ value.text }} ({{ value.examples.join(", ") }})
          </option>
        </select>
      </div>
      <div class="col-md-auto me-3">
        <h6 class="mt-3">Reproducción</h6>
        <TagCheckButton
            v-for="tag in TAGS.filter(t => t.group === 'REPRODUCTION')"
            :key="tag.id"
            :tag="tag"
            v-model="filters.tags"/>

      </div>
      <div class="col-md-auto me-3">
        <h6 class="mt-3">Polinización</h6>
        <TagCheckButton
            v-for="tag in TAGS.filter(t => t.group === 'POLLINATION')"
            :key="tag.id"
            :tag="tag"
            v-model="filters.tags"/>
      </div>
      <div class="col-md-auto me-3">
        <h6 class="mt-3">Otros</h6>
        <TagCheckButton
            v-for="tag in TAGS.filter(t => t.group === 'OTHER')"
            :key="tag.id"
            :tag="tag"
            v-model="filters.tags"/>
      </div>
      <div class="col-md-auto me-3">
        <h6 class="mt-3">Envío</h6>
        <select class="form-select" aria-label="Selector de envío" v-model="filters.sentOn">
          <option selected value="">No aplicar filtro</option>
          <option selected value="N/A">Sin envío</option>
          <option v-for="(s, i) in getSentOnValues" :key="i" :value="s">{{ s }}</option>
        </select>
      </div>
      <div class="col-md-auto me-3" v-if="user">
        <h6 class="mt-3">Quiero / Tengo</h6>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="filterHave" role="switch" v-model="filters.have">
          <label class="form-check-label" for="filterHave">Las que tengo</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="filterWant" role="switch" v-model="filters.want">
          <label class="form-check-label" for="filterWant">Las que quiero</label>
        </div>
      </div>
    </div>
    <hr class="my-3"/>
    <h5>Ordenar por</h5>
    <div class="card-text row">
      <div class="col-md-3">
        <div class="input-group">
          <select class="form-select" v-model="order.by" aria-label="Default select example">
            <option value="name">Nombre</option>
            <option value="species">Especie</option>
          </select>
          <select class="form-select" v-model="order.asc" aria-label="Default select example">
            <option value="1">Ascendente</option>
            <option value="-1">Descendente</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.season-icon {
  max-width: 8.33%;
  max-height: 38px;
}
</style>
