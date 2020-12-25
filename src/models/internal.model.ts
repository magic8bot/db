import { dbDriver } from '../lib/db-driver.lib'

export class InternalModel {
  public static getAllExchanges() {
    return dbDriver.internal.find({ type: 'exchange' }).toArray()
  }

  public static getAllStrategies() {
    return dbDriver.internal.find({ type: 'strategy' }).toArray()
  }
}
