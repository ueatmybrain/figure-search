<script setup>
  import PrettyMd from '../components/PrettyMd.vue';
  import FigureSearch from '../components/FigureSearch.vue';
  import ListViewSelector from '../components/ListViewSelector.vue';
  import PrettySm from '../components/PrettySm.vue';
  import {
    ChevronDoubleRightIcon as ChevronR,
    ChevronDoubleLeftIcon as ChevronL,
  } from '@heroicons/vue/24/outline';
  import SideMenu from '../components/SideMenu.vue';
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <SideMenu class="fixed z-50 right-0"></SideMenu>
      <label
        for="my-drawer-4"
        aria-label="open sidebar"
        class="btn btn-ghost hover:bg-base-400 h-full fixed"
      >
        <ChevronR class="size-5" />
      </label>
      <div class="mx-auto flex flex-row mt-2">
        <FigureSearch class="mx-auto"></FigureSearch>
      </div>
    </div>

    <div class="drawer-side">
      <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
      <div
        class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-28 is-drawer-open:w-auto"
      >
        <ListViewSelector></ListViewSelector>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
