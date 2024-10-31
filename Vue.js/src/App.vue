<template>
  <div id="app">
    <h1>Jurnal API - Sales Invoices</h1>
    <input v-model="invoiceId" placeholder="Enter Invoice ID" />
    <button @click="getSalesInvoice">Get Sales Invoice</button>
    <div v-if="invoiceData">
      <h2>Invoice Data:</h2>
      <pre>{{ invoiceData }}</pre>
    </div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      invoiceId: '',
      invoiceData: null,
      error: null,
    };
  },
  methods: {
    async getSalesInvoice() {
      this.error = null;
      this.invoiceData = null;
      try {
        const response = await axios.get(`http://localhost:3000/api/sales-invoices/${this.invoiceId}`);
        this.invoiceData = response.data;
      } catch (error) {
        this.error = error.response ? error.response.data.error : 'Error fetching data';
      }
    },
  },
};
</script>

<style>
#app {
  text-align: center;
  margin-top: 20px;
}
</style>
