<script setup>
  import { InformationCircleIcon } from '@heroicons/vue/24/outline';
  import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
  import { XCircleIcon } from '@heroicons/vue/24/outline';
  import { CheckCircleIcon } from '@heroicons/vue/24/outline';
  import { useAlertsStore } from '../stores/alerts.js';
  import PrettySm from './PrettySm.vue';

  const alerts = useAlertsStore();

  const typeConfig = {
    warning: {
      type: 'alert-warning',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-warning',
    },
    error: {
      type: 'alert-error',
      icon: XCircleIcon,
      iconColor: 'text-red-500',
    },
    success: {
      type: 'alert-success',
      icon: CheckCircleIcon,
      iconColor: 'text-success',
    },
    info: {
      type: 'alert-info',
      icon: InformationCircleIcon,
      iconColor: 'text-info',
    },
  };

  function getTypeConfig(type) {
    return typeConfig[type] || typeConfig.info;
  }
</script>

<template>
  <div
    class="h-[100vh] w-110 flex flex-col-reverse overflow-y-auto gap-2 pb-4 no-scrollbar fade-top-to-bottom"
    :class="{ 'fade-top-to-bottom': alerts.queue.length >= 6 }"
  >
    <transition-group name="fade" tag="div" class="space-y-2">
      <PrettySm
        :key="alert"
        v-for="alert in alerts.queue"
        role="alert"
        class="alert bg-base-200 mx-auto mt-4"
      >
        <div class="p-4 flex flex-row gap-4">
          <component
            :is="getTypeConfig(alert.type).icon"
            class="size-7 shrink-0"
            :class="getTypeConfig(alert.type).iconColor"
          />
          <span class="w-78 text">{{ alert.message }}</span>
        </div>
      </PrettySm>
    </transition-group>
  </div>
</template>

<style scoped>
  .alert {
    display: flex;
    z-index: 10;
    padding: 0.75rem 1rem;
  }

  .fade-top-to-bottom {
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 1) 70%,
      rgba(0, 0, 0, 1) 100%
    );
    mask-size: 100% 100%;
  }
</style>
