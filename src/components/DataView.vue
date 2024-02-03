<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { FinancialData } from '../parse_csv'
import AccountData from './AccountData.vue';
import { formatDateMonthName, formatDateBasic } from '../util';
import Balance from './Balance.vue';
import TransactionTable from './TransactionTable.vue';
import BarChart from './BarChart.vue';
import LineChart from './LineChart.vue';

defineProps<{ data: FinancialData }>()
</script>

<template>
  <h1>Kontodaten</h1>
  <AccountData :data="data.account" :initial_balance="data.initial_balance" :final_balance="data.final_balance" />

  <h2>Monatsübersicht</h2>
  <p>Umsätze vom {{ formatDateMonthName(data.start_date) }} zum {{ formatDateMonthName(data.end_date) }}</p>
  <BarChart :transactions="data.payments" :start_date="data.start_date" :end_date="data.end_date" />

  <h2>Verlauf</h2>
  <LineChart :transactions="data.payments" :initial_value="data.initial_balance" />

  <h2>Tabelle</h2>
  <TransactionTable :transactions="data.payments" />
</template>

<style scoped>
th {
  text-align: left;
  padding-right: 1em;
  font-weight: bold;
}

td {
  padding-right: 1em;
}

td.align-right {
  text-align: right;
  white-space: nowrap;
}
</style>

