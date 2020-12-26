import { dbDriver } from '../lib/db-driver.lib'
import { CandleCollection } from '../types/db.types'

export class CandleModel {
  static get(exchange: string, symbol: string, resolution: string, limit = 200) {
    return dbDriver.candle.find({ exchange, symbol, resolution }).sort({ bucket: 1 }).limit(limit).toArray()
  }

  static insert({ exchange, symbol, resolution, bucket, ...candle }: CandleCollection) {
    return dbDriver.candle.updateOne({ exchange, symbol, resolution, bucket }, { $set: candle }, { upsert: true })
  }
}
