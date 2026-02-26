<script setup></script>

<template>
  <div class="heart-frame m-1 bg-base-100">
    <!-- top left -->
    <div
      src="/1.png"
      class="heart tl bg-base-100 rounded-lg mask-linear-45 mask-linear-from-65% mask-linear-to-75%"
    >
      <img src="/1.png" />
    </div>

    <!-- top right -->
    <div
      src="/1.png"
      class="heart tr bg-base-100 rounded-lg mask-linear-45 mask-linear-from-65% mask-linear-to-75%"
    >
      <img src="/1.png" />
    </div>

    <!-- bottom left -->
    <div
      src="/1.png"
      class="heart bl bg-base-100 rounded-lg mask-linear-45 mask-linear-from-65% mask-linear-to-75%"
    >
      <img src="/1.png" />
    </div>

    <!-- bottom right -->
    <div
      src="/1.png"
      class="heart br bg-base-100 rounded-lg mask-linear-45 mask-linear-from-65% mask-linear-to-75%"
    >
      <img src="/1.png" />
    </div>

    <!-- slot content -->
    <div class="inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .heart-frame {
    position: relative;
    display: block;
    border: 2px solid var(--color-deathpink);
    border-radius: 8px;
    padding: 0.2rem;
    width: fit-content;
  }

  .inner {
    position: relative;
    z-index: 2;
  }

  /* heart base style */
  .heart {
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
    z-index: 1;
    transform-origin: center;
    user-select: none;
    pointer-events: none;
  }

  /* corner placements and flipping */
  .tl {
    top: -10px;
    left: -10px;
    transform: scaleX(-1);
  }
  .tr {
    top: -10px;
    right: -10px;
  }
  .bl {
    bottom: -10px;
    left: -10px;
    transform: scaleY(-1) scaleX(-1);
  }
  .br {
    bottom: -10px;
    right: -10px;
    transform: scaleY(-1);
  }
</style>
