import { dbDriver } from '../lib/db-driver.lib'
import { StoreOpts, Trade } from '../types/db.types'

const MAX_TRADES_LOAD = 5000

export class TradeModel {
  public static insertTrades({ exchange, symbol }: StoreOpts, newTrades: Trade[]) {
    try {
      return dbDriver.trade.insertMany(
        newTrades.map((trade) => ({ ...trade, exchange, symbol })),
        { ordered: false }
      )
    } catch {
      // ヽ(。_°)ノ
    }
  }

  public static findTrades(exchange: string, symbol: string, timestamp: number) {
    return dbDriver.trade
      .find({ symbol, exchange, timestamp: { $gt: timestamp } })
      .sort({ timestamp: 1 })
      .limit(MAX_TRADES_LOAD)
      .toArray()
  }
}
