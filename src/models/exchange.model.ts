import { dbDriver } from '../lib/db-driver.lib'
import { ExchangeConfig } from '../types/db.types'

export class ExchangeModel {
  public static save(exchangeConfig: ExchangeConfig) {
    const { exchange, ...exchangeConf } = exchangeConfig
    return dbDriver.exchange.updateOne({ exchange }, { $set: { ...exchangeConf } }, { upsert: true })
  }

  public static load(exchange: string) {
    return dbDriver.exchange.findOne({ exchange }, { projection: { _id: 0, auth: 0 } })
  }

  public static loadWithAuth(exchange: string) {
    return dbDriver.exchange.findOne({ exchange }, { projection: { _id: 0 } })
  }

  public static loadAll() {
    return dbDriver.exchange.find({}, { projection: { _id: 0, auth: 0 } }).toArray()
  }

  public static loadAllWithAuth() {
    return dbDriver.exchange.find({}, { projection: { _id: 0 } }).toArray()
  }

  public static delete(exchange: string) {
    return dbDriver.exchange.deleteOne({ exchange })
  }
}
