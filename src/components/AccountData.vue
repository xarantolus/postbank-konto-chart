<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { AccountData } from '../parse_csv'
import Balance from './Balance.vue';

defineProps<{ data: AccountData, initial_balance: number, final_balance: number }>()
</script>


<template>
	<table>
		<tbody>
			<tr>
				<th>Name</th>
				<td>{{ data.name }}</td>
			</tr>
			<tr>
				<th>Kontonummer</th>
				<td>{{ data.account_number }}</td>
			</tr>
			<tr>
				<th>IBAN</th>
				<td>{{ data.iban }}</td>
			</tr>
			<tr>
				<th>Initialer Kontostand</th>
				<td><Balance :value="initial_balance" :currency="data.currency" /></td>
			</tr>
			<tr>
				<th>Endgültiger Kontostand</th>
				<td><Balance :value="final_balance" :currency="data.currency" /></td>
			</tr>
		</tbody>
	</table>
</template>


<style scoped>
th {
  text-align: left;
  padding-right: 1em;
  font-weight: bold;
}
</style>
