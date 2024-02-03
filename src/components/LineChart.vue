<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, ChartData, ChartOptions } from 'chart.js'
import { ref, defineProps, watch } from 'vue'
import { AccountData, Payment } from '../parse_csv'
import { formatDateMonthName } from '../util'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, PointElement, LinearScale)

const props = defineProps<{ transactions: Payment[], initial_value: number }>();

const labels = ref<string[]>([]);
const data = ref<number[]>([]);

let copy = props.transactions.slice().sort((a, b) => a.date.getTime() - b.date.getTime());

let current_balance = props.initial_value;

let new_labels = ["Initial"];
let new_data = [current_balance];

for (const transaction of copy) {
	current_balance += transaction.amount;

	new_labels.push(
		formatDateMonthName(transaction.date) + "\n" +
		transaction.amount.toFixed(2) + " " + transaction.currency + "\n" +
		transaction.other_party + "\n" +
		transaction.message
	);

	new_data.push(current_balance);
}

labels.value = new_labels;
data.value = new_data;

// Detect from CSS
const isDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => isDarkMode.value = e.matches);

const chartData = ref<ChartData<"line">>({
	labels: labels.value,
	datasets: [
		{
			label: 'Kontostand',
			backgroundColor: 'orange',
			data: data.value,
			borderColor: '#ccc',
			borderDash: [5, 5],
		},
	]
});


const chartOptions: ChartOptions<'line'> | any = ref({
	responsive: true,
	resizeDelay: 0,
	color: isDarkMode.value ? '#fff' : '#333',
	legend: {
		display: false,
	},
	scales: {
		// Remove the text below chart
		x: {
			display: false
		}
	}
});

watch(() => isDarkMode.value, (newVal) => {
	chartOptions.color = newVal ? '#fff' : '#333'
})

</script>

<template>
	<div class="chart">
		<Line :options="chartOptions" :data="(chartData as unknown as any)" />
	</div>
</template>

<style scoped>
.chart {
	position: relative;
	width: 100%;
	background-color: #ffffff;
}

@media (prefers-color-scheme: dark) {
	.chart {
		background-color: #333;
	}
}
</style>
