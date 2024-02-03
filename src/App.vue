<template>
  <DataView :data="parsedCSV" v-if="parsedCSV"></DataView>

  <div class="drop-area" v-else @drop="onFileDrop" @dragover.prevent>
    <h1>Drop a CSV file here</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { FinancialData, fromCSV } from './parse_csv'
import DataView from './components/DataView.vue';

const fileContent = ref<string | null>(null);
const parsedCSV = ref<FinancialData | null>(null);

watch(fileContent, (content: string) => {
  if (content) {
    parsedCSV.value = fromCSV(content)
  }
});

if (import.meta.hot) {
  let last_csv = localStorage.getItem('last-csv');
  if (last_csv) {
    fileContent.value = last_csv;
  }
}

const onFileDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      fileContent.value = reader.result as string
      if (import.meta.hot) {
        localStorage.setItem('last-csv', fileContent.value as string)
      }
    }
    reader.readAsText(file)
  }
}
</script>


<style scoped>
.drop-area {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
}
</style>
