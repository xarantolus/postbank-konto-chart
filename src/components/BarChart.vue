<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartData, ChartOptions } from 'chart.js'
import { ref, defineProps, watch } from 'vue'
import { AccountData, Payment } from '../parse_csv'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{ transactions: Payment[], start_date: Date, end_date: Date }>();

const labels = ref<string[]>([]);
const data = ref<number[]>([]);

const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

let last_month = -1;
let last_year = -1;

let new_data = [];
let new_labels = [];

let copy = props.transactions.slice().sort((a, b) => a.date.getTime() - b.date.getTime());

for (const transaction of copy) {
	const month = transaction.date.getMonth();
	const year = transaction.date.getFullYear();

	if (last_month !== month || last_year !== year) {
		new_labels.push(`${months[month]} ${year}`);
		new_data.push(transaction.amount);
	} else {
		new_data[new_data.length - 1] += transaction.amount;
	}

	last_month = month;
	last_year = year;
}


labels.value = new_labels;
data.value = new_data;


const chartData: ChartData<"bar"> = {
	labels: labels.value,
	datasets: [
		{
			label: 'Umsatz',
			backgroundColor: data.value.map(sum => sum >= 0 ? '#33ff33' : '#ff3333'),
			data: data.value,
		},
	],
};


// Detect from CSS
const isDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => isDarkMode.value = e.matches);

const chartOptions: ChartOptions<'bar'> | any = ref({
	responsive: true,
	resizeDelay: 0,
	color: isDarkMode.value ? '#fff' : '#333',
});

watch(() => isDarkMode.value, (newVal) => {
	chartOptions.color = newVal ? '#fff' : '#333'
})

</script>

<template>
	<div class="chart">
		<Bar :options="chartOptions" :data="chartData" />
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
