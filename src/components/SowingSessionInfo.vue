<script setup lang="ts">

import springIcon from "@/assets/seasons/spring.svg"
import summerIcon from "@/assets/seasons/summer.svg"
import autumnIcon from "@/assets/seasons/autumn.svg"
import winterIcon from "@/assets/seasons/winter.svg"

interface Props {
  sow: number[]
}

const props = defineProps<Props>()

const seasons = [
  springIcon, springIcon, springIcon,
  summerIcon, summerIcon, summerIcon,
  autumnIcon, autumnIcon, autumnIcon,
  winterIcon, winterIcon, winterIcon
]

</script>

<template>
  <p class="card-text">
    <img
        v-for="(img, i) in seasons"
        :key="'season-' + i"
        class="season-icon"
        :class="{ 'opacity-25': !props.sow.includes(i+1) }"
        :src="img"
        :alt="'season-' + i"
    />
  </p>
</template>

<style scoped>
.season-icon {
  max-width: 8%;
  max-height: 35px;
}
</style>