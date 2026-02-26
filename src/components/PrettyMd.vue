<script setup></script>

<template>
  <div class="heart-frame m-4 bg-base-100">
    <!-- top left -->
    <div
      src="/1.png"
      class="heart tl bg-base-100 rounded-xl mask-linear-45 mask-linear-from-65% mask-linear-to-75%"
    >
      <img src="/1.png" />
    </div>

    <!-- top right -->
    <div
      src="/1.png"
      class="heart tr bg-base-100 rounded-xl mask-linear-45 mask-linear-from-65% mask-linear-to-75%"
    >
      <img src="/1.png" />
    </div>

    <!-- bottom left -->
    <div
      src="/1.png"
      class="heart bl bg-base-100 rounded-xl mask-linear-45 mask-linear-from-65% mask-linear-to-75%"
    >
      <img src="/1.png" />
    </div>

    <!-- bottom right -->
    <div
      src="/1.png"
      class="heart br bg-base-100 rounded-xl mask-linear-45 mask-linear-from-65% mask-linear-to-75%"
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
    border: 4px solid var(--color-deathpink);
    border-radius: 16px;
    padding: 1.5rem;
    width: fit-content;
  }

  .inner {
    position: relative;
    z-index: 2;
  }

  /* heart base style */
  .heart {
    width: 3rem;
    height: 3rem;
    position: absolute;
    z-index: 1;
    transform-origin: center;
    user-select: none;
    pointer-events: none;
  }

  /* corner placements and flipping */
  .tl {
    top: -19px;
    left: -19px;
    transform: scaleX(-1);
  }
  .tr {
    top: -19px;
    right: -19px;
  }
  .bl {
    bottom: -19px;
    left: -19px;
    transform: scaleY(-1) scaleX(-1);
  }
  .br {
    bottom: -19px;
    right: -19px;
    transform: scaleY(-1);
  }
</style>
