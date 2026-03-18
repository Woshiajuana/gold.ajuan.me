<template>
  <input
    class="vro-input"
    v-bind="dynamicProps"
    :value="modelValue"
    @compositionstart="handleCompositionstart"
    @compositionend="handleCompositionend"
    @input="handleInput"
    @focus="$emit('focus', $event)"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
  import { isNumber, omit, parseDecimalString, parseNumberString } from '@daysnap/utils'
  import { useComposition } from '@daysnap/vue-use'
  import { type HTMLAttributes, type InputTypeHTMLAttribute, type PropType } from 'vue'

  defineOptions({ name: 'VroInput' })
  const props = defineProps({
    /**
     * 类型：扩展了 decimal 类型
     * @default text
     */
    type: {
      type: String as PropType<InputTypeHTMLAttribute | 'decimal'>,
      default: 'text',
    },
    modelValue: {
      type: [String, Number, Object] as PropType<string | number | null | undefined>,
      default: '',
    },
    /**
     * 最大值：仅当 type 为 decimal 有效
     * @default Number.MAX_SAFE_INTEGER
     */
    max: {
      type: [String, Number],
      default: Number.MAX_SAFE_INTEGER,
    },
    /**
     * 最小值：仅当 type 为 decimal 有效
     * @default Number.MIN_SAFE_INTEGER
     */
    min: {
      type: [String, Number],
      default: Number.MIN_SAFE_INTEGER,
    },
    /**
     * 输入的值如果超过最大值或小于最小值，是否自动修正：仅当 type 为 decimal 有效
     * @default false
     */
    autoFix: Boolean,
    maxlength: [String, Number],
    placeholder: String,
    disabled: Boolean,
    /**
     * 精确度：仅当 type 为 decimal 有效
     * @default 2
     */
    precision: {
      type: [String, Number],
      default: 2,
    },

    /**
     * 扩展
     */
    pattern: Function as PropType<(value: string, preValue: string) => string>,

    id: String,
    name: String,
    readonly: Boolean,
    inputmode: String as PropType<HTMLAttributes['inputmode']>,
  })
  const emit = defineEmits(['update:model-value', 'change', 'focus', 'blur'])

  const dynamicProps = computed(() => {
    // eslint-disable-next-line prefer-const
    let { type, inputmode, ...rest } = props

    if (type === 'decimal') {
      type = 'text'
      inputmode = 'decimal'
    } else if (type === 'number') {
      type = 'tel'
      inputmode = 'numeric'
    }

    const id = props.id ?? useId()

    return {
      ...omit(rest, ['pattern', 'modelValue', 'precision', 'max', 'min']),
      id,
      type,
      inputmode,
    }
  })

  const { handleCompositionstart, handleCompositionend } = useComposition()

  const handleBlur = (e: FocusEvent) => {
    const { type, modelValue } = props
    if (type === 'decimal') {
      const v = modelValue?.toString() ?? ''
      if (v === '-') {
        // 修复只输入 - 的情况
        emit('update:model-value', '')
      } else if (v.endsWith('.')) {
        // 修复末尾只输入.的情况
        emit('update:model-value', v.substring(0, v.length - 1))
      } else if (+v === 0) {
        // 修复 -0、-0.0 这种情况
        emit('update:model-value', '0')
      }
    }
    emit('blur', e)
  }

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    if ((target as any)?.composing) {
      return
    }

    const { type, precision, min, max, pattern, modelValue, autoFix } = props
    let value = target.value

    if (type === 'number') {
      value = parseNumberString(value)
    } else if (type === 'decimal') {
      value = parseDecimalString(value, { precision: +precision, allowNegativeNumber: +min < 0 })

      if (+value < +min || +value > +max) {
        if (autoFix) {
          if (+value < +min) {
            value = min.toString()
          } else if (+value > +max) {
            value = max.toString()
          }
        } else {
          value = modelValue?.toString() ?? ''
        }
      }
    }

    if (pattern) {
      value = pattern(value, isNumber(modelValue) ? modelValue.toString() : (modelValue ?? ''))
    }

    if (target.value !== value) {
      target.value = value
    }

    emit('update:model-value', value)
    emit('change', value)
  }
</script>
