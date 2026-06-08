<script setup>
  import { BanknotesIcon } from '@heroicons/vue/24/solid';
  import { computed, ref } from 'vue';
  import { CurrencyYenIcon as YenIcon, CurrencyEuroIcon as EuroIcon} from '@heroicons/vue/24/outline';
  const yenNotEuro = ref(false);
  const currencySymbol = computed(() => {
    if (yenNotEuro.value) return '¥';
    else return '€';
  });
  const figurePrice = ref(null);
  const shippingCost = ref(null);
  const vatPercentage = ref(19);
  const taxPercentage = ref(5);
  const totalCost = computed(() => {
    if (!figurePrice.value || !shippingCost.value) return 'N/A';
    totalCost.value = figurePrice.value;
    const vatAndTax =
      ((parseFloat(figurePrice.value) + parseFloat(shippingCost.value)) *
        (parseFloat(taxPercentage.value) + parseFloat(vatPercentage.value))) /
      100;
    const total = vatAndTax + (parseFloat(figurePrice.value) + parseFloat(shippingCost.value));
    return (
      vatAndTax +
      ' ' +
      currencySymbol.value +
      '(VAT + Tax) ' +
      total +
      ' ' +
      currencySymbol.value +
      ' (Total)'
    );
  });
</script>

<template>
  <input type="checkbox" />
  <div class="collapse-title text-xs">
    <BanknotesIcon class="size-5 inline" />
    Total cost calculator
  </div>
  <div class="collapse-content text-sm">
    <div class="mb-4">
      Currency:
      <EuroIcon class="size-5 inline" />
      <input type="checkbox" class="toggle toggle-sm" v-model="yenNotEuro" />
      <YenIcon class="size-5 inline" />
    </div>

    <div class="flex gap-2">
      <div>
        <input type="text" placeholder="figure" class="input w-30" v-model="figurePrice" /><span>{{
          currencySymbol
        }}</span>
      </div>
      <div>
        <input
          type="text"
          placeholder="shipping"
          class="input w-30"
          v-model="shippingCost"
        /><span>{{ currencySymbol }}</span>
      </div>
      <div><input type="text" placeholder="VAT" class="input w-15" v-model="vatPercentage" />%</div>
      <div><input type="text" placeholder="tax" class="input w-15" v-model="taxPercentage" />%</div>
    </div>

    <a href="https://www.remambo.jp/help/calc.html" class="link">Shipping calculator</a>

    <div>{{ totalCost }}</div>
  </div>
</template>

<style scoped></style>
