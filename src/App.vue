<template>
  <RouterView v-slot="{ Component }">
    <Transition :name="transitionName">
      <KeepAlive max="10" :include="includes">
        <Component class="view-wrap" :is="Component" :key="componentKey" @reset="handleReset" />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<script setup lang="ts">
  import { useKeepAlive, useTransitionName } from '@daysnap/vue-use'

  const { includes, keepAliveList } = useKeepAlive(310)

  const route = useRoute()
  const componentKey = computed(() => {
    if (route.path.includes(':')) {
      return route.fullPath
    }
    return
  })

  const handleReset = () => {
    includes.value = []
    keepAliveList.value = []
  }

  const transitionName = useTransitionName({
    enterClass: 'slide-plus-left',
    leaveClass: 'slide-plus-right',
  })
</script>

<style lang="scss">
  @use '@/assets/scss/global.scss' as *;

  .view-wrap {
    @extend %pa;
    @extend %t0;
    @extend %l0;
    @extend %w100;
    @extend %h100;
    @extend %bsb;
    @extend %oya;
    background-color: $bg-color;
    &.is-white {
      background-color: #fff;
    }
    &.is-fullscreen {
      @extend %oh;
    }
    &.is-pt {
      padding-top: j(10);
    }
    &.is-pb {
      padding-bottom: j(120);
    }
    &.is-nav-white {
      --van-nav-bar-icon-color: #fff;
      --van-nav-bar-title-text-color: #fff;
    }
    &.is-nav-transparent {
      .van-nav-bar {
        @extend %dan;
        background-color: transparent;
      }
    }
    &.is-no-border {
      .van-nav-bar {
        @extend %dan;
      }
    }
    &.is-search-navbar {
      .van-nav-bar__title {
        max-width: 281px;
        width: 281px;
      }
    }
    &.is-search-full-navbar {
      .van-nav-bar__title {
        font-weight: normal;
        max-width: 100%;
        width: 100%;
        .van-search {
          padding: 0 0 0 12px;
        }
        .van-search__action {
          padding: 0 14px;
        }
      }
      .van-nav-bar__left,
      .van-nav-bar__right {
        display: none;
      }
    }
  }
  .c-bar {
    height: j(10);
  }
</style>
