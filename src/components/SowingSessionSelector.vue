<script setup lang="ts">

import springIcon from "@/assets/seasons/spring.svg"
import summerIcon from "@/assets/seasons/summer.svg"
import autumnIcon from "@/assets/seasons/autumn.svg"
import winterIcon from "@/assets/seasons/winter.svg"

const model = defineModel<number[]>({ required: true })

const seasons = [
  springIcon, springIcon, springIcon,
  summerIcon, summerIcon, summerIcon,
  autumnIcon, autumnIcon, autumnIcon,
  winterIcon, winterIcon, winterIcon
]

</script>

<template>
  <div>
    <div class="form-check d-inline p-0" :key="'season' + i" v-for="(season, i) in seasons">
      <input type="checkbox" class="btn-check" autocomplete="off"
             v-model="model"
             :id="'season' + i"
             :value="i + 1">
      <label class="btn btn-sm btn-outline-light p-0 selector-label" :for="'season' + i">
        <img
            class="img-fluid"
            :class="{ 'opacity-25': !model.find((v:Number) => v === i + 1) }"
            :src="season"
        />
      </label>
    </div>
    <button class="btn btn-sm btn-light" @click.prevent="model = []">Limpiar</button>
  </div>
</template>

<style scoped>

.selector-label {
  max-width: calc(100% / 12);
}

.selector-label img {
  max-height: 35px;
}


</style>