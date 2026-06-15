<script setup>
  import { computed, ref } from 'vue';
  import {
    CurrencyYenIcon as YenIcon,
    CurrencyEuroIcon as EuroIcon,
  } from '@heroicons/vue/24/outline';
  import { invalidInputs } from '../constants.js';
  const yenNotEuro = ref(false);
  const currencySymbol = computed(() => {
    if (yenNotEuro.value) return '¥';
    else return '€';
  });
  const figurePrice = ref(null);
  const shippingCost = ref(null);
  const vatPercentage = ref(19);
  const taxPercentage = ref(5);
  const dhlFeeAdded = ref(false);
  const dhlFeeAmount = ref(7);
  const yenEuroCourse = ref(0.0054);

  function euroToYen(euro) {
    return Math.round(euro / yenEuroCourse.value);
  }
  function yenToEuro(yen) {
    return Math.round(yen * yenEuroCourse.value * 100) / 100;
  }
  function switchCurrency() {
    if (yenNotEuro.value) {
      if (figurePrice.value) {
        figurePrice.value = yenToEuro(figurePrice.value);
      }
      if (shippingCost.value) {
        shippingCost.value = yenToEuro(shippingCost.value);
      }
      dhlFeeAmount.value = yenToEuro(dhlFeeAmount.value);
    } else {
      if (figurePrice.value) {
        figurePrice.value = euroToYen(figurePrice.value);
      }
      if (shippingCost.value) {
        shippingCost.value = euroToYen(shippingCost.value);
      }
      dhlFeeAmount.value = euroToYen(dhlFeeAmount.value);
    }
    yenNotEuro.value = !yenNotEuro.value;
  }
  const totalCost = computed(() => {
    if (!figurePrice.value || !shippingCost.value) return '';
    totalCost.value = figurePrice.value;
    const vatAndTax = Math.round(
      ((parseFloat(figurePrice.value) + parseFloat(shippingCost.value)) *
        (parseFloat(taxPercentage.value) + parseFloat(vatPercentage.value))) /
        100
    );
    let total = Math.round(
      vatAndTax + (parseFloat(figurePrice.value) + parseFloat(shippingCost.value))
    );

    let dhlFeeText = '';
    let dhlTotalFeeText = '';
    if (dhlFeeAdded.value) {
      total += dhlFeeAmount.value;
      dhlFeeText = ' + ' + dhlFeeAmount.value + '€ (DHL customs processing fee)';
      let totalFee = dhlFeeAmount.value + vatAndTax;
      dhlTotalFeeText = ' (' + totalFee + '€ paid to DHL at the door)';
    }
    return (
      total +
      ' ' +
      currencySymbol.value +
      ' (Total) [includes ' +
      vatAndTax +
      ' ' +
      currencySymbol.value +
      ' (VAT + import tax)' +
      dhlFeeText +
      ']' +
      dhlTotalFeeText
    );
  });
</script>
<template>
  <div class="font-bold">Total cost calculator</div>
  <div class="mb-4">
    <span class="text-xs">Currency: </span>
    <EuroIcon class="size-5 inline" />
    <input
      type="checkbox"
      class="toggle toggle-sm"
      @click="switchCurrency()"
      :checked="yenNotEuro.value"
    />
    <YenIcon class="size-5 inline" />
    <p class="label text-xs mx-2"> (at exchange rate {{ yenEuroCourse }})</p>
    <label class="ml-4 label font-bold text-xs text-primary-content">
      <input type="checkbox" checked="checked" class="checkbox-xs" v-model="dhlFeeAdded" />
      DHL fee ({{ dhlFeeAmount + currencySymbol }})?
    </label>
  </div>

  <div class="flex gap-2">
    <div>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Figure Price ({{ currencySymbol }})</legend>
        <input type="text" placeholder="0" class="input w-30" v-model="figurePrice" />
        <p class="label"></p>
      </fieldset>
    </div>
    <div>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Shipping Price ({{ currencySymbol }})</legend>
        <input type="text" placeholder="0" class="input w-30" v-model="shippingCost" />
        <p class="label">
          <a href="https://www.remambo.jp/help/calc.html" target="_blank" class="link text-xs"
            >Shipping calculator</a
          >
        </p>
      </fieldset>
    </div>
    <div>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">VAT (%)</legend>
        <input type="text" placeholder="0" class="input w-15" v-model="vatPercentage" />
        <p class="label"></p>
      </fieldset>
    </div>
    <div>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Customs Tax (%)</legend>
        <input type="text" placeholder="0" class="input w-15" v-model="taxPercentage" />
        <p class="label"></p>
      </fieldset>
    </div>
  </div>

  <div class="max-w-100">{{ totalCost }}</div>
</template>

<style scoped></style>
