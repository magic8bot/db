import { dbDriver } from '../lib/db-driver.lib'
import { StoreOpts, StrategyConfig } from '../types/db.types'

export class StrategyModel {
  public static save(strategyConfig: StrategyConfig) {
    const { exchange, symbol, strategy, ...stratConf } = strategyConfig
    return dbDriver.strategy.updateOne({ exchange, symbol, strategy }, { $set: { ...stratConf } }, { upsert: true })
  }

  public static load(storeOpts: StoreOpts) {
    return dbDriver.strategy.findOne({ ...storeOpts }, { projection: { _id: 0 } })
  }

  public static loadAll() {
    return dbDriver.strategy.find({}, { projection: { _id: 0 } }).toArray()
  }

  public static loadAllForExchange(exchange: string) {
    return dbDriver.strategy.find({ exchange }, { projection: { _id: 0 } }).toArray()
  }

  public static delete(exchange: string, symbol: string, strategy: string) {
    return dbDriver.strategy.deleteOne({ exchange, symbol, strategy })
  }

  public static deleteAllForExchange(exchange: string) {
    return dbDriver.strategy.deleteMany({ exchange })
  }
}
