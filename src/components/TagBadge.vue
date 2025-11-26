<script setup lang="ts">

import {type Tag} from "@/model/Tag";

interface Props {
  tag: Tag
}

const props = defineProps<Props>()

</script>

<template>
  <span class="badge text-bg-light" v-tooltip="props.tag.description">
    <img class="img-fluid" :src="props.tag.image" :alt="props.tag.text"/>
    {{ props.tag.text }}
  </span>
</template>

<style scoped>
.badge img {
  max-height: 25px;
}
</style>