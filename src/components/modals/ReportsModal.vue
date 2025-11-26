<script setup lang="ts">

import {type ReportReasonKey, ReportReasons, type ReportType, useReportsStore} from "@/stores/reports";
import {storeToRefs} from "pinia";
import {useToasterStore} from "@/stores/toaster";
import {ref} from "vue";

const toaster = useToasterStore()
const reportsStore = useReportsStore()
const {reportType} = storeToRefs(reportsStore)

const TITLES: Record<ReportType, string> = {
  GALLERY_IMAGE: "Reportar una imagen",
  COMMENT: "Reportar un comentario",
};

const selected = ref<ReportReasonKey | "">("")
const text = ref("")

function onClose() {
  reportsStore.closeModal()
}

function onReport() {
  if (selected.value != "") {
    reportsStore.create(selected.value, text.value).then(() => {
      toaster.success({text: "Reportado con éxito. Gracias por hacer este lugar un poco más seguro."})
      reportsStore.closeModal()
      selected.value = ""
      text.value = ""
    }).catch((reason) => {
      toaster.error({text: reason})
    })

  } else {
    alert("else")
  }
}

</script>

<template>
  <div id="reportsModal" class="modal modal-lg" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" v-if="reportType">{{ TITLES[reportType] }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="reportReason" class="form-label">Motivo del reporte</label>
            <select class="form-select" id="reportReason" v-model="selected" required>
              <option value="" disabled selected>Selecciona un motivo...</option>
              <option v-for="o in ReportReasons" :key="o.value" :value="o.value">{{ o.text }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="reportDetails" class="form-label">Detalles adicionales</label>
            <textarea class="form-control" id="reportDetails" rows="4"
                      placeholder="Describe el problema con más detalle..." v-model="text" required></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click.prevent="onClose">Cerrar</button>
          <button type="button" class="btn btn-primary" @click.prevent="onReport">Reportar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>