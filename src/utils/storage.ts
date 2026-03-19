import { Storage } from '@daysnap/utils'

import { createNamespace } from './createNamespace'

export const costPriceStorage = new Storage<{
  price: number
  buyWeight: number
  currentAvgPrice: number
  currentWeight: number
}>(createNamespace('cost-price'), window.localStorage)
