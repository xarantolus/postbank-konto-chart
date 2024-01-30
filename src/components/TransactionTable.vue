<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { AccountData, Payment } from '../parse_csv'
import type { Header, Item } from "vue3-easy-data-table";
import EasyDataTable from "vue3-easy-data-table"
import { formatDateBasic } from '../util';
import Balance from './Balance.vue';

defineProps<{ transactions: Payment[] }>()

const headers: Header[] = [
	{ value: 'date', text: 'Datum', sortable: true },
	{ value: 'amount', text: 'Betrag', sortable: true },
	{ value: 'message', text: 'Verwendungszweck' },
	{ value: 'other_party', text: 'Andere Partei' },
	{ value: 'type', text: 'Typ' },
]
</script>


<template>
	<EasyDataTable :headers="headers" :items="transactions">
		<template #item-date="{ date }">
			{{ formatDateBasic(date) }}
		</template>
		<template #item-amount="{ amount }">
			<Balance :value="amount" />
		</template>
	</EasyDataTable>
</template>


<style>
@import "vue3-easy-data-table/dist/style.css";

th {
	text-align: left;
	padding-right: 1em;
	font-weight: bold;
}
</style>

<style>
:root {
	--easy-table-border: 1px solid #e0e0e0;
	--easy-table-row-border: 1px solid #e0e0e0;
	--easy-table-header-font-color: #373737;
	--easy-table-header-background-color: #fff;
	--easy-table-body-row-font-color: #212121;
	--easy-table-body-row-background-color: #fff;
	--easy-table-body-row-hover-font-color: #212121;
	--easy-table-body-row-hover-background-color: #eee;
	--easy-table-body-even-row-font-color: #373737;
	--easy-table-body-even-row-background-color: #fff;
	--easy-table-footer-background-color: #fff;
	--easy-table-footer-font-color: #212121;
	--easy-table-message-font-color: #212121;
	--easy-table-loading-mask-background-color: #fff;
	--easy-table-scrollbar-track-color: #fff;
	--easy-table-scrollbar-color: #fff;
	--easy-table-scrollbar-thumb-color: #c1c1c1;
	--easy-table-scrollbar-corner-color: #fff;
	--easy-table-buttons-pagination-border: 1px solid #e0e0e0;
}

@media (prefers-color-scheme: dark) {
    :root {
        --easy-table-border: 1px solid #0b0b0b;
        --easy-table-row-border: 1px solid #0b0b0b;
        --easy-table-header-font-color: #fff;
        --easy-table-header-background-color: #333333;
        --easy-table-body-row-font-color: #fff;
        --easy-table-body-row-background-color: #333333;
        --easy-table-body-row-hover-font-color: #fff;
        --easy-table-body-row-hover-background-color: #505050;
        --easy-table-body-even-row-font-color: #fff;
        --easy-table-body-even-row-background-color: #333333;
        --easy-table-footer-background-color: #333333;
        --easy-table-footer-font-color: #fff;
        --easy-table-message-font-color: #fff;
        --easy-table-loading-mask-background-color: #333333;
        --easy-table-scrollbar-track-color: #333333;
        --easy-table-scrollbar-color: #333333;
        --easy-table-scrollbar-thumb-color: #505050;
        --easy-table-scrollbar-corner-color: #333333;
        --easy-table-buttons-pagination-border: 1px solid #0b0b0b;
    }
}

</style>
