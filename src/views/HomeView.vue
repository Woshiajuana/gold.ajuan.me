<template>
  <div class="home-wrap">
    <header class="header-section">
      <img src="@/assets/images/logo.png" alt="logo" />
      <h1>黄金成本价计算器</h1>
    </header>

    <section class="result-card">
      <div class="result-title">计算结果</div>
      <div class="result-main">
        <div class="result-label">加仓后均价</div>
        <div class="result-value">{{ formatMoney(result.nextAvgPrice) }}</div>
      </div>
      <div class="result-grid">
        <div class="result-item">
          <div class="result-item-label">新增投入</div>
          <div class="result-item-value">{{ formatMoney(result.buyCost) }}</div>
        </div>
        <div class="result-item">
          <div class="result-item-label">总持仓克重</div>
          <div class="result-item-value">{{ formatWeight(result.totalWeight) }}</div>
        </div>
      </div>
      <div class="result-tip" :class="{ up: result.delta > 0, down: result.delta < 0 }">
        均价变化 {{ formatDelta(result.delta) }}
      </div>
    </section>

    <section class="panel">
      <div class="field-item">
        <div class="field-label">当前金价</div>
        <NumberInput v-model="form.price" :min="0" :step="0.01" :precision="2" />
        <div class="field-unit">元/克</div>
      </div>

      <div class="field-item">
        <div class="field-label">准备加仓</div>
        <NumberInput v-model="form.buyWeight" :min="0" :step="0.1" :precision="2" />
        <div class="field-unit">克</div>
      </div>

      <div class="field-item">
        <div class="field-label">当前持仓均价</div>
        <NumberInput v-model="form.currentAvgPrice" :min="0" :step="0.01" :precision="2" />
        <div class="field-unit">元/克</div>
      </div>

      <div class="field-item">
        <div class="field-label">当前持仓克重</div>
        <NumberInput v-model="form.currentWeight" :min="0" :step="0.1" :precision="2" />
        <div class="field-unit">克</div>
      </div>
    </section>

    <section class="action-bar">
      <VanButton class="save-btn" type="primary" block @click="handleSave">保存当前参数</VanButton>
      <VanButton class="reset-btn" @click="handleReset">重置</VanButton>
      <div class="save-time" v-if="savedAtText">上次保存：{{ savedAtText }}</div>
    </section>

    <footer class="footer-info">
      <div class="copyright">© {{ currentYear }} 黄金成本价计算器</div>
      <div class="risk-tip">温馨提示：投资有风险，入市需谨慎.</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import NumberInput from './components/NumberInput.vue'

  const form = reactive({
    price: 0,
    buyWeight: 0,
    currentAvgPrice: 0,
    currentWeight: 0,
  })
  const STORAGE_KEY = 'gold-calculator-form-v1'
  const STORAGE_TIME_KEY = 'gold-calculator-form-time-v1'
  const savedAtText = ref('')
  const currentYear = new Date().getFullYear()

  const round = (value: number, precision = 2) => {
    const scale = 10 ** precision
    return Math.round(value * scale) / scale
  }

  const result = computed(() => {
    const totalWeight = form.currentWeight + form.buyWeight
    const buyCost = form.price * form.buyWeight
    const totalCost = form.currentAvgPrice * form.currentWeight + buyCost
    const nextAvgPrice = totalWeight === 0 ? 0 : totalCost / totalWeight
    const delta = nextAvgPrice - form.currentAvgPrice

    return {
      buyCost: round(buyCost),
      totalWeight: round(totalWeight, 3),
      nextAvgPrice: round(nextAvgPrice),
      delta: round(delta),
    }
  })

  const formatMoney = (value: number) => {
    return `${value.toFixed(2)} 元/克`
  }
  const formatWeight = (value: number) => {
    return `${value.toFixed(3)} 克`
  }
  const formatDelta = (value: number) => {
    const prefix = value > 0 ? '+' : ''
    return `${prefix}${value.toFixed(2)} 元/克`
  }

  const formatSaveTime = (value: string) => {
    const time = Number(value)
    if (!Number.isFinite(time) || time <= 0) {
      return ''
    }
    const date = new Date(time)
    const yyyy = date.getFullYear()
    const MM = `${date.getMonth() + 1}`.padStart(2, '0')
    const dd = `${date.getDate()}`.padStart(2, '0')
    const hh = `${date.getHours()}`.padStart(2, '0')
    const mm = `${date.getMinutes()}`.padStart(2, '0')
    return `${yyyy}-${MM}-${dd} ${hh}:${mm}`
  }

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
      const time = `${Date.now()}`
      localStorage.setItem(STORAGE_TIME_KEY, time)
      savedAtText.value = formatSaveTime(time)
    } catch {}
  }

  const handleReset = () => {
    form.price = 0
    form.buyWeight = 0
    form.currentAvgPrice = 0
    form.currentWeight = 0
  }

  onMounted(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (typeof parsed?.price === 'number') form.price = parsed.price
        if (typeof parsed?.buyWeight === 'number') form.buyWeight = parsed.buyWeight
        if (typeof parsed?.currentAvgPrice === 'number')
          form.currentAvgPrice = parsed.currentAvgPrice
        if (typeof parsed?.currentWeight === 'number') form.currentWeight = parsed.currentWeight
      }

      const savedTime = localStorage.getItem(STORAGE_TIME_KEY) ?? ''
      savedAtText.value = formatSaveTime(savedTime)
    } catch {}
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;

  .home-wrap {
    min-height: 100%;
    padding: 12px 12px 16px;
    background: linear-gradient(180deg, #fff8dc 0%, #f8fbff 180px, transparent 180px);
  }

  .header-section {
    text-align: center;
    margin-bottom: 10px;
    img {
      width: 48px;
      height: 48px;
      margin: 0 auto;
      display: block;
    }
    h1 {
      margin-top: 6px;
      font-size: 20px;
      line-height: 1.2;
      font-weight: 700;
      color: #7f5d17;
    }
  }

  .panel {
    margin-top: 8px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    background-color: #fff;
    border-radius: 12px;
    padding: 10px;
    box-shadow:
      0 6px 14px rgba(17, 24, 39, 0.06),
      inset 0 0 0 1px rgba(255, 215, 106, 0.4);
  }

  .field-item {
    min-width: 0;
  }

  .field-label {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .field-unit {
    margin-top: 4px;
    text-align: right;
    color: #9ca3af;
    font-size: 11px;
  }

  .result-card {
    margin-top: 6px;
    padding: 12px 12px;
    background: linear-gradient(135deg, #fff3cd, #fff9eb 45%, #ffffff 100%);
    border-radius: 12px;
    border: 1px solid rgba(255, 214, 102, 0.45);
    box-shadow: 0 6px 14px rgba(255, 204, 87, 0.2);
  }

  .result-title {
    font-size: 12px;
    color: #927038;
    margin-bottom: 6px;
  }

  .result-main {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
  }

  .result-label {
    color: #7d6140;
    font-size: 13px;
  }

  .result-value {
    color: $color-primary;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.1;
  }

  .result-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .result-item {
    background-color: rgba(255, 255, 255, 0.72);
    border-radius: 8px;
    padding: 8px;
  }

  .result-item-label {
    color: #6b7280;
    font-size: 11px;
  }

  .result-item-value {
    margin-top: 3px;
    color: #1f2937;
    font-size: 14px;
    font-weight: 600;
  }

  .result-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #6b7280;
    &.up {
      color: #ef4444;
    }
    &.down {
      color: #16a34a;
    }
  }

  .action-bar {
    margin-top: 8px;
    text-align: center;
  }

  .save-btn {
    height: 36px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
  }

  .reset-btn {
    margin-top: 4px;
    height: auto;
    border: none;
    background: transparent;
    padding: 0;
    color: #9ca3af;
    font-size: 12px;
    font-weight: 400;
  }

  .save-time {
    margin-top: 6px;
    text-align: center;
    font-size: 11px;
    color: #9ca3af;
  }

  .footer-info {
    margin-top: 10px;
    text-align: center;
  }

  .copyright {
    font-size: 11px;
    color: #9ca3af;
  }

  .risk-tip {
    margin-top: 4px;
    font-size: 12px;
    color: #b45309;
    font-weight: 500;
  }
</style>
