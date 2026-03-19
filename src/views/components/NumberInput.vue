<template>
  <div class="number-input">
    <VanButton
      class="number-input-btn"
      icon="minus"
      :disabled="isMin"
      @click="handleClick('minus')"
      @mousedown="startPress('minus')"
      @mouseup="stopPress"
      @mouseleave="stopPress"
      @touchstart.passive="startPress('minus')"
      @touchend="stopPress"
      @touchcancel="stopPress"
    />
    <VroInput
      class="number-input-input"
      type="decimal"
      :model-value="modelValue"
      :max="max"
      :min="min"
      :auto-fix="true"
      :precision="precision"
      @update:model-value="handleInput"
    />
    <VanButton
      class="number-input-btn"
      icon="plus"
      :disabled="isMax"
      @click="handleClick('plus')"
      @mousedown="startPress('plus')"
      @mouseup="stopPress"
      @mouseleave="stopPress"
      @touchstart.passive="startPress('plus')"
      @touchend="stopPress"
      @touchcancel="stopPress"
    />
  </div>
</template>

<script setup lang="ts">
  import { sounds } from '@/utils'

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
  }>()

  const props = defineProps({
    modelValue: {
      type: Number,
      default: 0,
    },
    step: {
      type: Number,
      default: 1,
    },
    min: {
      type: Number,
      default: Number.MIN_SAFE_INTEGER,
    },
    max: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER,
    },
    precision: {
      type: Number,
      default: 2,
    },
  })

  const scale = computed(() => {
    const p = Math.max(0, props.precision)
    return 10 ** p
  })
  const normalizedModelValue = computed(() => {
    if (!Number.isFinite(props.modelValue)) {
      return 0
    }
    return props.modelValue
  })
  const round = (value: number) => {
    return Math.round(value * scale.value) / scale.value
  }
  const clamp = (value: number) => {
    return Math.min(props.max, Math.max(props.min, round(value)))
  }
  const updateValue = (value: number) => {
    emit('update:modelValue', clamp(value))
  }
  const isMin = computed(() => {
    return round(normalizedModelValue.value) <= round(props.min)
  })
  const isMax = computed(() => {
    return round(normalizedModelValue.value) >= round(props.max)
  })

  const LONG_PRESS_DELAY = 500
  const LONG_PRESS_INTERVAL = 80
  const pressType = ref<'minus' | 'plus' | null>(null)
  const pressStarted = ref(false)
  let pressTimeout: ReturnType<typeof setTimeout> | null = null
  let pressInterval: ReturnType<typeof setInterval> | null = null

  const stepBy = (type: 'minus' | 'plus') => {
    if (type === 'minus' && isMin.value) {
      return
    }
    if (type === 'plus' && isMax.value) {
      return
    }
    const offset = type === 'minus' ? -props.step : props.step
    updateValue(normalizedModelValue.value + offset)
  }

  const stopPress = () => {
    if (pressTimeout) {
      clearTimeout(pressTimeout)
      pressTimeout = null
    }
    if (pressInterval) {
      clearInterval(pressInterval)
      pressInterval = null
    }
    pressType.value = null
  }

  const startPress = (type: 'minus' | 'plus') => {
    if ((type === 'minus' && isMin.value) || (type === 'plus' && isMax.value)) {
      return
    }
    stopPress()
    pressType.value = type
    pressStarted.value = false
    pressTimeout = setTimeout(() => {
      pressStarted.value = true
      stepBy(type)
      pressInterval = setInterval(() => {
        sounds.click()
        stepBy(type)
      }, LONG_PRESS_INTERVAL)
    }, LONG_PRESS_DELAY)
  }

  const handleClick = (type: 'minus' | 'plus') => {
    if (pressStarted.value && pressType.value === type) {
      pressStarted.value = false
      return
    }
    sounds.click()
    stepBy(type)
  }

  const handleInput = (value: string | number) => {
    if (value === '' || value === '-' || value === '.' || value === '-.') {
      return
    }

    const nextValue = Number(value)
    if (!Number.isFinite(nextValue)) {
      return
    }
    updateValue(nextValue)
  }

  onBeforeUnmount(stopPress)
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;

  .number-input {
    display: flex;
    align-items: center;
    padding: 3px;
    border: 1px solid #dbe4ee;
    border-radius: 999px;
    background-color: #f7fafc;
    gap: 4px;
  }

  .number-input-btn {
    width: 30px;
    padding: 0;
    height: 30px;
    border: 1px solid #dbe4ee;
    border-radius: 50%;
    background-color: #fff;
    color: $color-primary;
    flex-shrink: 0;
    transition:
      transform 0.12s ease,
      background-color 0.2s ease,
      opacity 0.2s ease;
  }

  .number-input-btn:active {
    transform: scale(0.94);
    background-color: #eef6f4;
  }

  .number-input-btn:disabled {
    opacity: 0.45;
  }

  .number-input-btn :deep(.van-icon) {
    font-size: 14px;
    font-weight: 700;
  }

  .number-input-input {
    flex: 1;
    min-width: 0;
    height: 30px;
    padding: 0 6px;
    border: none;
    border-radius: 999px;
    background-color: transparent;
    color: #1d2129;
    font-size: 15px;
    font-weight: 600;
    line-height: 30px;
    text-align: center;
    font-variant-numeric: tabular-nums;
    outline: none;
  }

  .number-input-input:focus {
    background-color: #fff;
    box-shadow: inset 0 0 0 1px $color-primary;
  }
</style>
