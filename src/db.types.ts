type Filter<T, K extends keyof T> = Pick<T, FilterKeys<T, K>>
type FilterKeys<T, K extends keyof T> = { [P in keyof T]: P extends K ? never : P }[keyof T]

export interface Order {
  id: string
  clientOrderId: string
  datetime: string
  timestamp: number
  lastTradeTimestamp: number
  status: 'open' | 'closed' | 'canceled'
  symbol: string
  type: string
  timeInForce?: string
  side: 'buy' | 'sell'
  price: number
  average?: number
  amount: number
  filled: number
  remaining: number
  cost: number
  trades: Trade[]
  fee: Fee
  info: any
}

export interface Trade {
  amount: number
  datetime: string
  id: string
  info: any
  order?: string
  price: number
  timestamp: number
  type?: string
  side: 'buy' | 'sell'
  symbol: string
  takerOrMaker: 'taker' | 'maker'
  cost: number
  fee: Fee
}

export interface Fee {
  type: 'taker' | 'maker'
  currency: string
  rate: number
  cost: number
}

export interface SessionCollection {
  sessionId: string
  startTime: number
  lastTime: number
}

export type TradeCollection = Trade & {
  exchange: string
  symbol: string
}

export interface Marker {
  symbol: string
  exchange: string
  from: number
  to: number
  oldestTime: number
  newestTime: number
}

export type TradeWithFee = Trade & { fee: Fee }

export type OrderWithTrades = Filter<Order, 'fee'> & {
  trades?: TradeWithFee[]
  fee: Fee
}

export type OrderCollection = OrderWithTrades & {
  sessionId: string
  strategy: string
  exchange: string
  symbol: string
}

export interface Wallet {
  currency: number
  asset: number
}

export type WalletCollection = Wallet & {
  sessionId: string
  exchange: string
  symbol: string
  strategy: string
  time: number
}

export type Adjustment = Wallet & {
  type: 'user' | 'openLong' | 'closeLong' | 'openLongFill' | 'closeLongFill' | 'cancelOrder' | 'fillOrder' | 'fee'
}

export type AdjustmentCollection = Adjustment & {
  sessionId: string
  exchange: string
  symbol: string
  strategy?: string
  timestamp: number
}

export interface ExchangeAuthentication {
  apiKey: string
  secret: string
  uid?: string
  login?: string
  password?: string
  twofa?: string
  privateKey?: string
  walletAdress?: string
  client_id?: string
  sandbox?: boolean
  apiURI?: string
  websocketURI?: string
}

export interface ExchangeConfig {
  exchange: string
  tradePollInterval: number
  auth: ExchangeAuthentication
}

export type ExchangeCollection = ExchangeConfig & {
  sessionId: string
}

export interface StrategyConfig {
  [key: string]: string | number | boolean
  symbol: string
  exchange: string
  strategy: string

  days: number
  period: string
  periods: string
  markDn: number
  markUp: number
  orderPollInterval: number
  orderSlippageAdjustmentTolerance: number
}

export type StrategyCollection = StrategyConfig & {
  sessionId: string
}
