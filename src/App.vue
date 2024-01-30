<template>
  <pre v-if="parsedCSV">{{ JSON.stringify(parsedCSV, null, 2) }}</pre>
  <div v-else @drop="onFileDrop" @dragover.prevent>
    <h1>Drop a CSV file here</h1>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { fromCSV } from './parse_csv'

const fileContent = ref<string | null>(null);
const parsedCSV = ref<FinancialData | null>(null);

watch(fileContent, (content: string) => {
  if (content) {
    parsedCSV.value = fromCSV(content)
  }
});

if (import.meta.hot) {
  // This code runs before the module is replaced
  import.meta.hot.dispose((data) => {
    // Store parsedCSV in the data object
    data.parsedCSV = parsedCSV.value
  })

  // This code runs after the module is replaced
  import.meta.hot.accept((data: any) => {
    if (data.parsedCSV) {
      parsedCSV.value = data.parsedCSV
    }
  })
}

const onFileDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      fileContent.value = reader.result as string
    }
    reader.readAsText(file)
  }
}
</script>


<style scoped>
div {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
}
</style>
