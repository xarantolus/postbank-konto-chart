<script setup lang="ts">
import { ref, defineProps } from 'vue'

defineProps<{ value: number, currency?: string }>()
</script>


<template>
	<span :class="value > 0 ? 'positive' : 'negative'">
		{{ value.toFixed(2) }} {{ currency ?? 'EUR' }}
	</span>
</template>


<style scoped>
span {
	white-space: nowrap;
}
.positive {
	color: #33ff33;
}

.negative {
	color: #ff3333;
}
</style>
