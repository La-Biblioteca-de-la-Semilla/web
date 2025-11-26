<script setup lang="ts">

import {SQUARE_FOOT_IMAGE, type SquareFootType} from "@/model/Seed";
import {onMounted} from "vue";


const props = defineProps<{
  text: string
}>()

const model = defineModel<SquareFootType | null | undefined>({required: true})

onMounted(() => {
  model.value = model.value ?? null
})

</script>

<template>
  <div>
    <div class="input-group mb-3">
      <span class="input-group-text" :id="'sfg-' + props.text">{{ text }}</span>
      <select class="form-select" aria-label="Default select example" :aria-describedby="'sfg-' + props.text"
              v-model="model">
        <option selected :value="null">Sin valor</option>
        <option :key="key" :value="key" v-for="(value, key) in SQUARE_FOOT_IMAGE">{{ key }}</option>
      </select>
    </div>
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