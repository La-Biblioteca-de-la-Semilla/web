<script setup lang="ts">
import VueCropper from "vue-cropperjs";
import 'cropperjs/dist/cropper.css';
import {ref, useTemplateRef} from "vue";


const emit = defineEmits(['finished'])

const imgSrc = ref<String | null>(null)
const cropper = useTemplateRef('cropper')
const step = ref<Number>(1)

const MAX_SIZE = 1048487;

function setImage(e: Event) {
  const target = (<HTMLInputElement>e.target);
  const files = target.files;

  if (files) {
    const file = files[0];

    if (file.type.indexOf('image/') === -1) {
      alert('Please select an image file');
      return;
    }

    if (typeof FileReader === 'function') {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (!event.target || !cropper.value) return;
        imgSrc.value = event.target.result as String;
        // @ts-ignore
        cropper.value.replace(event.target.result);
      };

      reader.readAsDataURL(file);
      step.value = 2
    } else {
      alert('Sorry, FileReader API not supported');
    }
  }
}

function cropImage() {
  if (!cropper.value) return;

  // @ts-ignore
  const canvas = cropper.value.getCroppedCanvas();

  let format = 'image/png'; // Formato por defecto
  let quality = 1.0; // Calidad inicial para formatos con pérdida

  // Obtener formato de la imagen original (si es posible)
  const originalDataURL = canvas.toDataURL();
  const match = originalDataURL.match(/^data:(image\/[a-zA-Z]+);/);
  if (match) {
    format = match[1];
  }

  // Generar la imagen en el formato detectado
  let croppedImage = canvas.toDataURL(format, format === 'image/png' ? undefined : quality);

  // Reducir calidad para formatos con pérdida si excede el tamaño máximo
  while (croppedImage.length > MAX_SIZE && quality > 0 && format !== 'image/png') {
    quality -= 0.05; // Reducir calidad progresivamente
    croppedImage = canvas.toDataURL(format, quality);
  }

  // Si sigue excediendo el tamaño máximo y es PNG, cambiar a JPEG para mejor compresión
  if (croppedImage.length > MAX_SIZE && format === 'image/png') {
    format = 'image/jpeg';
    quality = 1.0; // Reiniciar calidad
    croppedImage = canvas.toDataURL(format, quality);

    while (croppedImage.length > MAX_SIZE && quality > 0) {
      quality -= 0.05;
      croppedImage = canvas.toDataURL(format, quality);
    }
  }

  console.log(croppedImage.length)
  emit('finished', croppedImage);
}


</script>

<template>
  <div v-if="step === 1">
    <input
        class="form-control"
        type="file"
        id="imageFile"
        accept="image/png, image/jpeg"
        aria-describedby="imageFileHelp"
        @change="setImage">
    <div id="imageFileHelp" class="form-text">Solo se permiten imágnes .png y .jpeg</div>
  </div>
  <div v-if="step === 2">

    <p class="form-label">
      Ajusta la zona de recorte y pulsa
      <button class="btn btn-sm btn-primary" @click.prevent="cropImage">Recortar</button>
      o
      <button class="btn btn-sm btn-link" @click.prevent="step = 1">elige otra imagen</button>
    </p>
    <VueCropper
        ref="cropper"
        :src="imgSrc"
        :aspectRatio=1
        :zoomable="false"
        preview=".preview"
        :viewMode=1
    />
  </div>
</template>

<style scoped>

</style>