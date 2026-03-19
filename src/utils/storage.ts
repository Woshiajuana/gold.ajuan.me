import { Storage } from '@daysnap/utils'

import { createNamespace } from './createNamespace'

export const costPriceStorage = new Storage<{
  price: 0
  buyWeight: 0
  currentAvgPrice: 0
  currentWeight: 0
  saveTime: string
}>(createNamespace('cost-price'), window.localStorage)
