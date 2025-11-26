<script setup lang="ts">

import {type Tag} from "@/model/Tag";

interface Props {
  tag: Tag
}

const props = defineProps<Props>()
const model = defineModel()

</script>

<template>
  <div class="form-check filter-form-check-inline">
    <input type="checkbox" class="btn-check" autocomplete="off"
           :id="'filter-tag-check-button-' + props.tag.id"
           :value="props.tag.id"
            v-model="model">
    <label class="btn btn-sm btn-light" :for="'filter-tag-check-button-' + props.tag.id">
        <img class="img-fluid" :src="props.tag.image" :alt="props.tag.text"/>
        {{ props.tag.text }}
    </label>
  </div>
</template>

<style scoped>
.btn img {
  max-height: 25px;
}
.filter-form-check-inline {
  display: inline-block;
  padding-left: 0.125em;
}
</style>